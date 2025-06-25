import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { Request, Stop } from "@/types/request";

interface RequestState {
  request: Request | null;
  originalRequest: Request | null;
  hasChanges: boolean,
}

const initialState: RequestState = {
  request: null,
  originalRequest: null,
  hasChanges: false,
};

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    setRequest(state, action: PayloadAction<Request | null>) {
      state.originalRequest = action.payload;
      state.request = action.payload;
    },
    updateField: (state, action: PayloadAction<Partial<Request>>) => {
      if (state.request) {
        Object.assign(state.request, action.payload)
      }
    },
    updateStopField: (
      state,
      action: PayloadAction<{
        index: number;
        field?: keyof Stop; // optional
        value: any;
      }>
    ) => {
      if (!state.request || !state.request.stops[action.payload.index]) {
        return;
      }

      const stop = state.request.stops[action.payload.index];

      if (action.payload.field) {
        // update only one field
        (stop as any)[action.payload.field] = action.payload.value;
      } else {
        // replace/patch multiple fields
        Object.assign(stop, action.payload.value);
      }
    },
    resetRequest: (state) => {
      state.request = state.originalRequest
    },
    clearRequest: (state) => {
      state.originalRequest = null
      state.request = null
    },
  },
});

export default requestSlice.reducer;
export const { setRequest, updateField, updateStopField, resetRequest, clearRequest } = requestSlice.actions;


const isEqual = (a: any, b: any): boolean => {
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return false
  }
}

const selectOriginalRequest = (state: RootState) => state.request.originalRequest
const selectRequest = (state: RootState) => state.request.request

export const selectHasChanges = createSelector(
  [selectOriginalRequest, selectRequest],
  (original, edited) => {
    if (!original || !edited) return false
    return !isEqual(original, edited)
  }
)


