import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/bootstrap.css';
import './styles/own.css';
import App from './App';
import store from '../src/store/store';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <HelmetProvider>

 <App />
 </HelmetProvider>

</Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
