import React, { useEffect, useState, useRef } from 'react';
import { CustomTextField } from '../../theme';
import classes from './form-investissement-charge.module.css'
import {
    Button, Typography, Box, Autocomplete, FormControl, FormControlLabel,
    Radio, RadioGroup, CircularProgress, Grid, FormHelperText,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const initialValues = {
    description: '',
    montant: '',
    quantite: '',
    lien: '',
}

const FormInvestissement = props => {

    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})

    const [type, setType] = useState(null)
    const [openType, setOpenType] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [types, setTypes] = useState([])

    const [radio, setRadio] = useState('facture');

    const handleChangeRadio = (event) => {
        setRadio(event.target.value);
    };

    const onChangeTypeHandler = newValue => {
        setType(newValue)
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

    const inputFile = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(null);

    const onClickUpload = () => {
        inputFile.current.click();
        setErrors({ ...errors, lien: '' })
    };

    const fileUploadHandler = (event) => {
        setSelectedFile(event.target.files[0])
        setSelectedFileName(event.target.files[0].name)
    }

    const validate = () => {
        let temp = {}

        temp.type = type === null ? 'Vous devez choisir un type' : ''
        if (values.description === '' && type && type.nomType === 'Autres') {
            temp.description = 'Vous devez fournir une description lorsqu\'il s\'agit du type "Autre"'
        } else
            temp.description = ''

        temp.montant = values.montant === '' ? 'Vous devez entrer le montant unitaire' : ''
        temp.quantite = values.quantite === '' ? 'Vous devez entrer la quantité' : ''
        temp.lien = selectedFile === null && values.lien === '' ?
            'Vous devez fournir une facture (devi) ou un lien vers un plan de paiement' : ''

        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const submit = async e => {
        e.preventDefault()
        if (validate()) {
            try {
                let response
                if (props.values) {
                    // await axios.patch('/membres', { ...values, idMembre: props.membre.idMembre })
                } else {
                    const formData = new FormData()
                    if (props.type === 'investissement')
                        formData.append('idType', type.idTypeInvestissement)
                    else
                        formData.append('idType', type.idTypeChargeExterne)

                    formData.append('description', values.description)
                    formData.append('montantUnitaire', values.montant)
                    formData.append('quantite', values.quantite)
                    formData.append('lienOuFacture', radio)
                    formData.append('projetId', props.projetId)
                    formData.append('numeroTranche', props.numeroTranche)
                    formData.append('investissementOuCharge', props.type)
                    if (radio === 'lien')
                        formData.append('lien', values.lien)
                    else
                        formData.append('factureArticlePrevision', selectedFile)

                    response = await axios.post('/previsions/investissementsChargesExternes', formData)
                }
                toast.success(response.data.message)
                props.afterSubmit()
                props.onClose()
            } catch (e) {
                toast.error(e.response.data.message)
            }
        }
    }

    const fetchTypes = async () => {
        setIsLoading(true)
        try {
            let response
            if (props.type === 'investissement')
                response = await axios.get('/previsions/typesinvestissements')
            else
                response = await axios.get('/previsions/typeschargesexternes')

            setTypes(response.data.data.types)
        } catch (e) {
            toast.error(e.response.data.message)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (openType)
            fetchTypes();
    }, [openType])

    return (
        <div className={classes.container}>
            <form onSubmit={submit}>
                <Box sx={{ typography: 'subtitle2', fontWeight: 700, }}
                    className={classes.hdr}
                >Ajouter {props.type === 'investissement' ? 'un investissement' : 'une charge externe'}</Box>

                <Box sx={{
                    typography: 'body2',
                    fontWeight: 400,
                }}
                >Type</Box>

                <Autocomplete
                    noOptionsText='Aucun résultat'
                    open={openType}
                    onOpen={() => {
                        setOpenType(true);
                    }}
                    onClose={() => {
                        setOpenType(false);
                    }}
                    onChange={(_, value) => onChangeTypeHandler(value)}
                    value={type}
                    ListboxProps={{ style: { maxHeight: 160, overflow: 'auto' } }}
                    isOptionEqualToValue={(option, value) => {
                        return props.type === 'investissement' ?
                            option.idTypeInvestissement === value.idTypeInvestissement
                            : option.idTypeChargeExterne === value.idTypeChargeExterne
                    }}
                    getOptionLabel={(option) => option.nomType}
                    options={types}
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
                            {...(errors.type && errors.type !== ''
                                && { error: true, helperText: errors.type })}
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
                <Grid container columns={4} columnSpacing={1}
                    className={classes.field} mb={1}>
                    <Grid item xs={3}>
                        <Typography fontWeight={400}
                            variant='body2'>Montant unitaire</Typography>
                        <CustomTextField
                            fullWidth
                            name='montant'
                            id='montant-field'
                            size='small' margin='none'
                            type='number' onChange={onChangeHandler}
                            value={values.montant}
                            {...(errors.montant && errors.montant !== ''
                                && { error: true, helperText: errors.montant })}
                        >
                        </CustomTextField>
                    </Grid>
                    <Grid item xs={1}>
                        <Typography fontWeight={400}
                            variant='body2'>Quantité</Typography>
                        <CustomTextField
                            name='quantite'
                            id='quantite-field'
                            size='small' margin='none'
                            type='number' onChange={onChangeHandler}
                            value={values.quantite}
                            {...(errors.quantite && errors.quantite !== ''
                                && { error: true, helperText: errors.quantite })}
                        >
                        </CustomTextField>
                    </Grid>
                </Grid>
                {
                    values.montant && values.quantite &&
                    <Box sx={{
                        typography: 'body2', fontWeight: 400,
                        my: '0.5rem', display: 'flex', justifyContent: 'center'
                    }} >
                        Total: {Number(values.montant * values.quantite)} DZD
                    </Box>
                }
                <div>
                    <FormControl>
                        <RadioGroup
                            row
                            name="controlled-radio-buttons-group"
                            value={radio}
                            onChange={handleChangeRadio}
                        >
                            <FormControlLabel value="facture" control={<Radio />} label="Facture" />
                            <FormControlLabel value="lien" control={<Radio />} label="Lien" />
                        </RadioGroup>
                    </FormControl>
                </div>
                {radio === 'lien' &&
                    <CustomTextField
                        placeholder='http://www.example.com/'
                        name='lien'
                        id='lien-field'
                        fullWidth
                        size='small' margin='none'
                        type='url' onChange={onChangeHandler}
                        value={values.lien}
                    >
                    </CustomTextField>
                }
                {radio === 'facture' &&
                    <FormControl fullWidth
                        error={errors.rapport !== ''}>
                        <div className={classes.fileBtnContainer}>
                            <Button
                                onClick={onClickUpload}
                                className={classes.filebtn} variant='outlined'>
                                <input type='file' accept='.pdf,.doc,.docx'
                                    onChange={fileUploadHandler}
                                    style={{ display: 'none' }}
                                    id='file' ref={inputFile} />
                                {selectedFile ? 'Remplacer' : 'Ajouter'}
                            </Button>
                            {selectedFile &&
                                <Typography variant='body2'
                                    style={{
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                    }}
                                    noWrap>
                                    {selectedFileName}
                                </Typography>}
                        </div>
                    </FormControl>}
                {errors.lien !== '' &&
                    <div>
                        <FormControl error={errors.lien !== ''}>
                            <FormHelperText>
                                {errors.lien}
                            </FormHelperText>
                        </FormControl>
                    </div>}
                <div className={classes.btnContainer}>
                    <Button className={classes.btn}
                        onClick={props.onClose}
                    >
                        <Typography fontWeight={400} color='primary'
                            variant='body2'>Annuler</Typography>
                    </Button>
                    <Button className={classes.btn}
                        type='submit' variant='contained'
                    >
                        <Typography color='white' fontWeight={400}
                            variant='body2'>
                            {props.membre ? 'Sauvgarder' : 'Ajouter'}
                        </Typography>
                    </Button>
                </div>
            </form>
        </div >
    );
};

export default FormInvestissement;