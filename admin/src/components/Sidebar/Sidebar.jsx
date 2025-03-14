import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { ConfigRoutes } from '../../Router/Router'

export default function Sidebar() {
  return (
    <div className='sidebar'>
      <div className='sidebar-options'>
        <NavLink to ={ConfigRoutes.add}  className='sidebar-option'>
          <img src={assets.add} alt=''/>
          <p>Add Items</p>
        </NavLink>
        <NavLink to = {ConfigRoutes.list} className='sidebar-option'>
          <img src={assets.list_items} alt=''/>
          <p>List Items</p>
        </NavLink>
        <NavLink to = {ConfigRoutes.update} className='sidebar-option'>
          <img src={assets.order} alt=''/>
          <p>Update</p>
        </NavLink>
        <NavLink to = {ConfigRoutes.order_management} className='sidebar-option'>
          <img src={assets.order} alt=''/>
          <p>Order Management</p>
        </NavLink>
        <NavLink to = {ConfigRoutes.return_management} className='sidebar-option'>
          <img src={assets.order} alt=''/>
          <p>Return Management</p>
        </NavLink><NavLink to = {ConfigRoutes.delivery_management} className='sidebar-option'>
          <img src={assets.order} alt=''/>
          <p>Delivery management</p>
        </NavLink><NavLink to = {ConfigRoutes.sales_statistics} className='sidebar-option'>
          <img src={assets.order} alt=''/>
          <p>Sale Statistics</p>
        </NavLink>   
      </div>
    </div>
  )
}
