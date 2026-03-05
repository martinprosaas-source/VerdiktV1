import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { BetaModalProvider } from './context/BetaModalContext';
import { AuthGuard } from './components/AuthGuard';

// Landing page
import { Landing } from './pages/Landing';

// Auth pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Signup } from './pages/Signup';
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
          <Routes>
            {/* Landing page - with auto-redirect logic */}
            <Route path="/" element={
              <AuthGuard>
                <Landing />
              </AuthGuard>
            } />

            {/* Auth routes (ready for production) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Onboarding - protected, requires auth */}
            <Route path="/onboarding" element={
              <AuthGuard requireAuth>
                <Onboarding />
              </AuthGuard>
            } />
            
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
