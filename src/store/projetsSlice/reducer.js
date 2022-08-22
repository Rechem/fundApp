import { createSlice, createAsyncThunk,  } from '@reduxjs/toolkit';
import axios from 'axios'

const initialState = {
    projets: [],
    status: 'idle', //'fetching' 'idle',
    error: '',
}

export const projetsSlice = createSlice({
    name: 'projets',
    initialState,
    extraReducers(builder) {
        builder
            .addCase(fetchAllProjets.rejected, (state, action) => {
                state.status = 'idle'
                state.error = action.error.message
            })
            .addCase(fetchAllProjets.pending, (state, action) => {
                state.status = 'fetching'
            })
            .addCase(fetchAllProjets.fulfilled, (state, action) => {
                state.status = 'idle'
                state.projets = action.payload.data.projets
            })
    }
})

export const fetchAllProjets = createAsyncThunk('projets/fetchAllProjets',
    async searchInput => {
        const response = await axios.get('/projets',
            {
                params: {
                    searchInput,
                }
            })
        return response.data
    })

export default projetsSlice.reducer

