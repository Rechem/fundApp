import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './loginSlice/reducer'
import demandesReducer from './demandesSlice/reducer'

export default configureStore({
  reducer: {
    login : loginReducer,
    demandes : demandesReducer
  },
},)