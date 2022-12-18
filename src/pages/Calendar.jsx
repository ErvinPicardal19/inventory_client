/* eslint-disable react-hooks/exhaustive-deps */
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
} from '../features/schedule/scheduleSlice';
import { useSelector, useDispatch } from 'react-redux';
import {Header} from '../common/components';
import useAxiosPrivate from '../common/hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';

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

      dispatch(fetchScheduleList({axiosPrivate}));


   } catch(err) {
      console.error(err);
      navigate('/login', {state: {from: location}, replace: true});
   }
  }, []);

  useEffect(() => {

    setSchedules([...scheduleList])
  }, [scheduleList]);


  const dataSourceChanged = async(args) => {

      try{
        if(args?.requestType === 'eventCreated'){

          dispatch(addNewSchedule({axiosPrivate, data: args?.data[0]}))

       }

       if(args?.requestType === 'eventChanged'){

          dispatch(updateSchedule({axiosPrivate, data: args?.data[0]}))

          const filteredSchedules = schedules.filter((val) => val.Id !== args?.data[0]?.Id)


          if(!filteredSchedules) {
            setSchedules([]);
            return;
          };
          
          setSchedules([...filteredSchedules, args?.data[0]])
          
       }

       if(args?.requestType === 'eventRemoved'){

          dispatch(deleteSchedule({axiosPrivate, data: args?.data}));
          const filteredSchedules = schedules.filter((val) => val.Id !== args?.data[0].Id)

      
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