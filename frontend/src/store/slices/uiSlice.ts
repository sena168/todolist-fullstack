import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  viewMode: 'page' | 'scroll';
  currentPage: number;
  limit: number;
}

const initialState: UIState = {
  viewMode: 'scroll',
  currentPage: 1,
  limit: 10,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<'page' | 'scroll'>) => {
      state.viewMode = action.payload;
      // Reset page when switching modes
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    nextPage: (state) => {
      state.currentPage += 1;
    },
    prevPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
  },
});

export const {
  setViewMode,
  setCurrentPage,
  setLimit,
  nextPage,
  prevPage,
} = uiSlice.actions;

export default uiSlice.reducer;
