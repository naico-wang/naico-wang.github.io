import { Outlet } from 'react-router-dom'
import Aside from '../../components/Aside'
import Footer from '../../components/Footer'

import './index.css'

const Layout = () => {
  return (
    <>
      <main className='main-section'>
        <div
          className='aside'>
          <Aside />
          <Footer />
        </div>
        <div className='page-content'>
        <Outlet />
        </div>
      </main>
    </>
  )
}

export default Layout
