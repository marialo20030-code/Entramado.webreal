import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

console.log('🚀 Iniciando aplicación...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ No se encontró el elemento root');
  throw new Error('No se encontró el elemento root');
}

console.log('✅ Elemento root encontrado');

try {
  const root = createRoot(rootElement);
  console.log('✅ createRoot ejecutado correctamente');
  
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </StrictMode>
  );
  
  console.log('✅ Aplicación renderizada');
} catch (error) {
  console.error('❌ Error al renderizar la aplicación:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: Arial; color: #d32f2f;">
      <h1>Error al cargar la aplicación</h1>
      <p>${error instanceof Error ? error.message : 'Error desconocido'}</p>
      <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 10px; cursor: pointer;">
        Recargar página
      </button>
    </div>
  `;
}
