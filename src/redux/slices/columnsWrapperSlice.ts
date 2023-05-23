import { createSlice, /* PayloadAction */ } from "@reduxjs/toolkit";


export interface IColumnsWrapperState {
  columnCount: number
};

const initialState: IColumnsWrapperState = {
  columnCount: 25
};

export const counterSlice = createSlice({
  name: 'columnsWrapper',
  initialState,

  reducers: {
    addColumn: (state) => {
      state.columnCount += 1;
    },
    removeColumn: (state) => {
      if (state.columnCount === 1) return;
      state.columnCount -= 1;
    },
  },
});


const columnsWrapperReducer = counterSlice.reducer;

export const { 
  addColumn, 
  removeColumn 
} = counterSlice.actions;

export default columnsWrapperReducer;