import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios'

const initialState = {
    membres: [],
    status: 'idle', //'fetching' 'idle',
    error: '',
}

export const membresSlice = createSlice({
    name: 'membres',
    initialState,
    extraReducers(builder) {
        builder
            .addCase(fetchAllMembres.rejected, (state, action) => {
                state.status = 'idle'
                state.error = action.error.message
            })
            .addCase(fetchAllMembres.pending, (state, action) => {
                state.status = 'fetching'
            })
            .addCase(fetchAllMembres.fulfilled, (state, action) => {
                state.status = 'idle'
                state.membres = action.payload.data.membres
            })
    }
})

export const fetchAllMembres = createAsyncThunk('membres/fetchAllMembres',
    async searchInput => {
        const response = await axios.get('/membres',
            {
                params: {
                    searchInput,
                }
            })
        return response.data
    })

// export const { reset, logout, autoSignIn, setCompletedSignup, logoutWithError } = membresSlice.actions

export default membresSlice.reducer

