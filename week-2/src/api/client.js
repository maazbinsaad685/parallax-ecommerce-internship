import { notify } from '../utils/notifications';
import { QueryClient } from '@tanstack/react-query';
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60000, retry: false, refetchOnWindowFocus: false },
  },
});
export async function requestJSON(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    notify(data.message || 'Request failed. Please try again.', true);
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  if (options?.method === 'POST') notify('Order placed successfully.');
  return data;
}
export const createOrder = (order, signal) =>
  requestJSON('/api/orders', {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
