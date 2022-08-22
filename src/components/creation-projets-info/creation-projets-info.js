import React from 'react';
import classes from './creation-projets-info.module.css'
import { Typography, Button, } from '@mui/material';

const CreationProjetsInfo = props => {
    return (
        <div className={classes.container}>
            <Typography fontWeight={700} className={classes.hdr}
                variant='subtitle2'>Succès</Typography>
            <Typography>Les projets suivants ont été créés:</Typography>
            <ul>
            {props.projets.map((p, i) => (
                <Typography key={i}> - {p}</Typography>
            ))}
            </ul>

            <div className={classes.btnContainer}>
                <Button className={classes.btn}
                    onClick={props.onClose}
                >
                    <Typography fontWeight={400} color='primary'
                        variant='body2'>Fermer</Typography>
                </Button>
                <Button className={classes.btn}
                    variant='contained' onClick={props.afterSubmit}
                >
                    <Typography color='white' fontWeight={400}
                        variant='body2'>Montrez-moi</Typography>
                </Button>
            </div>
        </div>
    );
};

export default CreationProjetsInfo;