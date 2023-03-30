import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from '../../Utils/axios';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const SettingsNavTab = ({
  userData,
  setIsLoading,
  fetchProfileData,
  profileOf,
}) => {
  const [userStatus, setUserStatus] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });

  useEffect(() => {
    setUserStatus(userData.account_active);
    setUserRole(userData.role);
  }, [userData.account_active, userData.role]);

  const updateUserStatus = async () => {
    setIsLoading(true);
    try {
      const response = await axios().patch(
        '/api/v1/auth/admin/profile/update-status/admin',
        { status: userStatus }
      );
      fetchProfileData();
      Toast.fire({ icon: 'success', title: response.data.msg });
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: 'error',
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
    }
  };

  const updateUserRole = async () => {
    setIsLoading(true);
    try {
      const response = await axios().patch(
        '/api/v1/auth/admin/profile/update-role/admin',
        { role: userRole }
      );
      fetchProfileData();
      Toast.fire({ icon: 'success', title: response.data.msg });
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: 'error',
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
    }
  };

  const updatePassword = async () => {
    const { old_password, new_password, new_password_confirm } = passwordData;

    if (new_password !== new_password_confirm) {
      Toast.fire({ icon: 'warning', title: 'New password should match' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios().patch(
        '/api/v1/auth/profile/update-password',
        { old_password, new_password }
      );
      setIsLoading(false);
      Toast.fire({ icon: 'success', title: response.data.msg });
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: 'error',
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
    }
  };

  const handleAccountDelete = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: '<h5>This account will be deleted?</h5>',
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: '#D14343',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          const response = await axios().patch(
            '/api/v1/auth/profile/delete-profile'
          );
          setIsLoading(false);
          Toast.fire({ icon: 'success', title: response.data.msg });
        } catch (error) {
          console.log(error);
          Toast.fire({
            icon: 'error',
            title: error.response.data
              ? error.response.data.msg
              : error.message,
          });
          setIsLoading(false);
        }
      }
    });
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            Account Status:{' '}
            {userData.account_active === true ? (
              <>
                <span className="badge badge-success">Active</span>
              </>
            ) : (
              <>
                <span className="badge badge-danger">Blocked</span>
              </>
            )}
          </h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <h6 className="d-flex">
                Email :{' '}
                {userData.email_verified === true ? (
                  <>
                    <span className="badge badge-success ms-auto">
                      Verified
                    </span>
                  </>
                ) : (
                  <>
                    <span className="badge badge-danger ms-auto">
                      Not Verified
                    </span>
                  </>
                )}
              </h6>
              <h6 className="d-flex">
                Phone Number:{' '}
                {userData.phone_no_verified === true ? (
                  <>
                    <span className="badge badge-success ms-auto">
                      Verified
                    </span>
                  </>
                ) : (
                  <>
                    <span className="badge badge-danger ms-auto">
                      Not Verified
                    </span>
                  </>
                )}
              </h6>
              <h6 className="d-flex">
                Registered On :{' '}
                <span className="ms-auto">
                  {new Date(userData.createdAt).toLocaleString()}
                </span>
              </h6>
              <h6 className="d-flex">
                Updated On :{' '}
                <span className="ms-auto">
                  {new Date(userData.updatedAt).toLocaleString()}
                </span>
              </h6>

              {profileOf !== 'admin' && (
                <>
                  <label htmlFor="account_status" className="form-label mt-2">
                    Change account status to:
                  </label>
                  <select
                    className="form-select"
                    id="account_status"
                    value={userStatus}
                    onChange={(e) => {
                      setUserStatus(e.target.value === 'true' ? true : false);
                    }}
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Blocked</option>
                  </select>
                </>
              )}
            </div>
          </div>
        </div>
        {profileOf !== 'admin' && (
          <>
            <div className="card-footer clearfix d-flex">
              <button
                type="button"
                className="btn btn-success"
                onClick={(e) => updateUserStatus()}
              >
                Update
              </button>
            </div>
          </>
        )}
      </div>

      {profileOf !== 'admin' && (
        <>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                Account Role:{' '}
                {userData.role === 'admin' ? (
                  <>
                    <span className="badge badge-primary">Admin</span>
                  </>
                ) : (
                  <>
                    <span className="badge badge-primary">User</span>
                  </>
                )}
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="account_role" className="form-label mt-2">
                    Change account role to:
                  </label>
                  <select
                    className="form-select"
                    id="account_role"
                    value={userRole}
                    onChange={(e) => {
                      setUserRole(e.target.value);
                    }}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card-footer clearfix d-flex">
              <button
                type="button"
                className="btn btn-success"
                onClick={(e) => updateUserRole()}
              >
                Update
              </button>
            </div>
          </div>
        </>
      )}

      {profileOf === 'admin' && (
        <>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Change Password</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="oldPass">Old Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.old_password}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          old_password: e.target.value,
                        })
                      }
                      id="oldPass"
                      placeholder="Old Password"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="newPass">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.new_password}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          new_password: e.target.value,
                        })
                      }
                      id="newPass"
                      placeholder="New Password"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="confirmPass">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.new_password_confirm}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          new_password_confirm: e.target.value,
                        })
                      }
                      id="confirmPass"
                      placeholder="Confirm Password"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer clearfix">
              <button
                type="button"
                className="btn btn-success"
                onClick={(e) => updatePassword()}
              >
                Update
              </button>
            </div>
          </div>
        </>
      )}

      <div className="card ">
        <div className="card-header bg-danger">
          <h3 className="card-title">Delete Account</h3>
        </div>
        <div className="card-body">
          <p>
            WARNING : By deleting you account, all transactions, exam results,
            user data will be deleted PERMANANTLY.
            <br />
            <br />
            This CANNOT be undone.
          </p>
        </div>
        <div className="card-footer bg-danger-subtle clearfix">
          <button
            type="button"
            className="btn btn-danger"
            onClick={(e) => handleAccountDelete()}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsNavTab;
