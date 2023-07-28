import React from "react";
import { Link } from "react-router-dom";

export default function Menu() {
  const logOut = () => {
    localStorage.removeItem("gimme_comment_access_token");
    window.location.reload();
  };

  return (
    <>
      <aside
        className="main-sidebar sidebar-dark-primary elevation-4"
        style={{ background: "#775DA8", position: "fixed" }}
      >
        <div className="sidebar" style={{ height: "99vh" }}>
          {/* <div className="form-inline">
            <div className="input-group mt-2" data-widget="sidebar-search">
              <input
                className="form-control form-control-sidebar bg-white"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append ">
                <button className="btn btn-sidebar bg-white">
                  <i className="fas fa-search fa-fw" />
                </button>
              </div>
            </div>
          </div> */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column flex-nowrap"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <>
                <li className="nav-item">
                  <Link to="/websites" className={`nav-link `}>
                    <i className="nav-icon fa fa-map-o" />
                    <p>Websites</p>
                  </Link>
                </li>
              </>

              <li
                className="nav-header rounded-2 text-bold my-2 "
                style={{ background: "#6c4da9" }}
              >
                SETTINGS
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  <i className="nav-icon fas fa-user" />
                  <p>Profile</p>
                </Link>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link" onClick={logOut}>
                  <i className="nav-icon fas fa-sign-out-alt" />
                  <p>Log Out</p>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
