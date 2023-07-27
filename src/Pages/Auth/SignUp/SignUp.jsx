import { React, useState } from 'react'
import Swal from 'sweetalert2'
import axios from '../../../Utils/axios'
import { useNavigate, Link } from 'react-router-dom'

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
})

const initialState = {
  name: '',
  email: '',
  password: '',
}

const SignUp = () => {
  const navigate = useNavigate()
  const [userDetail, setUserDetail] = useState(initialState)
  const [showPassword, setShowPassword] = useState(false)

  const handleChage = (e) => {
    const { name, value } = e.target

    setUserDetail({
      ...userDetail,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios().post('/api/v1/auth/register', userDetail)

      console.log(res)

      Toast.fire({
        icon: 'success',
        title: res.data.msg,
      })

      if (res.data) {
        navigate('/')
      }
    } catch (err) {
      console.log(err)
      Toast.fire({
        icon: 'error',
        title: err.response.data ? err.response.data.msg : err.message,
      })
    }
  }

  return (
    <>
      <form className="form-horizontal">
        <h2 style={{ color: '#775DA8' }}>Registration | Developer</h2>
        <h6>Please enter details</h6>

        <div className="form-group row">
          <>
            <label htmlFor="nameField" className="form-label">
              Name
            </label>
            <div className="">
              <input
                type="text"
                name="name"
                className="form-control"
                id="nameField"
                placeholder="Enter your name"
                value={userDetail.name}
                onChange={handleChage}
              />
            </div>
          </>
        </div>

        <div className="form-group row">
          <>
            <label htmlFor="emailField" className="form-label">
              Email
            </label>
            <div className="">
              <input
                type="email"
                name="email"
                className="form-control"
                id="emailField"
                placeholder="abc@email.com"
                value={userDetail.email}
                onChange={handleChage}
              />
            </div>
          </>
        </div>
        <div className="form-group row">
          <label htmlFor="passwordField" className="form-label">
            Password
          </label>
          <div className="">
            <div className="input-group mb-1">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-control  border-right-0"
                id="passwordField"
                placeholder="Password"
                value={userDetail.password}
                onChange={handleChage}
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
          onClick={(e) => handleSubmit(e)}
        >
          Register
        </button>
      </form>

      <div className="my-2 text-center">
        <Link to="/sign-in">Already Register?</Link>
      </div>
    </>
  )
}

export default SignUp
