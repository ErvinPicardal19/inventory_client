/* eslint-disable no-template-curly-in-string */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject, Toolbar} from '@syncfusion/ej2-react-grids';


import { DropDownList } from '@syncfusion/ej2-react-dropdowns';

import {ordersData, ordersGrid} from '../data/dummy';
import {Header} from '../common/components';
import { DataManager, Query } from '@syncfusion/ej2/data';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchOrders, 
  getAllOrders, 
  getOrdersError, 
  getOrdersStatus,
  addNewOrder,
  deleteOrder,
  updateOrder,
  setOrderStatus
} from '../features/orders/orderSlice'
import {
  getAllCustomers,
  fetchCustomers,
  getCustomerPageStatus,
  setCustomerStatus
} from '../features/customers/customersSlice'
import {
  getInventoryProducts,
  fetchInventoryProducts,
  getInventoryStatus,
  setInventoryStatus,
} from '../features/products/productSlice';
import useAxiosPrivate from '../common/hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';

const Orders = () => {
  let grid;

  const navigate = useNavigate();
  const location = useLocation();
  
  const [orders, setOrders] = useState([]);
  // const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  // const [rowSelected, setRowSelected] = useState(null);

  const axiosPrivate = useAxiosPrivate();
  
  const fetchedOrders = useSelector(getAllOrders);
  const fetchStatus = useSelector(getOrdersStatus);
  const fetchError = useSelector(getOrdersError);
  const fetchedCustomers = useSelector(getAllCustomers);
  const fetchedInventory = useSelector(getInventoryProducts);
  const fetchCustomerStatus = useSelector(getCustomerPageStatus);
  const inventoryStatus = useSelector(getInventoryStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    try{
      // const response = await axiosPrivate.get('/inventory', {
      //    signal: controller.signal
      // });
      console.log(inventoryStatus);
      dispatch(fetchOrders({axiosPrivate}));
      dispatch(fetchCustomers({axiosPrivate}));
      dispatch(fetchInventoryProducts({axiosPrivate}));
      
      // console.log(response.data);
      // setCategories(response.data.category);

   } catch(err) {
      console.error(err);
      navigate('/login', {state: {from: location}, replace: true});
   }
  }, []);

  useEffect(() => {
    setProducts([...fetchedInventory]);
  }, [fetchedInventory])

  useEffect(() => {
    // console.log(fetchedOrders);
    setOrders([...fetchedOrders]);
  }, [fetchedOrders])

  useEffect(() => {
    console.log(products);
  }, [products])

  const toolbarClick = (args) => {
      console.log(args.item.id)
      if (grid && args.item.id === 'gridcomp_pdfexport') {
          grid.pdfExport();
      }
  };

  // const country = [
  //   { countryName: 'United States', countryId: '1' },
  //   { countryName: 'Australia', countryId: '2' },
  //   { countryName: 'India', countryId: '3' }
  // ];
  const customerSetting = {
    create : function() {
      this.element = document.createElement('input');
      return this.element;
    },
    destroy : function(){
      this.dropdownobj.destroy();
    },
    read : function() {
          return this.dropdownobj.value;
    },
    write : function(args) {
      this.dropdownobj = new DropDownList({
          dataSource: fetchedCustomers,
          value: args.rowData[args.column.field],
          query: new Query().select(['_id', 'name', 'phone', 'location']).where('name', 'notequal', args.rowData.customer.name),
          fields: { text: 'name', value: 'name' },
          placeholder: 'Select a Customer',
          headerTemplate: '<table><tr><th>Name</th></tr></table>',
          itemTemplate: '<div class="e-grid"><table aclass="e-table"><tbody><tr><td class="e-rowcell">${name}</td></tr> </tbody></table></div>'
      });
      this.dropdownobj.appendTo(this.element);
    },
    params : function(){
      return{
          create: this.create,
          destroy: this.destroy,
          read: this.read,
          write: this.write
      }
    }
  }

  const itemSettings = {
    create : function() {
      this.element = document.createElement('input');
      return this.element;
    },
    destroy : function(){
      this.dropdownobj.destroy();
    },
    read : function() {
          return this.dropdownobj.value;
    },
    write : function(args) {
      console.log(fetchedInventory);
      this.dropdownobj = new DropDownList({
          dataSource: fetchedInventory,
          value: args.rowData[args.column.field],
          query: new Query().select(['_id', 'name']).where('name', 'notequal', args.rowData.product.name),
          fields: { text: 'name', value: 'name' },
          placeholder: 'Select a Customer',
          headerTemplate: '<table><tr><th>Name</th></tr></table>',
          itemTemplate: '<div class="e-grid"><table aclass="e-table"><tbody><tr><td class="e-rowcell">${name}</td></tr> </tbody></table></div>'
      });
      this.dropdownobj.appendTo(this.element);
    },
    params : function(){
      return{
          create: this.create,
          destroy: this.destroy,
          read: this.read,
          write: this.write
      }
    }
  }
  
  const dataSourceChanged = async(args) => {
    console.log(args);
       if(args?.requestType === 'save'){
          console.log('Saving...');
          if(!editMode){
            console.log('Adding...');
             // await addNewProduct(args.data);
             dispatch(addNewOrder({axiosPrivate, data: args.data}));
          } else {
             console.log('Editing...');
             dispatch(updateOrder({axiosPrivate, data: args.data}));
            
            const filteredOrders = orders.filter((val) => val._id !== args?.data?._id)

              // foundEvent = args?.data[0];
              if(!filteredOrders) {
                setOrders([]);
                return;
              };
              
              setOrders([...filteredOrders, args?.data])
              setEditMode(false);
          }
       }
 
       if(args?.requestType === 'delete'){
          console.log('deleting...');
          // deleteProduct(args.data);
          dispatch(deleteOrder({axiosPrivate, data: args.data}));

          const filteredOrders = orders.filter((val) => val._id !== args?.data?._id)

          // console.log(filteredCustomers);
          if(!filteredOrders) {
            setOrders([]);
            return;
          };

          setProducts(filteredOrders);
       }
   }

  return (
    <div className='mt-20 m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
      <Header category="Page" title="Orders"/>
    {
      fetchStatus === "succeeded" && fetchCustomerStatus === "succeeded" && inventoryStatus === "succeeded" &&
      <GridComponent
        id='gridcomp'
        ref={g => {
          !grid && (grid = g)
       }} 
        dataSource={orders}
        allowPaging
        allowPdfExport
        editSettings={{
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true
       }}
        beginEdit={() => setEditMode(true)}
        actionComplete={dataSourceChanged}
        toolbarClick={toolbarClick}
        toolbar={['Search','Add', 'Edit', 'Delete', 'Update', 'Cancel', 'ExcelExport']}
      >
        <ColumnsDirective>
          {/* {ordersGrid.map((item, index) => (
            <ColumnDirective key={index} {...item}/>
          ))} */}
          <ColumnDirective type='checkbox' width='50'/>
          <ColumnDirective field='product.name' headerText='Item' width='140' textAlign="Left" editType="dropDownEdit" edit={itemSettings.params()}/>
          <ColumnDirective field='customer.name' headerText='Customer Name' width='140' editType="dropDownEdit" edit={customerSetting.params()} textAlign="Left"/>
          <ColumnDirective field='customer.phone' headerText='Phone' width='140' textAlign="Left" allowEditing={false} />
          <ColumnDirective field='quantity' type='number' editType='numericedit' headerText='Quantity' width='140' textAlign="Left"/>
          <ColumnDirective field='totalPrice' headerText='Total Amount' width='140' textAlign="Left" allowEditing={false}/>
          {/* <ColumnDirective field='countInStock' type='number' editType='numericedit'headerText='Stock' width='140' textAlign="Left"/> */}
          <ColumnDirective field='customer.location' headerText='Location' width='150' allowEditing={false} textAlign='Right'/>
        </ColumnsDirective>
        <Inject services={[Resize, Sort, Filter, Page, Edit, PdfExport, Toolbar]}/>
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

export default Orders