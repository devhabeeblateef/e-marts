'use client';

import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg border border-red-200">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">We encountered an error while loading this page.</p>
            {this.state.error && (
              <p className="text-sm text-gray-500 mb-6 font-mono wrap-break-word max-w-md">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-2 bg-lime-500 text-gray-900 font-semibold rounded-lg hover:bg-lime-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}