import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../Utils/axios';
import { useStore } from '../../Contexts/StoreContext';

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

const default_profile_image =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png';

const Profile = () => {
  const { setIsLoading } = useStore();
  const [userData, setUserData] = useState({
    profile_image: '',
    // name: '',
    // gender: '',
    // birthday: '',
    // email: '',
    // phone_no: '',
    // email_verified: '',
    // phone_no_verified: '',
    // account_active: '',
    // old_password: '',
    // new_password: '',
    name: 'Vishesh Gupta',
    gender: 'Male',
    birthday: '2023-03-14',
    email: 'visheshguptavgr@gmail.com',
    phone_no: '9180772349203',
    email_verified: true,
    phone_no_verified: true,
    account_active: true,
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });

  const [navTab, setNavTab] = useState(1);

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
            <div className="row justify-content-center mt-5">
              <div className="col-md-12">
                <div className="mb-5 d-flex align-items-center justify-content-center gap-2 gap-sm-4 flex-wrap">
                  <img
                    src={userData.profile_image || default_profile_image}
                    alt="profile"
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                    }}
                  />
                  <div>
                    <strong>{userData.name}</strong>
                    <br />
                    <small>
                      {userData.email} | +{userData.phone_no}
                    </small>
                  </div>
                </div>
                <nav class="nav nav-pills flex-column flex-sm-row mb-2 bg-body-secondary">
                  <button
                    className={`flex-sm-fill text-sm-center nav-link ${
                      navTab === 1 && 'active'
                    }`}
                    onClick={() => setNavTab(1)}
                  >
                    Info
                  </button>
                  <button
                    className={`flex-sm-fill text-sm-center nav-link ${
                      navTab === 2 && 'active'
                    }`}
                    onClick={() => setNavTab(2)}
                  >
                    Settings
                  </button>
                  <button
                    className={`flex-sm-fill text-sm-center nav-link ${
                      navTab === 3 && 'active'
                    }`}
                    onClick={() => setNavTab(3)}
                  >
                    Status
                  </button>
                </nav>

                {navTab === 1 && (
                  <InfoNavTab userData={userData} setUserData={setUserData} />
                )}
                {navTab === 2 && (
                  <SettingsNavTab
                    userData={userData}
                    setUserData={setUserData}
                  />
                )}
                {navTab === 3 && (
                  <StatusNavTab userData={userData} setUserData={setUserData} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

const InfoNavTab = ({ userData, setUserData }) => {
  const [localImg, setlocalImg] = useState(null);

  const UpdateProfile = () => {
    const { name, gender, birthday } = userData;
    console.log(name, gender, birthday);
  };

  const handleProfileImageUpload = (e, action) => {
    e.preventDefault();
    if (!localImg) return;

    let data = new FormData();

    if (action === 'delete') {
      data.append('upload', null);
    } else {
      data.append('upload', localImg);
    }

    // getAxiosInstance()
    //   .post('/admin/image-upload', data, {
    //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   })
    //   .then(async (res) => {
    //     setFileDataUrl(res.data.url);

    //     if (option === 'option') {
    //       setOptionDetails({
    //         ...optionDetails,
    //         option_image: res.data.url,
    //       });
    //     } else {
    //       setQuestionDetails({
    //         ...questionDetails,
    //         question_image: res.data.url,
    //       });
    //     }

    //     setTempImagesUsed({ ...tempImagesUsed, [res.data.url]: true });

    //     try {
    //       await navigator.clipboard.writeText(res.data.url);
    //       Toast.fire({
    //         icon: 'success',
    //         title: 'Image uploaded and URL copied',
    //       });
    //     } catch (err) {
    //       Toast.fire({ icon: 'success', title: 'Image uploaded' });
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //     Toast.fire({ icon: 'error', title: 'Image upload error' });
    //   });
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">User Profile</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  id="name"
                  placeholder="First Name"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  class="form-select"
                  id="gender"
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData({ ...userData, gender: e.target.value })
                  }
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="birthday">Birthday</label>
                <input
                  type="date"
                  className="form-control"
                  value={userData.birthday}
                  onChange={(e) =>
                    setUserData({ ...userData, birthday: e.target.value })
                  }
                  id="birthday"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer clearfix">
          <button
            type="button"
            className="btn btn-success"
            onClick={(e) => UpdateProfile()}
          >
            Update
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">User Image</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="image">Image</label>
                <input
                  id="image"
                  type="file"
                  accept="image/png, image/jpg, image/jpeg"
                  className="form-control"
                  onChange={(e) => {
                    setlocalImg(e.target.files[0]);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer clearfix">
          <button
            type="button"
            className="btn btn-success"
            onClick={(e) => handleProfileImageUpload(e, 'update')}
          >
            Update
          </button>
          <button
            type="button"
            className="btn btn-danger ms-2"
            onClick={(e) => handleProfileImageUpload(e, 'delete')}
          >
            Remove
          </button>
        </div>
      </div>
    </>
  );
};

const SettingsNavTab = ({ userData, setUserData }) => {
  const updatePassword = () => {
    const { old_password, new_password, new_password_confirm } = userData;
    console.log(old_password, new_password, new_password_confirm);
  };

  const handleAccountDelete = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: '<h5>This account will be deleted?</h5>',
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: '#D14343',
    }).then((result) => {
      if (result.isConfirmed) {
        //   setIsLoading(true);
        alert('account delted');
      }
    });
  };

  return (
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
                  value={userData.old_password}
                  onChange={(e) =>
                    setUserData({ ...userData, old_password: e.target.value })
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
                  value={userData.new_password}
                  onChange={(e) =>
                    setUserData({ ...userData, new_password: e.target.value })
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
                  value={userData.new_password_confirm}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
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

      <div className="card ">
        <div className="card-header bg-danger">
          <h3 className="card-title">Delete Account</h3>
        </div>
        <div className="card-body">
          <p>
            WARNING : By deleting you account, all transactiono, exam results,
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

const StatusNavTab = ({ userData, setUserData }) => {
  const updateUserStatus = () => {
    alert('updated');
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

              <label htmlFor="account_status" className="form-label mt-2">
                Change account status to:
              </label>
              <select
                className="form-select"
                id="account_status"
                value={userData.account_active}
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    account_active: e.target.value === 'true' ? true : false,
                  });
                }}
              >
                <option value={true}>Active</option>
                <option value={false}>Blocked</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-footer clearfix d-flex">
          <button
            type="button"
            className="btn btn-success"
            onClick={(e) => updateUserStatus()}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};
