/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import {GridComponent, ColumnsDirective, ColumnDirective, Page, Inject, Toolbar, Edit, Filter, Sort} from '@syncfusion/ej2-react-grids';
import { useSelector, useDispatch } from 'react-redux';
import {MdOutlineCancel} from 'react-icons/md';
import { Button, Modal, Box, Divider, Badge, Avatar } from '@mui/material';
import {Profileform} from '../common/components';

import {
  addNewEmployee,
  deleteEmployee,
  fetchEmployees,
  getAllEmployees,
  getEmployeePageError,
  getEmployeePageStatus,
} from '../features/Employee/employeeSlice';

import {Header} from '../common/components';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../common/hooks/useAxiosPrivate';

const Employees = () => {

  const [employeesList, setEmployeesList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [disableConfirm, setDisableConfirm] = useState(true);
  const [employeeFormData, setEmployeeFormData] = useState({
    email: "",
    username: "",
    password: "",
    roles: 1050,
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: ""
  });
  const [error, setError] = useState({
    username: false,
    password: false,
    confirmPassword: false,
    phone: false,
    email: false,
    zip: false
  });

  const employees = useSelector(getAllEmployees);
  const employeesFetchStatus = useSelector(getEmployeePageStatus);
  const employeesFetchError = useSelector(getEmployeePageError);

  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try{
        dispatch(fetchEmployees({axiosPrivate}));

   } catch(err) {
      console.error(err);
      navigate('/login', {state: {from: location}, replace: true});
   }
  }, []);

  useEffect(() => {

    setEmployeesList([...employees]);
  }, [employees]);

  useEffect(() => {
    const boolErr = Object.values(error).find((e) => e === true);
    const dataVal = Object.values(employeeFormData).find((data) => data === "") === "" ? true : false;
    if(dataVal || boolErr){
      setDisableConfirm(true);
    }else{
      setDisableConfirm(false);
    }
  }, [error])

  const gridEmployeeProfile = (props) => (
    <div className="flex items-center gap-2">
      <Badge badgeContent={4} color={props.isActive ? "success" : "error"} variant='dot'>
        <Avatar src={props.profile} alt={props.name} />
      </Badge>
    </div>
  );
   
   const toggleModal = () => setOpen(!open);

   const style = {
    position: 'absolute',
    display: 'flex',
    flexFlow: 'column',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: '#fff',
    boxShadow: 24,
    padding: "0 1.5rem",
  };

  const registerEmployee = () => {

    dispatch(addNewEmployee({axiosPrivate, data: employeeFormData}));
    window.location.reload(false);
  }

  const onDelete = (args) => {

    if(args.requestType === 'delete'){
      dispatch(deleteEmployee({axiosPrivate, data: args.data}));
      const filteredEmployees = employeesList.filter((val) => val._id !== args?.data?._id)
  

      if(!filteredEmployees) {
        setEmployeesList([]);
        return;
      };
  
      setEmployeesList(filteredEmployees);
    }
  }

  return (
    <div className='mt-20 m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl flex flex-col'>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='flex justify-end'>
            <button 
            type='button' 
            className="text-xl rounded-full p-3 hover:bg-light-gray mt-4"
            onClick={toggleModal}
            >
            <MdOutlineCancel/>
          </button>
          </div>
          <h1 className='p-4 font-extrabold text-xl'>Add New Employee</h1>
          <Divider/>
          <Profileform
            employeeFormData={employeeFormData}
            setEmployeeFormData={setEmployeeFormData}
            error={error}
            setError={setError}
          />
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <Button
            sx={{borderColor: "#0B6623", color: "#0B6623"}}
            color="success"
            onClick={registerEmployee}
            size="md"
            variant="outlined"
            disabled={disableConfirm}
          >
            <p>
              Confirm
            </p>
          </Button>
          </div>
        </Box>
      </Modal>
      <Header category="Page" title="Employees"/>
      {employeesFetchStatus === 'succeeded' &&
      <>
      <div className='flex justify-end'>
        <Button
          sx={{borderColor: "#BEBEBE", marginBottom: 4, color: "#000"}}
          color="secondary"
          onClick={toggleModal}
          size="md"
          variant="outlined"
        >
          <p>
            Add Employee
          </p>
        </Button>
      </div>
        <GridComponent
        dataSource={employeesList}
        allowPaging
        allowSorting
        editSettings={{
          allowDeleting: true,
       }}
        toolbar={['Search', 'Delete', 'Cancel']}
        width="auto"
        actionComplete={onDelete}
      >
        <ColumnsDirective>
          <ColumnDirective 
          headerText= ''
          width= '50'
          template= {gridEmployeeProfile}
          textAlign= 'Right'
          />
          <ColumnDirective 
          field= 'name'
          headerText= 'Employee Name'
          width= '150'
          textAlign= 'Center'
          />
          <ColumnDirective 
          field= 'email'
          headerText= 'Email'
          width= '170'
          textAlign= 'Center'
          />
          <ColumnDirective 
          field= 'phone'
          headerText= 'Phone'
          width= '135'
          textAlign= 'Center'
          />
          <ColumnDirective 
          field= 'city'
          headerText= 'Location'
          width= '125'
          textAlign= 'Center'
          />
          <ColumnDirective 
          field= '_id'
          headerText= 'Employee ID'
          width= '125'
          textAlign= 'Center'
          />
        </ColumnsDirective>
        <Inject services={[Sort, Filter, Page, Toolbar, Edit]}/>
      </GridComponent>
      </>
      }
      {employeesFetchStatus === 'loading' &&
        <p>
          Fetching Data...
        </p>
      }
      {employeesFetchStatus === 'failed' &&
        <p>
          {employeesFetchError}
        </p>
      }
    </div>
  )
}

export default Employees