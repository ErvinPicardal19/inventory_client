/* eslint-disable react-hooks/exhaustive-deps */
import {FiSettings} from 'react-icons/fi'
import {TooltipComponent} from '@syncfusion/ej2-react-popups';

import { NavBar, SideBar, ThemeSettings } from '../components';

import { Outlet } from "react-router-dom"
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect } from 'react';

const Layout = () => {
   const {activeMenu, themeSettings, setThemeSettings, currentColor, setCurrentColor, currentMode, setCurrentMode} = useStateContext();

   useEffect(() => {
      setCurrentMode(localStorage.getItem('themeMode'));
      setCurrentColor(localStorage.getItem('colorMode'));
   }, [])

   return (
      <div className={currentMode === "Dark" ? 'dark' : ''}>
         <div className='flex relative dark:bg-main-dark-bg'>
            <div className='fixed right-5 bottom-4' style={{zIndex: "1000"}}>
               <TooltipComponent content="Settings" position='Top'>
                  <button type='button' className='text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white' style={{backgroundColor: currentColor, borderRadius: "50%"}}
                  onClick={() => setThemeSettings(true)}
                  >
                     <FiSettings/>
                  </button>
               </TooltipComponent>
            </div>
            <div className={
               `dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
                  activeMenu ? 
                  ' md:ml-72'
                  :
                  'flex-2'
               }`
            }>
               <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                  <NavBar/>
               </div>

               <div>
                  {themeSettings && <ThemeSettings/>}
                     <Outlet />
               </div>
            </div>
            {
               activeMenu ? (
                  <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white'>
                     <SideBar/>
                  </div>
               ) :
               (
                  <div className='w-0 dark:bg-secondary-dark-bg'>
                     <SideBar/>
                  </div>
               )
            }
         </div>
      </div>
   )
}

export default Layout