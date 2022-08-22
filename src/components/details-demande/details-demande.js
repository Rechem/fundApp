import React from 'react';
import { Grid, Typography, useTheme, Box, IconButton } from "@mui/material";
import classes from './details-demande.module.css'
import { Add } from 'iconsax-react';
import axios from 'axios';
import Status from '../status/status';
import moment from 'moment';
import InfoDemande from './info-demande';

const getFileName = (response) => {
    const headerLine = response.headers['content-disposition'];
    const startFileNameIndex = headerLine.indexOf('"') + 1
    const endFileNameIndex = headerLine.lastIndexOf('"');
    const filename = headerLine.substring(startFileNameIndex, endFileNameIndex);
    return filename;
}

const DetailsDemande = props => {
    const theme = useTheme()

    const downloadBusinessPlan = async () => {
        const BASE_URL = process.env.REACT_APP_BASE_URL
        const response = await axios.post(BASE_URL + `/demandes/${props.idDemande}/business-plan`,
            { responseType: 'blob' })
        const fileName = getFileName(response)
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        if (typeof window.navigator.msSaveBlob === 'function') {
            window.navigator.msSaveBlob(
                response.data,
                fileName
            );
        } else {
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        }
    }

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