import { ThemeProvider } from '@mui/system';
import theme from './theme'
import Login from './pages/login/login'
import Demandes from './pages/demandes/demandes';
import { StyledEngineProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
      <Router>
        <ThemeProvider theme={theme}>
          <StyledEngineProvider injectFirst>
            <Demandes />
            {/* <Login/> */}
          </StyledEngineProvider>
        </ThemeProvider>
      </Router>
  );
}

export default App;
