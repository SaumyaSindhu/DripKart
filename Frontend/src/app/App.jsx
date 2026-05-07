import './App.scss';
import { RouterProvider } from "react-router";
import { routes } from './app.routes';
import { useAuth } from '../features/auth/hook/useAuth';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function App() {

  const { handleGetMe } = useAuth()

  const user = useSelector(state => state.auth.user)

  useEffect(() => {

    handleGetMe()

  }, [])
  

  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
