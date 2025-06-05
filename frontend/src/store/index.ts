import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";

import authReducer from "@/slices/auth-slice";
import { authApi } from "@/services/auth-api";
import { rtkQueryErrorLogger } from "@/services/base-service";
import { usersApi } from "@/services/users-api";
import { servicesApi } from "@/services/services-api";
import { calendarRatesApi } from "@/services/calendar-rates-api";
import { ratesApi } from "@/services/rates-api";
import { extraServicesApi } from "@/services/extra-services-api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [ratesApi.reducerPath]: ratesApi.reducer,
    [calendarRatesApi.reducerPath]: calendarRatesApi.reducer,
    [extraServicesApi.reducerPath]: extraServicesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      rtkQueryErrorLogger,
      authApi.middleware,
      usersApi.middleware,
      servicesApi.middleware,
      ratesApi.middleware,
      calendarRatesApi.middleware,
      extraServicesApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppSelector = typeof store.getState;

export const useAppSelector = useReduxSelector.withTypes<RootState>();

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useReduxDispatch.withTypes<AppDispatch>();
