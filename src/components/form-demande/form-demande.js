import React, { useState, useRef } from 'react';
import { Add } from 'iconsax-react';
import classes from './form-demande.module.css'
import { IconButton, Button, Typography, MenuItem, Grid, FormHelperText, FormControl }
    from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Calendar1 } from 'iconsax-react';
import { CustomTextField, CustomSelect } from '../../theme';
import { useTheme } from '@mui/system';
import ErrorDisplay from '../error-display/error-display';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Divider } from '@mui/material';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserDemandes } from '../../store/demandesSlice/reducer';

const steps = [
    'Information sur la société',
    'Business plan'
];

const initialValues = {
    denominationCommerciale: '',
    formeJuridique: '',
    nbEmploye: '',
    dateCreation: null,
    nif: '',
    nbLabel: '',
    montant: ''
}

const FormStepper = props => {
    const theme = useTheme()

    return (<Stepper activeStep={props.activeStep} alternativeLabel
        className={classes.stepper}>
        {steps.map((label) => (
            <Step key={label}
                sx={{
                    '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                    {
                        color: theme.palette.primary.main, // Just text label (ACTIVE)
                    },
                    '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                        fill: '#ffffff', // circle's number (ACTIVE)
                    },
                }}
            >
                <StepLabel
                >{label}</StepLabel>
            </Step>
        ))}
    </Stepper>)
}

const FromSteperHandler = props => {
    const childrenArray = React.Children.toArray(props.children);
    const [activeStep, setActiveStep] = useState(0)
    const currentChild = childrenArray[activeStep];

    const isLastStep = () => {
        return activeStep === childrenArray.length - 1;
    }

    const submitForm = e => {
        e?.preventDefault()
        if (isLastStep()) {
            if (props.validateSecondPage()) {
                console.log("Form is valiiiiiiiiid")
                props.submit()
            }
        } else {
            //this is possible because we only have 2 steps
            if (props.validateFirstPage())
                setActiveStep(activeStep + 1);
        }
    }

    return (<React.Fragment>
        <FormStepper activeStep={activeStep} />
        <Divider className={classes.dvdr} />
        <form onSubmit={submitForm} className={classes.subContainer}>
            <Grid container rowSpacing={1} columnSpacing={3}>
                {currentChild}
            </Grid>
            <div className={classes.btnContainer}>
                {activeStep > 0 ? (
                    <Button variant='contained' className={classes.btn} onClick={() => setActiveStep(activeStep - 1)}>
                        <Typography color='white' fontWeight={600} noWrap>
                            {'Retour'}
                        </Typography>
                    </Button>) : null}
                <Button variant='contained' className={classes.btn}
                    type='submit'>
                    <Typography color='white' fontWeight={600} noWrap>
                        {isLastStep() ? 'Envoyer' : 'Suivant'}
                    </Typography>
                </Button>
            </div>
        </form>
    </React.Fragment>)
}

