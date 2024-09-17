import { createSlice } from '@reduxjs/toolkit';

// userSlice.ts


const PinSlice = createSlice({
  name: 'pin',
  initialState: { pin: '1234' },
  reducers: {
    setPin: (state, action) => {
      state.pin = action.payload;
    },
    
  },
});

export const { setPin } = PinSlice.actions;
export default PinSlice.reducer;
