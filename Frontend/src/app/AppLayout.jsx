import React from 'react'
import Nav from '../features/Shared/Components/Nav';
import { Outlet } from 'react-router';

const Applayout = () => {
  return (
    <>
        <Nav />
        <Outlet />
    </>
  )
}

export default Applayout