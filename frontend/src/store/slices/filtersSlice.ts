import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Priority } from '@/types/todos';

export interface FiltersState {
  completed: boolean | undefined;
  priority: Priority | undefined;
  dateGte: string | undefined;
  dateLte: string | undefined;
  sort: 'date' | 'priority' | undefined;
  order: 'asc' | 'desc';
  search: string | undefined;
}

const initialState: FiltersState = {
  completed: undefined,
  priority: undefined,
  dateGte: undefined,
  dateLte: undefined,
  sort: undefined,
  order: 'desc',
  search: undefined,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCompleted: (state, action: PayloadAction<boolean | undefined>) => {
      state.completed = action.payload;
    },
    setPriority: (state, action: PayloadAction<Priority | undefined>) => {
      state.priority = action.payload;
    },
    setDateGte: (state, action: PayloadAction<string | undefined>) => {
      state.dateGte = action.payload;
    },
    setDateLte: (state, action: PayloadAction<string | undefined>) => {
      state.dateLte = action.payload;
    },
    setSort: (
      state,
      action: PayloadAction<'date' | 'priority' | undefined>
    ) => {
      state.sort = action.payload;
    },
    setOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.order = action.payload;
    },
    setSearch: (state, action: PayloadAction<string | undefined>) => {
      state.search = action.payload;
    },
    resetFilters: (state) => {
      state.completed = undefined;
      state.priority = undefined;
      state.dateGte = undefined;
      state.dateLte = undefined;
      state.sort = undefined;
      state.order = 'desc';
      state.search = undefined;
    },
  },
});

export const {
  setCompleted,
  setPriority,
  setDateGte,
  setDateLte,
  setSort,
  setOrder,
  setSearch,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
