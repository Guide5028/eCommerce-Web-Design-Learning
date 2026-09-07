import { ConfigProvider } from 'antd';

// Scoped AntD tokens for the shared "large field" look used by the checkout/contact/login forms.
const largeFieldTokens = {
  components: {
    Input: {
      paddingBlock: 25.5,
      paddingInline: 16,
      borderRadius: 10,
    },
    Select: {
      controlHeight: 75,
      borderRadius: 10,
    },
    Button: {
      borderRadius: 0,
      controlHeight: 62,
      contentFontSize: 16,
      paddingInline: 60,
    },
  },
};

export default function LargeFieldsTheme({ children }) {
  return <ConfigProvider theme={largeFieldTokens}>{children}</ConfigProvider>;
}
