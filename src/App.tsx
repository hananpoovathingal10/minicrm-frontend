import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Lazy loading pages
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const GetStarted = React.lazy(() => import('./pages/GetStarted'));
const AdminOverview = React.lazy(() => import('./pages/AdminOverview'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Customers = React.lazy(() => import('./pages/Customers'));
const Leads = React.lazy(() => import('./pages/Leads'));
const MainLayout = React.lazy(() => import('./layout/MainLayout'));

const Users = React.lazy(() => import('./pages/Users'));
const Phones = React.lazy(() => import('./pages/Phones'));
const Accounts = React.lazy(() => import('./pages/Accounts'));
const Opportunities = React.lazy(() => import('./pages/Opportunities'));
const Activities = React.lazy(() => import('./pages/Activities'));
const Communications = React.lazy(() => import('./pages/Communications'));
const Campaigns = React.lazy(() => import('./pages/Campaigns'));
const Reports = React.lazy(() => import('./pages/Reports'));
const SettingsPage = React.lazy(() => import('./pages/Settings'));
const Previews = React.lazy(() => import('./pages/Previews'));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<div className="flex-center" style={{ height: '100vh' }}>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/get-started" element={<GetStarted />} />
          
          {/* Protected Routes inside Main Layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
            <Route path="users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="phones" element={<ProtectedRoute><Phones /></ProtectedRoute>} />
            <Route path="accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
            <Route path="opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
            <Route path="activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
            <Route path="communications" element={<ProtectedRoute><Communications /></ProtectedRoute>} />
            <Route path="campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
            <Route path="reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="previews" element={<ProtectedRoute><Previews /></ProtectedRoute>} />
            <Route path="admin" element={<ProtectedRoute><AdminOverview /></ProtectedRoute>} />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
