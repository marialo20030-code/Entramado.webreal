import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl w-full max-w-md">
            <h1 className="text-2xl font-light text-gray-800 mb-4">Algo salió mal</h1>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'Ocurrió un error inesperado'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full bg-gradient-to-r from-blue-300 to-violet-300 text-white py-3 rounded-2xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              Recargar página
            </button>
            {this.state.error && (
              <details className="mt-4">
                <summary className="text-sm text-gray-500 cursor-pointer">Detalles técnicos</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

