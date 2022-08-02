import React from 'react';
import { Grid, Typography, useTheme, Box, IconButton } from "@mui/material";
import classes from './details-demande.module.css'
import { Add } from 'iconsax-react';
import axios from 'axios';
import Status from '../status/status';

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
        <Typography
            color={theme.palette.text.primary}
            fontWeight={700}
            className={classes.hdr}>Détails de la demande</Typography>
        <div className={classes.etatContainer}>
            <Typography display='inline' marginRight='1rem'>
                Etat :
            </Typography>
            <Status status={props.etat} />
        </div>
        <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid container item xs={12} sm={6} columnSpacing={1}>
                <Grid item container columnSpacing={1}>
                    <Grid item xs={12} sm={6}>
                        <Typography color={theme.palette.text.primary}>
                            Forme juridique
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color={theme.palette.text.primary}
                            fontWeight={700}>
                            {props.formeJuridique}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container item xs={12} sm={6} columnSpacing={1}>
                <Grid item container columnSpacing={1}>
                    <Grid item xs={12} sm={6}>
                        <Typography color={theme.palette.text.primary}>
                            NIF
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color={theme.palette.text.primary}
                            fontWeight={700}>
                            {props.nif}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container item xs={12} sm={6} columnSpacing={1}>
                <Grid item container columnSpacing={1}>
                    <Grid item xs={12} sm={6}>
                        <Typography color={theme.palette.text.primary}>
                            Dénomination commerciale
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color={theme.palette.text.primary}
                            fontWeight={700}>
                            {props.denominationCommerciale}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container item xs={12} sm={6} columnSpacing={1}>
                <Grid item container columnSpacing={1}>
                    <Grid item xs={12} sm={6}>
                        <Typography color={theme.palette.text.primary}>
                            Numéro du Label
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color={theme.palette.text.primary}
                            fontWeight={700}>
                            {props.nbLabel}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container item xs={12} sm={6} columnSpacing={1}>
                <Grid item container columnSpacing={1}>
                    <Grid item xs={12} sm={6}>
                        <Typography color={theme.palette.text.primary}>
                            Nombre d'employés
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color={theme.palette.text.primary}
                            fontWeight={700}>
                            {props.nbEmploye}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>


            <Grid container item xs={12} sm={6} columnSpacing={1}>
                <Grid item container columnSpacing={1}>
                    <Grid item xs={12} sm={6}>
                        <Typography color={theme.palette.text.primary}>
                            Business plan
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <span onClick={downloadBusinessPlan} style={{ cursor: 'pointer' }}>
                            <Typography
                                color={theme.palette.primary.main}
                                display='inline'
                            >Télécharger</Typography>
                        </span>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container item xs={12} sm={6} columnSpacing={1}>
                <Grid item container columnSpacing={1}>
                    <Grid item xs={12} sm={6}>
                        <Typography color={theme.palette.text.primary}>
                            Date de création
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color={theme.palette.text.primary}
                            fontWeight={700}>
                            {props.dateCreation}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container item xs={12} sm={6} columnSpacing={1}>
                <Grid item container columnSpacing={1}>
                    <Grid item xs={12} sm={6}>
                        <Typography color={theme.palette.text.primary}>
                            Montant
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color={theme.palette.text.primary}
                            fontWeight={700}>
                            {props.montant}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Box>
};

export default DetailsDemande;