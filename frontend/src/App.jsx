import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Dashboard from './pages/auth/Dashboard';
import AccountPage from './pages/AccountPage';
import Settings from './pages/Settings';
import Transaction from './pages/Transaction';
import useStore from './store';
import { setAuthToken } from './common/apiCall';
import { Toaster } from 'sonner';
import Navbar from './component/Navbar';
import { useEffect } from 'react';

const RootLayout = () => {
  // console.log(user);
  const { user } = useStore((state) => state);
  setAuthToken(user?.token || '');
  return !user ? (
    <Navigate to="sign-in" replace={true} />
  ) : (
    <>
      <Navbar />
      <div className="min-h-[calc(h-screen-100px)]">
        <Outlet />
      </div>
    </>
  );
};
function App() {
  // const theme = useStore()';
  const { theme } = useStore((state) => state);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <main>
      <div className="w-full min-h-screen bg-gray-100 dark:bg-slate-900">
        <Routes>
          <Route element={<RootLayout />}>
            {/* protected route */}
            <Route path="/" element={<Navigate to={'/overview'} />} />
            <Route path="/overview" element={<Dashboard />} />
            <Route path="transactions" element={<Transaction />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/accounts" element={<AccountPage />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </div>
      <Toaster richColors position="top-center" />
    </main>
  );
}

export default App;
