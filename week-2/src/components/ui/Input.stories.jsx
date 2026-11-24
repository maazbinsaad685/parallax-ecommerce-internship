import Input from './Input';
export default {
  title: 'UI/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          'Every input has an associated visible label and a unique ID. Placeholder text supplements the label.',
      },
    },
  },
  args: { label: 'Full name' },
};
export const Default = {};
export const WithPlaceholder = {
  args: { placeholder: 'Enter your full name' },
};
export const Disabled = {
  args: { disabled: true, value: 'Maaz', readOnly: true },
};
