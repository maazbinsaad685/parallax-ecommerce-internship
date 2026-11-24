import { useEffect, useState } from 'react';

export default function Toasts() {
  const [notice, setNotice] = useState(null);
  useEffect(() => {
    let timer;
    const show = ({ detail }) => {
      setNotice(detail);
      window.clearTimeout(timer);
      timer = setTimeout(() => setNotice(null), 4000);
    };
    window.addEventListener('forma-toast', show);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('forma-toast', show);
    };
  }, []);
  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      {notice && (
        <div className={`toast ${notice.error ? 'toast-error' : ''}`}>
          {notice.error ? 'Error: ' : 'Success: '}
          {notice.message}
          <button aria-label="Dismiss notification" onClick={() => setNotice(null)}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}
