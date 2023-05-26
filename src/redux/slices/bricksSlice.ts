import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IBrick {
  id: number
  coordX: number
  coordY: number
}

type BricksStateType = IBrick[]

const initialState: BricksStateType = [
  {
    id: 1,
    coordX: 0,
    coordY: 0
  }
]

const brickSlice = createSlice({
  name: 'bricks',
  initialState,

  reducers: {
    setCoords(state: BricksStateType, action: PayloadAction<IBrick>) {
      const { id, coordX, coordY } = action.payload;
      const targetBrick = state.find((el) => el.id === id);
      if (!targetBrick) return;
      targetBrick.coordX = coordX;
      targetBrick.coordY = coordY;
    }
  }
});



export const { setCoords } = brickSlice.actions;

export default brickSlice.reducer;