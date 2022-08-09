import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './loginSlice/reducer'
import demandesReducer from './demandesSlice/reducer'
import membresSlice from './membresSlice/reducer'
import setupAxios from '../axios-config'
import axios from 'axios'

const store = configureStore({
  reducer: {
    login : loginReducer,
    demandes : demandesReducer,
    membres : membresSlice,
  },
},)

setupAxios(axios, store)

export default store