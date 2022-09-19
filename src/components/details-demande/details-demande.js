import React from 'react';
import { Grid, Typography, useTheme, Box, IconButton } from "@mui/material";
import classes from './details-demande.module.css'
import { Add } from 'iconsax-react';
import axios from 'axios';
import Status from '../status/status';
import moment from 'moment';
import InfoDemande from './info-demande';

const DetailsDemande = props => {
    const theme = useTheme()

    return <Box className={classes.mdlContainer}>
        <IconButton className={classes.closeIcon}
            onClick={props.onClose}>
            <Add variant='Outline' size={32}
                className={classes.icon}
                color={theme.palette.text.primary} />
        </IconButton>
        <div className={classes.dateContainer}>
            <Typography
                color={theme.palette.text.primary}
                fontWeight={700}
                className={classes.hdr}>Détails de la demande</Typography>
            <div>
                <Typography
                    color={theme.palette.text.primary}
                    className={classes.hdr}>
                    {moment(props.createdAt).format("DD/MM/YYYY HH:MM")}
                </Typography>
            </div>
        </div>
        <div className={classes.etatContainer}>
            <Typography display='inline' marginRight='1rem'>
                Etat
            </Typography>
            <div>
                <Status status={props.etat} />
            </div>
        </div>
        <InfoDemande {...props} downloadBusinessPlan={downloadBusinessPlan}/>
    </Box>
};

export default DetailsDemande;