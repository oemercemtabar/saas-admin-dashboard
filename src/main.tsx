import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AppProviders } from './app/providers.tsx'
import { router } from './app/router.tsx'
import './index.css'

async function enableMocking() {
  console.log("[MSW] enableMocking called", import.meta.env.DEV);
  if (!import.meta.env.DEV) return;
  const { worker } = await import('./api/mock/browser.ts');
  await worker.start({
    serviceWorker: { url: "/mockServiceWorker.js" },
    onUnhandledRequest: "warn",
  });
}
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </React.StrictMode>,
  );
});
