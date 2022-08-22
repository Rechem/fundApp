import React from 'react';
import { Grid, Typography, useTheme } from '@mui/material';
import axios from 'axios';

const getFileName = (response) => {
    const headerLine = response.headers['content-disposition'];
    const startFileNameIndex = headerLine.indexOf('"') + 1
    const endFileNameIndex = headerLine.lastIndexOf('"');
    const filename = headerLine.substring(startFileNameIndex, endFileNameIndex);
    return filename;
}

const InfoDemande = props => {

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

    const theme = useTheme()

    const INFO = [
        { title: 'Forme juridique', value: props.formeJuridique },
        { title: 'NIF', value: props.nif },
        { title: 'Dénomination commerciale', value: props.denominationCommerciale },
        { title: 'Numéro du Label', value: props.nbLabel },
        { title: 'Nombre d\'employés', value: props.nbEmploye },
        {
            title: 'Business plan',
            value: (
                <Typography
                    color={theme.palette.primary.main}
                    display='inline'>
                    <span onClick={downloadBusinessPlan} style={{ cursor: 'pointer' }}>
                        Voir
                    </span>
                </Typography>
            )
        },
        { title: 'Date de création', value: props.dateCreation },
        { title: 'Montant demandé', value: props.montant },
    ]



    return (
        <Grid container rowSpacing={2}>
            {INFO.map((e, i) => (e.value ?
                <Grid container item xs={12} sm={6} key={i}>
                    <Grid item container columnSpacing={1}>
                        <Grid item >
                            <Typography color={theme.palette.textmain}>
                                {e.title}:
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography color={theme.palette.textmain}
                                fontWeight={700}>
                                {e.value}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                : null
            ))}
        </Grid>
    );
};

export default InfoDemande;