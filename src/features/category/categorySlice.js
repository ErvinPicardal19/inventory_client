const {createSlice, createAsyncThunk} = require('@reduxjs/toolkit');

const initialState = {
   category: [],
   categoryStatus: 'idle', //* 'idle' | 'loading' | 'succeeded' | 'failed'
   categoryError: null
}

export const fetchCategory = createAsyncThunk('category/fetchCategory', async(args) => {
   try{
      const response = await args.axiosPrivate.get('/category');
      return response.data;
   }catch(error){
      return error.message;
   }
});

export const addNewCategory = createAsyncThunk('category/addNewCategory', async(args) => {
   try{
      const response = await args.axiosPrivate.post('/category', JSON.stringify(args.data));
      
      return response;

   } catch(error) {
      return error.message;
   }
});

export const deleteCategory = createAsyncThunk('category/deleteCategory', async(args) => {
   try {
      for(let x in args.data){
         await args.axiosPrivate.delete(`/category/${args.data[x]._id}`);
      }

   } catch(error) {
      return error.message;
   }
});

export const updateCategory = createAsyncThunk('category/updateCategory', async(args) => {
   try {
      const response = await args.axiosPrivate.put(`/category/${args.data._id}`, JSON.stringify(args.data));

      return response;
   } catch(error) {

      return error.message;
   }
});

export const categorySlice = createSlice({
   name: "category",
   initialState: initialState,
   reducers: {
      setCategoryStatus: {
         reducer: (state, action) => {

            state.categoryStatus = action.payload;
         }
      }
   },
   extraReducers(builder) {
      builder
         .addCase(fetchCategory.pending, (state,action) => {
            state.categoryStatus = 'loading'
         })
         .addCase(fetchCategory.fulfilled, (state, action) => {
            state.categoryStatus = 'succeeded'

            state.category = action.payload.data;
         })
         .addCase(fetchCategory.rejected, (state, action) => {
            state.categoryStatus = 'failed'
            state.categoryError = action.error.message;
         })
   }
});

export const {setCategoryStatus} = categorySlice.actions;

export const getAllCategory = (state) => state.category.category;
export const getCategoryStatus = (state) => state.category.categoryStatus;
export const getCategoryError = (state) => state.category.categoryError;

export default categorySlice.reducer