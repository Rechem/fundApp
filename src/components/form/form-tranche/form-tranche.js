import React, { useState, useEffect } from 'react';
import classes from './form-tranche.module.css'
import {
    Box, CircularProgress, FormControl, Paper
    , useTheme, Button
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const FormTranche = props => {

    const [isLoading, setIsLoading] = useState(false)
    const [selectedOption, setOption] = useState(null)
    const [tranches, setTranches] = useState([])

    const fetchTranches = async () => {
        try {
            const response = await axios.get('/tranches')
            setTranches(response.data.data.tranches)
        } catch (e) {
            toast.error(e.response.data.message)
        }
    }

    const submitTranches = async () => {
        if (selectedOption) {
            setIsLoading(true)
            try {
                await axios.patch(`/projets/${props.idProjet}/tranche`, {
                    trancheId: selectedOption
                })
                setIsLoading(false)
                toast.success('Succès')
                props.afterSubmit()
                props.onClose()
            } catch (e) {
                setIsLoading(false)
                toast.error(e.response.data.message)
            }
        }
    }

    useEffect(() => {
        fetchTranches()
    }, [])

    return (
        <div className={classes.container}>
            <div className={classes.hdr}>
                <Box sx={{ typography: 'body1', fontWeight: 400, display: 'inline' }}
                    mr={1}>
                    Vous avez été accordé le montant de {props.montant}DZD,
                    veuillez à présent choisir sur combien de tranches voulez-vous
                    recevoir votre versement:
                </Box>
            </div>
            {tranches.length > 0 ?
                <FormControl className={classes.control}>
                    {tranches.map((t, i) => <TrancheItem key={t.idTranche} nbTranches={t.nbTranches}
                        pourcentage={t.pourcentage} selected={selectedOption === t.idTranche}
                        onClick={() => setOption(t.idTranche)} />)}
                </FormControl> : <CircularProgress style={{ display: 'block', margin: 'auto' }} />}
            <div className={classes.btnContainer}>
                <Button onClick={props.onClose}
                    variant='text'>Fermer</Button>
                <Button onClick={submitTranches} variant='contained'
                    startIcon={isLoading && selectedOption ?
                        <CircularProgress color='background' size='1rem' /> : null}
                    disabled={isLoading || !selectedOption}>
                    <Box sx={{ color: 'white' }}>
                        Confirmer
                    </Box>
                </Button>
            </div>
        </div>
    );
};

const TrancheItem = props => {

    const theme = useTheme()

    const textColor = theme.palette.text.main
    const primaryColor = theme.palette.primary.main

    return <Paper variant='outlined'
        style={{
            outline: props.selected ?
                `2px solid ${primaryColor}` :
                '1px solid rgba(0, 0, 0, 0.12)'
        }}
        onClick={props.onClick}
        className={classes.option}>
        <Box sx={{ typography: 'body2' }} mb={0.5}>
            {props.nbTranches} Tranches
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {props.pourcentage.map((p, i) => {
                return <div key={i} style={{ display: 'flex', flexFlow: 'row' }}>
                    <Box sx={{ typography: 'h3', color: textColor }}>
                        {p * 100}
                    </Box>
                    <Box sx={{ typography: 'body1', color: textColor, alignSelf: 'center' }}>
                        %
                    </Box>
                    {i < props.pourcentage.length - 1
                        && <div style={{ alignSelf: 'center', marginInline: '1rem', color: 'rgb(100,100,100)' }}>|</div>}
                </div>
            })}
        </Box>
    </Paper >
}

export default FormTranche;