import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UserRegister from '../pages/UserRegister'
import UserLogin from '../pages/UserLogin'
import FoodPartnerRegister from '../pages/FoodPartnerRegister'
import FoodPartnerLogin from '../pages/FoodPartnerLogin'
import Home from '../pages/Home'
import CreateFood from '../components/CreateFood'
import Profile from '../components/Profile'
import Saved from '../pages/Saved'

const router = createBrowserRouter([
  {
    path: '/user/register',
    element: <UserRegister />,
  },
  {
    path: '/user/login',
    element: <UserLogin />,
  },
  {
    path: '/foodPartner/register',
    element: <FoodPartnerRegister />,
  },
  {
    path: '/foodPartner/login',
    element: <FoodPartnerLogin />,
  },
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/create-food',
    element: <CreateFood />,
  },
  {
    path: '/food-partner/:id',
    element: <Profile />,
  },
  {
    path: '/saved',
    element: <Saved />,
  }
])

const AppRouter = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default AppRouter