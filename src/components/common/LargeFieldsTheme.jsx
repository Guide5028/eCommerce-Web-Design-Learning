import { ConfigProvider } from 'antd';

// Scoped AntD component-token override for the checkout / contact / login forms' shared
// "large field" look (ported from legacy/css/style.css:1453-1465's uniform 75px-tall
// .form-field input/select/textarea box, 10px radius), plus their submit button's
// square corners (.auth-submit / .contact-submit in the original CSS -- both
// type="primary" so their fill color already comes from the global colorPrimary token
// for free). A nested ConfigProvider keeps all of this local to the 3 forms that use
// it -- it must NOT leak into the header search Input, the product-page qty
// InputNumber, or any other button on the page.
//
// Height math for Input: AntD Input doesn't expose a "height" token -- its box height is
// paddingBlock*2 + line-height-of-content + border*2, so paddingBlock is solved to land on
// 75px using the default Input tokens (fontSize 14, lineHeight ~1.5714, border 1px):
//   75 = 2*paddingBlock + round(14 * 1.5714286) + 2*1  ->  paddingBlock = 25.5
// Select is simpler -- AntD reads `token.controlHeight` directly as the selector's height.
//
// Button doesn't get the same paddingBlock treatment -- unlike Input/Select, AntD's
// Button always renders a literal `height: controlHeight` CSS property of its own
// (button/style/index.js) and hardcodes its vertical padding to 0 regardless of any
// paddingBlock override, so controlHeight is the real (and only) lever for height --
// same mechanism as Select. 62 approximates what the original 18px vertical padding
// produced at 16px font (contentFontSize below): its ~25.6px content line height +
// 2*18px padding =~ 62.
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
