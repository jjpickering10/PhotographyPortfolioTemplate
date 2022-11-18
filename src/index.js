import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrismicProvider } from '@prismicio/react';
import { client } from './prismic';
import App from './app/App';
import './styles/index.scss';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PrismicProvider client={client}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </PrismicProvider>
);
