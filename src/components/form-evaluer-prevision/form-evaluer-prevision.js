import React, { useState } from 'react';
import { Typography, Button, Box, CircularProgress } from '@mui/material';
import classes from './form-evaluer-prevision.module.css'
import { ArrowRight2, } from 'iconsax-react';
import { CustomTextField, } from '../../theme';
import axios from 'axios';
import { statusPrevision } from '../../utils';
import { toast } from 'react-toastify';

const FormEvaluerPrevision = props => {

    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const onChangeMessage = e => {
        setError('')
        setMessage(e.target.value)
    }

    const [error, setError] = useState('')

    const [step, setStep] = useState('initial');

    const setAccepterStep = () => {
        setStep('accepter')
    }

    const setRefuserStep = () => {
        setStep('refuser')
    }

    const setIntialStep = () => {
        setStep('initial')
    }

    const submitEvaluation = async () => {
        let requestObject = {}
        switch (step) {
            case 'accepter':
                requestObject.etat = statusPrevision.accepted
                break;
            case 'refuser':
                requestObject.etat = statusPrevision.refused
                break;
            default:
                return toast.error('Etat invalide.')
        }

        if (requestObject.etat === statusPrevision.refused && !message) {
            return setError('Vous devez indiquer le motif de refus')
        }
        setIsLoading(true)
        try {
            const response = await axios.patch(`/previsions/${props.projetId}/${props.numeroTranche}`,
                requestObject)
            setIsLoading(false)
            toast.success(response.data.message)
            props.afterSubmit()
            props.onClose()
        } catch (e) {
            toast.error(e.response.data.message)
            setIsLoading(false)
        }

    }

    return (
        <div className={classes.container}>
            <Box sx={{ typography: 'subtitle2', fontWeight: 600, }}
                className={classes.hdr}
            >{step === 'initial' ? 'Evaluer cette prévision' :
                step === 'accepter' ? 'Accepter cette prévision ?' :
                    'Refuser cette prévision ?'}</Box>
            <Box >{step === 'initial' ?
                <span>N'accepter qu'après avoir consulter tous les articles présents dans
                    les différents onglets investissements, salaires et charges externes.<br /><br />
                    Refuser en cas d'inconformité.</span> :
                step === 'accepter' ?
                    <>
                        <Typography>Startup: <strong>{props.nom}</strong></Typography>
                        <Typography>Tranche: <strong>{props.numeroTranche}</strong></Typography>
                        <Typography>Valeur: <strong>{props.valeur} DZD</strong></Typography>
                    </> :
                    <Typography variant='body2'>Veuillez indiquer le motif de refus:</Typography>
            }</Box>
            {step === 'refuser' &&
                <CustomTextField
                    fullWidth
                    onChange={onChangeMessage}
                    value={message}
                    className={classes.field}
                    margin='none' size='small'
                    multiline rows={3}
                    {...(error && error !== ''
                        && { error: true, helperText: error })} />}
            {step !== 'initial' && <Typography><br /><i>Cette action est irréversible.</i></Typography>}
            <div className={classes.btnContainer}>
                <Button
                    onClick={props.onClose}
                >
                    <Typography fontWeight={400} color='primary'
                        variant='body2'>
                        Annuler</Typography>
                </Button>
                <div className={classes.subBtnContainer}>
                    {step !== 'initial' &&
                        <Button
                            onClick={setIntialStep}
                        >
                            <Typography fontWeight={400} color='primary'
                                variant='body2'>
                                Retour</Typography>
                        </Button>
                    }
                    {step === 'initial' &&
                        <Button
                            variant='outlined'
                            onClick={setRefuserStep}
                            endIcon={<ArrowRight2 />}
                        >
                            <Typography fontWeight={400} color='primary'
                                variant='body2'>Refuser</Typography>
                        </Button>
                    }
                    {step === 'initial' &&
                        <Button className={classes.btn}
                            variant='contained' onClick={setAccepterStep}
                            endIcon={<ArrowRight2 color='white' />}
                        >
                            <Typography color='white' fontWeight={400}
                                variant='body2'>
                                Accepter
                            </Typography>
                        </Button>
                    }
                    {step !== 'initial' &&
                        <Button className={classes.btn}
                            variant='contained'
                            onClick={submitEvaluation}
                            disabled={isLoading}
                            startIcon={isLoading ?
                                <CircularProgress size='1rem' color='background' />
                                : null}
                        >
                            <Typography color='white' fontWeight={400} variant='body2'>
                                {step === 'accepter' ? 'Accepter' : 'Refuser'}
                            </Typography>
                        </Button>}
                </div>
            </div>
        </div>
    );
};

export default FormEvaluerPrevision;