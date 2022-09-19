import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './loginSlice/reducer'
import membresSlice from './membresSlice/reducer'
import setupAxios from '../axios-config'
import axios from 'axios'

const store = configureStore({
  reducer: {
    login : loginReducer,
    membres : membresSlice,
  },
},)

setupAxios(axios, store)

export default store