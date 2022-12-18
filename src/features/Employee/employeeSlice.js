import { socket } from "../../common/api/socket";
const {createSlice, createAsyncThunk} = require('@reduxjs/toolkit');

const initialState = {
   employees: [],
   employeesStatus: 'idle', //* 'idle' | 'loading' | 'succeeded' | 'failed'
   employeesError: null
}

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async(args) => {
   try{

      const response = await args.axiosPrivate.get('/employees');
      return response.data;
   }catch(error){
      return error.message;
   }
});

export const addNewEmployee = createAsyncThunk('employees/addNewEmployee', async(args) => {
   try{
      const response = await args.axiosPrivate.post('/register', JSON.stringify(args.data));
      socket.emit("update");
      
      return response.data;
   } catch(error) {
      return error.message;
   }
});

export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async(args) => {
   try {

      for(let employee of args.data){
         args.axiosPrivate.delete(`/employees/${employee._id}`)
      }
      socket.emit("update");

   } catch(error) {
      return error.message;
   }
});

export const updateEmployee = createAsyncThunk('employees/updateEmployee', async(args) => {

   try {
      const response = await args.axiosPrivate.put(`/employees/${args.data._id}`, JSON.stringify(args.data));

      return response;
   } catch(error) {

      return error.message;
   }
});

export const employeeSlice = createSlice({
   name: "employees",
   initialState: initialState,
   reducers: {
      setEmployeeStatus: {
         reducer: (state, action) => {

            state.employeesStatus = action.payload;
         }
      }
   },
   extraReducers(builder) {
      builder
         .addCase(fetchEmployees.pending, (state,action) => {
            state.employeesStatus = 'loading'
         })
         .addCase(fetchEmployees.fulfilled, (state, action) => {
            state.employeesStatus = 'succeeded'
 
            state.employees = action.payload.data;
         })
         .addCase(fetchEmployees.rejected, (state, action) => {
            state.employeesStatus = 'failed'
            state.employeesError = action.error.message;
         })
   }
});

export const {setEmployeeStatus} = employeeSlice.actions;

export const getAllEmployees = (state) => state.employees.employees;
export const getEmployeePageStatus = (state) => state.employees.employeesStatus;
export const getEmployeePageError = (state) => state.employees.employeesError;

export default employeeSlice.reducer