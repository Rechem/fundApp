import { createTheme } from '@mui/material/styles';
import { TextField, Checkbox, Select, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import { BpCheckedIcon, BpIcon } from './components-utils'

const tinycolor = require("tinycolor2");

let theme = createTheme({
    palette: {
        primary: {
            main: "#18a39f",
            light: tinycolor("#18a39f").lighten(5).toString(),
            dark: tinycolor("#18a39f").lighten(5).toString(),
            contrastText: "fff"
        },
        error: { main: "#ff4e3c" },
        success: { main: "#27ae60" },
        warning: { main: "#e67e22" },
        info: { main: "#3498db" },
        text: { main: "#424141" },
        background: { main: "#fff" },
    },
    typography: {
        htmlFontSize: 16,
        fontFamily: ["inter", "sans-serif"],
        body1: {
            fontSize: "1rem",
            color: "#424141"
        },
        body2: {
            fontSize: "0.875rem",
            color: "#424141"
        },
        subtitle1: {
            fontSize: "1.75rem",
            color: "#424141"
        },
        subtitle2: {
            fontSize: "1.3125rem",
            color: "#424141"
        },
        h2: {
            fontSize: "3.25rem",
            color: "#424141"
        },
        h3: {
            fontSize: "2.375rem",
            color: "#424141"
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
                root:{
                    textTransform: "none",
                },
                // outlined: {
                //     '&:hover': {
                //         backgroundColor: 'transparent',
                //         boxShadow: 'none',
                //         '@media (hover: none)': {
                //             boxShadow: 'none',
                //         },
                //     },
                //   },
                //   outlinedPrimary: {
                //     '&:hover': {
                //         backgroundColor: 'transparent',
                //         boxShadow: 'none',
                //         '@media (hover: none)': {
                //             boxShadow: 'none',
                //         },
                //     },
                //   },
                contained: {
                    textTransform: "none",
                    boxShadow: 'none',
                    '&:hover': {
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
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    marginRight: 0,
                    marginLeft: 0
                }
            }
        }
    },
});

export const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderWidth: 'thin',
            borderColor: theme.palette.text.primary,
        },
    },
    '& .MuiFormHelperText-root': {
        marginRight: 0,
        marginLeft: 0,
    },
    input: {
        '&::placeholder': {
            fontSize: theme.typography.body2.fontSize,
        },
    },
}));

export const CustomSelect = props =>
    <Select
        sx={{
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: 'thin',
                borderColor: theme.palette.text.primary,
            },
        }}
        {...props}
    />


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

export const CustomTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        textTransform: 'none',
        fontWeight: 500,
        fontSize: "1rem",
    }),
);
export default theme