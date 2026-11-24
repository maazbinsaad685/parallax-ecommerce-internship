import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import '../src/styles.css';

export default {
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Store theme',
      toolbar: { title: 'Theme', items: ['light', 'dark'] },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = context.globals.theme;
      return (
        <MemoryRouter>
          <div style={{ padding: 24, maxWidth: 440 }}>
            <Story />
          </div>
        </MemoryRouter>
      );
    },
  ],
  parameters: { layout: 'padded', controls: { expanded: true } },
};
