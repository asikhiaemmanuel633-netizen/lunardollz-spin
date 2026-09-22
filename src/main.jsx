
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@solana/wallet-adapter-react-ui/styles.css';
import './index.css';
import App from './App.jsx';
import WalletContextProvider from './components/WalletContextProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WalletContextProvider>
      <App />
    </WalletContextProvider>
  </React.StrictMode>
);
