import { socket } from "../../common/api/socket";
const {createSlice, createAsyncThunk} = require('@reduxjs/toolkit');


const initialState = {
   orders: [],
   status: 'idle', //* 'idle' | 'loading' | 'succeeded' | 'failed'
   error: null
}

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async(args) => {
   try{
      const response = await args.axiosPrivate.get('/orders');
      return response.data;
   }catch(error){
      return error.message;
   }
});

export const addNewOrder = createAsyncThunk('orders/addNewOrder', async(args) => {
   try{
      const response = await args.axiosPrivate.post('/orders', JSON.stringify(args.data));
      socket.emit("update");
      
      return response.data;
   } catch(error) {
      return error.message;
   }
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async(args) => {
   try {
      for(let x in args.data){
         await args.axiosPrivate.delete(`/orders/${args.data[x]._id}`);
      }
      socket.emit("update");

      return args.data;

   } catch(error) {
      return error.message;
   }
});

export const updateOrder = createAsyncThunk('orders/updateOrder', async(args) => {
   try {
      const response = await args.axiosPrivate.put(`/orders/${args.data._id}`, JSON.stringify(args.data));
      
      return response;
   } catch(error) {
      return error.message;
   }
});

const orderSlice = createSlice({
   name: "orders",
   initialState: initialState,
   reducers: {
      setOrderStatus: {
         reducer: (state, action) => {
            state.status = action.payload;
         }
      }
   },
   extraReducers(builder) {
      builder
         .addCase(fetchOrders.pending, (state,action) => {
            state.status = 'loading'
         })
         .addCase(fetchOrders.fulfilled, (state, action) => {
            state.status = 'succeeded'

            for(let i in action.payload.data){
               let totalPrice = action.payload.data[i].product.price * action.payload.data[i].quantity;
               action.payload.data[i] = {...action.payload.data[i], totalPrice}
            }  

            state.orders = action.payload.data;
         })
         .addCase(fetchOrders.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message;
         })
         .addCase(addNewOrder.fulfilled, (state, action) => {

            const totalPrice = action.payload.data.product.price * action.payload.data.quantity;

            action.payload.data = {...action.payload.data, totalPrice}

            state.orders = [...state.orders, action.payload.data]
         })
         .addCase(deleteOrder.fulfilled, (state, action) => {
            action.payload.forEach((args) => {
               state.orders = state.orders.filter((val) => val._id !== args._id)
            })
         })
   }
});


export const {setOrderStatus} = orderSlice.actions;

export const getAllOrders = (state) => state.order.orders;
export const getOrdersStatus = (state) => state.order.status;
export const getOrdersError = (state) => state.order.error;

export default orderSlice.reducer