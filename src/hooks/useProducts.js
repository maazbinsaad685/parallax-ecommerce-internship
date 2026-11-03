import { useEffect, useState } from 'react';

export function useProducts(id) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const [attempt, setAttempt] = useState(0);
  const forceError =
    new URLSearchParams(window.location.search).get('apiError') === '1';
  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: '' });
    const url = id
      ? `/api/products/${id}`
      : `/api/products${forceError ? '?error=1' : ''}`;
    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok)
          throw new Error(
            response.status === 404
              ? 'This product could not be found.'
              : 'We couldn’t load the collection. Please try again.',
          );
        return response.json();
      })
      .then((data) => setState({ data, loading: false, error: '' }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ data: null, loading: false, error: error.message });
        }
      });
    return () => controller.abort();
  }, [id, attempt, forceError]);
  return { ...state, retry: () => setAttempt((value) => value + 1) };
}
