// FIX: Refactored component to use `import * as React` and `React.Component` to resolve a TypeScript error where `this.props` was not being correctly identified on the class instance. This approach ensures proper type inheritance.
import * as React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  public state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center font-sans p-4 text-center">
            <div className="w-full max-w-lg p-8 space-y-6 bg-panel-dark backdrop-blur-xl border border-red-500/50 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-red-400 tracking-wider">An Unexpected Error Occurred</h1>
                <p className="text-gray-400">
                    We've encountered a problem. Please try refreshing the page to continue.
                </p>
                <div className="pt-4">
                    <button
                        onClick={this.handleRefresh}
                        className="w-full sm:w-auto shrink-0 flex justify-center items-center mx-auto py-3 px-8 border border-transparent text-md font-bold rounded-lg text-black bg-cyan-tech-300 hover:bg-cyan-tech-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark focus:ring-cyan-tech-500 transition-all duration-300 transform hover:scale-105"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
