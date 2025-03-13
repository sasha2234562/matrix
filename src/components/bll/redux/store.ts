import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {currencySlice} from "./reducers/currency.ts";
import { useDispatch } from "react-redux";

export const RootStateReducer = combineReducers({
    currency: currencySlice.reducer
});
export const store = configureStore({reducer: RootStateReducer});

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export type RootState = ReturnType<typeof store.getState>;
