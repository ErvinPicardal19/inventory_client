/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import { FormControl } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';

const roles = [
  {
    value: 1050,
    label: 'User',
  },
  {
    value: 1985,
    label: 'Editor',
  },
  {
    value: 2000,
    label: 'Admin',
  }
];

const errorMessage = (errMsg) => {
  return(
    <FormHelperText error>{errMsg}</FormHelperText>
  )
}

function Profileform(props) {

  const {employeeFormData, setEmployeeFormData, error, setError} = props;
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [password, setPassword] = useState("");
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [name, setName] = useState("");
  // const [phone, setPhone] = useState("");

  const handleChange = (prop) => (event) => {
    let regex;

    if(prop === 'username') {
      regex = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/g
    } else if(prop === 'password') {
      regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g;
    } else if(prop === 'phone') {
      regex = /^\(?(\d{4})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/g;
    } else if(prop === 'email') {
      regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    } else if(prop === 'zip') {
      regex = /^(\d{4})$/g;
    } else {
      regex = /./g;
    }


    const input = event.target.value;
    const found = regex.test(input);
    if(!found && input.length){
      setError({...error, [prop]: true});
    } else {
      setError({...error, [prop]: false});
    }
  

    setEmployeeFormData({ ...employeeFormData, [prop]: event.target.value });
  }

  useEffect(() => {
    setEmployeeFormData({...employeeFormData, name: `${firstName} ${lastName}`})
  }, [firstName, lastName])
  

  return (
    <div className='
    md:overflow-hidden overflow-auto
    md:hover:overflow-auto p-4'
    style={{height: "500px"}}>
   <div>
     <div className="md:grid md:grid-cols-3 md:gap-6">
       <div className="md:col-span-1">
         <div className="px-4 sm:px-0">
           <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
           <p className="mt-1 text-sm text-gray-600">
             This information will be displayed publicly so be careful what you share.
           </p>
         </div>
       </div>
       <div className="mt-5 md:col-span-2 md:mt-0">
         <form>
           <div className="shadow sm:overflow-hidden sm:rounded-md">
             <div className="space-y-6 bg-white px-4 py-5 sm:p-6" >
             <FormControl variant="outlined" className="w-full">
               <InputLabel htmlFor="username">Username</InputLabel>
               
                <OutlinedInput id="username" label="Username" variant="outlined"
                error={error.username ? true : false}
                type={'text'}
                value={employeeFormData.username}
                onChange={handleChange('username')}
                />
                {error.username ? errorMessage("Must be 8-20 characters long. Special character are not allowed") : null}
              </FormControl>

               <FormControl variant="outlined" className="w-full">
               <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput id="password" label="Password" variant="outlined"
                error={error.password ? true : false}
                type={showPassword ? 'text' : 'password'}
                value={employeeFormData.password}
                onChange={handleChange('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(event) => {event.preventDefault();}}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                />
                {error.password ? errorMessage("Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter and 1 number:") : null}
               </FormControl>

               <FormControl variant="outlined" className="w-full">
               <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                <OutlinedInput id="confirmPassword" label="Confirm Password" variant="outlined"
                type={showConfirmPassword ? 'text' : 'password'}
                error={error.confirmPassword ? true : false}
                value={confirmPassword}
                onChange={(evt) => {
                  setConfirmPassword(evt.target.value)
                  if(evt.target.value !== employeeFormData.password && evt.target.value){
                    setError({...error, confirmPassword: true})
                  }else {
                    setError({...error, confirmPassword: false})
                  }
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      onMouseDown={(event) => {event.preventDefault();}}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                />
                {error.confirmPassword ? errorMessage("Does not match password") : null}
               </FormControl>

               <div>
               <TextField
                id="roles"
                select
                label="Role"
                value={employeeFormData.roles}
                onChange={handleChange('roles')}
                helperText="Select their role"
              >
                {roles.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
               </div>

               {/* <div>
                 <label className="block text-sm font-medium text-gray-700">Photo</label>
                 <div className="mt-1 flex items-center">
                   <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                     <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                     </svg>
                   </span>
                   <button
                     type="button"
                     className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                   >
                     Change
                   </button>
                 </div>
               </div> */}

               {/* <div>
                 <label className="block text-sm font-medium text-gray-700">Cover photo</label>
                 <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                   <div className="space-y-1 text-center">
                     <svg
                       className="mx-auto h-12 w-12 text-gray-400"
                       stroke="currentColor"
                       fill="none"
                       viewBox="0 0 48 48"
                       aria-hidden="true"
                     >
                       <path
                         d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                         strokeWidth={2}
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       />
                     </svg>
                     <div className="flex text-sm text-gray-600">
                       <label
                         htmlFor="file-upload"
                         className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                       >
                         <span>Upload a file</span>
                         <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                       </label>
                       <p className="pl-1">or drag and drop</p>
                     </div>
                     <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                   </div>
                 </div>
               </div> */}
             </div>
           </div>
         </form>
       </div>
     </div>
   </div>

   <div className="hidden sm:block" aria-hidden="true">
     <div className="py-5">
       <div className="border-t border-gray-200" />
     </div>
   </div>

   <div className="mt-10 sm:mt-0">
     <div className="md:grid md:grid-cols-3 md:gap-6">
       <div className="md:col-span-1">
         <div className="px-4 sm:px-0">
           <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
           <p className="mt-1 text-sm text-gray-600">Use a permanent address where you can receive mail.</p>
         </div>
       </div>
       <div className="mt-5 md:col-span-2 md:mt-0">
         <form>
           <div className="overflow-hidden shadow sm:rounded-md">
             <div className="bg-white px-4 py-5 sm:p-6">
               <div className="grid grid-cols-6 gap-6">
                 {/* <div>
                  <TextField id="firstName" label="First name" variant="outlined" type={"text"} className="w-full" placeholder=''/>
                 </div> */}

                 <FormControl variant="outlined" className="col-span-6 sm:col-span-3">
                  <InputLabel htmlFor="firstName">First name</InputLabel>
                    <OutlinedInput id="firstName" label="First name" variant="outlined"
                    type={'text'}
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    />
                  </FormControl>
                

                 <FormControl variant="outlined" className="col-span-6 sm:col-span-3">
                  <InputLabel htmlFor="lastName">Last name</InputLabel>
                    <OutlinedInput id="lastName" label="Last name" variant="outlined"
                    type={'text'}
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    />
                  </FormControl>

                  <div className="col-span-6">
                    <TextField id="contact" label="Contact No." variant="outlined" type={"tel"} className="w-full" placeholder='xxxx-xxx-xxxx' autoComplete='tel' value={employeeFormData.phone} onChange={handleChange('phone')} error={error.phone} helperText={error.phone ? "Example(s): (xxx)-xxx-xxxx or xxx-xxx-xxxx" : ""}/>
                  </div>

                 <div className="col-span-6">
                  <TextField id="email" label="Email" variant="outlined" type={"email"} className="w-full" placeholder='example@gmail.com' autoComplete='email' value={employeeFormData.email} onChange={handleChange('email')} error={error.email} helperText={error.email ? "Example(s): example@gmail.com" : ""}/>
                 </div>

                 {/* <div className="col-span-6 sm:col-span-3">
                   <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                     Country
                   </label>
                   <select
                     id="country"
                     name="country"
                     autoComplete="country-name"
                     className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                     value={employeeFormData.username}
                     onChange={handleChange('username')}
                   >
                     <option>United States</option>
                     <option>Canada</option>
                     <option>Mexico</option>
                   </select>
                 </div> */}

                 <div className="col-span-6">
                   <TextField id="street" label="Street address" variant="outlined" type={"text"} className="w-full" autoComplete="street-address" value={employeeFormData.street} onChange={handleChange('street')}/>
                 </div>

                 <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                   <TextField id="city" label="City" variant="outlined" type={"text"} className="w-full" placeholder='' autoComplete="address-level2" value={employeeFormData.city} onChange={handleChange('city')}/>
                 </div>

                 <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                   <TextField id="state" label="State" variant="outlined" type={"text"} className="w-full" autoComplete="address-level1" value={employeeFormData.state} onChange={handleChange('state')}/>
                 </div>

                 <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                   <TextField id="zip" label="ZIP / Postal code" variant="outlined" type={"text"} className="w-full appearance-none" autoComplete="postal-code" value={employeeFormData.zip} onChange={handleChange('zip')} error={error.zip} helperText={error.zip ? "Invalid ZIP/Postal code" : ""}/>
                 </div>
               </div>
             </div>
           </div>
         </form>
       </div>
     </div>
   </div>

   <div className="hidden sm:block" aria-hidden="true">
     <div className="py-5">
       <div className="border-t border-gray-200" />
     </div>
   </div>

 </div>
  )
}

export default Profileform