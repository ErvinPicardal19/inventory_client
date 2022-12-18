import React, {useRef, useState, useEffect} from 'react';
import {FiLock} from 'react-icons/fi';
import useAuth from '../../common/hooks/useAuth';
import axios from '../../common/api/axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {setAuth, persist, setPersist} = useAuth();

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist])

  const handleSubmit = async(e) => {
    e.preventDefault();

    try{
      const response = await axios.post('/login', JSON.stringify({username: user, password: pwd}), {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      const name = response?.data?.name;
      const email = response?.data?.email;
      const profile = response?.data?.profile
      const _id = response?.data?._id;
      setAuth({name, pwd, email, roles, accessToken, profile, _id});
      setUser('');
      setPwd('');
      navigate(from, {replace:true});
      // window.location.reload(false);
    } catch(err) {
      if(!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
    }
  }

  const togglePersist = () => {
    setPersist(prev => !prev);
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
        <div 
          className="w-full max-w-md space-y- rounded-3xl px-5 py-20 bg-white"
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px'
          }}
        >
          <div>
            <img
              className="mx-auto h-28 w-auto"
              src={require('../../data/LOGO.png')}
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  ref={userRef}
                  autoComplete="off"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-gray-900 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email address"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-gray-900 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="persist"
                  name="persist"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  onChange={togglePersist}
                  checked={persist}
                />
                <label htmlFor="persist" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-main-dark-bg py-2 px-4 text-sm font-medium text-white hover:bg-secondary-dark-bg focus:outline-none focus:ring-2 focus:bg-secondary-dark-bg focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiLock className="h-5 w-5 text-gray-500 group-hover:text-white" aria-hidden="true" />
                </span>
                Sign in
              </button>
            </div>
            {errMsg && 
              <p className='text-center text-red-800 bg-red-300 p-5 rounded-md' ref={errRef}>
                {errMsg}
              </p>
            }
          </form>
        </div>
      </div>
    </>
  )
}

export default Login