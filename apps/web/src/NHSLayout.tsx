import { Link } from 'react-router-dom';

export function NHSLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--bg-section2)' }}>
      <header
        className="sticky top-0 z-10 border-b px-4 shadow-sm"
        style={{ borderColor: 'rgba(138,138,160,0.3)', backgroundColor: 'var(--bg-section)' }}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between">
          <Link
            to="/"
            className="text-xl font-bold transition hover:opacity-90"
            style={{ color: 'var(--primary-color3)' }}
          >
            NHS Appointments
          </Link>
          <nav className="flex gap-4">
            <Link
              to="/appointments"
              className="text-sm font-medium transition hover:opacity-90"
              style={{ color: 'var(--primary-color2)' }}
            >
              My appointments
            </Link>
            <Link
              to="/appointments/book"
              className="text-sm font-medium transition hover:opacity-90"
              style={{ color: 'var(--primary-color2)' }}
            >
              Book
            </Link>
            <Link
              to="/dashboard"
              className="text-sm font-medium transition hover:opacity-90"
              style={{ color: 'var(--primary-color2)' }}
            >
              Staff
            </Link>
            <Link
              to="/auth/signin"
              className="text-sm font-medium transition hover:opacity-90"
              style={{ color: 'var(--primary-color2)' }}
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer
        className="border-t py-4 text-center text-sm"
        style={{ borderColor: 'rgba(138,138,160,0.3)', backgroundColor: 'var(--footer-bg)', color: 'var(--primary-color4)' }}
      >
        NHS Appointment Management · Demo
      </footer>
    </div>
  );
}
