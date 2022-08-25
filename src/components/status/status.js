import React from 'react';
import { useTheme } from '@mui/system';
import tinycolor from 'tinycolor2';
import { Typography } from '@mui/material';

const STATUS = {
    accepted: 'Acceptée',
    refused: 'Refusée',
    pending: 'En attente',
    complement: 'Besoin complément',
    programmee: 'Programmée',
    preselectionnee: 'Préselectionnée',
    terminee: 'Terminée',
    brouillon: 'Brouillon'
}

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
        case STATUS.preselectionnee:
            message = 'Préselectionnée'
            messageColor = theme.palette.warning.main
            containerColor = tinycolor(theme.palette.warning.main).setAlpha(.1)
            break;
        case STATUS.programmee:
            message = 'Programmée'
            messageColor = '#706fd3'
            containerColor = tinycolor('#706fd3').setAlpha(.1)
            break;
        case STATUS.complement :
            message = 'Besoin complément'
            messageColor = theme.palette.info.main
            containerColor = tinycolor(theme.palette.info.main).setAlpha(.1)
            break;
        case STATUS.terminee:
            message = 'Terminée'
            messageColor = theme.palette.success.main
            containerColor = tinycolor(theme.palette.success.main).setAlpha(.1)
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
        width : '6.5rem',
        height : '2.5rem',
        padding : 'auto',
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'center',
        margin : 'auto'
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