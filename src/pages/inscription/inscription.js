import { Button, Typography, FormHelperText, FormControl } from '@mui/material';
import { CustomTextField, CustomCheckBox } from '../../theme';
import classes from './inscription.module.css'
import React, { useState } from 'react';
import ErrorDisplay from '../../components/error-display/error-display';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { signUp } from '../../store/loginSlice/reducer';

const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    agreesToTos: false,
}

const Inscription = () => {

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
        temp.confirmPassword = values.password !== values.confirmPassword ?
            'Mots de passe non identiques' : ''
        temp.agreesToTos = !values.agreesToTos ? 'Vous devez accepter le contrat d\'utilisation' : ''

        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const submitSignUpForm = async (e) => {
        // setResponseError(null)
        e?.preventDefault()
        if (validateForm()) {
            console.log('Form is valid')
            dispatch(signUp({
                email: values.email,
                password: values.password,
            }))
        }
    }

    let redirect = null

    if (authenticationState.status === 'connected') {
        if (authenticationState.user.completedSignup) {
            redirect = <Navigate to="/mes-demandes" />
        } else {
            redirect = <Navigate to="/complete-signup" />
        }
    }

    return (
        <React.Fragment>
            {/* {redirect} */}
            <div className={classes.container}>
                <form onSubmit={submitSignUpForm}>

                    <Typography variant='h3' fontWeight={700}
                        className={classes.hdr}>
                        Inscription
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

                    <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                        Confirmer mot de passe
                    </Typography>

                    <CustomTextField className={classes.field}
                        name='confirmPassword'
                        id='password-field-login'
                        type='password'
                        size='small' margin='none'
                        onChange={onChangeHandler}
                        value={values.confirmPassword}
                        {...(errors.confirmPassword && errors.confirmPassword !== '' && { error: true, helperText: errors.confirmPassword })}>
                    </CustomTextField>
                    <FormControl error={errors.agreesToTos!=null && errors.agreesToTos !== ''}>
                        <span className={classes.chckbxcontainer}
                            onClick={() => onChangeHandler({ target: { name: 'agreesToTos', value: !values.agreesToTos } })}>
                            <CustomCheckBox className={classes.chckbx} size='small'
                                checked={values.agreesToTos}></CustomCheckBox>
                            <Typography display='inline' marginLeft='0.5rem' variant='body2'>
                                J'ai lu et j'accepte le contrat d'utilisation
                            </Typography>
                        </span>
                        {errors.agreesToTos && errors.agreesToTos !== ''
                            && <FormHelperText>{errors.agreesToTos}</FormHelperText>}
                    </FormControl>
                    <Button variant='contained' className={classes.btn} onClick={submitSignUpForm}>
                        <Typography color='white' fontWeight={600} >S'inscrire</Typography>
                    </Button>
                </form>
            </div >
        </React.Fragment>
    );
};

export default Inscription;