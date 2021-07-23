import { Meta } from '@storybook/html';
export default {
  title: 'StripeElement/Modal',
  argTypes: {
    showCloseButton: { control: 'boolean' },
    open: { control: 'boolean' },
  },
  parameters: {
    docs: {
      inlineStories: false,
      iframeHeight: '500px',
    },
  },
} as Meta;

const Template = ({ showCloseButton, open }) => `<stripe-element-modal open=${open} showCloseButton=${showCloseButton}>slot</stripe-element-modal> `;

export const Basic = Template.bind({});
Basic.args = {
  showCloseButton: true,
  open: true,
};
