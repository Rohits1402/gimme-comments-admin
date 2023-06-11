import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../Contexts/StoreContext';

export default function Menu() {
  const { setAccessToken, accessLevel } = useStore();
  const navigate = useNavigate();
  console.log(accessLevel);

  const logOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('access_level');
    setAccessToken(null);
    navigate('/sign-in');
  };

  return (
    <>
      <aside
        className="main-sidebar sidebar-dark-primary elevation-4"
        style={{ background: '#775DA8', position: 'fixed' }}
      >
        <div className="sidebar" style={{ height: '99vh' }}>
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
              <li className="nav-item">
                <Link to="/" className={`nav-link `}>
                  <i className="nav-icon fas fa-th" />
                  <p>Dashboard</p>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link to="/about-us" className={`nav-link `}>
                  <i className="nav-icon fa fa-info-circle"></i>
                  <p>About Us</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/plans" className={`nav-link `}>
                  <i className="nav-icon fa fa-usd"></i>
                  <p>Plans</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/exams" className={`nav-link `}>
                  <i className="nav-icon fa fa-clipboard"></i>
                  <p>Exams</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/forum-discussion" className={`nav-link `}>
                  <i className="nav-icon fa fa-weixin"></i>
                  <p>Forum Discussion</p>
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <Link to="#" className={`nav-link `}>
                  <i className="nav-icon fas fa-th-list" />
                  <p>
                    Category
                    <i className="fas fa-angle-left right" />
                  </p>
                </Link>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/categories/add" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Add Category</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/categories/view" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>View Category</p>
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <a href="#" className={`nav-link `}>
                  <i className="nav-icon fas fa-copy" />
                  <p>
                    Forum Category
                    <i className="fas fa-angle-left right" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/forum-categories/add" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Add Category</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/forum-categories/view" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>View Category</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/forum-categories/unapproved-questions"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon" />
                      <p>Unapproved Questions</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/forum-categories/unapproved-replies"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon" />
                      <p>Unapproved Replies</p>
                    </Link>
                  </li>
                </ul>
              </li> */}
              {accessLevel === 'teacher' ? (
                <>
                  {/* Show to teachers only */}
                  <li className="nav-item active">
                    <Link to="/course-categories" className={`nav-link `}>
                      <i className="nav-icon fa fa-files-o" />
                      <p>Course Categories</p>
                    </Link>
                  </li>

                  <li className="nav-item active">
                    <Link to="/courses" className={`nav-link `}>
                      <i className="nav-icon fa fa-book" />
                      <p>Courses</p>
                    </Link>
                  </li>
                  <li className="nav-item active">
                    <Link to="/customers" className={`nav-link `}>
                      <i className="nav-icon fas fa-users" />
                      <p>Customers</p>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item active">
                    <Link to="/customers" className={`nav-link `}>
                      <i className="nav-icon fas fa-users" />
                      <p>Customers</p>
                    </Link>
                  </li>
                  {/* Show to Admin only */}
                  <li
                    className="nav-header rounded-2 text-bold my-2 "
                    style={{ background: '#6c4da9' }}
                  >
                    APP
                  </li>
                  <li className="nav-item">
                    <Link to="/app/banner" className={`nav-link `}>
                      <i className="nav-icon fa fa-television" />
                      <p>Banner</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/app/welcome-screen" className={`nav-link `}>
                      <i className="nav-icon fa fa-mobile" />
                      <p>Welcome Screen</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/app/event" className={`nav-link `}>
                      <i className="nav-icon fa fa-map-o" />
                      <p>Event</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/app/feedback" className={`nav-link `}>
                      <i className="nav-icon fa fa-bug" />
                      <p>Feedback</p>
                    </Link>
                  </li>
                </>
              )}

              <li
                className="nav-header rounded-2 text-bold my-2 "
                style={{ background: '#6c4da9' }}
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
              {/* <li className="nav-header">QUESTIONS</li>
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <i className="fas fa-circle nav-icon" />
                                    <p>Question</p>
                                </a>
                            </li> */}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
