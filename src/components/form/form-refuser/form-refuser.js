import React, { useState } from 'react';
import { Typography, Button, CircularProgress} from '@mui/material';
import classes from './form-refuser.module.css'
import { CustomTextField } from '../../../theme';
import axios from 'axios';
import { statusDemande } from '../../../utils';
import { toast } from 'react-toastify';

const FormRefuser = props => {

    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const onChangeMessage = e => {
        setMessage(e.target.value)
    }

    const refuserDemande = async () => {
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
            // console.log("error ?", e); TOAST IT
        }
    }

    return (
        <div className={classes.container}>
            <div>
                <Typography variant='body1' fontWeight={700}
                    marginBottom='1rem' display='inline'>
                    Refuser
                </Typography>
                {isLoading && <CircularProgress size='1rem' />}
            </div>
            <Typography variant='body1' fontWeight={700}
                marginBottom='0.5rem'>
                Message (optionel)
            </Typography>
            <CustomTextField
                onChange={onChangeMessage}
                value={message}
                className={classes.field}
                margin='none' size='small'
                multiline rows={3} />
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
                >
                    <Typography color='white' fontWeight={400}
                        variant='body1'>Enovyer</Typography>
                </Button>
            </div>
        </div >
    );
};

export default FormRefuser;