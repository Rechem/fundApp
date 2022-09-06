import React, { useState } from 'react';
import InfoDetailRevenu from './info-detail-revenu';
import FormAjouterRevenu from './form-ajouter-revenu/form-ajouter-revenu';
import { CustomTextField } from '../../../theme';
import { Button, Typography, CircularProgress } from '@mui/material';
import { ArrowRight2 } from 'iconsax-react';
import classes from './detail-revenu.module.css'
import { isSimpleUser, isAdmin, statusArticleRevenu } from '../../../utils';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const DetailRevenu = props => {

    const [step, setStep] = useState('initial')

    const authenticationState = useSelector(state => state.login)

    const setAccepterStep = () => {
        setStep('accepter')
    }

    const setRefuserStep = () => {
        setStep('refuser')
    }

    const setModifierType = () => {
        setType('modifier')
    }

    const setIntialStep = () => {
        setStep('initial')
    }

    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState(props.type ? props.type : '')
    const [isLoading, setIsLoading] = useState(false)

    const onChangeMessage = e => {
        setError('')
        setMessage(e.target.value)
    }

    let formUI = null

    switch (type) {
        case 'ajouter':
            formUI = <FormAjouterRevenu
                projetId={props.projetId}
                afterSubmit={props.afterSubmit}
                onClose={props.onClose} />
            break;
        case 'modifier':
            formUI = <FormAjouterRevenu
                values={props.selectedItem}
                projetId={props.projetId}
                afterSubmit={props.afterSubmit}
                onClose={props.onClose} />
            break;
        case 'detail':
            formUI = <InfoDetailRevenu
                {...props.selectedItem} />
            break;
        default:
            formUI = <FormAjouterRevenu />
            break;
    }

    const submitEvaluation = async () => {
        let requestObject = {}
        switch (step) {
            case 'accepter':
                requestObject.etat = statusArticleRevenu.accepted
                break;
            case 'refuser':
                requestObject.etat = statusArticleRevenu.refused
                if (!message)
                    return setError('Vous devez indiquer le motif de refus')
                requestObject.message = message
                break;
            default:
                return toast.error('Etat invalide.')
        }

        setIsLoading(true)
        try {
            const response = await axios.patch(`/revenus/${props.selectedItem.projetId}/
            ${props.selectedItem.idRevenu}`,requestObject)
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
            {step === 'initial' && formUI}

            {
                step === 'accepter' &&
                <>
                    <Typography variant='subtitle2' fontWeight={700} mb='1.5rem'
                    >Accepter ce justificatif ?</Typography>
                    <Typography><i>Cette action est irréversible.</i></Typography>
                </>
            }

            {
                step === 'refuser' &&
                <>
                    <Typography variant='subtitle2' fontWeight={700} mb='1.5rem'
                    >Refuser ce justificatif ?</Typography>
                    <Typography variant='body2'>Veuillez indiquer le motif de refus:</Typography>
                    <CustomTextField
                        fullWidth
                        onChange={onChangeMessage}
                        value={message}
                        margin='none' size='small'
                        multiline rows={3}
                        {...(error && error !== ''
                            && { error: true, helperText: error })} />
                </>
            }

            {
                type === 'detail' &&
                <div className={classes.btnContainer}>
                    <Button sx={{ marginRight: 'auto' }}
                        onClick={props.onClose}
                    >
                        <Typography fontWeight={500} color='primary'
                            variant='body2'>
                            Fermer</Typography>
                    </Button>
                    {isSimpleUser(authenticationState) && props.selectedItem &&
                        props.selectedItem.etat === statusArticleRevenu.refused
                        &&
                        //switch to modifier
                        <>
                            < Button className={classes.btn}
                                onClick={setModifierType} variant='contained'
                            >
                                <Typography color='white' fontWeight={500}
                                    variant='body2'>
                                    Modifier
                                </Typography>
                            </Button>
                        </>
                    }
                    {isAdmin(authenticationState) && props.selectedItem &&
                        (props.selectedItem.etat === statusArticleRevenu.pending
                            || props.selectedItem.etat === statusArticleRevenu.refused)
                        &&
                        <div className={classes.subBtnContainer}>
                            {step === 'initial' &&
                                props.selectedItem.etat === statusArticleRevenu.pending
                                &&
                                <Button
                                    variant='outlined'
                                    onClick={setRefuserStep}
                                    endIcon={<ArrowRight2 />}
                                >
                                    <Typography fontWeight={500} color='primary'
                                        variant='body2'>Refuser</Typography>
                                </Button>
                            }
                            {step === 'initial' &&
                                (props.selectedItem.etat === statusArticleRevenu.pending
                                    || props.selectedItem.etat === statusArticleRevenu.refused)
                                &&
                                <Button className={classes.btn}
                                    variant='contained' onClick={setAccepterStep}
                                    endIcon={<ArrowRight2 color='white' />}
                                >
                                    <Typography color='white' fontWeight={500}
                                        variant='body2'>
                                        Accepter
                                    </Typography>
                                </Button>
                            }
                            {step !== 'initial' &&
                                <>
                                    <Button
                                        onClick={setIntialStep}
                                    >
                                        <Typography fontWeight={500} color='primary'
                                            variant='body2'>
                                            Retour</Typography>
                                    </Button>
                                    <Button className={classes.btn}
                                        variant='contained'
                                        onClick={submitEvaluation}
                                        disabled={isLoading}
                                        startIcon={isLoading ?
                                            <CircularProgress size='1rem' color='background' />
                                            : null}
                                    >
                                        <Typography color='white' fontWeight={500} variant='body2'>
                                            {step === 'accepter' ? 'Accepter' : 'Refuser'}
                                        </Typography>
                                    </Button>
                                </>
                            }

                        </div>
                    }

                </div>
            }
        </div>
    )
}
export default DetailRevenu;