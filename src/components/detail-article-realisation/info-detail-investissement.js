import React from 'react';
import { Typography, Grid } from '@mui/material';

const InfoDetailInvestissement = props => {
    return (
        <>
            <Typography variant='subtitle2' fontWeight={700}
                mb='1.5rem'
            >Détails {props.type === 'charge-externe' ? 'charge externe' : 'investissement'}</Typography>
            <Typography fontWeight={400}
                variant='body2'>Type</Typography>
            <Typography fontWeight={600} mb='1rem' >
                {props.item.type.nomType}</Typography>
            <Typography fontWeight={400}
                variant='body2'>Description</Typography>
            {!props.item.description ?
                <Typography fontWeight={400}
                    variant='body2'><i>(vide)</i></Typography>:
            <Typography fontWeight={600} mb='1rem'>
                {props.item.description}</Typography>}
            <Grid container columns={3} columnSpacing={1}
                mb='1rem'>
                <Grid item xs={2}>
                    <Typography fontWeight={400}
                        variant='body2'>Montant unitaire</Typography>
                    <Typography fontWeight={600}>{props.item.montantUnitaire} DZD</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography fontWeight={400}
                        variant='body2'>Quantité</Typography>
                    <Typography fontWeight={600}>{props.item.quantite}</Typography>
                </Grid>
            </Grid>
            <Grid container columns={3} columnSpacing={1}
                mb='1rem'>
                <Grid item xs={2}>
                    <Typography fontWeight={400}
                        variant='body2'>Total</Typography>
                    <Typography fontWeight={600} mb='1rem' >
                        {props.item.montantUnitaire * props.item.quantite} DZD</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography fontWeight={400}
                        variant='body2' >Lien/Facture</Typography>
                    <Typography component='a'
                        target='_blank'
                        href={props.item.lien ? props.item.lien :
                            `${process.env.REACT_APP_BASE_URL}${props.item.facture}`}
                        color='primary'
                        mb='1rem'
                    >Voir</Typography>
                </Grid>
            </Grid>
        </>
    );
};

export default InfoDetailInvestissement;