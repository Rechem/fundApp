import React, { useState, useRef } from 'react';
import classes from './form-ajouter-revenu.module.css'
import axios from 'axios';
import {
    Typography, Grid, Radio, RadioGroup, Button,
    FormControl, FormHelperText, FormControlLabel, CircularProgress
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Calendar1 } from 'iconsax-react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { CustomTextField } from '../../../../theme';
import { toast } from 'react-toastify';
import { statusArticleRevenu } from '../../../../utils';

const initialValues = {
    description: '',
    dateDebut: null,
    dateFin: null,
    montant: '',
    lien: '',
}

const FormAjouterRevenu = props => {

    const [values, setValues] = useState(props.values ? props.values : initialValues)
    const [errors, setErrors] = useState({})

    const [isLoading, setIsLoading] = useState(false);

    const [radio, setRadio] = useState(props.values && props.values.lien ? 'lien' : 'facture');

    const onChangeDateDebutHandler = newValue => {
        setValues({
            ...values,
            dateDebut: newValue
        })
        setErrors({ ...errors, dateDebut: '' })
    }

    const onChangeDateFinHandler = newValue => {
        setValues({
            ...values,
            dateFin: newValue
        })
        setErrors({ ...errors, dateFin: '' })
    }

    const handleChangeRadio = (event) => {
        setRadio(event.target.value);
    };

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

        temp.description = values.description === '' ? 'Vous devez fournir une description' : ''
        temp.dateDebut = values.dateDebut === '' ? 'Vous devez entrer la date debut' : ''
        temp.dateFin = values.dateFin === '' ? 'Vous devez entrer la date fin' : ''
        temp.montant = values.montant === '' ? 'Vous devez entrer le montant' : ''
        temp.datesInvalid = values.dateFin < values.dateDebut ?
            'La date fin ne peut pas précéder la date début' :
            ''
        temp.lien = (radio === 'facture' && (selectedFile === null && (props.values && !props.values.facture)))
            || (radio === 'lien' && values.lien === '') ?
            'Vous devez fournir une facture ou un lien vers un paiement' : ''

        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const submit = async e => {
        e.preventDefault()
        if (validate()) {
            setIsLoading(true)
            try {

                let response;

                const formData = new FormData();

                formData.append('projetId', props.projetId)
                formData.append('dateDebut', values.dateDebut)
                formData.append('dateFin', values.dateFin)
                formData.append('description', values.description)
                formData.append('montant', values.montant)
                formData.append('lienOuFacture', radio)
                if (radio === 'lien')
                    formData.append('lien', values.lien)
                else {
                    if (selectedFile) {
                        formData.append('factureArticleRevenu', selectedFile)
                    }
                }

                if (props.values) {
                    formData.append('etat', statusArticleRevenu.pending)
                    response = await axios.patch(`/revenus/${props.projetId}/${props.values.idRevenu}`, formData,)
                } else
                    response = await axios.post(`/revenus`, formData)
                toast.success(response.data.message)
                props.afterSubmit()
                props.onClose()
            } catch (e) {
                toast.error(e.response.data.message)
            }
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={submit}>
            <Typography variant='subtitle2' fontWeight={700}
                className={classes.hdr}
            >{props.values ? 'Modifier un revenu' : 'Ajouter un revenu'}</Typography>
            <Typography variant='body2'
                fontWeight={400}
            >Montant</Typography>
            <CustomTextField
                style={{ marginBottom: '1rem' }}
                fullWidth
                name='montant'
                id='montant-field'
                className={classes.field}
                size='small' margin='none'
                type='number' onChange={onChangeHandler}
                value={values.montant}
                {...(errors.montant && errors.montant !== ''
                    && { error: true, helperText: errors.montant })}
            ></CustomTextField>
            <Grid container columns={12} columnSpacing='1rem' mb='1rem'>
                <Grid item xs={6}>
                    <Typography variant='body2'
                        fontWeight={400}
                    >Date début</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DatePicker
                            inputFormat='DD/MM/YYYY'
                            disableFuture
                            value={values.dateDebut}
                            onChange={onChangeDateDebutHandler}
                            components={{
                                OpenPickerIcon: () => <Calendar1 variant='Outline' />
                            }}
                            renderInput={(params) => <CustomTextField fullWidth
                                size='small' margin='none' {...params}
                                inputProps={{
                                    ...params.inputProps,
                                    placeholder: ''
                                }}
                                value={values.dateDebut}
                                {...(errors.dateDebut && errors.dateDebut !== ''
                                    && { error: true, helperText: errors.dateDebut })} />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant='body2'
                        fontWeight={400}
                    >Date fin</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DatePicker
                            inputFormat='DD/MM/YYYY'
                            disableFuture
                            value={values.dateFin}
                            onChange={onChangeDateFinHandler}
                            components={{
                                OpenPickerIcon: () => <Calendar1 variant='Outline' />
                            }}
                            renderInput={(params) => <CustomTextField className={classes.field}
                                size='small' margin='none' {...params}
                                inputProps={{
                                    ...params.inputProps,
                                    placeholder: ''
                                }}
                                value={values.dateFin}
                                {...(errors.dateFin && errors.dateFin !== ''
                                    && { error: true, helperText: errors.dateFin })} />}
                        />
                    </LocalizationProvider>
                </Grid>
                {errors.datesInvalid && errors.datesInvalid !== '' &&
                    <Grid item xs={12}>
                        <FormControl error={errors.datesInvalid !== ''}>
                            <FormHelperText>
                                {errors.datesInvalid}
                            </FormHelperText>
                        </FormControl>
                    </Grid>}
            </Grid>

            <Typography variant='body2'
                fontWeight={400}
            >Description</Typography>
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
            <FormControl>
                <RadioGroup
                    row
                    name="controlled-radio-buttons-group"
                    value={radio}
                    onChange={handleChangeRadio}
                >
                    <FormControlLabel value="facture" control={<Radio />}
                        label={<Typography variant='body2'>Facture</Typography>} />
                    <FormControlLabel value="lien" control={<Radio />}
                        label={<Typography variant='body2'>Lien</Typography>} />
                </RadioGroup>
            </FormControl>
            {radio === 'lien' &&
                <CustomTextField
                    placeholder='http://www.example.com/'
                    name='lien'
                    id='lien-field'
                    fullWidth
                    size='small' margin='none'
                    type='url' onChange={onChangeHandler}
                    value={values.lien || ''}
                >
                </CustomTextField>
            }
            {radio === 'facture' &&
                <div className={classes.fileBtnContainer}>
                    {!selectedFile && props.values && props.values.facture &&
                        <Typography component='a'
                            target='_blank' mr='1rem'
                            href={`${process.env.REACT_APP_BASE_URL}${props.values.facture}`}
                            color='primary'
                        >Voir</Typography>}
                    <Button
                        onClick={onClickUpload}
                        className={classes.filebtn} variant='outlined'>
                        <input type='file' accept='.pdf,.doc,.docx'
                            onChange={fileUploadHandler}
                            style={{ display: 'none' }}
                            id='file' ref={inputFile} />
                        {selectedFile || (props.values && props.values.facture) ?
                            'Remplacer' : 'Ajouter'}
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
                </div>}
            {errors.lien && errors.lien !== '' &&
                <FormControl error={errors.lien !== ''}>
                    <FormHelperText>
                        {errors.lien}
                    </FormHelperText>
                </FormControl>}
            <div className={classes.btnContainer}>
                <Button className={classes.btn}
                    onClick={props.onClose}
                >
                    <Typography fontWeight={400} color='primary'
                        variant='body2'>Fermer</Typography>
                </Button>
                <Button className={classes.btn}
                    type='submit' variant='contained'
                    disabled={isLoading}
                    startIcon={isLoading ?
                        <CircularProgress size='1rem' color='background' />
                        : null}>
                    <Typography color='white' fontWeight={400}
                        variant='body2'>
                        {props.values ? 'Sauvgarder' : 'Ajouter'}
                    </Typography>
                </Button>
            </div>
        </form>
    );
};

export default FormAjouterRevenu;