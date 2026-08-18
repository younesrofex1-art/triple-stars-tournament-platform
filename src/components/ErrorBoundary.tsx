import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-6 text-gray-100 font-sans">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#121721] border border-white/10 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 mx-auto flex items-center justify-center text-red-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display uppercase tracking-wider text-white">
                Application Recovered
              </h2>
              <p className="text-xs text-gray-400">
                A display error occurred. You can reload the system below.
              </p>
              {this.state.error && (
                <div className="p-3 bg-[#0E121B] rounded-xl text-[11px] font-mono text-red-300 text-left overflow-x-auto border border-red-500/20">
                  {this.state.error.message}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-3 rounded-xl bg-[#00F0FF] text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload System</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
