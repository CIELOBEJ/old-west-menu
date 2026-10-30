import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

// Registra il Service Worker e gestisce gli aggiornamenti
const updateSW = registerSW({
  immediate: true,

  onNeedRefresh() {
    window.dispatchEvent(
      new CustomEvent('oldwest-update-available')
    );
  },

  onOfflineReady() {
    console.log('Old West: app pronta per l’utilizzo offline');
  },
});

// Installa la nuova versione soltanto quando il cliente lo richiede
window.addEventListener('oldwest-apply-update', async () => {
  try {
    const registration = await navigator.serviceWorker.getRegistration();

    if (registration?.waiting) {
      await updateSW(true);
    } else {
      // Se la nuova versione è già attiva, ricarica la pagina
      window.location.reload();
    }
  } catch (error) {
    console.error('Errore durante aggiornamento Old West:', error);
  }
});

// Error Boundary Component per catturare errori e mostrarli a schermo invece della pagina bianca
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#333' }}>
          <h1 style={{ color: 'red' }}>Qualcosa è andato storto.</h1>
          <p>Si è verificato un errore durante il caricamento dell'applicazione.</p>
          <pre style={{ background: '#f0f0f0', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 20px' }}>
            Ricarica Pagina
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);