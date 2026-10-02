import { Route, Routes } from 'react-router-dom';
import { appRoutes } from './config/routes';
import { AuthProvider } from './features/auth/AuthProvider';
import { GuestOnly, RequireAuth } from './features/auth/RouteGuards';

const protectedPaths = new Set(['/dashboard', '/production', '/billing', '/settings', '/webhook', '/activity']);
const guestOnlyPaths = new Set(['/login', '/signup']);

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {appRoutes.map(({ path, element }) => {
          const guarded = protectedPaths.has(path)
            ? <RequireAuth>{element}</RequireAuth>
            : guestOnlyPaths.has(path)
              ? <GuestOnly>{element}</GuestOnly>
              : element;
          return <Route key={path} path={path} element={guarded} />;
        })}
      </Routes>
    </AuthProvider>
  );
}
