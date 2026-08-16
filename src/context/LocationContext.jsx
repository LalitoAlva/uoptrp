import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const LocationContext = createContext(null);

/** Remembers only whether the user turned the feature off — never coordinates. */
const OPT_OUT_KEY = 'nyc_app_location_opt_out';

function readOptOut() {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Live location for the whole app.
 *
 * Behaviour, deliberately:
 *  · While the app is open it asks for location and then *keeps watching*, so
 *    the nearby/route suggestions follow you as you walk instead of freezing
 *    at wherever you first opened the tab.
 *  · It asks automatically, but only when the browser says the permission is
 *    still in the `prompt` state. If the user already denied it, we never
 *    re-trigger the native dialog — a blocked prompt cannot be re-shown
 *    programmatically anyway, and hammering it just wastes their attention.
 *  · Watching pauses while the tab is hidden and resumes on return. A
 *    background tab holding a GPS watch open is a battery drain for data
 *    nobody is looking at.
 *  · Coordinates live in memory only. Nothing is written to localStorage and
 *    nothing is sent over the network; the only persisted bit is the opt-out
 *    flag. See `utils/geo.js` — all distance work happens locally against a
 *    static table.
 */
export function LocationProvider({ children }) {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | locating | ready | denied | unavailable | off
  const [updatedAt, setUpdatedAt] = useState(null);
  const [optedOut, setOptedOut] = useState(readOptOut);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const watchIdRef = useRef(null);

  const clearWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const startWatching = useCallback(() => {
    if (!('geolocation' in navigator) || watchIdRef.current !== null) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy });
        setUpdatedAt(new Date());
        setStatus('ready');
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable');
        clearWatch();
      },
      // A city block of precision is plenty for "¿qué tengo cerca?", and
      // high accuracy would keep the GPS radio hot for no visible benefit.
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 }
    );
  }, [clearWatch]);

  /** Explicit user request — the only path allowed to trigger a fresh prompt. */
  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unavailable');
      return;
    }
    try {
      localStorage.removeItem(OPT_OUT_KEY);
    } catch {
      // Not persisting the opt-out is harmless — it just won't survive a reload.
    }
    setOptedOut(false);
    setStatus('locating');
    startWatching();
  }, [startWatching]);

  /**
   * Forces a fresh fix right now.
   *
   * A one-shot `getCurrentPosition` rather than restarting the watch: the
   * watch is already open in the normal case, and `startWatching` bails out
   * when it is, so re-calling it would do nothing at all. `maximumAge: 0` is
   * the point of the whole function — it refuses the browser's cached
   * position, which is what makes the button actually move the numbers after
   * you've walked a few blocks.
   */
  const refresh = useCallback(() => {
    if (!('geolocation' in navigator) || isRefreshing) return;

    setIsRefreshing(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy });
        setUpdatedAt(new Date());
        setStatus('ready');
        setIsRefreshing(false);
      },
      (err) => {
        // A failed manual refresh shouldn't tear down a watch that still
        // works — only a hard permission denial changes the status.
        if (err.code === err.PERMISSION_DENIED) {
          setStatus('denied');
          clearWatch();
        }
        setIsRefreshing(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }, [isRefreshing, clearWatch]);

  /** Stops tracking and remembers the choice across reloads. */
  const disableLocation = useCallback(() => {
    clearWatch();
    setCoords(null);
    setStatus('off');
    setOptedOut(true);
    try {
      localStorage.setItem(OPT_OUT_KEY, '1');
    } catch {
      // Same as above — worst case the preference resets next visit.
    }
  }, [clearWatch]);

  // Ask (or silently resume) as soon as the app is open.
  useEffect(() => {
    if (optedOut) {
      setStatus('off');
      return undefined;
    }
    if (!('geolocation' in navigator)) {
      setStatus('unavailable');
      return undefined;
    }

    let cancelled = false;

    const begin = () => {
      if (cancelled) return;
      setStatus('locating');
      startWatching();
    };

    // The Permissions API lets us distinguish "never asked" from "already
    // said no", so a previous refusal is respected instead of re-prompted.
    if (navigator.permissions?.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((result) => {
          if (cancelled) return;
          if (result.state === 'denied') {
            setStatus('denied');
            return;
          }
          begin();
          // React live if the user flips the permission in browser settings.
          result.onchange = () => {
            if (result.state === 'granted') begin();
            if (result.state === 'denied') { setStatus('denied'); clearWatch(); }
          };
        })
        .catch(begin); // Older browsers: just ask.
    } else {
      begin();
    }

    return () => { cancelled = true; };
  }, [optedOut, startWatching, clearWatch]);

  // Don't hold a GPS watch open for a tab nobody is looking at.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        clearWatch();
      } else if (!optedOut && status === 'ready') {
        startWatching();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [optedOut, status, startWatching, clearWatch]);

  useEffect(() => clearWatch, [clearWatch]);

  return (
    <LocationContext.Provider value={{
      coords,
      status,
      updatedAt,
      isRefreshing,
      isTracking: status === 'ready',
      requestLocation,
      refresh,
      disableLocation
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation debe usarse dentro de <LocationProvider>');
  return ctx;
}
