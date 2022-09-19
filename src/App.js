import { ThemeProvider } from '@mui/system';
import { useEffect } from 'react';
import theme from './theme'
import Login from './pages/login/login'
import Layout from './components/layout/layout';
import Inscription from './pages/inscription/inscription';
import { StyledEngineProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
import Realisation from './pages/realisation/realisation';
import Revenu from './pages/revenu/revenu'
import Utilisateurs from './pages/users/users'
import Profil from './pages/profil/profil'
import Ticket from './pages/messages/ticket';
import ConfirmEmail from './pages/util-pages/confirmEmail';
import VerifyEmail from './pages/util-pages/verifyEmail';
import ResetPassword from './pages/reset-password/reset-password';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './pages/util-pages/scroll-to-top';
import NewPassword from './pages/reset-password/new-password';

const App = () => {

  // setupAxios(axios)
  const dispatch = useDispatch()
  const authenticationState = useSelector(state => state.login)

  useEffect(() => {
    dispatch(checkSignIn());
  }, [])

  let redirectCompleteSignup = null

  if (authenticationState.status === 'connected') {
    // if (isSimpleUser(authenticationState)) {
      if (authenticationState.user.completedSignUp) {
        redirectCompleteSignup = '/demandes'
      }
      else {
        redirectCompleteSignup = '/complete-signup'
      }
    // } else
      // redirectCompleteSignup = '/demandes'
  } else {
    redirectCompleteSignup = '/connexion'
  }

  const standByScreen = (<div
    style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
  ><CircularProgress /></div>)

  const protectedRoutes = (
    <Routes>

      <Route path="/" exact element={<Navigate  to='/demandes'/>} />

      <Route exact
        element={<ProtectedRoute
          isAllowed={
            authenticationState.status !== 'connected'}
          redirectPath={redirectCompleteSignup} />}>
        <Route path="/new-password/:token" exact element={<NewPassword />} />
        <Route path="/reset-password" exact element={<ResetPassword />} />
        <Route path="/verifyMail/:token" exact element={<VerifyEmail />} />
        <Route path="/confirmEmail" exact element={<ConfirmEmail />} />
        <Route path="/connexion" exact element={<Login />} />
        <Route path="/inscription" exact element={<Inscription />} />
      </Route>

      <Route exact
        element={<ProtectedRoute
          isAllowed={
            authenticationState.status === 'connected'
            // && isSimpleUser(authenticationState)
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
        <Route path="/me" exact element={<Layout><Profil /></Layout>} />
        <Route path="/projets/:idProjet/revenu" exact element={<Layout><Revenu /></Layout>} />
        <Route path="/projets/:idProjet/prevision/:tranche" exact element={<Layout><Prevision /></Layout>} />
        <Route path="/projets/:idProjet/realisation/:tranche" exact element={<Layout><Realisation /></Layout>} />
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
        <Route path="/users/:idUser" exact element={<Layout><Profil /></Layout>} />
        <Route path="/users" exact element={<Layout><Utilisateurs /></Layout>} />
        <Route path="/commissions" exact element={<Layout><Commissions /></Layout>} />
        <Route path="/commissions/:idCommission" exact element={<Layout><Commission /></Layout>} />
      </Route>

      <Route exact
        element={<ProtectedRoute
          isAllowed={
            authenticationState.status === 'connected'} />}>
        <Route path="/tickets/new" exact element={<Layout><NewMessage /></Layout>} />
        <Route path="/tickets/:idTicket" exact element={<Layout><Ticket /></Layout>} />
        <Route path="/tickets" exact element={<Layout><Messages /></Layout>} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/notfound" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>)


  return (
    <Router>
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          <ScrollToTop />
          {authenticationState.status === 'init'
            ? standByScreen : protectedRoutes}
          <ToastContainer
            position="bottom-right"
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
