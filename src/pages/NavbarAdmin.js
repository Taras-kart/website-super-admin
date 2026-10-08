import React,{useEffect,useState} from 'react'
import {NavLink,Link,useLocation} from 'react-router-dom'
import {useAuth} from './AdminAuth'
import {apiGet} from './api'
import './Operations.css'
export default function NavbarAdmin(){
  const {user,logout,setBranch}=useAuth(),[branches,setBranches]=useState([]),[open,setOpen]=useState(false),location=useLocation()
  const superAdmin=user?.role==='SUPER_ADMIN'
  useEffect(()=>{apiGet('/manage/branches').then(setBranches).catch(()=>{})},[])
  useEffect(()=>setOpen(false),[location.pathname])
  const links=[['Overview','/'],['Stock','/stocks'],['Add product','/products'],['Excel & images','/import'],['Sales','/sales'],['Counter sale','/pos'],['Movements','/transactions'],...(superAdmin?[['Branches','/branches'],['Admins','/branch-admins'],['Categories','/categories'],['Customers','/customers'],['Homepage','/homepage-images'],['Order issues','/order-issues'],['B2B orders','/b2b-orders'],['B2B stock','/b2b-stock'],['Shipping','/shipping'],['Rewards','/coin-settings'],['Activity','/audit']]:[]),['Account','/settings']]
  return <nav className="ops-nav"><div className="ops-nav-top"><Link to="/" className="ops-brand">ATTACH<small>{superAdmin?'SUPER ADMIN':'BRANCH ADMIN'}</small></Link><button className="ops-mobile-toggle" aria-expanded={open} onClick={()=>setOpen(!open)}>Menu</button><div className="ops-nav-controls">{superAdmin?<select aria-label="Select branch" value={user?.branch_id||''} onChange={e=>setBranch(e.target.value)}><option value="">All branches</option>{branches.map(row=><option key={row.id} value={row.id}>{row.name}{row.is_active?'':' (inactive)'}</option>)}</select>:<span>{branches.find(row=>Number(row.id)===Number(user?.branch_id))?.name||`Branch ${user?.branch_id||''}`}</span>}<span>{user?.username}</span><button onClick={logout}>Sign out</button></div></div><div className={`ops-nav-links ${open?'is-open':''}`}>{links.map(([name,path])=><NavLink key={path} to={path} end={path==='/'}>{name}</NavLink>)}</div></nav>
}
