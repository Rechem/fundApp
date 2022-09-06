import React, { useState } from 'react';
import classes from './form-montant.module.css'
import { CustomTextField } from '../../../theme';
import { Button, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const FormMontant = props => {

    const [step, setStep] = useState(0)

    const [montant, setMontant] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [error, setError] = useState('')

    const onChangeHandler = e => {
        const { name, value } = e.target
        setMontant(value)
        setError('')
    }

    const nextStep = () => {
        setStep(step => step + 1)
    }

    const previousStep = () => {
        setStep(step => step - 1)
    }

    const validate = () => {

        let temp = Number(montant) < 1000 ? 'Le montant doit être supérieur à 1000DZD' : ''

        setError(temp)
        return temp === ''
    }

    const submit = async e => {

        e.preventDefault()

        if (step === 0) {
            if (validate())
                nextStep()
        } else {
            setIsLoading(true)
            try {
                await axios.patch(`/projets/${props.idProjet}`, {montant})
                setIsLoading(false)
                toast.success('Succès')
                props.onClose()
                props.afterSubmit()
            } catch (e) {
                setIsLoading(false)
                toast.error(e.response.data.message)
            }
        }
    }

    return (
        <div className={classes.container}>
            <form onSubmit={submit}>
                <div className={classes.hdr}>
                    <Box sx={{ typography: 'subtitle2', fontWeight: 700, display:'inline' }}
                        mr={1}>
                        Entrer le montant accordé
                    </Box>
                    {isLoading && <CircularProgress size='1rem' />}
                </div>
                {step === 0 ?
                    <>
                        <Box sx={{ typography: 'body2' }}>
                            Montant
                        </Box>
                        <CustomTextField
                            name='montant'
                            id='montant-field'
                            className={classes.field}
                            size='small' margin='none'
                            type='number' onChange={onChangeHandler}
                            value={montant}
                            {...(error && error !== ''
                                && { error: true, helperText: error })} />
                    </>
                    :
                    <Box>Accorder le montant de {montant}DZD à {props.nomProjet} ?</Box>}
                <div className={classes.btnContainer}>
                    <Button onClick={step > 0 ? previousStep : props.onClose}
                        variant='text'>{step > 0 ? 'Retour' : 'Annuler'}</Button>
                    <Button type='submit' variant='contained' disabled={isLoading}>
                        <Box sx={{ typography: 'body2', color: 'white' }}>
                            {step === 0 ? 'Suivant' : 'Confirmer'}
                        </Box>
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FormMontant;