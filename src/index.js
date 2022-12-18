import React from "react";
import ReactDOM from 'react-dom/client';
import App from "./app/App";
import { ContextProvider } from "./common/contexts/ContextProvider";
import {AuthProvider} from './common/contexts/AuthProvider';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {store} from './app/store';
import { Provider } from "react-redux";

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
   <BrowserRouter>
      <Provider store={store}>
         <AuthProvider>
            <ContextProvider>
               <Routes>
                  <Route path="/*" element={<App/>}/>
               </Routes>
            </ContextProvider>
         </AuthProvider>
      </Provider>
   </BrowserRouter>
);