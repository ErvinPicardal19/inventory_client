import { configureStore } from "@reduxjs/toolkit";
import productReducer from '../features/products/productSlice';
import orderReducer from '../features/orders/orderSlice';
import customerReducer from '../features/customers/customersSlice';
import categoryReducer from '../features/category/categorySlice';
import employeesReducer from '../features/Employee/employeeSlice';
import scheduleReducer from '../features/schedule/scheduleSlice';

export const store = configureStore({
   reducer: {
      product: productReducer,
      order: orderReducer,
      customer: customerReducer,
      category: categoryReducer,
      employees: employeesReducer,
      schedule: scheduleReducer
   },
   middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }), 
});