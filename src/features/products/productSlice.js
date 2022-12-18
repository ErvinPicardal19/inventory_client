import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { socket } from "../../common/api/socket";
// import { axiosPrivate } from "../../common/api/axios";

const initialState = {
   inventoryProducts: [],
   inventoryStatus: 'idle', //* 'idle' | 'loading' | 'succeeded' | 'failed'
   inventoryError: null
}

export const fetchInventoryProducts = createAsyncThunk('products/fetchInventoryProducts', async(args) => {
   try{
      const response = await args.axiosPrivate.get('/inventory');

      return response.data;
   } catch(inventoryError) {
      return inventoryError.message;
   }
});

export const addNewInventoryProduct = createAsyncThunk('products/addNewInventoryProduct', async(args) => {
   try {
   
      const response = await args.axiosPrivate.post('/inventory', JSON.stringify(args.data));
      socket.emit("update");

      return response.data;
   } catch(inventoryError) {
      return inventoryError.message;
   }
});

export const deleteInventoryProduct = createAsyncThunk('products/deleteInventoryProduct', async(args) => {
   try {
      for(let x in args.data){
         await args.axiosPrivate.delete(`/inventory/${args.data[x]._id}`);
      }
      socket.emit("update");
      return args.data;
   } catch(inventoryError) {
      return inventoryError.message;
   }
});

export const updateInventoryProduct = createAsyncThunk('products/updateInventoryProduct', async(args) => {

   try {
      const response = await args.axiosPrivate.put(`/inventory/${args.data._id}`, JSON.stringify({...args.data, categoryID: args.data.categoryID.name}));

      return response;
   } catch(inventoryError) {
      return inventoryError.message;
   }
});

export const productSlice = createSlice({
   name: "products",
   initialState: initialState,
   reducers: {
      setInventoryStatus: {
         reducer: (state, action) => {
            
            state.inventoryStatus = action.payload;
         }
      }
   },
   extraReducers(builder) {
      builder
         .addCase(fetchInventoryProducts.pending, (state, action) => {
            state.inventoryStatus = 'loading'
         })
         .addCase(fetchInventoryProducts.fulfilled, (state, action) => {
            state.inventoryStatus = 'succeeded'
            
            state.inventoryProducts = action.payload.data;
         })
         .addCase(fetchInventoryProducts.rejected, (state, action) => {
            state.inventoryStatus = 'failed'
            state.inventoryError = action.inventoryError.message;
         })
         .addCase(addNewInventoryProduct.fulfilled, (state, action) => {
            
            state.inventoryProducts = [...state.inventoryProducts, {...action.payload.data, categoryID: {name: action.payload.categoryName}}]
         })
         .addCase(deleteInventoryProduct.fulfilled, (state, action) => {
            action.payload.forEach((args) => {
               state.inventoryProducts = state.inventoryProducts.filter((val) => val._id !== args._id)
            })
         })
   }
});

export const {setInventoryProducts, setInventoryStatus} = productSlice.actions;

export const getInventoryProducts = (state) => state.product.inventoryProducts;
export const getInventoryStatus = (state) => state.product.inventoryStatus;
export const getInventoryError = (state) => state.product.inventoryError;

export default productSlice.reducer