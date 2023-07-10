import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from '../../Utils/axios';
import { auth } from '../../Utils/firebaseConfig';
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
} from 'firebase/auth';

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

const InfoNavTab = ({
  userData,
  setUserData,
  setIsLoading,
  fetchProfileData,
  currUserId,
}) => {
  const googleAuthProvider = new GoogleAuthProvider();
  const facebookAuthProvider = new FacebookAuthProvider();

  const [localImg, setlocalImg] = useState(null);
  const [userLocalData, setUserLocalData] = useState({
    name: '',
    gender: '',
    birthday: '',
  });

  useEffect(() => {
    setUserLocalData({
      name: userData.name,
      gender: userData.gender,
      birthday: userData.birthday,
    });
  }, [userData]);

  const UpdateProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axios().patch(
        '/api/v1/auth/profile/update-profile',
        userLocalData
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

  const handleProfileImageUpload = async (e, action) => {
    e.preventDefault();

    let imageData = new FormData();

    if (action === 'delete') {
      imageData.append('profile_image', null);
    } else {
      if (!localImg) {
        Toast.fire({ icon: 'warning', title: 'Please provide Image' });
        return;
      }

      imageData.append('profile_image', localImg);
    }

    setIsLoading(true);
    try {
      const response = await axios().patch(
        '/api/v1/auth/profile/update-profile-image',
        imageData,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
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

  const handleLinkSocialAccount = async (e, provider) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let res;
      if (provider === 'google') {
        res = await signInWithPopup(auth, googleAuthProvider);
        await signOut(auth);

        const response = await axios().post('/api/v1/auth/social/link', {
          provider: 'google',
          google_login_uid: res.user.uid,
        });

        Toast.fire({ icon: 'success', title: response.data.msg });
      } else if (provider === 'facebook') {
        res = await signInWithPopup(auth, facebookAuthProvider);
        await signOut(auth);

        const response = await axios().post('/api/v1/auth/social/link', {
          provider: 'facebook',
          facebook_login_uid: res.user.uid,
        });

        Toast.fire({ icon: 'success', title: response.data.msg });
      } else {
        Toast.fire({ icon: 'success', title: 'Please provide valid provider' });
      }

      setIsLoading(false);
      fetchProfileData();
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: 'error',
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
    }
  };

  const handleUnlinkSocialAccount = async (e, provider) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (provider === 'google') {
        const response = await axios().post('/api/v1/auth/social/unlink', {
          provider: 'google',
        });

        Toast.fire({ icon: 'success', title: response.data.msg });
      } else if (provider === 'facebook') {
        const response = await axios().post('/api/v1/auth/social/unlink', {
          provider: 'facebook',
        });

        Toast.fire({ icon: 'success', title: response.data.msg });
      } else {
        Toast.fire({ icon: 'success', title: 'Please provide valid provider' });
      }

      setIsLoading(false);
      fetchProfileData();
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: 'error',
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
    }
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
                  className="form-control  w-100"
                  disabled={currUserId !== 'admin'}
                  value={userLocalData.name}
                  onChange={(e) =>
                    setUserLocalData({ ...userLocalData, name: e.target.value })
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
                  className="form-select  w-100"
                  id="gender"
                  disabled={currUserId !== 'admin'}
                  value={userLocalData.gender}
                  onChange={(e) =>
                    setUserLocalData({
                      ...userLocalData,
                      gender: e.target.value,
                    })
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
                  className="form-control w-100"
                  disabled={currUserId !== 'admin'}
                  value={userLocalData.birthday}
                  onChange={(e) =>
                    setUserLocalData({
                      ...userLocalData,
                      birthday: e.target.value,
                    })
                  }
                  id="birthday"
                />
              </div>
            </div>
          </div>
        </div>
        {currUserId === 'admin' && (
          <>
            <div className="card-footer clearfix">
              <button
                type="button"
                className="btn btn-success"
                onClick={(e) => UpdateProfile()}
              >
                Update
              </button>
            </div>
          </>
        )}
      </div>

      {currUserId === 'admin' && (
        <>
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
                      className="form-control  w-100"
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
      )}

      {currUserId === 'admin' && (
        <>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Social Accounts</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="google_login_uid" className="d-block">
                      {userData.google_login_uid
                        ? `Google account linked with UID : ${userData.google_login_uid}`
                        : `No Google account linked`}
                    </label>
                    <button
                      type="submit"
                      className="btn btn-light my-2"
                      onClick={(e) => handleLinkSocialAccount(e, 'google')}
                    >
                      Link Google Account
                    </button>
                    {userData.google_login_uid && (
                      <>
                        <button
                          type="submit"
                          className="btn btn-danger ms-2"
                          onClick={(e) =>
                            handleUnlinkSocialAccount(e, 'google')
                          }
                        >
                          Unlink Google Account
                        </button>
                      </>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="facebook_login_uid" className="d-block">
                      {userData.facebook_login_uid
                        ? `Facebook account linked with UID : ${userData.facebook_login_uid}`
                        : `No Facebook account linked`}
                    </label>
                    <button
                      type="submit"
                      className="btn btn-primary my-2"
                      onClick={(e) => handleLinkSocialAccount(e, 'facebook')}
                    >
                      Link Facebook Account
                    </button>
                    {userData.facebook_login_uid && (
                      <>
                        <button
                          type="submit"
                          className="btn btn-danger ms-2"
                          onClick={(e) =>
                            handleUnlinkSocialAccount(e, 'facebook')
                          }
                        >
                          Unlink Facebook Account
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer clearfix"></div>
          </div>
        </>
      )}
    </>
  );
};

export default InfoNavTab;
