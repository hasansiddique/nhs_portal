import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div
      className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-4 py-8"
      style={{ backgroundColor: 'var(--bg-section2)' }}
    >
      <div
        className="w-full max-w-[480px] overflow-y-auto rounded-[16px] p-6 shadow-lg sm:p-8"
        style={{
          backgroundColor: 'var(--bg-section)',
          border: '1px solid rgba(138,138,160,0.3)',
          maxHeight: 'calc(100vh - 4rem)',
        }}
      >
        <Outlet />
      </div>
      <p className="mt-4 text-center text-sm" style={{ color: 'var(--primary-color4)' }}>
        <Link to="/" className="hover:underline" style={{ color: 'var(--primary-color3)' }}>
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
