import React from 'react';
import { Link } from 'react-router-dom';
import ProfileComponent from '../../Components/ProfileComponent/ProfileComponent';

const Profile = () => {
  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Profile</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Profile</li>
                </ol>
              </div>
            </div>
            <ProfileComponent profileOf="admin" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
