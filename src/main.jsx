import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

async function startApp() {
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true });
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
}

startApp().catch(() => {
  document.getElementById('root').innerHTML = `
    <main class="startup-error"><h1>We couldn’t start the store</h1>
    <p>Allow service workers and reload this page to try again.</p>
    <button onclick="location.reload()">Reload store</button></main>`;
});
