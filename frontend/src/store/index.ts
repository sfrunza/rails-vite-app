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
import { settingsApi } from "@/services/settings-api";
import { trucksApi } from "@/services/trucks-api";
import { packingsApi } from "@/services/packings-api";
import { moveSizesApi } from "@/services/move-sizes-api";
import { entranceTypesApi } from "@/services/entrance-types-api";
import { employeesApi } from "@/services/employees-api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [ratesApi.reducerPath]: ratesApi.reducer,
    [calendarRatesApi.reducerPath]: calendarRatesApi.reducer,
    [extraServicesApi.reducerPath]: extraServicesApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [trucksApi.reducerPath]: trucksApi.reducer,
    [packingsApi.reducerPath]: packingsApi.reducer,
    [moveSizesApi.reducerPath]: moveSizesApi.reducer,
    [entranceTypesApi.reducerPath]: entranceTypesApi.reducer,
    [employeesApi.reducerPath]: employeesApi.reducer,
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
      settingsApi.middleware,
      trucksApi.middleware,
      packingsApi.middleware,
      moveSizesApi.middleware,
      entranceTypesApi.middleware,
      employeesApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppSelector = typeof store.getState;

export const useAppSelector = useReduxSelector.withTypes<RootState>();

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useReduxDispatch.withTypes<AppDispatch>();
