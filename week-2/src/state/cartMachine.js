import { assign, setup } from 'xstate';
import { addItem, changeQuantity, restoreCart } from '../utils/cart';

export const cartMachine = setup({
  actions: {
    change: assign(({ context, event }) => {
      const current = context.items;
      const item = current.find((entry) => entry.key === event.key);
      let items = current;
      if (event.type === 'ADD_ITEM')
        items = addItem(current, event.product, event.variants, event.quantity);
      if (event.type === 'REMOVE_ITEM' && item)
        items = current.filter((entry) => entry.key !== event.key);
      if (event.type === 'CLEAR_CART') items = [];
      if (event.type === 'SET_QUANTITY')
        items = changeQuantity(current, event.key, event.quantity);
      if (event.type === 'INCREASE_QUANTITY' && item)
        items = changeQuantity(current, event.key, item.quantity + 1);
      if (event.type === 'DECREASE_QUANTITY' && item)
        items = changeQuantity(current, event.key, item.quantity - 1);
      return { items, rejected: items === current };
    }),
  },
}).createMachine({
  id: 'cart',
  context: ({ input }) => ({ items: restoreCart(input?.saved), rejected: false }),
  initial: 'ready',
  states: {
    ready: {
      on: Object.fromEntries(
        [
          'ADD_ITEM',
          'REMOVE_ITEM',
          'INCREASE_QUANTITY',
          'DECREASE_QUANTITY',
          'SET_QUANTITY',
          'CLEAR_CART',
        ].map((type) => [type, { actions: 'change' }]),
      ),
    },
  },
});
