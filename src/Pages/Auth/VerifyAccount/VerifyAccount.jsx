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

const VerifyAccount = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [data, setData] = useState({
    email: '',
    otp: 0,
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (page === 1) {
      generateOTP()
    } else {
      verifyOTP()
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
        '/api/v1/auth/account-verification/verify-account',
        { email: data.email, otp: Number(data.otp) },
      )

      console.log(res)

      Toast.fire({
        icon: 'success',
        title: res.data.msg,
      })

      navigate('/sign-in')
    } catch (err) {
      console.log(err)
      Toast.fire({
        icon: 'error',
        title: err.response.data ? err.response.data.msg : err.message,
      })

      if (err.response.data.msg === 'Email is already verified') {
        navigate('/sign-in')
      }
    }
  }

  return (
    <>
      <form className="form-horizontal">
        <h2 style={{ color: '#775DA8' }}>Verify Account</h2>
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
              <div className="input-group mb-1">
                <input
                  name="otp"
                  className="form-control  border-right-0"
                  id="otp"
                  type="number"
                  placeholder="otp"
                  value={data.otp}
                  onChange={(e) =>
                    setData({ ...data, otp: Number(e.target.value) })
                  }
                />
                <span
                  className="input-group-text btn btn-success "
                  onClick={() => generateOTP()}
                >
                  Get OTP again
                </span>
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          className="btn btn-success w-100"
          onClick={(e) => handleSubmit(e)}
        >
          {page === 1 && 'Get OTP'}
          {page === 2 && 'Verify Account'}
        </button>
      </form>
    </>
  )
}

export default VerifyAccount
