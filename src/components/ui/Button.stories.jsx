import Button from './Button';
export default {
  title: 'UI/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Use primary for the main action and secondary for supporting actions. Native disabled buttons cannot be activated.',
      },
    },
  },
  args: { children: 'Explore collection' },
};
export const Primary = { args: { variant: 'primary' } };
export const Secondary = { args: { variant: 'secondary' } };
export const Disabled = { args: { disabled: true } };
