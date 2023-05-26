import { configureStore } from '@reduxjs/toolkit';
import columnsWrapperReducer from './slices/columnsWrapperSlice';
import rowsWrapperReducer from './slices/rowsWrapperSlice';
import coordsReducer from './slices/coordsSlice';
import bricksReducer from './slices/bricksSlice'

export const store = configureStore({
  reducer: {
    rows: rowsWrapperReducer,
    columns: columnsWrapperReducer,
    coords: coordsReducer,
    bricks: bricksReducer
   }
});

export type RootStateType = ReturnType<typeof store.getState>;
export type DispatchType = typeof store.dispatch;

