import React, {createContext, useContext, useState} from "react";

const StateContext = createContext();

const initialState = {
   chat: false,
   cart: false,
   userProfile: false,
   notificaton:false,
}

export const ContextProvider = ({children}) => {
   const [activeMenu, setActiveMenu] = useState(true);
   const [isClicked, setIsClicked] = useState(initialState);
   const [screenSize, setScreenSize] = useState(undefined);
   const [currentColor, setCurrentColor] = useState('#03C9D7');
   const [currentMode, setCurrentMode] = useState('Light');
   const [themeSettings, setThemeSettings] = useState(false);
   const [numOfProd, setNumOfProd] = useState(0);


   const setMode = (e) => {
      console.log(e);
      setCurrentMode(e.target.value);

      localStorage.setItem('themeMode', e.target.value);
   }

   const setColor = (color) => {
      setCurrentColor(color);

      localStorage.setItem('colorMode', color);

      setThemeSettings(false);
   }

   const handleClick = (clicked) => {
      setIsClicked({...initialState, [clicked]: !isClicked[clicked]});
   }

   return (
      <StateContext.Provider
         value={{
            activeMenu,
            setActiveMenu,
            isClicked,
            setIsClicked,
            handleClick,
            screenSize,
            setScreenSize,
            currentColor,
            setCurrentColor,
            setColor,
            currentMode,
            setCurrentMode,
            setMode,
            themeSettings,
            setThemeSettings,
         }}
      >
         {children}
      </StateContext.Provider>
   )
}

export const useStateContext = () => useContext(StateContext);