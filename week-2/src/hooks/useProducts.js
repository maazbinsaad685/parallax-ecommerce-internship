import { useQuery } from '@tanstack/react-query';
import { requestJSON } from '../api/client';
export function useProducts(id) {
  const forceError =
    new URLSearchParams(window.location.search).get('apiError') === '1';
  const query = useQuery({
    queryKey: ['products', id || 'all', forceError],
    queryFn: ({ signal }) =>
      requestJSON(
        `/api/products${id ? `/${id}` : ''}${forceError ? '?error=1' : ''}`,
        { signal },
      ),
  });
  return {
    data: query.data,
    loading: query.isPending,
    error: query.error?.message || '',
    retry: query.refetch,
  };
}
