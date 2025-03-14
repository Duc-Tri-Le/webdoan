import React from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import Header from '../components/Header/Header'
import "./DefaultLayout.css"

const DefaultLayout = ({children}) => {
  return (
    <div className='wrapper'>
      <Header/>
      <div className='container'>
        <Sidebar/>
        <div className='content'>
            {children}
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
