import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedJobId: null,
};

export const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setSelectedJobId: (state, action) => {
      state.selectedJobId = action.payload;
    },
    clearSelectedJobId: (state) => {
      state.selectedJobId = null;
    },
  },
});

// Export the actions to use in components
export const { setSelectedJobId, clearSelectedJobId } = jobSlice.actions;

export default jobSlice.reducer;
