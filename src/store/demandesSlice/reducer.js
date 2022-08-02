import { createSlice, createAsyncThunk, isAnyOf, addMatcher } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    demandes: [],
    status: 'idle', //'searching' 'idle',
    error: null,
}

export const demandesSlice = createSlice({
    name: 'demandes',
    initialState,
    extraReducers(builder) {
        builder
            .addMatcher(isAnyOf(fetchUserDemandes.fulfilled),
                (state, action) => {
                    state.demandes = action.payload.demandes
                    state.status = 'idle'
                })
            .addMatcher(isAnyOf(fetchUserDemandes.pending),
                (state, action) => {
                    state.status = 'searching'
                })
            .addMatcher(isAnyOf(fetchUserDemandes.rejected),
                (state, action) => {
                    state.status = 'idle'
                })
    }
})

export const fetchUserDemandes = createAsyncThunk('demandes/fetchDemandesByUserId',
    async ({searchInput, idUser, }, { rejectWithValue }) => {
        try {
            const BASE_URL = process.env.REACT_APP_BASE_URL
            console.log(idUser)
            const response = await axios.get(
                `${BASE_URL}/demandes/user`, {
                params: {
                    idUser,
                    searchInput,
                }
            })
            return response.data
        } catch (e) {
            console.log(e)
            // if(e.response.status)
            return rejectWithValue(e.response.data.message)
        }
    })

// export const { reset, logout, autoSignIn, setCompletedSignup } = demandesSlice.actions

export default demandesSlice.reducer