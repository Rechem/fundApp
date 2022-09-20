import React, { useEffect, useState, useRef } from 'react';
import { CustomTextField } from '../../../theme';
import classes from './form-salaire.module.css'
import {
    Button, Typography, Box, Autocomplete, FormControl, FormControlLabel,
    Radio, RadioGroup, CircularProgress, Grid, FormHelperText,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const initialValues = {
    description: '',
    salaireMensuel: '',
    nbMois: '',
    nbPersonne: '',
}

const FormSalaire = props => {

    const [values, setValues] = useState(props.values ? props.values : initialValues)
    const [errors, setErrors] = useState({})

    const [poste, setPoste] = useState(props.values ? props.values.type : null)
    const [openPoste, setOpenPoste] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const [postes, setPostes] = useState([])

    const onChangePosteHandler = newValue => {
        setPoste(newValue)
        setErrors({ ...errors, type: '' })
    }

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

        temp.poste = poste === null ? 'Vous devez choisir un poste' : ''
        if (values.description === '' && poste && poste.nomPoste === 'Autres') {
            temp.description = 'Vous devez fournir une description lorsqu\'il s\'agit du poste "Autre"'
        } else
            temp.description = ''

        temp.salaireMensuel = values.salaireMensuel === '' ? 'Vous devez entrer le salaire mensuel du poste' :
            values.salaireMensuel < 1000 ? 'Le salaire mensuel doit être supèrieur à 1000 DZD' : ''
        temp.nbMois = values.nbMois === '' ? 'Vous devez entrer le nombre de mois' : ''
        temp.nbPersonne = values.nbPersonne === '' ? 'Vous devez entrer le nombre de personnes' : ''
        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const submit = async e => {
        e.preventDefault()
        if (validate()) {
            setIsSubmitLoading(true)
            try {
                let response

                const requestObject = {
                    typePosteId: poste.idTypePoste,
                    description: values.description,
                    salaireMensuel: values.salaireMensuel,
                    nbMois: values.nbMois,
                    nbPersonne: values.nbPersonne,
                    projetId: props.projetId,
                    numeroTranche: props.numeroTranche,
                }
                if (props.values) {
                    requestObject.idSalaire = props.values.idSalaire
                    response = await axios.patch('/previsions/salaires', requestObject)
                } else {
                    response = await axios.post('/previsions/salaires', requestObject)
                }
                toast.success(response.data.message)
                props.afterSubmit()
                props.onClose()
            } catch (e) {
                toast.error(e.response.data.message)
            }

            setIsSubmitLoading(false)
        }
    }

    const fetchSalaires = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('/previsions/typespostes')
            setPostes(response.data.data.types)
        } catch (e) {
            toast.error(e.response.data.message)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (openPoste)
            fetchSalaires();
    }, [openPoste])

    return (
        <div className={classes.container}>
            <form onSubmit={submit}>
                <Box sx={{ typography: 'subtitle2', fontWeight: 700, }}
                    className={classes.hdr}
                >Ajouter un salaire</Box>

                <Box sx={{
                    typography: 'body2',
                    fontWeight: 400,
                }}
                >Poste</Box>

                <Autocomplete
                    noOptionsText='Aucun résultat'
                    open={openPoste}
                    onOpen={() => {
                        setOpenPoste(true);
                    }}
                    onClose={() => {
                        setOpenPoste(false);
                    }}
                    onChange={(_, value) => onChangePosteHandler(value)}
                    value={poste}
                    ListboxProps={{ style: { maxHeight: 160, overflow: 'auto' } }}
                    isOptionEqualToValue={(option, value) => option.idTypePoste === value.idTypePoste}
                    getOptionLabel={(option) => option.nomPoste}
                    options={postes}
                    loading={isLoading}
                    renderInput={(params) => (
                        <CustomTextField
                            style={{ marginBottom: '1rem' }}
                            className={classes.field}
                            {...params}
                            size='small' margin='none'
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                        <Box style={{ margin: '1rem' }} />
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                            {...(errors.poste && errors.poste !== ''
                                && { error: true, helperText: errors.poste })}
                        />
                    )}
                />

                <Box sx={{
                    typography: 'body2',
                    fontWeight: 400,
                }}
                >Description (optionelle)</Box>
                <CustomTextField
                    style={{ marginBottom: '1rem' }}
                    fullWidth
                    multiline
                    rows={3}
                    name='description'
                    id='description-field'
                    className={classes.field}
                    size='small' margin='none'
                    type='text' onChange={onChangeHandler}
                    value={values.description}
                    {...(errors.description && errors.description !== ''
                        && { error: true, helperText: errors.description })}
                >
                </CustomTextField>
                <Typography fontWeight={400}
                    variant='body2'>Salaire mensuel</Typography>
                <CustomTextField
                    style={{ marginBottom: '1rem' }}
                    fullWidth
                    name='salaireMensuel'
                    id='salaireMensuel-field'
                    size='small' margin='none'
                    type='number' onChange={onChangeHandler}
                    value={values.salaireMensuel}
                    {...(errors.salaireMensuel && errors.salaireMensuel !== ''
                        && { error: true, helperText: errors.salaireMensuel })}
                >
                </CustomTextField>
                <Grid container columns={4} columnSpacing={1}
                    className={classes.field} mb={1} alignItems='flex-end'>
                    <Grid item xs={2}>
                        <Typography fontWeight={400}
                            variant='body2'>Nombre de mois</Typography>
                        <CustomTextField
                            fullWidth
                            name='nbMois'
                            id='nbMois-field'
                            size='small' margin='none'
                            type='number' onChange={onChangeHandler}
                            value={values.nbMois}
                            {...(errors.nbMois && errors.nbMois !== ''
                                && { error: true, helperText: errors.nbMois })}
                        >
                        </CustomTextField>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography fontWeight={400}
                            variant='body2'>Nombre de personnes</Typography>
                        <CustomTextField
                            name='nbPersonne'
                            id='nbPersonne-field'
                            size='small' margin='none'
                            type='number' onChange={onChangeHandler}
                            value={values.nbPersonne}
                            {...(errors.nbPersonne && errors.nbPersonne !== ''
                                && { error: true, helperText: errors.nbPersonne })}
                        >
                        </CustomTextField>
                    </Grid>
                </Grid>
                {
                    values.salaireMensuel && values.nbMois && values.nbPersonne &&
                    <Box sx={{
                        typography: 'body2', fontWeight: 400,
                        my: '0.5rem', display: 'flex', justifyContent: 'center'
                    }} >
                        Total: {Number(values.salaireMensuel * values.nbMois * values.nbPersonne)} DZD
                    </Box>
                }
                <div className={classes.btnContainer}>
                    <Button className={classes.btn}
                        onClick={props.onClose}
                    >
                        <Typography fontWeight={400} color='primary'
                            variant='body2'>Annuler</Typography>
                    </Button>
                    <Button className={classes.btn}
                        type='submit' variant='contained'
                        disabled={isSubmitLoading}
                        startIcon={isSubmitLoading ?
                            <CircularProgress size='1rem' color='background' />
                            : null}
                    >
                        <Typography color='white' fontWeight={400}
                            variant='body2'>
                            {props.values ? 'Sauvgarder' : 'Ajouter'}
                        </Typography>
                    </Button>
                </div>
            </form>
        </div >
    );
};

export default FormSalaire;