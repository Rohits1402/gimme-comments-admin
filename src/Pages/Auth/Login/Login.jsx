import { React, useState } from 'react'
import Swal from 'sweetalert2'
import axios from '../../../Utils/axios'

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
  //   const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const signUserIn = async (e) => {
    e.preventDefault()
    if (email === '')
      return Toast.fire({ icon: 'error', title: 'Email required' })
    if (password === '')
      return Toast.fire({ icon: 'error', title: 'Password required' })

    const params = {
      password: password,
    }

    if (email) {
      params.email = email
    }

    try {
      const res = await axios().post(
        process.env.REACT_APP_BASE_URL + '/api/v1/auth/login',
        params,
      )

      console.log(res)
      //   Toast.fire({
      //     icon: 'success',
      //     title: 'Logged In',
      //   })

      if (res.status === 200) {
        Toast.fire({
          icon: 'success',
          title: 'Logged In',
        })
      }

      if (!(res.status === 200)) {
        Toast.fire({
          icon: 'error',
          title: 'Invalid Credentials',
        })
        return
      }

      localStorage.setItem('access_token', res.data.token)
      localStorage.setItem('access_level', res.data.role)
      window.location.reload()
    } catch (err) {
      console.log(err)
      Toast.fire({
        icon: 'error',
        title: err.response.data?.msg || err.message,
      })
    }
  }

  return (
    <>
      <form className="form-horizontal">
        <h2 style={{ color: '#775DA8' }}>Login | Admin</h2>
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
          onClick={(e) => signUserIn(e)}
        >
          Sign in
        </button>
      </form>
    </>
  )
}

export default Login
