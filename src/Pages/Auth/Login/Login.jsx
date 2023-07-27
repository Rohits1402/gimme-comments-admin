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

const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (email === '')
      return Toast.fire({ icon: 'error', title: 'Email required' })
    if (password === '')
      return Toast.fire({ icon: 'error', title: 'Password required' })

    try {
      const res = await axios().post('/api/v1/auth/login', {
        email,
        password,
      })

      console.log(res.data)

      Toast.fire({
        icon: 'success',
        title: 'Logged In',
      })

      setTimeout(() => {
        localStorage.setItem('gimme_comment_access_token', res.data.token)
        window.location.reload()
      }, 1000)
    } catch (err) {
      console.log(err)
      if (err.response.data.msg === 'Email is not verified') {
        Toast.fire({
          icon: 'error',
          title: err.response.data ? err.response.data.msg : err.message,
        })
        navigate('/verify-account')
      } else {
        Toast.fire({
          icon: 'error',
          title: err.response.data ? err.response.data.msg : err.message,
        })
      }
    }
  }

  return (
    <>
      <form className="form-horizontal">
        <h2 style={{ color: '#775DA8' }}>Login | Developer</h2>
        <h6>Please enter your log in details</h6>
        {/* <span>Login with : </span> */}

        <div className="form-group row">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="form-control  border-right-0"
                id="passwordField"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          onClick={(e) => handleLogin(e)}
        >
          Sign in
        </button>
      </form>

      <div className="my-2 text-center ">
        <Link to="/forget-password">Forget Password?</Link>
      </div>
      <hr style={{ width: '80vw', margin: '0 auto' }} />
      <Link to="/sign-up">
        <button className="btn btn-primary w-100 mt-2">
          Create new Account
        </button>
      </Link>
    </>
  )
}

export default Login
