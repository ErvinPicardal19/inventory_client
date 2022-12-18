import React, {useEffect,useState} from 'react';
import { Routes, Route,  } from 'react-router-dom';
import {Layout, RequireAuth, PersistLogin} from '../common/components';
import io from 'socket.io-client';

import { Dashboard, Orders, Calendar, Employees, Customers, Kanban, Missing, Login, Inventory} from '../pages';

import './App.css'

const Main = () => {
   return(
      <Routes>
         {/* Auth Routes */}
         <Route exact path='/login' element={<Login/>}/>

         <Route path='/' element={<Layout/>}>
            <Route element={<PersistLogin/>}>
               <Route element={<RequireAuth/>}>
                  {/* Dashboard */}
                  <Route path='/' element={<Dashboard/>}/>
                  <Route path='dashboard' element={<Dashboard/>}/>

                  {/* Pages */}
                  <Route path='orders' element={<Orders/>}/>
                  <Route path='employees' element={<Employees/>}/>
                  <Route path='customers' element={<Customers/>}/>
                  <Route path='inventory' element={<Inventory/>}/>

                  {/* Apps */}
                  <Route path='kanban' element={<Kanban/>}/>
                  <Route path='calendar' element={<Calendar/>}/> 

                  {/* 404 */}
                  <Route path='*' element={<Missing/>}/>
               </Route>
            </Route>
         </Route>
      </Routes>
   )
}

const App = () => {
  return (
   <div className='App'>
      <Main/>
   </div>
  )
}

export default App