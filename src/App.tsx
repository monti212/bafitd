import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BaFitDPage from './pages/BaFitDPage';
import BaFitITCardPage from './pages/BaFitITCardPage';
import PrivateOpportunityApplyPage from './pages/PrivateOpportunityApplyPage';
import UserAuthPage from './pages/UserAuthPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVolunteers from './pages/admin/AdminVolunteers';
import AdminMatches from './pages/admin/AdminMatches';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';
import { UserAuthProvider, useUserAuth } from './contexts/UserAuthContext';

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdminAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#020c14] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

function ProtectedUserRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUserAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/card/auth" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <UserAuthProvider>
        <AdminAuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<BaFitDPage />} />
            <Route path="/card/auth" element={<UserAuthPage />} />

            {/* Protected member route */}
            <Route
              path="/card"
              element={
                <ProtectedUserRoute>
                  <BaFitITCardPage />
                </ProtectedUserRoute>
              }
            />

            <Route path="/opportunities/apply" element={<PrivateOpportunityApplyPage />} />

            {/* Admin auth */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected admin */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="volunteers" element={<AdminVolunteers />} />
              <Route path="matches" element={<AdminMatches />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AdminAuthProvider>
      </UserAuthProvider>
    </BrowserRouter>
  );
}

export default App;
