import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ICoords {
  columnCoords: number [],
  rowCoords: number []
};


const initialState: ICoords = {
  columnCoords: [],
  rowCoords: []
};


const coordsSlice = createSlice({
  name: 'coords',
  initialState,

  reducers: {
    writeCoords: (state, action: PayloadAction<ICoords> ) => {
      state.columnCoords = action.payload.columnCoords;
      state.rowCoords = action.payload.rowCoords
    }
  },
});


export const { writeCoords } =  coordsSlice.actions;
export default  coordsSlice.reducer;
