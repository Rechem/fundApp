import React, { useState } from 'react';
import { CustomTextField } from '../../theme';
import classes from './form-membre.module.css'
import { Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const initialValues = {
    nomMembre: '',
    prenomMembre: '',
    emailMembre: '',
}

const FormMembre = props => {

    const [values, setValues] = useState(props.membre ? props.membre : initialValues)
    const [errors, setErrors] = useState({})

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

        temp.nomMembre = values.nomMembre === '' ? 'Vous devez entrer une valeur' : ''
        temp.prenomMembre = values.prenomMembre === '' ? 'Vous devez entrer une valeur' : ''
        temp.emailMembre = values.emailMembre != '' ? (/\S+@\S+\.\S+/).test(values.emailMembre) ? '' : 'Email invalide' : ''

        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const submit = async e => {
        e.preventDefault()
        if (validate()) {
            try {
                if (props.membre) {
                    await axios.patch('/membres', {...values, idMembre: props.membre.idMembre})
                } else {
                    await axios.post('/membres', { ...values })
                }
                props.onClose()
                props.afterSubmit()
            } catch (e) {
                toast.error(e.response.data.message)
            }
        }
    }

    return (
        <div className={classes.container}>
            <form onSubmit={submit}>
                <Typography fontWeight={700} className={classes.hdr}
                    variant='subtitle2'>Ajouter un membre</Typography>
                <Typography fontWeight={400}
                    variant='body2'>Nom</Typography>
                <CustomTextField
                    name='nomMembre'
                    id='nomMembre-field'
                    className={classes.field}
                    size='small' margin='none'
                    type='text' onChange={onChangeHandler}
                    value={values.nomMembre}
                    {...(errors.nomMembre && errors.nomMembre !== ''
                        && { error: true, helperText: errors.nomMembre })}
                >
                </CustomTextField>
                <Typography fontWeight={400}
                    variant='body2'>Prénom</Typography>
                <CustomTextField
                    name='prenomMembre'
                    id='prenomMembre-field'
                    className={classes.field}
                    size='small' margin='none'
                    type='text' onChange={onChangeHandler}
                    value={values.prenomMembre}
                    {...(errors.prenomMembre && errors.prenomMembre !== ''
                        && { error: true, helperText: errors.prenomMembre })}
                >
                </CustomTextField>
                <Typography fontWeight={400}
                    variant='body2'>E-mail</Typography>
                <CustomTextField
                    name='emailMembre'
                    id='emailMembre-field'
                    className={classes.field}
                    size='small' margin='none'
                    type='text' onChange={onChangeHandler}
                    value={values.emailMembre}
                    {...(errors.emailMembre && errors.emailMembre !== ''
                        && { error: true, helperText: errors.emailMembre })}
                >
                </CustomTextField>
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
        </div>
    );
};

export default FormMembre;