import { createContext, useContext, useEffect, useState } from 'react';
import { useActorRef, useSelector } from '@xstate/react';
import { cartMachine } from './cartMachine';
import { notify } from '../utils/notifications';
const CartContext = createContext(null);
const storageKey = 'forma-cart-v1';
export function CartProvider({ children }) {
  const actor = useActorRef(cartMachine, {
    input: {
      saved: (() => {
        try {
          return localStorage.getItem(storageKey);
        } catch {
          return null;
        }
      })(),
    },
  });
  const items = useSelector(actor, (snapshot) => snapshot.context.items);
  const send = (event, message) => {
    actor.send(event);
    const rejected = actor.getSnapshot().context.rejected;
    notify(
      rejected
        ? 'Invalid quantity, unavailable product, or stock limit reached.'
        : message,
      rejected,
    );
  };
  const [storageError, setStorageError] = useState('');
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      setStorageError(
        'Your browser could not save this bag. Keep this tab open until checkout.',
      );
    }
  }, [items]);
  const value = {
    items,
    storageError,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    add: (product, variants, quantity) =>
      send({ type: 'ADD_ITEM', product, variants, quantity }, 'Added to your bag.'),
    update: (key, quantity) =>
      send({ type: 'SET_QUANTITY', key, quantity }, 'Quantity updated.'),
    remove: (key) => send({ type: 'REMOVE_ITEM', key }, 'Product removed.'),
    clear: () => actor.send({ type: 'CLEAR_CART' }),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
