import React from 'react';

import { Button } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout';

const UserProfile = () => {
  const { currentColor } = useStateContext();
  const {auth} = useAuth();
  const logout = useLogout();

  const navigate = useNavigate();

  const signOut = async() => {
    await logout()
    navigate('/', {replace: true})
  }

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
      </div>
      <div className="flex gap-5 items-center mt-6 border-color dark:border-white border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={auth.profile}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200"> {auth.name} </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">  Administrator   </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">{auth.email} </p>
        </div>
      </div>
      <div className="mt-5">
        <Button
          color="white"
          bgColor={currentColor}
          text="Logout"
          borderRadius="10px"
          width="full"
          onClick={signOut}
        />
      </div>
    </div>

  );
};

export default UserProfile;