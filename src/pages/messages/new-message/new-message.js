import { Typography, useTheme, Button } from '@mui/material';
import React, { useState } from 'react';
import { CustomTextField } from '../../../theme';
import classes from './new-message.module.css'

const initialValue = { objet: '', body: '' }

const NewMessage = () => {

    const theme = useTheme()

    const [values, setValues] = useState(initialValue)
    const [errors, setErrors] = useState({})

    const onChangeHandler = e => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
        setErrors({ ...errors, [name]: '' })
    }

    return (
        <div>
            <Typography
                variant='h3' className={classes.hdr}>
                Nouveau message
            </Typography>
            <Typography
            marginBottom='1rem'
            variant='subtitle2'
            >A: Support</Typography>
            <form className={classes.form}>
                <Typography variant='body2'
                marginBottom='0.5rem'
            > Objet</Typography>
                <CustomTextField
                    name='objet'
                    id='objety-id'
                    className={classes.field}
                    size='small' margin='none'
                    value={values.objet}
                    type='text' onChange={onChangeHandler} />
                <Typography variant='body2'
                marginBottom='0.5rem'
            >Message</Typography>
                <CustomTextField
                    name='body'
                    id='body-id'
                    className={classes.field}
                    size='small' margin='none'
                    multiline rows={10}
                    value={values.body}
                    type='text' onChange={onChangeHandler} />
                <div className={classes.btnContainer}>
                    <Button variant='outlined' className={classes.btn}>
                        <Typography color='primary' fontWeight={600} >Envoyer</Typography>
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default NewMessage;