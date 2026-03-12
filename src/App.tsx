import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { BetaModalProvider } from './context/BetaModalContext';
import { AuthGuard } from './components/AuthGuard';

// Landing page
import { Landing } from './pages/Landing';

// Legal pages
import { Mentions } from './pages/legal/Mentions';
import { Terms } from './pages/legal/Terms';
import { Privacy } from './pages/legal/Privacy';
import { Rgpd } from './pages/legal/Rgpd';
import { CookieBanner } from './components/CookieBanner';

// Auth pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Signup } from './pages/Signup';
import { JoinTeam } from './pages/auth/JoinTeam';
import { Onboarding } from './pages/onboarding/Onboarding';

// App pages
import { AppLayout } from './components/app/layout/AppLayout';
import { Dashboard } from './pages/app/Dashboard';
import { DecisionsList } from './pages/app/DecisionsList';
import { DecisionDetail } from './pages/app/DecisionDetail';
import { NewDecision } from './pages/app/NewDecision';
import { History } from './pages/app/History';
import { Team } from './pages/app/Team';
import { Poles } from './pages/app/Poles';
import { Settings } from './pages/app/Settings';
import { Analytics } from './pages/app/Analytics';
import { AuditLog } from './pages/app/AuditLog';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BetaModalProvider>
        <BrowserRouter>
          <CookieBanner />
          <Routes>
            {/* Landing page - with auto-redirect logic */}
            <Route path="/" element={
              <AuthGuard>
                <Landing />
              </AuthGuard>
            } />

            {/* Auth routes - AuthGuard redirects logged-in users */}
            <Route path="/login" element={
              <AuthGuard>
                <Login />
              </AuthGuard>
            } />
            <Route path="/register" element={
              <AuthGuard>
                <Register />
              </AuthGuard>
            } />
            <Route path="/signup" element={
              <AuthGuard>
                <Signup />
              </AuthGuard>
            } />
            
            {/* Onboarding - protected, requires auth */}
            <Route path="/onboarding" element={
              <AuthGuard requireAuth>
                <Onboarding />
              </AuthGuard>
            } />

            {/* Join team - for invited users only */}
            <Route path="/join" element={
              <AuthGuard requireAuth>
                <JoinTeam />
              </AuthGuard>
            } />
            
            {/* Legal pages - public */}
            <Route path="/mentions-legales" element={<Mentions />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/rgpd" element={<Rgpd />} />

            {/* App routes - protected, requires auth and onboarding */}
            <Route path="/app" element={
              <AuthGuard requireAuth>
                <AppLayout />
              </AuthGuard>
            }>
              <Route index element={<Dashboard />} />
              <Route path="decisions" element={<DecisionsList />} />
              <Route path="decisions/new" element={<NewDecision />} />
              <Route path="decisions/:id" element={<DecisionDetail />} />
              <Route path="history" element={<History />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="audit" element={<AuditLog />} />
              <Route path="team" element={<Team />} />
              <Route path="poles" element={<Poles />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BetaModalProvider>
    </ThemeProvider>
  );
}

export default App;
