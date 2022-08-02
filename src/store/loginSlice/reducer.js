import { createSlice, createAsyncThunk, isAnyOf, addMatcher } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

axios.defaults.withCredentials = true;


const initialState = {
    user: {
        idUser: null,
        role: null,
        completedSignUp: true,
    },
    status: 'init',// 'init', disconnected', 'connected', 'loading', 
    error: null,
}

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        onLoad: (state, _) => {

            const authObject = cookies.get('authObject')
            
            if (authObject) {
                console.log(cookies.get('authObject'))
                if (authObject.stayLoggedIn === true) {
                    const user = {
                        idUser: authObject.idUser,
                        role: authObject.role,
                        completedSignUp: authObject.completedSignUp,
                    }
                    state.user = user;
                    state.status = user.idUser && user.role ? 'connected' : 'disconnected'
                }else{
                    state.status = 'disconnected'
                }
            }
        },
        setCompletedSignup: (state, _) => {
            const authObject = cookies.get('authObject')

            if (authObject) {
                authObject.completedSignUp = true
            }
            state.user.completedSignUp = true

            cookies.set('authObject', JSON.stringify(authObject),
                { maxAge: process.env.REACT_APP_LOGGEDIN_EXPIRES * 60 * 24 })
        },
    },
    extraReducers(builder) {
        builder
            .addCase(signOut.fulfilled, (state, _) => {
                state.status = 'disconnected';// 'disconnected', 'connected', 'loading'
                state.user = {
                    idUser: null,
                    role: null,
                    completedSignUp: false,
                }
                state.error = null;

                cookies.remove('authObject')
            })
            // .addCase(onLoad.fulfilled, (state, action) => {
            //     state.status = 'connected'
            //     state.user = action.payload
            // })
            .addMatcher(isAnyOf(signIn.pending, signOut.pending),
                (state, _) => {
                    state.status = 'loading'
                    state.error = null
                })
            .addMatcher(isAnyOf(signIn.fulfilled, signUp.fulfilled), (state, action) => {
                const authObject = {
                    idUser: action.payload.response.user.idUser,
                    role: action.payload.response.user.role,
                    completedSignUp: action.payload.response.user.completedSignUp,
                    stayLoggedIn: action.payload.stayLoggedIn
                }

                cookies.set('authObject', JSON.stringify(authObject),
                    { maxAge: process.env.REACT_APP_LOGGEDIN_EXPIRES * 60 * 24 })

                state.status = 'connected'
                state.user = action.payload.response.user
            })
            .addMatcher(isAnyOf(signIn.rejected), (state, action) => {
                state.status = 'disconnected'
                state.error = action.payload
            })
    }
})

export const signIn = createAsyncThunk('authentication/login',
    async ({ email, password, stayLoggedIn, }, { rejectWithValue }) => {
        try {
            const BASE_URL = process.env.REACT_APP_BASE_URL
            const response = await axios.post(
                `${BASE_URL}/users/login`, {
                email,
                password,
            })
            return { response: response.data, stayLoggedIn }
        } catch (e) {
            return rejectWithValue(e.response.data.message)
        }
    })

export const signUp = createAsyncThunk('aythentication/signUp',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const BASE_URL = process.env.REACT_APP_BASE_URL
            console.log(BASE_URL)
            const response = await axios.post(
                `${BASE_URL}/users/signup`, {
                email,
                password,
            })
            return response.data
        } catch (e) {
            rejectWithValue(e.response.data.message)
        }
    })

// export const onLoad = createAsyncThunk('authentication/onLoad',
//     async (_, { rejectWithValue }) => {

//         const authObject = cookies.get('authObject')

//         if (authObject) {
//             // const stayLoggedIn = cookies.get('stayLoggedIn') === 'true'
//             // const idUser = parseInt(cookies.get('idUser'))
//             // const role = cookies.get('role')
//             // const completedSignUp = cookies.get('completedSignUp') === 'true'
//             if (authObject.stayLoggedIn === true) {
//                 const user = {
//                     idUser: authObject.idUser,
//                     role: authObject.role,
//                     completedSignUp: authObject.completedSignUp,
//                 }
//             }
//         }

//         if (stayLoggedIn && idUser != null) {
//             console.log("here ?")
//             try {
//                 const BASE_URL = process.env.REACT_APP_BASE_URL
//                 await axios.post(
//                     `${BASE_URL}/users/onLoad`, { user: user })
//                 return { ...user }
//             } catch (e) {
//                 return rejectWithValue(e.response.data.message)
//             }
//         }
//         return rejectWithValue()
//     })

export const signOut = createAsyncThunk('authentication/logout',
    async (_, { rejectWithValue }) => {
        try {
            const BASE_URL = process.env.REACT_APP_BASE_URL
            await axios.post(
                `${BASE_URL}/users/logout`, {})
        } catch (e) {
            return rejectWithValue(e.response.data.message)
        }
    })

// Action creators are generated for each case reducer function
export const { reset, logout, autoSignIn, setCompletedSignup, onLoad } = authenticationSlice.actions

export default authenticationSlice.reducer