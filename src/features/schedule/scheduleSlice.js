import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { axiosPrivate } from "../../common/api/axios";

const initialState = {
   schedules: [],
   scheduleStatus: 'idle', //* 'idle' | 'loading' | 'succeeded' | 'failed'
   scheduleError: null
}

export const fetchScheduleList = createAsyncThunk('schedules/fetchScheduleList', async(args) => {
   try{
      const response = await args.axiosPrivate.get('/schedule');


      return response.data;
   } catch(error) {
      return error.message;
   }
});

export const addNewSchedule = createAsyncThunk('schedules/addNewSchedule', async(args) => {
   try {

      const response = await args.axiosPrivate.post('/schedule', JSON.stringify(args.data));

      return response.data;
   } catch(error) {

      return error.message;
   }
});

export const deleteSchedule = createAsyncThunk('schedules/deleteSchedule', async(args) => {
   try {
      for(let x in args.data){
         await args.axiosPrivate.delete(`/schedule/${args.data[x].Id}`);
      }

      return args.data
   } catch(error) {
      return error.message;
   }
});

export const updateSchedule = createAsyncThunk('schedules/updateSchedule', async(args) => {

   try {
      const response = await args.axiosPrivate.put(`/schedule/${args.data.Id}`, JSON.stringify(args.data));

      return response;
   } catch(error) {
      return error.message;
   }
});

export const scheduleSlice = createSlice({
   name: "schedules",
   initialState: initialState,
   reducers: {
      setScheduleStatus: {
         reducer: (state, action) => {

            state.scheduleStatus = action.payload;
         }
      }
   },
   extraReducers(builder) {
      builder
         .addCase(fetchScheduleList.pending, (state, action) => {
            state.scheduleStatus = 'loading'
         })
         .addCase(fetchScheduleList.fulfilled, (state, action) => {
            state.scheduleStatus = 'succeeded'
        
            state.schedules = action.payload.data;
         })
         .addCase(fetchScheduleList.rejected, (state, action) => {
            state.scheduleStatus = 'failed'
            state.scheduleError = action.error.message;
         })
         .addCase(addNewSchedule.fulfilled, (state, action) => {
         
            state.schedules = [...state.schedules, action.payload.data]
         })
   }
});

export const {setScheduleStatus} = scheduleSlice.actions;

export const getScheduleList = (state) => state.schedule.schedules;
export const getScheduleStatus = (state) => state.schedule.scheduleStatus;
export const getScheduleError = (state) => state.schedule.scheduleError;

export default scheduleSlice.reducer