import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const getCurrency = createAsyncThunk(
    'currencySlice/getCurrency',
    async () => {
        try {
            const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');

            if (response.status === 200) {
                return {status: response.status, data: response.data};
            }
        } catch (error) {
            console.log(error)
        }
    },
);
