import React from 'react';
import { Typography, Grid } from '@mui/material';

const InfoDetailSalaire = props => {
    console.log(props);
    return (
        <>
            <Typography variant='subtitle2' fontWeight={700}
                mb='1.5rem'
            >Détails salaire</Typography>
            <Typography fontWeight={400}
                variant='body2'>Poste:</Typography>
            <Typography fontWeight={600} mb='1rem'>
                {props.item.type.nomPoste}</Typography>
            <Typography fontWeight={400}
                variant='body2'>Description:</Typography>
            {!props.item.description ?
                <Typography fontWeight={400}
                    variant='body2'><i>(vide)</i></Typography> :
            <Typography fontWeight={600} mb='1rem'>
                {props.item.description}</Typography>}
            <Grid container columns={4} columnSpacing={1}
                mb='1rem'
                sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Grid item xs={2}>
                    <Typography fontWeight={400}
                        variant='body2'>Salaire mensuel:</Typography>
                    <Typography fontWeight={600}>{props.item.salaireMensuel} DZD</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography fontWeight={400}
                        variant='body2'>Nb. de personnes:</Typography>
                    <Typography fontWeight={600}>{props.item.nbPersonne}</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography fontWeight={400}
                        variant='body2'>Nb. de mois:</Typography>
                    <Typography fontWeight={600}>{props.item.nbMois}</Typography>
                </Grid>
            </Grid>
            <Typography fontWeight={400}
                variant='body2'>Total:</Typography>
            <Typography fontWeight={600} mb='1rem'>
                {props.item.salaireMensuel * props.item.nbPersonne
                    * props.item.nbMois} DZD</Typography>
        </>
    );
};

export default InfoDetailSalaire;