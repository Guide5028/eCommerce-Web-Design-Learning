// Shared brand colors, reused by scoped per-button ConfigProvider overrides elsewhere.
export const COLOR_PRIMARY = '#B88E2F';
export const COLOR_TEXT = '#333333';

// Global AntD ConfigProvider theme tokens.
const theme = {
  token: {
    colorPrimary: COLOR_PRIMARY,
    colorLink: COLOR_PRIMARY,
    colorError: '#E97171',
    colorSuccess: '#2EC1AC',
    colorText: COLOR_TEXT,
    colorTextSecondary: '#9F9F9F',
    colorBorder: '#D9D9D9',
    fontFamily: "'Poppins', sans-serif",
    borderRadius: 6,
  },
  components: {
    Button: {
      fontWeight: 600,
    },
    Rate: {
      starColor: '#B88E2F',
    },
    Table: {
      headerBg: '#F9F1E7', // matches --color-cream; was a raw CSS override targeting .ant-table-thead
    },
  },
};

export default theme;
