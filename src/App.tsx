import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { BetaModalProvider } from './context/BetaModalContext';

// Landing page
import { Landing } from './pages/Landing';

// Auth pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
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
            {/* Landing page */}
            <Route path="/" element={<Landing />} />

            {/* Auth routes (ready for production) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            
            {/* App routes */}
            <Route path="/app" element={<AppLayout />}>
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
