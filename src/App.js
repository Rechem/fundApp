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
import Messages from './pages/messages/messages';
import NewMessage from './pages/messages/new-message/new-message';
import Demandes from './pages/demandes/demandes';
import Demande from './pages/demande/demande';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import Commissions from './pages/commissions/commissions-membres'
import Commission from './pages/commissions/commission/commission';
import NotFound from './pages/util-pages/not-found'
import Unauthorized from './pages/util-pages/unauthorized'
import { isAdmin, isModo, isSimpleUser } from './utils';
import Projets from './pages/projets/projets';
import Projet from './pages/projet/projet';
import Prevision from './pages/prevision/prevision';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  // setupAxios(axios)
  const dispatch = useDispatch()
  const authenticationState = useSelector(state => state.login)

  useEffect(() => {
    dispatch(checkSignIn());
  }, [])

  let redirectCompleteSignup = null

  if (authenticationState.status === 'connected') {
    if (isSimpleUser(authenticationState)) {
      if (authenticationState.user.completedSignUp) {
        redirectCompleteSignup = '/demandes'
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
            && isSimpleUser(authenticationState)
            && !authenticationState.user.completedSignUp}
          redirectPath={redirectCompleteSignup} />}>
        <Route path="/complete-signup" exact element={<CompleterInscription />} />
      </Route>

      <Route exact
        element={<ProtectedRoute
          isAllowed={
            authenticationState.status === 'connected'
            &&
            (isAdmin(authenticationState) || isModo(authenticationState) ||
              isSimpleUser(authenticationState)
              && authenticationState.user.completedSignUp)}
          redirectPath={redirectCompleteSignup} />}>
        <Route path="/projets/:idProjet/prevision/:tranche" exact element={<Layout><Prevision /></Layout>} />
        <Route path="/projets" exact element={<Layout><Projets /></Layout>} />
        <Route path="/projets/:idProjet" exact element={<Layout><Projet /></Layout>} />
        <Route path="/demandes" exact element={<Layout><Demandes /></Layout>} />
        <Route path="/demandes/:idDemande" exact element={<Layout><Demande /></Layout>} />
      </Route>

      <Route exact
        element={<ProtectedRoute
          isAllowed={
            authenticationState.status === 'connected'
            && isAdmin(authenticationState)} />}>
        <Route path="/commissions" exact element={<Layout><Commissions /></Layout>} />
        <Route path="/commissions/:idCommission" exact element={<Layout><Commission /></Layout>} />
      </Route>

      <Route exact
        element={<ProtectedRoute
          isAllowed={
            authenticationState.status === 'connected'} />}>
        <Route path="/messages" exact element={<Layout><Messages /></Layout>} />
        <Route path="/messages/new" exact element={<Layout><NewMessage /></Layout>} />
      </Route>


      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/notfound" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>)


  return (
    <Router>
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          {authenticationState.status === 'init'
            ? standByScreen : protectedRoutes}
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
            theme='colored' />
        </StyledEngineProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
