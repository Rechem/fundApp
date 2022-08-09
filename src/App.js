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
import { checkSignIn } from './store/loginSlice/reducer';
import ProtectedRoute from './components/protected-route'
import MesDemandes from './pages/demandes/user/mes-demandes';
import Messages from './pages/messages/messages';
import NewMessage from './pages/messages/new-message/new-message';
import Demandes from './pages/demandes/admin/demandes';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import Commissions from './pages/commissions/commissions'

const App = () => {
  const dispatch = useDispatch()
  const authenticationState = useSelector(state => state.login)

  useEffect(() => {
    dispatch(checkSignIn());
  }, [])

  const isAdmin = () => {
    return authenticationState.user.role === 'admin'
  }

  const isSimpleUser = () => {
    return authenticationState.user.role === 'simpleUser'
  }

  let redirectCompleteSignup = null

  if (authenticationState.status === 'connected') {
    if (isSimpleUser()) {
      if (authenticationState.user.completedSignUp) {
        redirectCompleteSignup = '/mes-demandes'
      }
      else {
        redirectCompleteSignup = '/complete-signup'
      }
    } else
      redirectCompleteSignup = '/demandes'
  } else {
    redirectCompleteSignup = '/connexion'
  }

  const standByScreen = (<div
    style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
  ><CircularProgress /></div>)

  const protectedRoutes = (
    <Routes>


      <Route exact
        element={<ProtectedRoute
          isAllowed={
            authenticationState.status !== 'connected'}
          redirectPath={redirectCompleteSignup} />}>
        <Route path="/connexion" exact element={<Login />} />
        <Route path="/inscription" exact element={<Inscription />} />
      </Route>



      <Route exact
        element={<ProtectedRoute
          isAllowed={
            authenticationState.status === 'connected'
            && isSimpleUser()
            && !authenticationState.user.completedSignUp}
          redirectPath={redirectCompleteSignup} />}>
        <Route path="/complete-signup" exact element={<CompleterInscription />} />
      </Route>

      <Route exact
        element={<ProtectedRoute
          isAllowed={
            authenticationState.status === 'connected'
            && isSimpleUser()
            && authenticationState.user.completedSignUp}
          redirectPath={redirectCompleteSignup} />}>
        <Route path="/mes-demandes" exact element={<Layout><MesDemandes /></Layout>} />
      </Route>

      <Route exact
        element={<ProtectedRoute
          isAllowed={
            authenticationState.status === 'connected'
            && isAdmin()} />}>
        <Route path="/demandes" exact element={<Layout><Demandes /></Layout>} />
        <Route path="/commissions" exact element={<Layout><Commissions /></Layout>} />
      </Route>

      <Route exact
        element={<ProtectedRoute
          isAllowed={
            authenticationState.status === 'connected'
            && (isAdmin() || isSimpleUser())} />}>
        <Route path="/messages" exact element={<Layout><Messages /></Layout>} />
        <Route path="/messages/new" exact element={<Layout><NewMessage /></Layout>} />
      </Route>


      <Route path="*" element={<h1>404 Not found</h1>} />
    </Routes>)


  return (
    <Router>
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          {authenticationState.status === 'init'
            ? standByScreen : protectedRoutes}
        </StyledEngineProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
