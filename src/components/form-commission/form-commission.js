import React, { useEffect, useState } from 'react';
import { CustomTextField } from '../../theme';
import classes from './form-commission.module.css'
import { Button, Typography, Autocomplete, CircularProgress, Box, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMembres } from '../../store/membresSlice/reducer';
import { CustomCheckBox } from '../../theme';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Calendar1 } from 'iconsax-react';
import { addCommission, fetchAllCommissions } from '../../store/commissionsSlice/reducer';
import { toast } from 'react-toastify';
import axios from 'axios';


const FormCommission = props => {

    const dispatch = useDispatch()
    const membresState = useSelector(state => state.membres)

    const [president, setPresident] = useState(props.values ? props.values.president : null)
    const [membres, setMembres] = useState(props.values ? props.values.membres : [])
    const [dateCommission, setDateCommission] = useState(props.values ? props.values.dateCommission : null)
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)

    const onChangeDateHander = newValue => {
        setDateCommission(newValue)
        setErrors({ ...errors, dateCommission: '' })
    }

    const onChangePresidentHander = newValue => {
        setPresident(newValue)
        setErrors({ ...errors, president: '' })
    }

    const onChangeMembresHander = newValue => {
        setMembres(newValue)
        setErrors({ ...errors, membres: '' })
    }

    const [errors, setErrors] = useState({})

    const [openPresident, setOpenPresident] = React.useState(false);
    const [openMembres, setOpenMembres] = React.useState(false);

    const loading = membresState.status === 'fetching'

    let optionPresident = membresState.membres
    let optionMembres = membresState.membres

    if (president != null) {
        optionMembres = optionMembres.filter(e => e.idMembre !== president.idMembre)
    }

    if (membres.length > 0) {
        optionPresident = optionPresident.filter(e => membres.every(m => m.idMembre != e.idMembre))
    }

    useEffect(() => {
        dispatch(fetchAllMembres())
    }, [])

    const validate = () => {
        let temp = {}

        temp.president = president == null ? 'Vous devez séléctionner un président' : ''
        temp.membres = membres.length === 0 ? 'Vous devez séléctionner des membres' : ''
        temp.dateCommission = dateCommission == null ? 'Vous devez choisir une date' : ''

        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const submit = async e => {
        e.preventDefault()
        if (validate()) {
            setIsLoadingSubmit(true)

            try {
                if (props.values)
                    await axios.patch('/commissions', {
                        idCommission: props.idCommission,
                        president: president.idMembre,
                        membres: membres.map((m, i) => m.idMembre),
                        dateCommission
                    })
                else
                    await axios.post('/commissions', {
                        president: president.idMembre,
                        membres: membres.map((m, i) => m.idMembre),
                        dateCommission
                    })
                props.onClose()
                props.afterSubmit()
            } catch (e) {
                toast.error(e.response.data.message)
            }
            setIsLoadingSubmit(false)
        }
    }

    return (
        <div className={classes.container}>
            <form onSubmit={submit}>
                <div className={classes.hdr}>
                    <Typography fontWeight={700} display='inline' marginRight='0.5rem'
                        variant='subtitle2'>
                        {props.values ?
                            'Modifer cette commission'
                            : 'Ajouter une commission'}

                    </Typography>
                    {isLoadingSubmit && <CircularProgress size='1rem' />}
                </div>
                <Typography fontWeight={400}
                    variant='body2'>Président</Typography>

                <Autocomplete
                    id="asynchronous-demo"
                    noOptionsText='Aucun résultat'
                    open={openPresident}
                    onOpen={() => {
                        setOpenPresident(true);
                    }}
                    onClose={() => {
                        setOpenPresident(false);
                    }}
                    onChange={(_, value) => onChangePresidentHander(value)}
                    value={president}
                    filterOptions={(option, state) => {
                        const filterOption = ["nomMembre", "prenomMembre", "emailMembre"]
                        return option.filter(o => state.inputValue.split(' ').every(el => filterOption.some(e => o[e].startsWith(el))))
                    }}
                    ListboxProps={{ style: { maxHeight: 160, overflow: 'auto' } }}
                    isOptionEqualToValue={(option, value) => option.idMembre === value.idMembre}
                    getOptionLabel={(option) => `${option.nomMembre} ${option.prenomMembre}`}
                    options={optionPresident}
                    loading={loading}
                    renderInput={(params) => (
                        <CustomTextField
                            className={classes.field}
                            {...params}
                            size='small' margin='none'
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        <Box style={{ margin: '1rem' }} />
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                            {...(errors.president && errors.president !== ''
                                && { error: true, helperText: errors.president })}
                        />
                    )}
                />
                <Typography fontWeight={400}
                    variant='body2'>Membres</Typography>

                <Autocomplete
                    id="asynchronous-demo"
                    noOptionsText='Aucun résultat'
                    multiple
                    open={openMembres}
                    onOpen={() => {
                        setOpenMembres(true);
                    }}
                    onClose={() => {
                        setOpenMembres(false);
                    }}
                    onChange={(_, value) => onChangeMembresHander(value)}
                    value={membres}
                    filterOptions={(option, state) => {
                        const filterOption = ["nomMembre", "prenomMembre", "emailMembre"]
                        return option.filter(o => state.inputValue.split(' ').every(el => filterOption.some(e => o[e].startsWith(el))))
                    }}
                    ListboxProps={{ style: { maxHeight: 150, overflow: 'auto' } }}
                    isOptionEqualToValue={(option, value) => option.idMembre === value.idMembre}
                    getOptionLabel={(option) => `${option.nomMembre} ${option.prenomMembre}`}
                    options={optionMembres}
                    loading={loading}
                    disableCloseOnSelect
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <CustomCheckBox
                                size='small'
                                checked={selected}
                            />
                            {option.nomMembre} {option.prenomMembre}
                        </li>
                    )}
                    renderInput={(params) => (
                        <CustomTextField
                            multiline
                            minRows={2}
                            className={classes.field}
                            {...params}
                            size='small' margin='none'
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        <Box style={{ margin: '1rem' }} />
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                            {...(errors.membres && errors.membres !== ''
                                && { error: true, helperText: errors.membres })}
                        />
                    )}
                />

                <Typography fontWeight={400}
                    variant='body2'>Date</Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DatePicker
                        inputFormat='DD/MM/YYYY'
                        value={dateCommission}
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
                            value={dateCommission}
                            {...(errors.dateCommission && errors.dateCommission !== ''
                                && { error: true, helperText: errors.dateCommission })} />}
                    />
                </LocalizationProvider>
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
                            variant='body2'>{props.values ? 'Sauvgarder' : 'Ajouter'}</Typography>
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FormCommission;