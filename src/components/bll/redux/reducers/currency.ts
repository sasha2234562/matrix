import {createSlice} from "@reduxjs/toolkit";
import {getCurrency} from "../thunks/get-currency.ts";

export interface Currency {
    symbol: string;
    priceChange: string;
    priceChangePercent: string;
    weightedAvgPrice: string;
    prevClosePrice: string;
    lastPrice: string;
    lastQty: string;
    bidPrice: string;
    bidQty: string;
    askPrice: string;
    askQty: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    volume: string;
    quoteVolume: string;
    openTime: number;
    closeTime: number;
    firstId: number;
    lastId: number;
    count: number;
}

export interface InitialState {
    currency: Currency[];
}

const initialState: InitialState = {
    currency: []
};

export const currencySlice = createSlice({
    name: 'dependency',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getCurrency.fulfilled, (state, action) => {
            state.currency = action.payload?.data
        })
    },
});
