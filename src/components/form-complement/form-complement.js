import { Typography, Button, CircularProgress, Divider, IconButton, FormHelperText, FormControl } from '@mui/material';
import React, { useEffect, useState } from 'react';
import classes from './form-complement.module.css'
import { CustomTextField } from '../../theme';
import { CloseOutlined, AddOutlined, DoneOutlined } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { statusDemande } from '../../utils';

const FormComplement = props => {

    const [complementValue, setComplementValue] = useState('')

    const [fieldError, setFieldError] = useState('')
    const [emptyError, setEmptyError] = useState('')

    const [isLoading, setIsLoading] = useState(false);

    const [message, setMessage] = useState('')
    const onChangeMessage = e => {
        setMessage(e.target.value)
    }

    const [combinedState, setState] = useState({
        listComplements: [],
        selected: -1,
        globalKey: 0,
    })

    const onChangeHandler = e => {
        setComplementValue(e.target.value)
        setFieldError('')
    }

    const onComplementClick = (key, value) => {
        if (combinedState.selected !== -1
            && !validateAndAddOrUpdate(combinedState.selected))
            return
        setComplementValue(value)
        setState(prevState => ({ ...prevState, selected: key }))
    }

    const submit = (e, key) => {
        e.preventDefault()
        validateAndAddOrUpdate(key)
    }

    const validateAndAddOrUpdate = (key) => {
        if (complementValue) {
            let newComplenemts = [...combinedState.listComplements]
            const foundIndex = newComplenemts.findIndex(x => x.key === key);
            newComplenemts[foundIndex].value = complementValue;
            setState(prevState => ({
                selected: - 1,
                listComplements: newComplenemts,
                globalKey: prevState.globalKey + 1
            }))
            setComplementValue('')
            return true
        }
        else {
            setFieldError('Vous devez entrer une valeur.')
            return false
        }
    }

    const onClickAddComplement = () => {
        setEmptyError('')
        if (combinedState.selected !== -1
            && !validateAndAddOrUpdate(combinedState.selected))
            return
        const currentKey = combinedState.globalKey
        const newComplement = { value: "", key: currentKey }
        setState(prevState => ({
            listComplements: prevState.listComplements.concat(newComplement),
            selected: currentKey,
            globalKey: currentKey + 1,
        }))
    }

    const removeComplement = key => {
        const newComplements = combinedState.listComplements.filter(c => c.key !== key)
        setState(prevState => ({ ...prevState, listComplements: newComplements }))
        if (key === combinedState.selected) {
            setState(prevState => ({ ...prevState, selected: -1 }))
            setFieldError('')
        }
    }

    const validateSendComplements = () => {
        if (combinedState.listComplements.length === 0) {
            return setEmptyError('Vous n\'avez pas ajouté de compléments.')
        }

        if (combinedState.selected !== -1) {
            return validateAndAddOrUpdate(combinedState.selected)
        }

        sendComplements()
    }

    const sendComplements = async () => {
        setIsLoading(true)
        try {
            await axios.patch(
                `/demandes`,
                {
                    idDemande: props.idDemande,
                    etat: statusDemande.complement,
                    listComplements: combinedState.listComplements.map(c => c.value),
                    message
                })
            setIsLoading(false)
            props.onClose()
            props.afterSubmit()
        } catch (e) {
            toast.error(e.response.data.message)
            // console.log("error ?", e);TOAST IT
            setIsLoading(false)
        }
    }

    return (
        <div className={classes.container}>

            <div className={classes.complementContainer}>
                <div>
                    <Typography variant='body1' fontWeight={700}
                        marginBottom='0.5rem' display='inline'>
                        Compléments
                    </Typography>
                    {isLoading && <CircularProgress size='1rem' />}
                </div>
                {combinedState.listComplements.map((c, i) => (
                    <div key={c.key}>
                        {combinedState.selected === c.key ?
                            <form className={classes.complementField}
                                onSubmit={(e) => submit(e, c.key)}
                            >
                                <CustomTextField
                                    autoFocus
                                    name='complementValue'
                                    onChange={onChangeHandler}
                                    className={classes.field}
                                    value={complementValue}
                                    variant='outlined'
                                    margin='none' size='small'
                                    // onBlur={() => validateAndAddOrUpdate(c.key)}
                                    {...(fieldError !== '' &&
                                        { error: true, helperText: fieldError })}>
                                </CustomTextField>
                                <IconButton type='submit'
                                    className={classes.iconButton}>
                                    <DoneOutlined />
                                </IconButton>

                                <IconButton onClick={() => removeComplement(c.key)}
                                    className={classes.iconButton}>
                                    <CloseOutlined />
                                </IconButton>
                            </form>
                            :
                            <div>
                                <div className={classes.complement}>
                                    <Typography display='inline'
                                        onClick={() => onComplementClick(c.key, c.value)}
                                        className={classes.complementTxt}>
                                        {c.value}</Typography>
                                    <IconButton onClick={() => removeComplement(c.key)}
                                        className={classes.iconButton}>
                                        <CloseOutlined />
                                    </IconButton>
                                </div>
                            </div>
                        }
                        <Divider />
                    </div>
                ))}
                <Button className={classes.addBtn}
                    onClick={onClickAddComplement}>
                    <AddOutlined fontSize='medium' />
                    <Typography display='inline' color='primary'
                        marginLeft='0.5rem'>
                        Ajouter un complément
                    </Typography>
                </Button>
                <FormControl error={emptyError !== ''}>
                    {emptyError !== '' &&
                        <FormHelperText>{emptyError}</FormHelperText>
                    }
                </FormControl>
            </div>
            <Typography variant='body1' fontWeight={700}
                marginBottom='0.5rem'>
                Message (optionel)
            </Typography>
            <CustomTextField
                onChange={onChangeMessage}
                value={message}
                className={classes.field}
                margin='none' size='small'
                multiline rows={3} />
            <div className={classes.btnContainer}>
                <Button className={classes.btn}
                    onClick={props.onClose}
                >
                    <Typography fontWeight={400} color='primary'
                        variant='body1'>Annuler</Typography>
                </Button>
                <Button className={classes.btn}
                    variant='contained' onClick={validateSendComplements}
                >
                    <Typography color='white' fontWeight={400}
                        variant='body1'>Envoyer</Typography>
                </Button>
            </div>
        </div >
    );
};

export default FormComplement;