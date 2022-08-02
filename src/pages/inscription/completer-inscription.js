import { Button, Typography, Grid, FormHelperText, FormControl } from '@mui/material';
import { CustomTextField, CustomSelect } from '../../theme';
import classes from './completer-inscription.module.css'
import { useState } from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Calendar1 } from 'iconsax-react';
import MenuItem from '@mui/material/MenuItem';
import { WILAYA } from './wilayas';
import moment from 'moment';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setCompletedSignup } from '../../store/loginSlice/reducer'
import ErrorDisplay from '../../components/error-display/error-display';

const initialValues = {
    nom: '',
    prenom: '',
    dateNaissance: null,
    wilayaNaissance: '',
    sexe: '',
    telephone: '',
    adress: '',
}

const CompleterInscription = () => {

    const authenticationState = useSelector(state => state.login)
    const dispatch = useDispatch()

    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})
    const [responseError, setResponseError] = useState('')

    const onChangeDateHander = newValue => {
        setValues({
            ...values,
            dateNaissance: newValue.format("DD-MM-YYYY")
        })
        setErrors({ ...errors, dateNaissance: '' })
    }

    const onChangeHandler = e => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })

        setErrors({ ...errors, [name]: '' })
    }

    const validateForm = () => {
        let temp = {}
        // .format("DD-MM-YYYY")
        temp.nom = values.nom === '' ? 'Vous devez entrer une valeur' : ''
        temp.prenom = values.prenom === '' ? 'Vous devez entrer une valeur' : ''
        if (values.dateNaissance == null) {
            temp.dateNaissance = 'Vous devez choisir une valeur'
        } else {
            if (moment().diff(values.dateNaissance, 'years') < 18)
                temp.dateNaissance = 'Vous devez avoir plus de 18 ans pour procéder'
            else
                temp.dateNaissance = ''
        }
        temp.wilayaNaissance = values.wilayaNaissance === '' ? 'Vous devez choisir une valeur' : ''
        temp.telephone = values.telephone === '' ? 'Vous devez entrer une valeur' : ''
        temp.adress = values.adress === '' ? 'Vous devez entrer une valeur' : ''
        temp.sexe = values.sexe === '' ? 'Vous devez choisir une valeur' : ''

        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const submitForm = async (e) => {
        e?.preventDefault()
        setResponseError('')
        if (validateForm()) {
            console.log('Form is valid')
            try {
                const BASE_URL = process.env.REACT_APP_BASE_URL
                const response = await axios.put(
                    BASE_URL + `/users/${authenticationState.user.idUser}`,
                    { ...values })
                    dispatch(setCompletedSignup())
            } catch (e) {
                setResponseError(e.response.data.message)
            }
        }
    }

    return (
        <div className={classes.container}>
            <Typography variant='h3' fontWeight={700}
                className={classes.hdr}>
                Compléter votre inscription
            </Typography>
            <form onSubmit={submitForm} className={classes.subContainer}>
                {responseError != '' &&
                    <ErrorDisplay>
                        responseError
                    </ErrorDisplay>}
                <Grid container rowSpacing={1} columnSpacing={3}>
                    <Grid item className={classes.col1} xs={12} sm={6}>
                        <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                            Nom
                        </Typography>
                        <CustomTextField
                            name='nom'
                            id='nom-field'
                            className={classes.field}
                            size='small' margin='none'
                            type='text' onChange={onChangeHandler}
                            value={values.nom}
                            {...(errors.nom && errors.nom !== '' && { error: true, helperText: errors.nom })}
                        >
                        </CustomTextField>
                    </Grid>
                    <Grid item className={classes.col2} xs={12} sm={6}>
                        <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                            Prénom
                        </Typography>

                        <CustomTextField className={classes.field}
                            name='prenom'
                            id='prenom-field'
                            type='text'
                            size='small' margin='none'
                            onChange={onChangeHandler}
                            value={values.prenom}
                            {...(errors.prenom && errors.prenom !== '' && { error: true, helperText: errors.prenom })}>
                        </CustomTextField>
                    </Grid>
                    <Grid item className={classes.col1} xs={12} sm={6}>
                        <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                            Date de naissance
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterMoment} >
                            <DatePicker
                                disableFuture
                                value={values.dateNaissance}
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
                                    value={values.dateNaissance}
                                    {...(errors.dateNaissance && errors.dateNaissance !== '' && { error: true, helperText: errors.dateNaissance })} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item className={classes.col2} xs={12} sm={6}>
                        <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                            Wilaya de naissance
                        </Typography>
                        <FormControl fullWidth size='small' margin='none'
                            error={errors.wilayaNaissance != null && errors.wilayaNaissance !== ''}>
                            <CustomSelect
                                id='select-wilaya'
                                value={values.wilayaNaissance}
                                onChange={onChangeHandler}
                                name='wilayaNaissance'
                            >
                                {WILAYA.map(e => <MenuItem
                                    key={e.numero}
                                    value={e.numero}>
                                    {e.numero} - {e.designation}</MenuItem>)}
                            </CustomSelect>
                            {errors.wilayaNaissance && errors.wilayaNaissance !== ''
                                && <FormHelperText>{errors.prenom}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item className={classes.col1} xs={12} sm={6}>
                        <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                            Sexe
                        </Typography>
                        <FormControl fullWidth size='small' margin='none'
                            error={errors.sexe != null && errors.sexe !== ''}>
                            <CustomSelect
                                id='select-sexe'
                                value={values.sexe}
                                onChange={onChangeHandler}
                                name='sexe'>
                                <MenuItem
                                    value='homme'>
                                    Homme</MenuItem>
                                <MenuItem
                                    value='femme'>
                                    Femme</MenuItem>
                            </CustomSelect>
                            {errors.sexe && errors.sexe !== ''
                                && <FormHelperText>{errors.sexe}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item className={classes.col2} xs={12} sm={6}>
                        <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                            Téléphone
                        </Typography>

                        <CustomTextField className={classes.field}
                            name='telephone'
                            id='telephone-field'
                            type='text'
                            size='small' margin='none'
                            onChange={onChangeHandler}
                            value={values.telephone}
                            {...(errors.telephone && errors.telephone !== '' && { error: true, helperText: errors.telephone })}>
                        </CustomTextField>
                    </Grid>

                    <Grid item className={classes.col2} xs={12}>
                        <Typography variant='body2' fontWeight={400} className={classes.lbl}>
                            Addresse
                        </Typography>
                        <CustomTextField className={classes.field}
                            name='adress'
                            id='addresse-field'
                            type='text'
                            size='small' margin='none'
                            onChange={onChangeHandler}
                            value={values.adress}
                            multiline
                            rows={3}
                            {...(errors.adress && errors.adress !== '' && { error: true, helperText: errors.adress })}>
                        </CustomTextField>
                    </Grid>
                </Grid>

                <Button variant='contained' className={classes.btn} onClick={submitForm}>
                    <Typography color='white' fontWeight={600} noWrap>Sauvgarder</Typography>
                </Button>
            </form>
        </div>
    );
};

export default CompleterInscription;