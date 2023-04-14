
const reducer = (state = 0, action) => {
  switch (action.type) {
    case 'deposit':
      return state + action.payload
      break;
    case 'withdraw':
      return state - action.payload
  }
}











{/*
// Import necessary dependencies
import { createSlice } from '@reduxjs/toolkit';

// Define initial state
const initialState = {
  // ... your initial state ...
};

// Create a Redux slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Define your reducers here
  
    timer: (state, action) => {
      // ... your timer logic ...
    },
  },
});

// Export the slice's reducer and actions
export const { timer } = appSlice.actions;

export default appSlice.reducer;
*/}