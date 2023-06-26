import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../Utils/axios';
import loginPageSigeImg from '../../assets/loginPageSigeImg.png';
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

export default function SignIn() {
  const { accessToken, setIsLoading } = useStore();
  const [userData, setUserData] = useState({
    email: '',
    phone_no: '',
    country_code: '',
    password: '',
  });
  const [emailLogin, setEmailLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    // Check if is Logged in
    if (accessToken) navigate('/');
  }, [accessToken, navigate]);

  const signUserIn = async (e) => {
    e.preventDefault();
    if (emailLogin && userData.email === '')
      return Toast.fire({ icon: 'error', title: 'Email required' });
    if (!emailLogin && userData.phone_no === '')
      return Toast.fire({ icon: 'error', title: 'Phone No required' });
    if (userData.password === '')
      return Toast.fire({ icon: 'error', title: 'Password required' });

    const params = {
      password: userData.password,
    };

    if (emailLogin) {
      params.email = userData.email;
    } else {
      params.phone_no = Number(userData.phone_no);
      params.country_code = Number(userData.country_code);
    }

    setIsLoading(true);

    try {
      const res = await axios().post(
        process.env.REACT_APP_BASE_URL + '/api/v1/auth/login',
        params
      );
      Toast.fire({
        icon: 'success',
        title: 'Logged In',
      });
      setIsLoading(false);

      if (!(res.data.role === 'admin' || res.data.role === 'teacher')) {
        Toast.fire({
          icon: 'error',
          title: 'Invalid Credentials',
        });
        return;
      }

      localStorage.setItem('access_token', res.data.token);
      localStorage.setItem('access_level', res.data.role);
      window.location.reload();
    } catch (err) {
      console.log(err);
      Toast.fire({
        icon: 'error',
        title: err.response.data?.msg || err.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        style={{ height: '100vh', width: '100vw' }}
        className="d-flex row m-0"
      >
        <img
          src={loginPageSigeImg}
          alt="logo"
          style={imgStyle}
          className=" d-none col-md-6 d-md-block"
        />
        <div
          style={{ width: '50%' }}
          className="d-flex justify-content-center align-items-center col-12 col-md-6 p-4"
        >
          <form className="form-horizontal">
            <h2 style={{ color: '#775DA8' }}>Login | Admin</h2>
            <h6>Please enter your log in details</h6>
            <h6>Enter your mobile number or Email to continue.</h6>
            <span>Login with : </span>
            <div className="form-check form-switch d-inline-block mt-5 mb-3">
              <span
                className="form-check-span pl-0"
                htmlFor="emailPhoneSwitch"
                style={{
                  color: !emailLogin && 'grey',
                  fontWeight: emailLogin && 'bold',
                }}
              >
                Email
              </span>
              <input
                className="form-check-input ml-2 d-inline-block"
                type="checkbox"
                role="switch"
                id="emailPhoneSwitch"
                onChange={() => setEmailLogin((prev) => !prev)}
              />
              <span
                className="form-check-span ml-5"
                htmlFor="emailPhoneSwitch"
                style={{
                  color: emailLogin && 'grey',
                  fontWeight: !emailLogin && 'bold',
                }}
              >
                Phone No
              </span>
            </div>

            <div className="form-group row">
              {emailLogin ? (
                <>
                  <label htmlFor="emailField" className="form-label">
                    Email
                  </label>
                  <div className="">
                    <input
                      type="email"
                      className="form-control"
                      id="emailField"
                      placeholder="abc@email.com"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <label htmlFor="phoneNoField" className="form-label">
                    Phone No
                  </label>
                  <div className="d-flex">
                    <div class="input-group mb-3">
                      <span class="input-group-text" id="basic-addon1">
                        +
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="countryCodeField"
                        style={{ maxWidth: '50px' }}
                        placeholder="XX"
                        value={userData.country_code}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            country_code: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        className="form-control"
                        id="phoneNoField"
                        placeholder="XXXXXXXXXX"
                        value={userData.phone_no}
                        onChange={(e) =>
                          setUserData({ ...userData, phone_no: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="form-group row">
              <label htmlFor="passwordField" className="form-label">
                Password
              </label>
              <div className="">
                <div className="input-group mb-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control  border-right-0"
                    id="passwordField"
                    placeholder="Password"
                    value={userData.password}
                    onChange={(e) =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                  />
                  <span
                    className="input-group-text bg-white"
                    id="basic-addon2"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <>
                        <i className="fa fa-eye-slash" aria-hidden="true"></i>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-eye" aria-hidden="true"></i>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-success w-100"
              onClick={(e) => signUserIn(e)}
            >
              Sign in
            </button>
            <button
              type="submit"
              className="btn btn-light w-100 my-2"
              onClick={async () => {
                window.open(
                  process.env.REACT_APP_BASE_URL + '/api/v1/auth/login/google',
                  '_blank'
                );
                // await axios().get(
                //   process.env.REACT_APP_BASE_URL + '/api/v1/auth/login/google'
                // );
                // window.location.href =
                //   process.env.REACT_APP_BASE_URL + '/api/v1/auth/login/google';
              }}
            >
              Google Login
            </button>
            <button
              type="submit"
              className="btn btn-primary w-100"
              onClick={async () => {
                window.open(
                  process.env.REACT_APP_BASE_URL +
                    '/api/v1/auth/login/facebook',
                  '_blank'
                );

                // await axios().get(
                //   process.env.REACT_APP_BASE_URL + '/api/v1/auth/login/facebook'
                // );
              }}
            >
              Facebook Login
            </button>
          </form>
        </div>
      </div>
      {/* <div className="row justify-content-center mt-5">
        <div className="col-md-5">imgStyle
          <div className="card card-info">
            <div className="card-header">
              <h3 className="card-title">Sign In</h3>
            </div>
            <form className="form-horizontal">
              <div className="card-body">
                <div className="form-group row">
                  <label
                    htmlFor="emailField"
                    className="col-sm-2 col-form-label"
                  >
                    Email
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="email"
                      className="form-control"
                      id="emailField"
                      placeholder="example@email.com"
                      value={Email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="passwordField"
                    className="col-sm-2 col-form-label"
                  >
                    Password
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="password"
                      className="form-control"
                      id="passwordField"
                      placeholder="Password"
                      value={Password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="offset-sm-2 col-sm-10">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        onChange={(e) => setRememberMe(!RememberMe)}
                        defaultChecked={RememberMe}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button
                  type="submit"
                  className="btn btn-info"
                  onClick={(e) => signUserIn(e)}
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div> */}
    </>
  );
}

const imgStyle = {
  height: '100%',
  width: '50%',
  objectFit: 'cover',
};
