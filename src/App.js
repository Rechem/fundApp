import { ThemeProvider } from '@mui/system';
import { useEffect } from 'react';
import theme from './theme'
import Login from './pages/login/login'
import Layout from './components/layout/layout';
import Inscription from './pages/inscription/inscription';
import { StyledEngineProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CompleterInscription from './pages/inscription/completer-inscription';
import { useSelector, useDispatch } from 'react-redux'
import { onLoad } from './store/loginSlice/reducer';
import ProtectedRoute from './components/protected-route'
import Cookies from 'universal-cookie';
import MesDemandes from './pages/demandes/user/mes-demandes';
import axios from 'axios';

const cookies = new Cookies();

const App = () => {
  const dispatch = useDispatch()
  const authenticationState = useSelector(state => state.login)

  useEffect(() => { console.log("can you go ? ",authenticationState.status !== 'disconnected'
  & authenticationState.user.completedSignUp);dispatch(onLoad()); }, [])

  let redirectCompleteSignup = null

  if (authenticationState.status === 'connected') {
    if (authenticationState.user.completedSignUp) {
      redirectCompleteSignup = '/mes-demandes'
    } else {
      redirectCompleteSignup = '/complete-signup'
    }
  } else {
    redirectCompleteSignup = '/login'
  }

  const routes = (
    <Routes>
      <Route path="/login" exact element={<Login />} />
      <Route path="/signup" exact element={<Inscription />} />
      <Route exact
        element={<ProtectedRoute
          isAllowed={
            authenticationState.status !== 'disconnected'
            && !authenticationState.user.completedSignUp}
          redirectPath={redirectCompleteSignup} />}>

        <Route path="/complete-signup" exact element={<CompleterInscription />} />

      </Route>
      <Route exact
        element={<ProtectedRoute
          isAllowed={authenticationState.status !== 'disconnected'
            && authenticationState.user.completedSignUp}
          redirectPath={redirectCompleteSignup} />}>
        <Route path="/mes-demandes" exact element={<Layout><MesDemandes /></Layout>} />
      </Route>


      <Route path="*" element={<h1>404 Not found</h1>} />
    </Routes>)

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          {routes}
        </StyledEngineProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
