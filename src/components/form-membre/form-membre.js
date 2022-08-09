import React, { useState } from 'react';
import { CustomTextField } from '../../theme';
import classes from './form-membre.module.css'
import { Button, Typography } from '@mui/material';

const initialValues = {
    nom: '',
    prenom: '',
    email: '',
}

const FormMembre = props => {

    const [values, setValues] = useState(initialValues)
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

        temp.nom = values.nom === '' ? 'Vous devez entrer une valeur' : ''
        temp.prenom = values.prenom === '' ? 'Vous devez entrer une valeur' : ''
        temp.email = values.email!=''? (/\S+@\S+\.\S+/).test(values.email) ? '' : 'Email invalide' : ''

        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const submit = e => {
        e.preventDefault()
        if (validate()) {
            props.addMembre({...values})
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
                    name='nom'
                    id='nom-field'
                    className={classes.field}
                    size='small' margin='none'
                    type='text' onChange={onChangeHandler}
                    value={values.nom}
                    {...(errors.nom && errors.nom !== ''
                        && { error: true, helperText: errors.nom })}
                >
                </CustomTextField>
                <Typography fontWeight={400}
                    variant='body2'>Prénom</Typography>
                <CustomTextField
                    name='prenom'
                    id='prenom-field'
                    className={classes.field}
                    size='small' margin='none'
                    type='text' onChange={onChangeHandler}
                    value={values.prenom}
                    {...(errors.prenom && errors.prenom !== ''
                        && { error: true, helperText: errors.prenom })}
                >
                </CustomTextField>
                <Typography fontWeight={400}
                    variant='body2'>E-mail</Typography>
                <CustomTextField
                    name='email'
                    id='email-field'
                    className={classes.field}
                    size='small' margin='none'
                    type='text' onChange={onChangeHandler}
                    value={values.email}
                    {...(errors.email && errors.email !== ''
                        && { error: true, helperText: errors.email })}
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
                            variant='body2'>Ajouter</Typography>
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FormMembre;