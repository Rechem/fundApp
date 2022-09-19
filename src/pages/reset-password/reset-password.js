import React, {useState} from 'react';
import classes from './styles.module.css'
import {Typography, Button, CircularProgress} from '@mui/material'
import { CustomTextField } from '../../theme';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialValues = {email : ''}

const ResetPassword = () => {

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
        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const submitSignInForm = async (e) => {
        e?.preventDefault()
        if (validateForm()) {
            setIsLoading(true)
            try {
                await axios.post('users/forgotPassword', {email : values.email})
                toast.success('Le lien de réinitialisation a été envoyé')
                setValues(initialValues)
            } catch (error) {
                toast.error(error.response.data.message)
            }
            setIsLoading(false)
        }
    }

    const [isLoading, setIsLoading] = useState(false)

    return (
        <div className={classes.container}>
                <form onSubmit={submitSignInForm}>
                    <Typography variant='subtitle2'
                        className={classes.hdr}>
                        Pour réinitialiser votre mot de passe, veuillez entrer l'email associé à votre compte
                    </Typography>

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
                    <Button variant='contained' className={classes.btn} onClick={submitSignInForm}
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size="1rem"
                            color='background' /> : null}>
                        <Typography color='white' fontWeight={600} >Envoyer le lien de réinitialisation</Typography>
                    </Button>
                </form>
            </div >
    );
};

export default ResetPassword;