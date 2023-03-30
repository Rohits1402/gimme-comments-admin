import React from 'react';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../Contexts/StoreContext';

import Header from '../Layout/Header';
import Menu from '../Layout//Menu';
import Footer from '../Layout//Footer';

import SignIn from '../Pages/SignIn/SignIn';
import Dashboard from '../Pages/Dashboard/Dashboard';
import Profile from '../Pages/Profile/Profile';
import Customers from '../Pages/Customers/Customers';
import CustomerProfile from '../Pages/Customers/CustomerProfile';

export default function Routing() {
  const { isLoading, setIsLoading } = useStore();

  return (
    <div
      className="wrapper"
      style={{ overflowX: 'hidden', position: 'relative' }}
    >
      <div
        style={{
          display: isLoading ? 'grid' : 'none',
          position: 'fixed',
          zIndex: 100,
          height: '100vh',
          width: '100vw',
          placeItems: 'center',
          background: 'rgba(0,0,0,0.4)',
        }}
      >
        <div className="spinner-border" role="status">
          <div className="visually-hidden">Loading...</div>
        </div>
      </div>
      <div
        style={{
          display: isLoading ? 'flex' : 'none',
          position: 'fixed',
          zIndex: 1000,
          height: '100vh',
          width: '100vw',
          justifyContent: 'center',
          alignItems: 'end',
          padding: '20px',
        }}
      >
        <button className="btn btn-dark" onClick={() => setIsLoading(false)}>
          Close
        </button>
      </div>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:userId" element={<CustomerProfile />} />
        </Route>
        <Route path="/*" element={<div>Not Found</div>} />
      </Routes>
    </div>
  );
}

const ProtectedRoute = () => {
  const access_token = localStorage.getItem('access_token');

  if (access_token) {
    return (
      <>
        <Header />
        <Menu />
        <Outlet />
        <Footer />
      </>
    );
  } else {
    return <Navigate to="/sign-in" />;
  }
};
