import React, { useState, useEffect } from 'react';
import classes from './form-add-user.module.css'
import { CustomTextField } from '../../../theme';
import { CustomSelect } from '../../../theme';
import {
    MenuItem, CircularProgress, Typography,
    Button, FormControl, FormHelperText
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getRoleName } from '../../../utils';

const initialValues = {
    email: '',
    password: '',
    roleId: ''
}

const FormAddUser = props => {

    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})
    const [roles, setRoles] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

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

        temp.email = values.email === '' ? 'Vous devez entrer un email' : ''
        temp.password = values.password === '' ? 'Vous devez entrer un mot de passe' : ''
        temp.roleId = values.roleId === '' ? 'Vous devez choisir un rôle' : ''

        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const submit = async e => {
        e.preventDefault()
        if (validate()) {
            setIsLoading(true)
            try {
                await axios.post('/users/add', values)
                props.onClose()
            } catch (e) {
                toast.error(e.response.data.message)
            }
            setIsLoading(false)
        }
    }

    const fetchRoles = async () => {
        setIsFetching(true)
        try {
            const response = await axios.get('users/roles')
            setRoles(response.data.data.roles)
        } catch (error) {
            toast.error('Une erreur est survenue lors de la récupération des rôles')
        }
        setIsFetching(false)
    }

    useEffect(() => {
        fetchRoles()
    }, [])

    return (
        <div className={classes.container}>
            <form onSubmit={submit}>
                <Typography variant='subtitle2' fontWeight={700} mb='2rem'
                >Ajouter un utilisateur</Typography>
                <Typography variant='body2'
                    fontWeight={400}
                >Email</Typography>
                <CustomTextField
                    style={{ marginBottom: '1rem' }}
                    fullWidth
                    name='email'
                    id='email-field'
                    className={classes.field}
                    size='small' margin='none'
                    type='email' onChange={onChangeHandler}
                    value={values.email}
                    {...(errors.email && errors.email !== ''
                        && { error: true, helperText: errors.email })}
                ></CustomTextField>

                <Typography variant='body2'
                    fontWeight={400}
                >Mot de passe</Typography>
                <CustomTextField
                    style={{ marginBottom: '1rem' }}
                    fullWidth
                    name='password'
                    id='password-field'
                    className={classes.field}
                    size='small' margin='none'
                    type='password' onChange={onChangeHandler}
                    value={values.password}
                    {...(errors.password && errors.password !== ''
                        && { error: true, helperText: errors.password })}
                ></CustomTextField>

                <Typography variant='body2'
                    fontWeight={400}
                >Rôle</Typography>
                <FormControl fullWidth size='small' margin='none'
                    error={errors.roleId != null && errors.roleId !== ''}>
                    <CustomSelect
                        name='roleId'
                        defaultValue=""
                        value={values.roleId}
                        size='small'
                        onChange={onChangeHandler}>
                        {isFetching ?
                            <MenuItem style={{ opacity: 1 }} disabled>
                                <CircularProgress size='2rem' style={{ display: 'block', margin: 'auto' }} />
                            </MenuItem>
                            :
                            roles.length > 0 ?
                                roles.map((e) => <MenuItem
                                    key={e.idRole} value={e.idRole}>
                                    {getRoleName(e.nomRole)}</MenuItem>) :
                                <MenuItem disabled>
                                    <i>(Aucun rôle)</i>
                                </MenuItem>
                        }
                    </CustomSelect>
                    {errors.roleId && errors.roleId !== ''
                        && <FormHelperText>{errors.roleId}</FormHelperText>}
                </FormControl>
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
                            Ajouter
                        </Typography>
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FormAddUser;