export function notify(message, error = false) {
  if (typeof window !== 'undefined')
    window.dispatchEvent(new window.CustomEvent('forma-toast', { detail: { message, error } }));
}
