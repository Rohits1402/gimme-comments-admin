import React from 'react';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../Contexts/StoreContext';

import Header from '../Layout/Header';
import Menu from '../Layout//Menu';
import Footer from '../Layout//Footer';

import SignIn from '../Pages/SignIn/SignIn';
import Dashboard from '../Pages/Dashboard/Dashboard';
import Profile from '../Pages/Profile/Profile';

export default function Routing() {
  const { isLoading } = useStore();
  console.log(isLoading);
  return (
    <div
      className="wrapper"
      style={{ overflowX: 'hidden', position: 'relative' }}
    >
      <div
        style={{
          display: isLoading ? 'grid' : 'none',
          position: 'absolute',
          zIndex: 1000,
          height: '100vh',
          width: '100vw',
          placeItems: 'center',
          background: 'rgba(0,0,0,0.4)',
        }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
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
