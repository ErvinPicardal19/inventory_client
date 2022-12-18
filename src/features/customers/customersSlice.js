import { socket } from "../../common/api/socket";
const {createSlice, createAsyncThunk} = require('@reduxjs/toolkit');

const initialState = {
   customers: [],
   customer_status: 'idle', //* 'idle' | 'loading' | 'succeeded' | 'failed'
   customer_error: null
}

export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async(args) => {
   try{
      const response = await args.axiosPrivate.get('/customers');
      
      return response.data;
   }catch(error){
      return error.message;
   }
});

export const addNewCustomer = createAsyncThunk('customers/addNewCustomer', async(args) => {
   try{
      const response = await args.axiosPrivate.post('/customers', JSON.stringify(args.data));
      socket.emit("update");
      
      return response.data;
   } catch(error) {
      return error.message;
   }
});

export const deleteCustomer = createAsyncThunk('customers/deleteCustomer', async(args) => {
   try {
      for(let x in args.data){
         await args.axiosPrivate.delete(`/customers/${args.data[x]._id}`);
      }
      socket.emit("update");

      return args.data
   } catch(error) {
      return error.message;
   }
});

export const updateCustomer = createAsyncThunk('customers/updateCustomer', async(args) => {

   try {
      const response = await args.axiosPrivate.put(`/customers/${args.data._id}`, JSON.stringify(args.data));

      return response;
   } catch(error) {

      return error.message;
   }
});

export const customersSlice = createSlice({
   name: "customers",
   initialState: initialState,
   reducers: {
      setCustomerStatus: {
         reducer: (state, action) => {

            state.customer_status = action.payload;
         }
      }
   },
   extraReducers(builder) {
      builder
         .addCase(fetchCustomers.pending, (state,action) => {
            state.customer_status = 'loading'
         })
         .addCase(fetchCustomers.fulfilled, (state, action) => {
            state.customer_status = 'succeeded'

            state.customers = action.payload.data;
         })
         .addCase(fetchCustomers.rejected, (state, action) => {
            state.customer_status = 'failed'
            state.customer_error = action.error.message;
         })
         .addCase(addNewCustomer.fulfilled, (state, action) => {

            state.customers = [...state.customers, action.payload.data]
         })
         .addCase(deleteCustomer.fulfilled, (state, action) => {

            action.payload.forEach((args) => {
               state.customers = state.customers.filter((val) => val._id !== args._id)
            })
         })
   }
});

export const {setCustomerStatus} = customersSlice.actions;

export const getAllCustomers = (state) => state.customer.customers;
export const getCustomerPageStatus = (state) => state.customer.customer_status;
export const getCustomerPageError = (state) => state.customer.customer_error;

export default customersSlice.reducer