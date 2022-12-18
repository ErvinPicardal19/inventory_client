/* eslint-disable no-template-curly-in-string */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { ColumnDirective, ColumnsDirective, ExcelExport } from '@syncfusion/ej2-react-grids';
import { Filter, GridComponent, Inject, Page, Toolbar, Search, Edit } from '@syncfusion/ej2-react-grids';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Query, DataManager } from '@syncfusion/ej2-data';

import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { 
   addNewInventoryProduct, 
   updateInventoryProduct,
   getInventoryProducts, 
   deleteInventoryProduct, 
   getInventoryError, 
   getInventoryStatus, 
   fetchInventoryProducts,
   setInventoryStatus
} from '../features/products/productSlice';

import {
   fetchCategory,
   getAllCategory,
   getCategoryStatus
} from '../features/category/categorySlice';

import {Header} from '../common/components';
import useAxiosPrivate from '../common/hooks/useAxiosPrivate';


const Inventory = () => {
   let grid;

   const axiosPrivate = useAxiosPrivate();

   const inventoryProducts = useSelector(getInventoryProducts);
   const inventoryStatus = useSelector(getInventoryStatus);
   const inventoryError = useSelector(getInventoryError);
   const category = useSelector(getAllCategory);
   // const categoryStatus = useSelector(getCategoryStatus);

   const [editMode, setEditMode] = useState(false);
   const [products, setProducts] = useState([]);
   const [selectedProduct, setSelectedProduct] = useState([]);
   // const [grid, setGrid] = useState();
   // const {addNewProduct, updateProduct, deleteProduct} = useInvetoryServices();
   const navigate = useNavigate();
   const location = useLocation();
   const dispatch = useDispatch();

   useEffect(() => {
      const getInvetory = async() => {
         try{
            // const response = await axiosPrivate.get('/inventory', {
            //    signal: controller.signal
            // });
            console.log(inventoryStatus);
            dispatch(fetchInventoryProducts({axiosPrivate}))
            dispatch(fetchCategory({axiosPrivate}))
            
            // console.log(response.data);
            // setCategories(response.data.category);
         } catch(err) {
            console.error(err);
            navigate('/login', {state: {from: location}, replace: true});
         }
      }
      getInvetory();
  
   }, []);

   useEffect(() => {
      setProducts([...inventoryProducts])
      return () => {
         setProducts([]);
      }
   }, [inventoryProducts]);

   useEffect(() => {
      console.log(category);
   }, [category]);

   useEffect(() => {
      console.log(products);
   }, [products]);

   const filterTemplate = (props) => {
      console.log(props);
      console.log(category);
      const data = category.map((category) => category.name);
      data.push('Clear');
      return (<DropDownListComponent id={props.column.field} popupHeight='250px' dataSource={data} change={onChange}/>);
  }

  const onChange = (args) => {
      // console.log(grid);
      if (grid) {
          if (args.value === 'Clear') {
              grid.clearFiltering();
          }
          else {
              console.log("Changed:" + args.value);
              grid.filterByColumn('categoryID.name', 'equal', args.value);
          }
      }
  }

  const dataSourceChanged = async(args) => {
   console.log(args);
      if(args?.requestType === 'save'){
         console.log('Saving...');
         if(!editMode){
            // await addNewProduct(args.data);
            dispatch(addNewInventoryProduct({axiosPrivate, data: args.data}));
         } else {
            console.log('Editing...');
            dispatch(updateInventoryProduct({axiosPrivate, data: args.data}));

            if(!args.data.categoryID.name) args.data.categoryID.name = args.rowData.categoryID.name
            
            const filteredProducts = products.filter((val) => val._id !== args?.data?._id)

              // foundEvent = args?.data[0];
              if(!filteredProducts) {
                setProducts([]);
                return;
              };
              
              setProducts([...filteredProducts, args?.data])
            //   grid.refresh()
             setEditMode(false);
         }
      }

      if(args?.requestType === 'delete'){
         console.log('deleting...');
         // deleteProduct(args.data);
         dispatch(deleteInventoryProduct({axiosPrivate, data: args.data}));

          const filteredProducts = products.filter((val) => val._id !== args?.data?._id)

          // console.log(filteredCustomers);
          if(!filteredProducts) {
            setProducts([]);
            return;
          };

          setProducts(filteredProducts);
          
      }
  }

  const categorySetting = {
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
            dataSource: category,
            value: args.rowData[args.column.field],
            query: new Query().select(['_id', 'name']),
            fields: { text: 'name', value: 'name' },
            placeholder: 'Select a Category',
            headerTemplate: '<table><tr><th>Category</th></tr></table>',
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

  const toolbarClick = (args) => {
   console.log(args.item.id);
   if (grid && args.item.id === 'grid_excelexport') {
       grid.excelExport();
   }
};

  return (
   <>
      <div className='mt-20 m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category="Page" title="Inventory"/>
            {inventoryStatus === 'succeeded' &&
            <GridComponent 
               id='grid'
               ref={g => {
                  !grid && (grid = g)
               }} 
               dataSource={products}
               allowFiltering={true}
               allowPaging
               allowExcelExport
               editSettings={{
                  allowEditing: true,
                  allowAdding: true,
                  allowDeleting: true
               }}
               toolbarClick={toolbarClick}
               actionComplete={dataSourceChanged}
               beginEdit={(args) => {
                  setSelectedProduct(args.dataRow)
                  setEditMode(true)
               }}
               toolbar={['Search','Add', 'Edit', 'Delete', 'Update', 'Cancel', 'ExcelExport']}
               width='auto'
               searchSettings={{
                  fields: ["name", "description", "Category"]
               }}
               
            >
               <ColumnsDirective>
                     <ColumnDirective type='checkbox' width='50'/>
                     <ColumnDirective field='name' headerText='Name' width='140' textAlign="Left" />
                     <ColumnDirective field='description' headerText='Description' width='140' textAlign="Left"/>
                     <ColumnDirective field='price' type='number' editType='numericedit' headerText='Price(&#8369;)' width='140' textAlign="Left"/>
                     <ColumnDirective field='countInStock' type='number' editType='numericedit'headerText='Stock' width='140' textAlign="Left"/>
                     <ColumnDirective field='categoryID.name' headerText='Category' width='140' filterTemplate={filterTemplate} edit={categorySetting.params()}/>
                  </ColumnsDirective>
                  <Inject services={[Filter, Page, Search, Toolbar, Edit, ExcelExport]}/>
               </GridComponent>
            }
            {inventoryStatus === 'loading' &&
               <p>
                  Fetching Data...
               </p>
            }
            {inventoryStatus === 'failed' &&
               <p>
                  {inventoryError}
               </p>
            }
      </div>
   </>
  )
}

export default Inventory