// Service Worker registration — production only.
//
// Lives in its own file rather than an inline <script> so the page's CSP can
// forbid inline scripts outright (`script-src` without 'unsafe-inline'),
// which is what makes the policy actually worth having against injected
// markup.
//
// A SW intercepting fetches during `npm run dev` fights Vite's HMR (stale
// cached module scripts get served with the wrong MIME type, WebSocket
// reconnects misbehave), so registration is explicitly skipped on localhost.
(function registerServiceWorker() {
  var isLocalDev = ['localhost', '127.0.0.1', '::1'].indexOf(window.location.hostname) !== -1;

  if (!('serviceWorker' in navigator)) return;

  if (!isLocalDev) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function (err) {
        console.log('Error registrando ServiceWorker:', err);
      });
    });
    return;
  }

  // Also unregister any SW left over from a previous production build
  // preview, so a stale cache can't haunt local dev either.
  navigator.serviceWorker.getRegistrations().then(function (regs) {
    regs.forEach(function (reg) { reg.unregister(); });
  });
})();
