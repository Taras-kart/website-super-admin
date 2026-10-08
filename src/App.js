import React,{lazy,Suspense} from 'react'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import {AuthProvider,useAuth} from './pages/AdminAuth'
import {LoadingProvider} from './pages/LoadingContext'
import {Dashboard,StockPage,ProductEditor,SalesPage,ManagementPage,MovementsPage,AuditPage,SettingsPage,ShippingPage} from './pages/Operations'
const SUPER_PORTAL = true
const Login=lazy(()=>import('./pages/LoginAdmin'))
const ImportStock=lazy(()=>import('./pages/ImportStock'))
const POS=lazy(()=>import('./pages/POS'))
const Categories=lazy(()=>import('./pages/CategoryManagement'))
const Customers=lazy(()=>import('./pages/Customers'))
const Homepage=lazy(()=>import('./pages/AdminHomepageImages'))
const OrderIssues=lazy(()=>import('./pages/OrderIssues'))
const Returns=lazy(()=>import('./pages/ReturnReview'))
const B2BOrders=lazy(()=>import('./pages/B2BOrders'))
const B2BStock=lazy(()=>import('./pages/B2BStock'))
const Coins=lazy(()=>import('./pages/CoinsSettings'))
function Guard({children,superOnly=false}){const {token,user,ready}=useAuth();if(!ready)return <div className="ops-empty">Checking your session...</div>;if(!token||!user)return <Navigate to="/login" replace/>;if((SUPER_PORTAL||superOnly)&&user.role!=='SUPER_ADMIN')return <div className="ops-empty">This page requires super admin access. <a href="/login">Sign in with another account</a></div>;return children}
const protect=(page,superOnly=false)=><Guard superOnly={superOnly}>{page}</Guard>
export default function App(){return <AuthProvider><LoadingProvider><BrowserRouter><Suspense fallback={<div className="ops-empty">Loading page...</div>}><Routes><Route path="/login" element={<Login/>}/><Route path="/" element={protect(<Dashboard/>)}/><Route path="/stocks" element={protect(<StockPage/>)}/><Route path="/products" element={protect(<ProductEditor/>)}/><Route path="/sales" element={protect(<SalesPage/>)}/><Route path="/transactions" element={protect(<MovementsPage/>)}/><Route path="/pos" element={protect(<POS/>)}/><Route path="/import" element={protect(<ImportStock/>)}/><Route path="/branches" element={protect(<ManagementPage kind="branches"/>,true)}/><Route path="/branch-admins" element={protect(<ManagementPage kind="admins"/>,true)}/><Route path="/categories" element={protect(<Categories/>,true)}/><Route path="/customers" element={protect(<Customers/>,true)}/><Route path="/homepage-images" element={protect(<Homepage/>,true)}/><Route path="/order-issues" element={protect(<OrderIssues/>,true)}/><Route path="/returns/:id" element={protect(<Returns/>,true)}/><Route path="/b2b-orders" element={protect(<B2BOrders/>,true)}/><Route path="/b2b-stock" element={protect(<B2BStock/>,true)}/><Route path="/shipping" element={protect(<ShippingPage/>,true)}/><Route path="/coin-settings" element={protect(<Coins/>,true)}/><Route path="/audit" element={protect(<AuditPage/>,true)}/><Route path="/settings" element={protect(<SettingsPage/>)}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></Suspense></BrowserRouter></LoadingProvider></AuthProvider>}
