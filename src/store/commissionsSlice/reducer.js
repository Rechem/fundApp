import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios'

const initialState = {
    commissions: [],
    status: 'idle', //'fetching' 'idle',
    error: '',
}

export const commissionsSlice = createSlice({
    name: 'commissions',
    initialState,
    extraReducers(builder) {
        builder
            .addCase(fetchAllCommissions.rejected, (state, action) => {
                state.status = 'idle'
                state.error = action.error.message
            })
            .addCase(fetchAllCommissions.pending, (state, action) => {
                state.status = 'fetching'
            })
            .addCase(fetchAllCommissions.fulfilled, (state, action) => {
                state.status = 'idle'
                state.commissions = action.payload.data.commissions
            })
    }
})

export const addCommission = createAsyncThunk('commissions/addCommission',
    async ({ president, membres, dateCommission }) => {
        const response = await axios.post('/commissions', { president, membres, dateCommission })
    })

export const fetchAllCommissions = createAsyncThunk('commissions/fetchAllCommissions',
    async searchInput => {
        const response = await axios.get('/commissions',
            {
                params: {
                    searchInput,
                }
            })
        return response.data
    })

// export const { reset, logout, autoSignIn, setCompletedSignup, logoutWithError } = membresSlice.actions

export default commissionsSlice.reducer

