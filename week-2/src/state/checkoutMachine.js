import { setup, assign, fromPromise } from 'xstate';
import { validateShipping } from '../utils/shipping';
import { createOrder } from '../api/client';
export const checkoutMachine = setup({
  actors: {
    submitOrder: fromPromise(({ input, signal }) => createOrder(input, signal)),
  },
  guards: {
    hasItems: ({ event }) =>
      event.items?.length > 0 &&
      event.items.every(
        (item) => Number.isInteger(item.quantity) && item.quantity > 0,
      ),
    validShipping: ({ event }) =>
      Object.keys(validateShipping(event.shipping)).length === 0,
    validPayment: ({ event }) =>
      ['success', 'failure'].includes(event.scenario),
  },
}).createMachine({
  id: 'checkout',
  initial: 'cart',
  context: {
    items: [],
    shipping: {},
    errors: {},
    scenario: 'success',
    order: null,
    error: '',
    requestId: '',
  },
  states: {
    cart: {
      on: {
        NEXT: {
          guard: 'hasItems',
          target: 'shipping',
          actions: assign({
            items: ({ event }) => event.items,
            requestId: () => crypto.randomUUID(),
          }),
        },
      },
    },
    shipping: {
      on: {
        BACK: {
          target: 'cart',
          actions: assign({
            shipping: ({ event }) => event.shipping || {},
            errors: {},
          }),
        },
        NEXT: [
          {
            guard: 'validShipping',
            target: 'payment',
            actions: assign({
              shipping: ({ event }) => event.shipping,
              errors: {},
              error: '',
            }),
          },
          {
            actions: assign({
              shipping: ({ event }) => event.shipping,
              errors: ({ event }) => validateShipping(event.shipping),
            }),
          },
        ],
      },
    },
    payment: {
      on: {
        BACK: 'shipping',
        SUBMIT: {
          guard: 'validPayment',
          target: 'submitting',
          actions: assign({
            scenario: ({ event }) => event.scenario,
            error: '',
          }),
        },
      },
    },
    submitting: {
      invoke: {
        src: 'submitOrder',
        input: ({ context }) => ({
          items: context.items,
          shipping: context.shipping,
          scenario: context.scenario,
          requestId: context.requestId,
        }),
        onDone: {
          target: 'confirmation',
          actions: assign({ order: ({ event }) => event.output }),
        },
        onError: {
          target: 'payment',
          actions: assign({
            error: ({ event }) =>
              event.error.message || 'Payment failed. Please try again.',
          }),
        },
      },
    },
    confirmation: { type: 'final' },
  },
});
