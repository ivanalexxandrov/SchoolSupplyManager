import { useAuth } from './AuthContext.jsx';
import AuthPage from './components/AuthPage.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Dashboard /> : <AuthPage />;
}
