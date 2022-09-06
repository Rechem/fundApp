import React from 'react';
import { useTheme } from '@mui/system';
import tinycolor from 'tinycolor2';
import { Typography } from '@mui/material';
import { statusUser } from '../../utils';

const STATUS = {
    accepted: 'Acceptée',
    refused: 'Refusée',
    pending: 'En attente',
    complement: 'Besoin complément',
    programmee: 'Programmée',
    preselectionnee: 'Préselectionnée',
    terminee: 'Terminée',
    brouillon: 'Brouillon',
    pendingEvaluation: 'En attente évaluation',
    waiting: 'En attente saisie'
}

const Status = ({ status }) => {

    const theme = useTheme()

    let message, messageColor, containerColor;

    switch (status) {
        case STATUS.accepted:
        case statusUser.confirmed:
            message = status
            messageColor = theme.palette.success.main
            containerColor = tinycolor(theme.palette.success.main).setAlpha(.1)
            break;
        case STATUS.refused:
        case statusUser.banned:
            message = status
            messageColor = theme.palette.error.main
            containerColor = tinycolor(theme.palette.error.main).setAlpha(.1)
            break;
        case STATUS.pending:
        case STATUS.pendingEvaluation:
        case statusUser.notConfirmed:
            message = status
            messageColor = theme.palette.warning.main
            containerColor = tinycolor(theme.palette.warning.main).setAlpha(.1)
            break;
        case STATUS.preselectionnee:
            message = status
            messageColor = theme.palette.warning.main
            containerColor = tinycolor(theme.palette.warning.main).setAlpha(.1)
            break;
        case STATUS.programmee:
            message = status
            messageColor = '#706fd3'
            containerColor = tinycolor('#706fd3').setAlpha(.1)
            break;
        case STATUS.complement:
        case STATUS.waiting:
            message = status
            messageColor = theme.palette.info.main
            containerColor = tinycolor(theme.palette.info.main).setAlpha(.1)
            break;
        case STATUS.terminee:
            message = status
            messageColor = theme.palette.success.main
            containerColor = tinycolor(theme.palette.success.main).setAlpha(.2)
            break;
        case STATUS.brouillon:
            message = status
            messageColor = '#424242'
            containerColor = tinycolor('#424242').setAlpha(.2)
            break;
        default:
            message = 'Inconnu'
            messageColor = '#424242'
            containerColor = tinycolor('#424242').setAlpha(.2)
            break;
    }

    const styles = {
        backgroundColor: containerColor,
        borderRadius: 10,
        width: '6.5rem',
        height: '2.5rem',
        padding: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto',
    }

    return (
        <div style={styles}>
            <Typography
                variant='body2'
                fontWeight={500}
                color={messageColor}
                align='center' lineHeight={1.3}
            >{message}</Typography>
        </div>
    );
};

export default Status;