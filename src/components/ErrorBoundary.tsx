import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-paper p-6">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl w-full text-center">
            <h1 className="text-3xl font-serif text-brand-ink mb-4">Something went wrong</h1>
            <p className="text-brand-ink/60 mb-6 font-mono text-sm bg-brand-paper p-4 rounded-xl text-left overflow-auto">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand-ink text-white px-8 py-3 rounded-full hover:bg-brand-gold transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
