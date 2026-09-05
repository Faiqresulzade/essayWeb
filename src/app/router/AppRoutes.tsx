import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ROUTES } from '@/shared/config/routes';

import { AppLayout } from '../layout/AppLayout';
import { GuestRoute, ProtectedRoute } from './guards';

// Kod bölünməsi: hər səhifə ayrıca yüklənir (analitika və dərs səhifələri ağırdır).
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const PrivacyPage = lazy(() => import('@/pages/legal/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/legal/TermsPage'));
const NewEssayPage = lazy(() => import('@/pages/essay/NewEssayPage'));
const HistoryPage = lazy(() => import('@/pages/history/HistoryPage'));
const HistoryDetailPage = lazy(() => import('@/pages/history/HistoryDetailPage'));
const LessonsPage = lazy(() => import('@/pages/lessons/LessonsPage'));
const LessonPlayerPage = lazy(() => import('@/pages/lessons/LessonPlayerPage'));
const GroupsPage = lazy(() => import('@/pages/students/GroupsPage'));
const GroupDetailPage = lazy(() => import('@/pages/students/GroupDetailPage'));
const StudentDetailPage = lazy(() => import('@/pages/students/StudentDetailPage'));
const OverviewPage = lazy(() => import('@/pages/reports/OverviewPage'));
const PlansPage = lazy(() => import('@/pages/plans/PlansPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.landing} element={<LandingPage />} />
      <Route path={ROUTES.privacy} element={<PrivacyPage />} />
      <Route path={ROUTES.terms} element={<TermsPage />} />

      <Route element={<GuestRoute />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.resetPassword} element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.essay} element={<NewEssayPage />} />
          <Route path={ROUTES.history} element={<HistoryPage />} />
          <Route path={ROUTES.historyDetailPattern} element={<HistoryDetailPage />} />
          <Route path={ROUTES.lessons} element={<LessonsPage />} />
          <Route path={ROUTES.lessonPlayerPattern} element={<LessonPlayerPage />} />
          <Route path={ROUTES.students} element={<GroupsPage />} />
          <Route path={ROUTES.groupDetailPattern} element={<GroupDetailPage />} />
          <Route path={ROUTES.studentDetailPattern} element={<StudentDetailPage />} />
          <Route path={ROUTES.reports} element={<OverviewPage />} />
          <Route path={ROUTES.plans} element={<PlansPage />} />
          <Route path={ROUTES.settings} element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
