import { Button, Typography } from '@mui/material';
import { CustomTextField, CustomCheckBox } from '../../theme';
import classes from './login.module.css'
import { useState } from 'react';

const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
}

const Login = () => {
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})

    const onChangeHandler = e => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
        setErrors({ ...errors, [name]: "" })
    }

    const validateForm = () => {
        let temp = {}
        temp.email = (/\S+@\S+\.\S+/).test(values.email) ? "" : "Email invalide"
        temp.password = (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).test(values.password) ?
            "" : "Le mot de passe doit contenir au moins 8 caractères numériques et alphabétiques"
        setErrors({ ...temp })
        return Object.values(temp).every(x => x === "")
    }

    const submitForm = (e) => {
        e.preventDefault()
        if (validateForm()) {
            console.log("Form is valid")
        }
    }

    return (
        <div className={classes.container}>
            <form onSubmit={submitForm}>

                <Typography variant='h3' fontWeight={700}
                    className={classes.hdr}>
                    Se connecter
                </Typography>

                <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                    Email
                </Typography>

                <CustomTextField
                    name='email'
                    id='email-field-login'
                    placeholder='example@example.example'
                    className={classes.field}
                    size='small' margin='none'
                    type='email' onChange={onChangeHandler}
                    value={values.email}
                    {...(errors.email && errors.email !== "" && { error: true, helperText: errors.email })}
                >
                </CustomTextField>

                <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                    Mot de passe
                </Typography>

                <CustomTextField className={classes.field}
                    name='password'
                    id='password-field-login'
                    placeholder='Mot de passe'
                    type='password'
                    size='small' margin='none'
                    onChange={onChangeHandler}
                    value={values.password}
                    {...(errors.password && errors.password !== "" && { error: true, helperText: errors.password })}>
                </CustomTextField>

                <span className={classes.chckbxcontainer}
                    onClick={() => onChangeHandler({ target: { name: 'rememberMe', value: !values.rememberMe } })}>
                    <CustomCheckBox className={classes.chckbx} size='small'
                        checked={values.rememberMe}></CustomCheckBox>
                    <Typography display='inline' marginLeft='0.5rem' variant='body2'>
                        Rester connecté
                    </Typography>
                </span>
                <Button variant='contained' className={classes.btn} onClick={submitForm}>
                    <Typography color='white' fontWeight={600} >Se connecter</Typography>
                </Button>
            </form>
        </div >
    );
};

export default Login;