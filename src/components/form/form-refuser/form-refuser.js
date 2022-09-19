import React, { useState } from 'react';
import { Typography, Button, CircularProgress } from '@mui/material';
import classes from './form-refuser.module.css'
import { CustomTextField } from '../../../theme';
import axios from 'axios';
import { statusDemande } from '../../../utils';
import { toast } from 'react-toastify';

const FormRefuser = props => {

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const onChangeMessage = e => {
        setError('')
        setMessage(e.target.value)
    }

    const refuserDemande = async () => {
        if (!message)
            return setError('Vous devez indiquer le motif de refus')
        setIsLoading(true)
        try {
            await axios.patch(
                `/demandes`,
                {
                    idDemande: props.idDemande,
                    etat: statusDemande.refused,
                    message
                })
            setIsLoading(false)
            props.onClose()
            props.afterSubmit()
        } catch (e) {
            toast.error(e.response.data.message)
            setIsLoading(false)
        }
    }

    return (
        <div className={classes.container}>
            <div style={{ marginBottom: '1rem' }}>
                <Typography variant='body1' fontWeight={700} >
                    Refuser
                </Typography>
            </div>
            <Typography variant='body2'>
                Message
            </Typography>
            <CustomTextField
                onChange={onChangeMessage}
                value={message}
                className={classes.field}
                margin='none' size='small'
                multiline rows={3}
                {...(error && error !== ''
                    && { error: true, helperText: error })} />
            <div className={classes.btnContainer}>
                <Button className={classes.btn}
                    onClick={props.onClose}
                >
                    <Typography fontWeight={400} color='primary'
                        variant='body1'>Annuler</Typography>
                </Button>
                <Button className={classes.btn}
                    variant='contained'
                    onClick={refuserDemande}
                    disabled={isLoading}
                                    startIcon={isLoading ?
                                        <CircularProgress size='1rem' color='background' />
                                        : null}
                >
                    <Typography color='white' fontWeight={500}
                        variant='body1'>Envoyer</Typography>
                </Button>
            </div>
        </div >
    );
};

export default FormRefuser;