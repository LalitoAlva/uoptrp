import React from 'react';
import { AlertTriangle, RotateCcw } from '../utils/icons';

// Without this, a single render error anywhere in the tree (e.g. a bad
// backup import, or a data field a future edit forgets to guard) unmounts
// the *entire* app and leaves the user staring at a blank white page with
// no way back short of knowing to hard-reload. This turns that into a
// recoverable, on-brand screen instead of a dead end.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Error capturado por ErrorBoundary:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[var(--bg-app)] text-[var(--text-primary)]">
        <div className="spa-card max-w-md w-full p-8 text-center space-y-5">
          <div className="mx-auto w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading font-black text-xl text-[var(--text-primary)]">
              Algo salió mal en esta pantalla
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Tus datos siguen guardados en este dispositivo. Intenta recargar — si el problema
              persiste, usa "Restablecer Todo" desde Respaldo e Importación.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 rounded bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Recargar la aplicación</span>
          </button>
        </div>
      </div>
    );
  }
}
