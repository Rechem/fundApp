import {
    Typography, useTheme, Button,
    MenuItem, FormHelperText, FormControl,
    CircularProgress
} from '@mui/material';
import React, { useState } from 'react';
import { CustomTextField } from '../../../theme';
import classes from './new-message.module.css'
import { useNavigate } from 'react-router-dom';
import { CustomSelect } from '../../../theme';
import { motifTicket } from '../../../utils';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialValue = { motif: '', objet: '', body: '' }

const NewMessage = () => {

    const authenticationState = useSelector(state => state.login)

    const navigate = useNavigate()

    const theme = useTheme()

    const [values, setValues] = useState(initialValue)
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

    const validate = () => {
        let temp = {}

        temp.motif = values.motif === '' ? 'Vous devez spécifier le motif' : ''
        temp.objet = values.objet === '' ? 'Vous devez spécifier l\' objet' : ''
        temp.body = values.body === '' ? 'Le corp ne doit pas être vide' : ''

        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const submit = async e => {
        e.preventDefault()
        if (validate()) {

            const requestObject = {
                userId: authenticationState.user.idUser,
                motif: values.motif,
                objet: values.objet,
                contenu: values.body,
            }

            setIsLoading(true)
            try {
                await axios.post('/tickets', requestObject)
            } catch (e) {
                toast.error(e.response.data.message)
            }
            setIsLoading(false)
        }
    }

    return (
        <>
            <Typography
                variant='h3' className={classes.hdr}>
                Nouveau message
            </Typography>
            <div className={classes.container}>
                <form className={classes.form} onSubmit={submit}>
                    <Typography variant='body2'
                    > Motif</Typography>
                    <FormControl fullWidth size='small' margin='none'
                        className={classes.field}
                        error={errors.motif != null && errors.motif !== ''}>
                        <CustomSelect
                            name='motif'
                            fullWidth
                            placeholder="Choisir un motif"
                            value={values.motif}
                            size='small'
                            onChange={onChangeHandler}>
                            <MenuItem value={motifTicket.rdv}>
                                {motifTicket.rdv}
                            </MenuItem>
                            <MenuItem value={motifTicket.renseignement}>
                                {motifTicket.renseignement}
                            </MenuItem>
                            <MenuItem value={motifTicket.reclamation}>
                                {motifTicket.reclamation}
                            </MenuItem>
                            <MenuItem value={motifTicket.autre}>
                                {motifTicket.autre}
                            </MenuItem>
                        </CustomSelect>
                        {errors.motif && errors.motif !== ''
                            && <FormHelperText>{errors.motif}</FormHelperText>}
                    </FormControl>
                    <Typography variant='body2'
                    > Objet</Typography>
                    <CustomTextField
                        name='objet'
                        id='objety-id'
                        className={classes.field}
                        size='small' margin='none'
                        value={values.objet}
                        type='text' onChange={onChangeHandler}
                        {...(errors.objet && errors.objet !== ''
                            && { error: true, helperText: errors.objet })} />
                    <Typography variant='body2'
                    >Message</Typography>
                    <CustomTextField
                        name='body'
                        id='body-id'
                        className={classes.field}
                        size='small' margin='none'
                        multiline rows={6}
                        value={values.body}
                        type='text' onChange={onChangeHandler}
                        {...(errors.body && errors.body !== ''
                            && { error: true, helperText: errors.body })} />
                    <div className={classes.btnContainer}>
                        <Button variant='outlined' className={classes.btn}
                            onClick={() => navigate(-1)}>
                            <Typography color='primary'>Retour</Typography>
                        </Button>
                        <Button variant='contained'
                            className={classes.btn}
                            onClick={submit}
                            disabled={isLoading}
                            startIcon={isLoading ?
                                <CircularProgress size='1rem' color='background' />
                                : null}>
                            <Typography color='white' fontWeight={500}
                            >Envoyer</Typography>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default NewMessage;