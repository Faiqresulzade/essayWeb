import { useEffect, type ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthActions, useAuthStore } from '@/features/auth/model/authContext';
import { ROUTES } from '@/shared/config/routes';
import { FullScreenLoader } from '@/shared/ui/states';

interface AuthBootstrapProps {
  readonly children: ReactNode;
}

/** Tətbiq açılanda sessiya bərpa edilir; bu müddətdə ağ ekran yox, skeleton göstərilir. */
export function AuthBootstrap({ children }: AuthBootstrapProps) {
  const status = useAuthStore(state => state.status);
  const { bootstrap } = useAuthActions();

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  if (status === 'bootstrapping') return <FullScreenLoader />;
  return children;
}

/** Yalnız daxil olmuş istifadəçilər üçün. */
export function ProtectedRoute() {
  const status = useAuthStore(state => state.status);
  const location = useLocation();

  if (status !== 'authenticated') {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

/** Daxil olmuş istifadəçi login/register səhifələrini görməməlidir. */
export function GuestRoute() {
  const status = useAuthStore(state => state.status);

  if (status === 'authenticated') {
    return <Navigate to={ROUTES.essay} replace />;
  }
  return <Outlet />;
}
