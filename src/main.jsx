import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import theme from './theme.js';
import { StoreProvider } from './store/StoreContext.jsx';
import { ProductsProvider } from './data/ProductsContext.jsx';
import App from './App.jsx';
import './styles/global.css';
import './styles/overrides.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <StoreProvider>
          <ProductsProvider>
            <App />
          </ProductsProvider>
        </StoreProvider>
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>
);
