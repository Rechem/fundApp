import React from 'react';
import {STATUS} from './status-enum'
import { useTheme } from '@mui/system';
import tinycolor from 'tinycolor2';
import { Typography } from '@mui/material';

const Status = ({status}) => {

    const theme = useTheme()

    let message, messageColor, containerColor;

    switch (status) {
        case STATUS.accepted:
            message = 'Acceptée'
            messageColor = theme.palette.success.main
            containerColor = tinycolor(theme.palette.success.main).setAlpha(.1)
            break;
        case STATUS.refused:
            message = 'Refusée'
            messageColor = theme.palette.error.main
            containerColor = tinycolor(theme.palette.error.main).setAlpha(.1)
            break;
        case STATUS.pending:
            message = 'En attente'
            messageColor = theme.palette.warning.main
            containerColor = tinycolor(theme.palette.warning.main).setAlpha(.1)
            break;
        case STATUS.complement:
            message = 'Besoin complément'
            messageColor = theme.palette.info.main
            containerColor = tinycolor(theme.palette.info.main).setAlpha(.1)
            break;
        default:
            message = 'Inconnu'
            messageColor = theme.palette.warning.main
            containerColor = tinycolor(theme.palette.warning.main).setAlpha(.1)
            break;
    }

    const styles = {
        backgroundColor : containerColor,
        borderRadius : 10,
        width : '7rem',
        height : '2.5rem',
        padding : 'auto',
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'center'
    }

    return (
        <div style={styles}>
            <Typography
            variant='body2'
            color={messageColor}
            align='center'
            >{message}</Typography>
        </div>
    );
};

export default Status;