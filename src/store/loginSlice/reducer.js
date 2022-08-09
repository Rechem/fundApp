import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit'
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const initialState = {
    user: {
        idUser: null,
        role: 'simpleUser',
        completedSignUp: true,
    },
    status: 'init',// 'init', disconnected', 'connected', 'loading', 
    error: '',
}

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        logout: {
            reducer: (state, action) => {
                state.status = 'disconnected';// 'disconnected', 'connected', 'loading'
                state.user = {
                    idUser: null,
                    role: null,
                    completedSignUp: false,
                }
                if (action.payload)
                    state.error = action.payload;
                else
                    state.error = ''
            },
            prepare: (error) => {
                cookies.remove('authObject')
                if (error)
                    return { payload: error }
                else
                    return {}
            },
        },
        setCompletedSignup: {
            reducer: (state, _) => {
                state.user.completedSignUp = true
            },
            prepare: () => {
                const authObject = cookies.get('authObject')

                if (authObject) {
                    authObject.completedSignUp = true
                }

                cookies.set('authObject', JSON.stringify(authObject),
                    {
                        maxAge: process.env.REACT_APP_LOGGEDIN_EXPIRES * 60 * 24,
                        path: '/'
                    })
                return {}
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(checkSignIn.rejected,
                (state, action) => {
                    state.status = 'disconnected'
                })
            .addCase(signOut.fulfilled,
                (state, action) => {
                    authenticationSlice.caseReducers.logout(state, action)
                })
            .addMatcher(isAnyOf(signIn.pending, signOut.pending),
                (state, _) => {
                    state.status = 'loading'
                    state.error = ''
                })
            .addMatcher(isAnyOf(signIn.fulfilled, signUp.fulfilled, checkSignIn.fulfilled),
                (state, action) => {
                    const userObject = {
                        idUser: action.payload.data.user.idUser,
                        role: action.payload.data.user.role,
                        completedSignUp: action.payload.data.user.completedSignUp,
                    }

                    cookies.set('authObject', JSON.stringify(userObject),
                        {
                            maxAge: process.env.REACT_APP_LOGGEDIN_EXPIRES * 60 * 24,
                            path: '/'
                        })

                    state.status = 'connected'
                    state.user = userObject
                })
            .addMatcher(isAnyOf(signIn.rejected, signUp.rejected), (state, action) => {
                console.log(action);
                state.status = 'disconnected'
                state.error = action.error.message
            })
    }
})

export const signIn = createAsyncThunk('authentication/login',
    async ({ email, password }) => {
        try {
            const response = await axios.post(
                `/users/login`, {
                email,
                password,
            })
            return response.data
        } catch (e) {
            throw new Error(e.response.data.message)
        }
    })

export const signUp = createAsyncThunk('authentication/signUp',
    async ({ email, password }) => {
        try {
            const response = await axios.post(
                `/users/signup`, {
                email,
                password,
            })
            console.log(response);
            return response.data
        } catch (e) {
            throw new Error(e.response.data.message)
        }
    })

export const checkSignIn = createAsyncThunk('authentication/checkSignIn',
    async () => {
        try {
            const uninterceptedAxiosInstance = axios.create();
            const BASE_URL = process.env.BASE_URL
            const response = await uninterceptedAxiosInstance.get(
                `${BASE_URL}/users/checkSignIn`)
            return response.data
        } catch (e) {
            throw new Error(e.response.data.message)
        }
    })

export const signOut = createAsyncThunk('authentication/logout',
    async () => {
        try {
            await axios.post(`/users/logout`)
        } catch (e) {
            throw new Error(e.response.data.message)
        }
    })

// Action creators are generated for each case reducer function
export const { reset, logout, autoSignIn, setCompletedSignup, logoutWithError } = authenticationSlice.actions

export default authenticationSlice.reducer