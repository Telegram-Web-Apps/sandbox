import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {init} from './twa';

// Initialize client SDK and then render application.
init(true, true).then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(<App/>);
});
