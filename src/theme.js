import { createTheme } from '@mui/material/styles';
import { TextField, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';
import {BpCheckedIcon, BpIcon} from './components-utils'

const tinycolor = require("tinycolor2");

let theme = createTheme({
    palette: {
        primary: { main: "#ff7373" },
        error: { main: "#ff4e3c" },
        success: { main: "#27ae60" },
        warning: { main: "#e67e22" },
        info: { main: "#3498db" },
        text: { main: "#424141" },
        background: { main: "#fff" },
    },
    typography: {
        fontFamily: ["inter", "sans-serif"],
        body1: {
            fontSize: "1rem",
            letterSpacing: '-0.02em'
            // color: theme.palette.text
        },
        body2: {
            fontSize: "0.75rem",
            // color: theme.palette.text
        },
        subtitle1: {
            fontSize: "1.75rem",
            // color: theme.palette.text
        },
        subtitle2: {
            fontSize: "1.3125rem",
            // color: theme.palette.text
        },
        h2: {
            fontSize: "3.25rem",
            // color: theme.palette.text
        },
        h3: {
            fontSize: "2.375rem",
            // color: theme.palette.text
        },
    },
})
theme = createTheme(theme, {
    components: {
        MuiButton: {
            defaultProps: {
                disableTouchRipple: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    textTransform: "none",
                    boxShadow: 'none',
                    '&:hover': {
                        backgroundColor: tinycolor(theme.palette.primary.main).lighten(5).toString(),
                        boxShadow: 'none',
                        '@media (hover: none)': {
                            boxShadow: 'none',
                        },
                    },
                    '&$focusVisible': {
                        boxShadow: 'none',
                    },
                    '&:active': {
                        boxShadow: 'none',
                    },
                    '&$disabled': {
                        boxShadow: 'none',
                    },
                },
            }
        },
    }
});

export const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderWidth:'thin',
        borderColor: theme.palette.text.primary,
      },
    },
    '& .MuiFormHelperText-root' :{
        marginRight: 0,
        marginLeft: 0,
    },
    input: {
        '&::placeholder': {
          fontSize : theme.typography.body2.fontSize,
        },
      },
  }));

export const CustomCheckBox = (props) =>
      <Checkbox
        sx={{
          '&:hover': { bgcolor: 'transparent' },
        }}
        disableRipple
        color="default"
        checkedIcon={<BpCheckedIcon />}
        icon={<BpIcon />}
        inputProps={{ 'aria-label': 'Checkbox demo' }}
        {...props}
      />

export default theme