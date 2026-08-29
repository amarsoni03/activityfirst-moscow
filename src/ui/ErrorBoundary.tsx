import { Component, type ErrorInfo, type ReactNode } from 'react';

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { err: Error | null }
> {
  state = { err: null as Error | null };

  static getDerivedStateFromError(err: Error) {
    return { err };
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    console.error(err, info);
  }

  render() {
    if (this.state.err) {
      return (
        <div className="mx-auto max-w-lg px-6 py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-quiet">
            ActivityFirst
          </p>
          <h1 className="font-display mt-3 text-3xl">Something went sideways.</h1>
          <p className="mt-3 text-sm text-quiet">
            Reload the page. Your saved activities and bookings are still here.
          </p>
          <button
            type="button"
            className="mt-8 min-h-11 rounded-full bg-ink px-6 text-sm font-semibold text-paper"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
