import { configureStore } from '@reduxjs/toolkit';
import columnsWrapperReducer from './slices/columnsWrapperSlice';
import rowsWrapperReducer from './slices/rowsWrapperSlice';
import coordsReducer from './slices/coordsSlice';

export const store = configureStore({
  reducer: {
    rows: rowsWrapperReducer,
    columns: columnsWrapperReducer,
    coords: coordsReducer
   }
});

export type RootStateType = ReturnType<typeof store.getState>;
export type DispatchType = typeof store.dispatch;

