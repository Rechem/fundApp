import { Button, Typography, CircularProgress, Box, useTheme } from '@mui/material';
import { CustomTextField, CustomCheckBox } from '../../theme';
import classes from './login.module.css'
import React, { useEffect, useState } from 'react';
import ErrorDisplay from '../../components/error-display/error-display';
import { useSelector, useDispatch } from 'react-redux'
import { signIn } from '../../store/loginSlice/reducer';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialValues = {
    email: '',
    password: '',
    // stayLoggedIn: false,
}

const Login = () => {

    const theme = useTheme()

    const { state } = useLocation();

    const dispatch = useDispatch()
    const authenticationState = useSelector(state => state.login)

    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})

    const onChangeHandler = e => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
        setErrors({ ...errors, [name]: '' })
    }

    const validateForm = () => {
        let temp = {}
        temp.email = (/\S+@\S+\.\S+/).test(values.email) ? '' : 'Email invalide'
        temp.password = (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).test(values.password) ?
            '' : 'Le mot de passe doit contenir au moins 8 caractères numériques et alphabétiques'
        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const submitSignInForm = async (e) => {
        e?.preventDefault()
        if (validateForm()) {
            dispatch(signIn({
                email: values.email,
                password: values.password,
                // stayLoggedIn: values.stayLoggedIn,
            }))
        }
    }

    useEffect(() => {
        if (state === 'succes')
            toast.success('Succès')
        else if (state === 'fail')
            toast.error('Une erreur est survenu')
    }, [state])

    return (
        <React.Fragment>
            <div className={classes.container}>
                <form onSubmit={submitSignInForm}>
                    <Typography variant='h3' fontWeight={700}
                        className={classes.hdr}>
                        Se connecter
                    </Typography>

                    {authenticationState.error !== '' &&
                        <ErrorDisplay>
                            {authenticationState.error}
                        </ErrorDisplay>}

                    <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                        Email
                    </Typography>

                    <CustomTextField
                        name='email'
                        id='email-field-login'
                        className={classes.field}
                        size='small' margin='none'
                        type='email' onChange={onChangeHandler}
                        value={values.email}
                        {...(errors.email && errors.email !== '' && { error: true, helperText: errors.email })}
                    >
                    </CustomTextField>

                    <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                        Mot de passe
                    </Typography>

                    <CustomTextField className={classes.field}
                        name='password'
                        id='password-field-login'
                        type='password'
                        size='small' margin='none'
                        onChange={onChangeHandler}
                        value={values.password}
                        {...(errors.password && errors.password !== '' && { error: true, helperText: errors.password })}>
                    </CustomTextField>
                    <Button variant='contained' className={classes.btn} onClick={submitSignInForm}
                        disabled={authenticationState.status === 'loading'}
                        startIcon={authenticationState.status === 'loading' ? <CircularProgress size="1rem"
                            color='background' /> : null}>
                        <Typography color='white' fontWeight={600} >Se connecter</Typography>
                    </Button>
                </form>
                <Box component={Link}
                    to={'/inscription'}
                    sx={{
                        color: theme.palette.primary.main,
                        marginTop : '1rem',
                        display: 'block'
                    }}>S'inscrir</Box>
            </div >
        </React.Fragment>
    );
};

export default Login;