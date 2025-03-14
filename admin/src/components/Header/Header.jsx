import React from 'react'
import "./Header.css"
import {assets} from "../../assets/assets.js"
const Header = () => {
  return (
    <div className='header-container'>
      <img className='logo' alt='' src={assets.logo}/>
      <img src={assets.profile} alt=''/>
    </div>
  )
}

export default Header