const FormDemande = props => {

    const theme = useTheme()

    const dispatch = useDispatch()
    const authenticationState = useSelector(state => state.login)

    const inputFile = useRef(null)
    const [selectedFile, setSelectedFile] = useState('');
    const [selectedFileName, setSelectedFileName] = useState(null);
    const fileUploadHandler = (event) => {
        setSelectedFile(event.target.files[0])
        setSelectedFileName(event.target.files[0].name)
    }
    const onClickUpload = () => {
        inputFile.current.click();
        setErrors({ ...errors, selectedFile: '' })
    };

    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})
    const [responseError, setResponseError] = useState('')

    const onChangeDateHander = newValue => {
        setValues({
            ...values,
            dateCreation: newValue.format("DD-MM-YYYY")
        })
        setErrors({ ...errors, dateCreation: '' })
    }

    const onChangeHandler = e => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })

        setErrors({ ...errors, [name]: '' })
    }

    //im so sorry i swear next time ill user formik
    const validateFirstPage = () => {
        let temp = {}

        temp.denominationCommerciale = values.denominationCommerciale === '' ? 'Vous devez entrer une valeur' : ''
        temp.formeJuridique = values.formeJuridique === '' ? 'Vous devez choisir une valeur' : ''
        temp.nbEmploye = values.nbEmploye === '' ? 'Vous devez entrer une valeur' : ''
        temp.dateCreation = values.dateCreation == null ? 'Vous devez choisir une valeur' : ''
        temp.nif = values.nif === '' ? 'Vous devez entrer une valeur' : ''
        temp.nbLabel = values.nbLabel === '' ? 'Vous devez entrer une valeur' : ''

        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const validateSecondPage = () => {
        let temp = {}
        temp.selectedFile = selectedFile == null ? 'Vous devez ajouter le business plan' : ''
        temp.montant = values.montant === '' ? 'Vous devez entrer une valeur' : ''

        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const submit = async () => {

        //TODO TRIGGER FETCH DEMANDE RIGHT AFTERWARDS

        const formData = new FormData()
        formData.append('businessPlan', selectedFile)
        formData.append('denominationCommerciale', values.denominationCommerciale)
        formData.append('formeJuridique', values.formeJuridique)
        formData.append('nbEmploye', values.nbEmploye)
        formData.append('dateCreation', values.dateCreation)
        formData.append('nif', values.nif)
        formData.append('nbLabel', values.nbLabel)
        formData.append('montant', values.montant)

        axios.post(
            process.env.REACT_APP_BASE_URL + '/demandes',
            formData
        ).then(function (response) {
            //handle success
            dispatch(fetchUserDemandes({idUser :  authenticationState.user.idUser}))
            console.log(response);
        }).catch(function (response) {
            //handle error
            console.log(response);
        });
    }

    return (
        <React.Fragment>
            <IconButton className={classes.closeIcon}
                onClick={props.onClose}>
                <Add variant='Outline' size={32}
                    className={classes.icon}
                    color={theme.palette.text.primary} />
            </IconButton>
            <div className={classes.container}>
                <Typography variant='h3' fontWeight={700}
                    className={classes.hdr}>
                    Demande de financement
                </Typography>
                <Divider className={classes.dvdr} />
                {responseError != '' &&
                    <ErrorDisplay>
                        {responseError}
                    </ErrorDisplay>}
                <FromSteperHandler
                    submit={submit}
                    validateFirstPage={validateFirstPage}
                    validateSecondPage={validateSecondPage}>
                    <React.Fragment>
                        <Grid item xs={12} sm={6}>
                            <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                                Dénomination commerciale
                            </Typography>
                            <CustomTextField
                                name='denominationCommerciale'
                                id='denomination-commerciale-field'
                                className={classes.field}
                                size='small' margin='none'
                                type='text' onChange={onChangeHandler}
                                value={values.denominationCommerciale}
                                {...(errors.denominationCommerciale && errors.denominationCommerciale !== ''
                                    && { error: true, helperText: errors.denominationCommerciale })}
                            >
                            </CustomTextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                                Forme juridique
                            </Typography>
                            <FormControl fullWidth size='small' margin='none'
                                error={errors.formeJuridique != null && errors.formeJuridique !== ''}>
                                <CustomSelect
                                    id='forme-juridique'
                                    value={values.formeJuridique}
                                    onChange={onChangeHandler}
                                    name='formeJuridique'
                                >
                                    <MenuItem value='EURL' >EURL</MenuItem>
                                    <MenuItem value='SARL'>SARL</MenuItem>
                                    <MenuItem value='SPA'>SPA</MenuItem>
                                    <MenuItem value='Entreprise individuelle'>
                                        Entreprise individuelle (personne physique)</MenuItem>
                                    <MenuItem value='SNC'>SNC</MenuItem>
                                    <MenuItem value='Pas encore créé'>Pas encore créé</MenuItem>
                                </CustomSelect>
                                {errors.formeJuridique && errors.formeJuridique !== ''
                                    && <FormHelperText>{errors.formeJuridique}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>

                            <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                                Nombre d'employés
                            </Typography>

                            <CustomTextField className={classes.field}
                                name='nbEmploye'
                                id='nbEmploye-field'
                                type='number'
                                size='small' margin='none'
                                onChange={onChangeHandler}
                                value={values.nbEmploye}
                                {...(errors.nbEmploye && errors.nbEmploye !== '' && { error: true, helperText: errors.nbEmploye })}>
                            </CustomTextField>

                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                                Date de création
                            </Typography>

                            <LocalizationProvider dateAdapter={AdapterMoment} >
                                <DatePicker
                                    disableFuture
                                    value={values.dateCreation}
                                    onChange={onChangeDateHander}
                                    components={{
                                        OpenPickerIcon: () => <Calendar1 variant='Outline' />
                                    }}
                                    renderInput={(params) => <CustomTextField className={classes.field}
                                        size='small' margin='none' {...params}
                                        inputProps={{
                                            ...params.inputProps,
                                            placeholder: ''
                                        }}
                                        value={values.dateCreation}
                                        {...(errors.dateCreation && errors.dateCreation !== ''
                                            && { error: true, helperText: errors.dateCreation })} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                                Numéro d'identification fiscale
                            </Typography>
                            <CustomTextField
                                name='nif'
                                id='nif-field'
                                className={classes.field}
                                size='small' margin='none'
                                type='text' onChange={onChangeHandler}
                                value={values.nif}
                                {...(errors.nif && errors.nif !== ''
                                    && { error: true, helperText: errors.nif })}>
                            </CustomTextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                                Numéro du label
                            </Typography>
                            <CustomTextField
                                name='nbLabel'
                                id='nbLabel-field'
                                className={classes.field}
                                size='small' margin='none'
                                type='text' onChange={onChangeHandler}
                                value={values.nbLabel}
                                {...(errors.nbLabel && errors.nbLabel !== ''
                                    && { error: true, helperText: errors.nbLabel })}>
                            </CustomTextField>
                        </Grid>
                    </React.Fragment>
                    <React.Fragment>
                        <Grid item xs={12} sm={6} zeroMinWidth className={classes.formBody}>
                            <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                                Business plan de la startup
                            </Typography>
                            <FormControl fullWidth size='small' margin='none'
                                error={errors.selectedFile != null && errors.selectedFile !== ''}>
                                <div className={classes.addBusinessPlan}>
                                    <Button onClick={() => { onClickUpload() }}
                                        className={classes.filebtn} variant='outlined'>
                                        <input type='file' onChange={fileUploadHandler}
                                            style={{ display: 'none' }}
                                            id='file' ref={inputFile} />
                                        {selectedFile ? 'Remplacer' : 'Ajouter'}
                                    </Button>
                                    {selectedFile &&
                                        <Typography variant='body2' style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                            {selectedFileName}
                                        </Typography>}
                                </div>
                                {errors.selectedFile && errors.selectedFile !== ''
                                    && <FormHelperText>{errors.selectedFile}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.formBody}>
                            <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                                Montant demandé
                            </Typography>
                            <FormControl fullWidth size='small' margin='none'
                                error={errors.montant != null && errors.montant !== ''}>
                                <CustomSelect
                                    id='montant'
                                    value={values.montant}
                                    onChange={onChangeHandler}
                                    name='montant'>
                                    <MenuItem value='Entre 1-5 Million de dinards' >
                                        Entre 1-5 Million de dinards</MenuItem>
                                    <MenuItem value='Entre 5-10 Million de dinards'>
                                        Entre 5-10 Million de dinards</MenuItem>
                                    <MenuItem value='Entre 10-20 Million de dinards'>
                                        Entre 10-20 Million de dinards</MenuItem>
                                    <MenuItem value='Plus de 20 Million de dinars'>
                                        Plus de 20 Million de dinars</MenuItem>
                                </CustomSelect>
                                {errors.montant && errors.montant !== ''
                                    && <FormHelperText>{errors.montant}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    </React.Fragment>
                </FromSteperHandler>
            </div>
        </React.Fragment>
    );
};

export default FormDemande;