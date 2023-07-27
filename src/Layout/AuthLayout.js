import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import loginPageSigeImg from '../assets/loginPageSigeImg.png'

export default function AuthLayout() {
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
          <Outlet />
        </div>
      </div>
    </>
  )
}

const imgStyle = {
  height: '100%',
  width: '50%',
  objectFit: 'cover',
}
