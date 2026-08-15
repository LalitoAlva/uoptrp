// Themed SweetAlert2 helpers — replaces window.confirm / alert / prompt with
// in-app dialogs and toasts that match the current light/dark theme and reuse
// the .spa-card look, instead of jarring native browser popups.
import Swal from 'sweetalert2';

function themeTokens() {
  const styles = getComputedStyle(document.documentElement);
  const read = (name, fallback) => styles.getPropertyValue(name).trim() || fallback;
  return {
    background: read('--bg-surface', '#0F172A'),
    color: read('--text-primary', '#FFFFFF'),
    accent: read('--accent-primary', '#0284C7'),
  };
}

function baseConfig() {
  const tokens = themeTokens();
  return {
    background: tokens.background,
    color: tokens.color,
    confirmButtonColor: tokens.accent,
    cancelButtonColor: 'transparent',
    customClass: {
      popup: 'spa-card !text-left',
      cancelButton: '!text-[var(--text-secondary)] !border !border-[var(--border-medium)]',
    },
    buttonsStyling: true,
    reverseButtons: true,
    focusConfirm: false,
  };
}

/** Replaces window.confirm(). Resolves true only if the user confirms. */
export async function confirmAction({
  title = 'Confirmar acción',
  text = '',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  danger = false
} = {}) {
  const result = await Swal.fire({
    ...baseConfig(),
    title,
    text,
    icon: danger ? 'warning' : 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: danger ? '#DC2626' : undefined,
  });
  return result.isConfirmed;
}

/** Replaces window.prompt(). Resolves the trimmed string, or null if cancelled. */
export async function promptText({
  title = 'Nuevo valor',
  label = '',
  placeholder = '',
  confirmText = 'Guardar'
} = {}) {
  const { value } = await Swal.fire({
    ...baseConfig(),
    title,
    input: 'text',
    inputLabel: label,
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar',
    inputValidator: (v) => (!v || !v.trim() ? 'Este campo es obligatorio' : undefined),
  });
  return value ? value.trim() : null;
}

const ToastMixin = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3200,
  timerProgressBar: true,
  didOpen: (el) => {
    el.addEventListener('mouseenter', Swal.stopTimer);
    el.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

/** Replaces alert() for non-blocking feedback. type: success | error | warning | info */
export function notify(message, type = 'success') {
  const tokens = themeTokens();
  ToastMixin.fire({
    icon: type,
    title: message,
    background: tokens.background,
    color: tokens.color,
    customClass: { popup: 'spa-card !text-sm' },
  });
}
