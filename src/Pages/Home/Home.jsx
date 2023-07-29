import React from 'react'
import { useNavigate } from 'react-router-dom'

import gimmecomments_logo from '../../assets/gimmecomments_logo.png'
const access_token = localStorage.getItem('gimme_comment_access_token')

const Home = () => {
  const navigate = useNavigate()

  function handleClick(e) {
    e.preventDefault()

    if (access_token) {
      navigate('/websites')
    } else {
      navigate('/sign-in')
    }
  }

  function handleStart() {
    navigate('/sign-up')
  }
  return (
    <>
      {/* Navbar  */}
      <nav className="navbar navbar-light bg-light">
        <div className="container">
          <a href="/" className="navbar-brand font-weight-bold">
            <img
              src={gimmecomments_logo}
              alt="logo"
              style={{ height: '50px', cursor: 'pointer' }}
            />
          </a>

          <form className="d-flex">
            <button
              className="btn btn-success"
              type="submit"
              onClick={handleClick}
            >
              Dashboard
            </button>
          </form>
        </div>
      </nav>

      {/* Body  */}

      <div className="container text-center mt-5 ">
        <h1 className="font-weight-bold">Welcome to Gimme Comments</h1>

        <div className="container mt-5 ">
          GimmeComments is an innovative and cutting-edge web application that
          revolutionizes the way developers incorporate comments into their
          projects. With a sleek and user-friendly interface, GimmeComments aims
          to simplify the process of integrating robust commenting functionality
          into websites, applications, and other software projects. This
          powerful and scalable comments server is designed to enhance
          collaboration, feedback gathering, and engagement among developers and
          users.
        </div>
      </div>

      {/* Footer */}

      <div className="container mt-5 text-center">
        <button type="button" class="btn btn-primary" onClick={handleStart}>
          Get Started
        </button>
      </div>
    </>
  )
}


export default Home;
