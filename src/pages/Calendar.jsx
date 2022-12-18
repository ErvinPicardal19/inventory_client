import React, {useEffect, useState} from 'react'
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop} from '@syncfusion/ej2-react-schedule';
import {
  addNewSchedule,
  deleteSchedule,
  fetchScheduleList,
  getScheduleError,
  getScheduleList,
  getScheduleStatus,
  updateSchedule,
  setScheduleStatus
} from '../features/schedule/scheduleSlice';
import { useSelector, useDispatch } from 'react-redux';
import {Header} from '../common/components';
import useAxiosPrivate from '../common/hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
// import { scheduleData } from '../data/dummy';

const Calendar = () => {

  const [schedules, setSchedules] = useState([]);
  const scheduleList = useSelector(getScheduleList);
  const fetchStatus = useSelector(getScheduleStatus);
  const fetchError = useSelector(getScheduleError);
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try{
      // const response = await axiosPrivate.get('/inventory', {
      //    signal: controller.signal
      // });
      // console.log(inventoryStatus);
      dispatch(fetchScheduleList({axiosPrivate}));
      // console.log(response.data);
      // setCategories(response.data.category);

   } catch(err) {
      console.error(err);
      navigate('/login', {state: {from: location}, replace: true});
   }
  }, []);

  useEffect(() => {
    console.log(scheduleList);
    setSchedules([...scheduleList])
  }, [scheduleList]);

  useEffect(() => {
    console.log(schedules);
  }, [schedules])

  const dataSourceChanged = async(args) => {
    console.log(args);
      try{
        if(args?.requestType === 'eventCreated'){
          console.log('Adding...');
          dispatch(addNewSchedule({axiosPrivate, data: args?.data[0]}))
          // window.location.reload(false);
          // setSchedules([...schedules, args?.data[0]])
          // console.log(args?.data[0]._id);
       }

       if(args?.requestType === 'eventChanged'){
          console.log(args?.data[0]);
          dispatch(updateSchedule({axiosPrivate, data: args?.data[0]}))
          // const foundEvent = schedules.find((val) => val._id === args?.data[0]._id)
          const filteredSchedules = schedules.filter((val) => val.Id !== args?.data[0]?.Id)

          // foundEvent = args?.data[0];
          if(!filteredSchedules) {
            setSchedules([]);
            return;
          };
          
          setSchedules([...filteredSchedules, args?.data[0]])
          
       }

       if(args?.requestType === 'eventRemoved'){
          console.log('deleting...');
          dispatch(deleteSchedule({axiosPrivate, data: args?.data}));
          const filteredSchedules = schedules.filter((val) => val.Id !== args?.data[0].Id)

          console.log(filteredSchedules);
          if(!filteredSchedules) {
            setSchedules([]);
            return;
          };
          setSchedules(filteredSchedules);
       }
      } catch(err) {

      }
   }

  return (
    <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
      <Header category="App" title="Calender"/>
      {fetchStatus === 'succeeded' &&
        <ScheduleComponent
        height={"650px"}
        eventSettings={{dataSource: schedules}}
        actionComplete={dataSourceChanged}
        selectedDate={new Date()}
        id
      >
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}/>
      </ScheduleComponent>
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

export default Calendar;