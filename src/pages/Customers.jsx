/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react'
import {GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter, Resize} from '@syncfusion/ej2-react-grids';
import {
  addNewCustomer,
  deleteCustomer,
  fetchCustomers,
  getAllCustomers,
  getCustomerPageError,
  getCustomerPageStatus,
  updateCustomer
} from '../features/customers/customersSlice';

import useAxiosPrivate from '../common/hooks/useAxiosPrivate';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { Header } from '../common/components';


const Customers = () => {

  const [customers, setCustomers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();
  
  const fetchedCustomers = useSelector(getAllCustomers);
  const fetchStatus = useSelector(getCustomerPageStatus);
  const fetchError = useSelector(getCustomerPageError);
  const dispatch = useDispatch();



  useEffect(() => {
    const getCustomers = async() => {
       try{

          dispatch(fetchCustomers({axiosPrivate}))

       } catch(err) {
          console.error(err);
          navigate('/login', {state: {from: location}, replace: true});
       }
    }
    getCustomers();

 }, []);


  useEffect(() => {

    setCustomers([...fetchedCustomers]);

    return () => {
      setCustomers([]);
    }
  }, [fetchedCustomers])

  const dataSourceChanged = async(args) => {

       if(args?.requestType === 'save'){
    
          if(!editMode){
        
            
             dispatch(addNewCustomer({axiosPrivate, data: args.data}));
             

          } else {
            
             dispatch(updateCustomer({axiosPrivate, data: args.data}));
      
             const filteredCustomers = customers.filter((val) => val._id !== args?.data?._id)

      
              if(!filteredCustomers) {
                setCustomers([]);
                return;
              };
              
              setCustomers([...filteredCustomers, args?.data])
             setEditMode(false);
       
          }
       }
 
       if(args?.requestType === 'delete'){
     
    
          dispatch(deleteCustomer({axiosPrivate, data: args.data}));
       }
   }

  return (
    <div className='mt-20 m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
      <Header category="Page" title="Customers"/>
          {fetchStatus === 'succeeded' &&
          <GridComponent
          dataSource={customers}
          allowPaging
          allowSorting
          toolbar={['Search','Add', 'Edit', 'Delete', 'Update', 'Cancel', 'ExcelExport']}
          editSettings={{allowDeleting: true, allowEditing: true, allowAdding: true}}
          width="auto"
          actionComplete={dataSourceChanged}
          beginEdit={() => setEditMode(true)}
        >
          <ColumnsDirective>
            <ColumnDirective type='checkbox' width='50'/>
            <ColumnDirective field='name' headerText='Item' width='140' textAlign="Left"/>
            <ColumnDirective field='email' headerText='Customer Name' width='140' textAlign="Left" />
            <ColumnDirective field='phone' headerText='Phone' width='140' textAlign="Left"/>
            <ColumnDirective field='location' headerText='Location' width='150' textAlign='Right'/>
          </ColumnsDirective>
          <Inject services={[Resize, Page, Toolbar, Selection, Edit, Sort, Filter]}/>
        </GridComponent>
        }
        {fetchStatus === 'loading' &&
          <p>
            Fetching Data...
          </p>
        }
        {fetchStatus === 'failed' &&
          <p>
            {fetchError}
          </p>
        }
    </div>
  )
}

export default Customers