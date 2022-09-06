import React from 'react';
import classes from './info-detail-revenu.module.css'
import { Grid, Typography } from '@mui/material';

const InfoDetailRevenu = props => {
    return (
        <>
            <Typography variant='subtitle2' fontWeight={700}
                mb='1.5rem'
            >Détails Revenu</Typography>
            <Typography fontWeight={400}
                variant='body2'>Montant:</Typography>
            <Typography fontWeight={600} mb='1rem'>
                {props.montant} DZD</Typography>
            <Grid container columns={2} columnSpacing={1}
                mb='1rem'
                sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Grid item xs={1}>
                    <Typography fontWeight={400}
                        variant='body2'>Date début:</Typography>
                    <Typography fontWeight={600}>{props.dateDebut}</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography fontWeight={400}
                        variant='body2'>Date fin:</Typography>
                    <Typography fontWeight={600}>{props.dateFin}</Typography>
                </Grid>
            </Grid>
            <Typography fontWeight={400}
                variant='body2'>Description:</Typography>
            {!props.description ?
                <Typography fontWeight={400}
                    variant='body2'><i>(vide)</i></Typography> :
                <Typography fontWeight={600} mb='1rem'>
                    {props.description}</Typography>}
            <Typography fontWeight={400}
                variant='body2' >Lien/Facture:</Typography>
            <Typography component='a'
                target='_blank'
                href={props.lien ? props.lien :
                    `${process.env.REACT_APP_BASE_URL}${props.facture}`}
                color='primary'
                mb='1rem'
            >Voir</Typography>
        </>
    );
};

export default InfoDetailRevenu;