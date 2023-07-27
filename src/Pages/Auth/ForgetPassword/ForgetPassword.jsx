import { React, useState } from 'react'
import Swal from 'sweetalert2'
import axios from '../../../Utils/axios'
import { useNavigate } from 'react-router-dom'

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

const ForgetPassword = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [data, setData] = useState({
    email: '',
    otp: 0,
    new_password: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (page === 1) {
      generateOTP()
    }
    if (page === 2) {
      verifyOTP()
    }
    if (page === 3) {
      updatePassword()
    }
  }

  const generateOTP = async () => {
    try {
      const res = await axios().post(
        '/api/v1/auth/forget-password/generate-otp',
        {
          email: data.email,
        },
      )

      console.log(res.data)

      Toast.fire({
        icon: 'success',
        title: res.data.msg,
      })
      setPage(2)
    } catch (err) {
      console.log(err)
      Toast.fire({
        icon: 'error',
        title: err.response.data ? err.response.data.msg : err.message,
      })
    }
  }

  const verifyOTP = async () => {
    try {
      const res = await axios().post(
        '/api/v1/auth/forget-password/verify-otp',
        {
          email: data.email,
          otp: Number(data.otp),
        },
      )

      console.log(res.data)

      Toast.fire({
        icon: 'success',
        title: res.data.msg,
      })
      setPage(3)
    } catch (err) {
      console.log(err)
      Toast.fire({
        icon: 'error',
        title: err.response.data ? err.response.data.msg : err.message,
      })
    }
  }

  const updatePassword = async () => {
    try {
      const res = await axios().patch(
        '/api/v1/auth/forget-password/change-password',
        {
          email: data.email,
          otp: Number(data.otp),
          new_password: data.new_password,
        },
      )

      console.log(res.data)

      Toast.fire({
        icon: 'success',
        title: res.data.msg,
      })
      navigate('/')
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
        <h2 style={{ color: '#775DA8' }}>Forget Password</h2>
        <h6>Please enter details</h6>

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
                disabled={!(page === 1)}
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
          </>
        </div>

        {page !== 1 && (
          <>
            <div className="form-group row">
              <label htmlFor="otp" className="form-label">
                Enter your OTP
              </label>
              <div className="">
                <div className="input-group mb-1">
                  <input
                    name="otp"
                    className="form-control  border-right-0"
                    id="otp"
                    type="number"
                    placeholder="otp"
                    value={data.otp}
                    disabled={!(page === 2)} // It will disabled editing
                    onChange={(e) =>
                      setData({ ...data, otp: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {page !== 1 && page !== 2 && (
          <div className="form-group row">
            <label htmlFor="new_password" className="form-label">
              Enter your New Password
            </label>
            <div className="">
              <div className="input-group mb-1">
                <input
                  name="new_password"
                  className="form-control  border-right-0"
                  id="new_password"
                  type="password"
                  placeholder="new password"
                  value={data.new_password}
                  disabled={!(page === 3)} // It will disabled editing
                  onChange={(e) =>
                    setData({ ...data, new_password: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-success w-100"
          onClick={(e) => handleSubmit(e)}
        >
          {page === 1 && 'Get OTP'}
          {page === 2 && 'Verify OTP'}
          {page === 3 && 'Update Password'}
        </button>
      </form>
    </>
  )
}

export default ForgetPassword
