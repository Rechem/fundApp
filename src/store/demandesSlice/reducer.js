import { createSlice, createAsyncThunk, isAnyOf, addMatcher } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    demandes: [],
    status: 'idle', //'fetching' 'idle',
    error: null,
}

export const demandesSlice = createSlice({
    name: 'demandes',
    initialState,
    extraReducers(builder) {
        builder
            .addMatcher(isAnyOf(fetchUserDemandes.fulfilled, fetchAllDemandes.fulfilled),
                (state, action) => {
                    state.demandes = action.payload.data.demandes
                    state.status = 'idle'
                })
            .addMatcher(isAnyOf(fetchUserDemandes.pending, fetchAllDemandes.pending),
                (state, action) => {
                    state.status = 'fetching'
                })
            .addMatcher(isAnyOf(fetchUserDemandes.rejected, fetchAllDemandes.rejected),
                (state, action) => {
                    state.status = 'idle'
                    state.error = action.payload
                })
    }
})

export const fetchUserDemandes = createAsyncThunk('demandes/fetchDemandesByUserId',
    async ({ searchInput, idUser, }) => {
        try {
            const { data } = await axios.get(
                `/demandes/user/${idUser}`, {
                params: {
                    searchInput,
                }
            })
            return data
        } catch (e) {
            throw new Error(e.response.data.message)
        }
    })

export const fetchAllDemandes = createAsyncThunk('demandes/fetchAllDemandes',
// { search, orderBy, sortBy, page, size, }
    async (searchInput) => {
        try {
            const response = await axios.get(
                `/demandes`, {
                params: {
                    searchInput,
                }
            })
            return response.data
        } catch (e) {
            // if(e.response.status)
            throw new Error(e.response.data.message)
        }
    })

// export const { reset, logout, autoSignIn, setCompletedSignup } = demandesSlice.actions

export default demandesSlice.reducer