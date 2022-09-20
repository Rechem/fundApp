import classes from './form-reset-pw.module.css'
import React, { useState } from 'react';
import { Typography, Button, CircularProgress } from '@mui/material'
import axios from 'axios';
import { CustomTextField } from '../../../theme';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { isSimpleUser, } from '../../../utils';
import { useDispatch } from 'react-redux';
import { signOut } from '../../../store/loginSlice/reducer';

const initialValues = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
}

const FormResetPassword = props => {

    const dispatch = useDispatch()

    const authenticationState = useSelector(state => state.login)

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

        temp.oldPassword = authenticationState.user.idUser !== props.idUser || (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).test(values.oldPassword) ? ''
            : 'Le mot de passe doit contenir au moins 8 caractères numériques et alphabétiques'
        temp.newPassword = (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).test(values.newPassword) ?
            '' : 'Le mot de passe doit contenir au moins 8 caractères numériques et alphabétiques'
        temp.confirmPassword = values.newPassword !== values.confirmPassword ?
            'Mots de passe non identiques' : ''
        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const submit = async (e) => {
        e?.preventDefault()
        if (validateForm()) {
            setIsLoading(true)
            try {
                await axios.patch(
                    `/users/resetPassword/${props.idUser}`, {
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword,
                })
                toast.success('Succès')
                if (authenticationState.user.idUser === props.idUser)
                    dispatch(signOut())

                props.onClose()
            } catch (e) {
                toast.error(e.response.data.message)
            }
            setIsLoading(false)
        }
    }

    return (
        <div className={classes.container}>
            <form onSubmit={submit}>
                <Typography variant='subtitle2' fontWeight={700}
                    mb='2rem'
                >Réinitialiser le mot de passe</Typography>

                {authenticationState.user.idUser === props.idUser
                    &&
                    <><Typography variant='body2' fontWeight={400} className={classes.lbl}>
                        Mot de passe actuel
                    </Typography>

                        <CustomTextField className={classes.field}
                            name='oldPassword'
                            id='oldPassword-field-login'
                            type='password'
                            size='small' margin='none'
                            onChange={onChangeHandler}
                            value={values.oldPassword}
                            {...(errors.oldPassword && errors.oldPassword !== '' &&
                                { error: true, helperText: errors.oldPassword })}>
                        </CustomTextField>
                    </>}

                <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                    Nouveau mot de passe
                </Typography>

                <CustomTextField className={classes.field}
                    name='newPassword'
                    id='password-field-login'
                    type='password'
                    size='small' margin='none'
                    onChange={onChangeHandler}
                    value={values.newPassword}
                    {...(errors.newPassword && errors.newPassword !== '' &&
                        { error: true, helperText: errors.newPassword })}>
                </CustomTextField>

                <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                    Confirmer le nouveau mot de passe
                </Typography>

                <CustomTextField className={classes.field}
                    name='confirmPassword'
                    id='password-field-login'
                    type='password'
                    size='small' margin='none'
                    onChange={onChangeHandler}
                    value={values.confirmPassword}
                    {...(errors.confirmPassword && errors.confirmPassword !== '' &&
                        { error: true, helperText: errors.confirmPassword })}>
                </CustomTextField>

                <div className={classes.btnContainer}>
                    <Button className={classes.btn}
                        onClick={props.onClose}
                    >
                        <Typography fontWeight={400} color='primary'
                            variant='body2'>Annuler</Typography>
                    </Button>
                    <Button className={classes.btn}
                        type='submit' variant='contained'
                        disabled={isLoading}
                        startIcon={isLoading ?
                            <CircularProgress size='1rem' color='background' />
                            : null}
                    >
                        <Typography color='white' fontWeight={400}
                            variant='body2'>
                            Modifier
                        </Typography>
                    </Button>
                </div>
            </form>

        </div>
    );
};

export default FormResetPassword;