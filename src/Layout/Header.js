import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../Contexts/StoreContext';
import NavyaLogoMain from '../assets/NavyaLogoMain.png';

export default function Header() {
  const { setAccessToken } = useStore();
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem('access_token');
    setAccessToken(null);
    navigate('/sign-in');
  };

  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light d-flex justify-content-between">
        <ul className="navbar-nav">
          <li className="nav-item">
            <div
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars" style={{ color: '#775DA8' }} />
            </div>
          </li>
        </ul>
        <img
          src={NavyaLogoMain}
          alt="logl"
          style={{ height: '40px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
        <ul className="navbar-nav">
          <li className="nav-item">
            <div
              className="nav-link"
              data-widget="fullscreen"
              href="#"
              role="button"
            >
              <i
                className="fas fa-expand-arrows-alt"
                style={{ color: '#775DA8' }}
              />
            </div>
          </li>
          <li className="nav-item">
            <div
              className="nav-link"
              data-widget="control-sidebar"
              data-controlsidebar-slide="true"
              href="#"
              role="button"
              onClick={() => logOut()}
            >
              {/* <i className="fas fa-th-large" /> */}
              <i className="fas fa-sign-out-alt" style={{ color: '#775DA8' }} />
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}
