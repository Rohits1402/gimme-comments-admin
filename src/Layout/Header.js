import React from 'react'
import { useNavigate } from 'react-router-dom'
import gimmecomments_logo from '../assets/gimmecomments_logo.png'

export default function Header() {
  const navigate = useNavigate()

  const logOut = () => {
    localStorage.removeItem('gimme_comment_access_token')
    window.location.reload()
  }

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
          src={gimmecomments_logo}
          alt="logo"
          style={{ height: '100px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
        <ul className="navbar-nav">
          <li className="nav-item">
            <div
              className="nav-link"
              role="button"
              onClick={() => window.location.reload()}
            >
              <i className="fa fa-refresh" style={{ color: '#775DA8' }} />
            </div>
          </li>
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
  )
}
