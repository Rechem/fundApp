import React from 'react';
import classes from './demandes.module.css'
import Sidebar from '../../components/sidebar/sidebar';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/system';

const Demandes = () => {

    const theme = useTheme()

    return (
        <div className={classes.root}>
            <Sidebar />
            <div className={classes.container}>
                <div className={classes.content}>
                    <Typography color={theme.palette.text.main}
                        variant='h3'>
                        Demandes    
                    </Typography>
                </div>
            </div>
        </div>
    );
};

export default Demandes;