import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Status } from "@/types/request";


export type Filter = Status | "all";

interface InitialState {
  filter: Filter
  page: number;
}

const initialState: InitialState = {
  filter: "pending",
  page: 1,
};

const requestsSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
});

export const { setFilter, setPage } = requestsSlice.actions;
export default requestsSlice.reducer;

