import { createSlice, /* PayloadAction */ } from "@reduxjs/toolkit";


export interface IRowsWrapperState {
  rowCount: number
  rowHeight: number
};

const initialState: IRowsWrapperState = {
  rowCount: 10,
  rowHeight: 50
};

export const counterSlice = createSlice({
  name: 'rowsWrapper',
  initialState,

  reducers: {
    addRow: (state) => {
      state.rowCount += 1;
    },
    removeRow: (state) => {
      if (state.rowCount === 1) return;
      state.rowCount -= 1;
    },
  },
});


const rowsWrapperReducer = counterSlice.reducer;

export const { 
  addRow,
  removeRow
} = counterSlice.actions;

export default rowsWrapperReducer;