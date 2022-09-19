import React, { useEffect, useState } from 'react';
import classes from './styles.module.css'
import { Typography, Button, CircularProgress } from '@mui/material'
import { CustomTextField } from '../../theme';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const initialValues = {
    password: '',
    confirmPassword: '',
}

const NewPassword = () => {

    const navigate = useNavigate()

    const { token } = useParams();

    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

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

        temp.password = (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).test(values.password) ?
            '' : 'Le mot de passe doit contenir au moins 8 caractères numériques et alphabétiques'
        temp.confirmPassword = values.password !== values.confirmPassword ?
            'Mots de passe non identiques' : ''

        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const resetPw = async (e) => {
        // setResponseError(null)
        e?.preventDefault()
        if (validateForm()) {
            setIsLoading(true)
            try {
                await axios.post(
                    `/users/resetPassword`, {
                    password: values.password,
                    token
                })
                navigate('/connexion', { state: 'succes' })
            } catch (e) {
                toast.error(e.response.data.message)
            }
            setIsLoading(false)
        }
    }

    const verifyToken = async () => {
        if (!token)
            navigate('/notfound')
        try {
            await axios.post(`/users/resetPassword`,
                { token })
        } catch (error) {
            navigate('/notfound')
        }
    }

    useEffect(() => {
        verifyToken()
    }, [])

    return (
        <div className={classes.container}>
            <form onSubmit={resetPw}>

                <Typography variant='subtitle2'
                    className={classes.hdr}>
                    Entrer votre nouveau mot de passe
                </Typography>

                <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                    Nouveau mot de passe
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

                <Button variant='contained' className={classes.btn} onClick={resetPw}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size="1rem"
                    color='background' /> : null}>
                    <Typography color='white' fontWeight={600} >Réinitialiser</Typography>
                </Button>
            </form>
        </div >
    );
};

export default NewPassword;