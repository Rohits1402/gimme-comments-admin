import React from 'react';
import { Link } from 'react-router-dom';
import ProfileComponent from '../../Components/ProfileComponent/ProfileComponent';

const CustomerProfile = () => {
  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">
                  <i className="nav-icon fas fa-users me-2" />
                  Customer Profile
                </h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/customers">Customers</Link>
                  </li>
                  <li className="breadcrumb-item active">Customer Profile</li>
                </ol>
              </div>
            </div>
            <ProfileComponent />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerProfile;
