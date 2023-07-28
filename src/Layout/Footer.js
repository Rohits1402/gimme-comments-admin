import React from 'react'
import { useStore } from '../Contexts/StoreContext'

export default function Footer() {
  const { accessLevel } = useStore()
  console.log(accessLevel)
  return (
    <>
      <footer className="main-footer">
        <strong style={{ color: '#775DA8' }}>
          Navya |{accessLevel === 'teacher' ? ' Teacher ' : ' Admin '}
          Portal
        </strong>
        <div className="float-right d-none d-sm-inline-block">
          2023 © All rights reserved
        </div>
      </footer>
    </>
  )
}
