import React,{createContext,useContext,useEffect,useMemo,useState,useCallback} from 'react'
import {apiGet} from './api'
const AuthCtx=createContext({token:null,user:null,ready:false,login:()=>{},logout:()=>{},setBranch:()=>{}})
export function AuthProvider({children}){
  const [token,setToken]=useState(()=>localStorage.getItem('auth_token')),[account,setAccount]=useState(null),[ready,setReady]=useState(false),[branch,setBranchState]=useState(()=>localStorage.getItem('selected_branch')||'')
  const logout=useCallback(()=>{localStorage.removeItem('auth_token');localStorage.removeItem('auth_user');localStorage.removeItem('selected_branch');setToken(null);setAccount(null);setBranchState('')},[])
  useEffect(()=>{if(!token){setReady(true);return}let active=true;setReady(false);apiGet('/auth-branch/me').then(user=>{if(active)setAccount({...user,role:user.role||user.role_enum})}).catch(logout).finally(()=>{if(active)setReady(true)});return()=>{active=false}},[token,logout])
  useEffect(()=>{const invalid=()=>logout();window.addEventListener('auth-expired',invalid);return()=>window.removeEventListener('auth-expired',invalid)},[logout])
  const login=useCallback((t,u)=>{localStorage.setItem('auth_token',t);localStorage.setItem('auth_user',JSON.stringify(u));setAccount(u);setToken(t)},[])
  const setBranch=useCallback(value=>{const next=String(value||'');setBranchState(next);localStorage.setItem('selected_branch',next)},[])
  const user=useMemo(()=>account?{...account,branch_id:account.role==='SUPER_ADMIN'?(Number(branch)||null):account.branch_id}:null,[account,branch])
  return <AuthCtx.Provider value={{token,user,account,ready,login,logout,setBranch}}>{children}</AuthCtx.Provider>
}
export const useAuth=()=>useContext(AuthCtx)
