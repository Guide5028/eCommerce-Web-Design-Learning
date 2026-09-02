import { ConfigProvider } from 'antd';

// Scoped AntD component-token override for the checkout / contact / login forms' shared
// "large field" look (ported from legacy/css/style.css:1453-1465's uniform 75px-tall
// .form-field input/select/textarea box, 10px radius). A nested ConfigProvider keeps this
// local to the 3 forms that use it -- it must NOT leak into the header search Input or the
// product-page qty InputNumber, which stay AntD's default size.
//
// Height math for Input: AntD Input doesn't expose a "height" token -- its box height is
// paddingBlock*2 + line-height-of-content + border*2, so paddingBlock is solved to land on
// 75px using the default Input tokens (fontSize 14, lineHeight ~1.5714, border 1px):
//   75 = 2*paddingBlock + round(14 * 1.5714286) + 2*1  ->  paddingBlock = 25.5
// Select is simpler -- AntD reads `token.controlHeight` directly as the selector's height.
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
  },
};

export default function LargeFieldsTheme({ children }) {
  return <ConfigProvider theme={largeFieldTokens}>{children}</ConfigProvider>;
}
