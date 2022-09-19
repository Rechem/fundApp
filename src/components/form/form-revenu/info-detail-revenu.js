import React from 'react';
import { Grid, Typography } from '@mui/material';
import Motif from '../../motif/motif';
import Status from '../../status/status';
import axios from 'axios';

const InfoDetailRevenu = props => {

    const getMotifs = async () => {
        try {
            const response = await axios.get(
                `/motifs/revenu/${props.projetId}/${props.idArticleRevenu}`)
            return response.data.data.motifsRevenu
        } catch (e) {
            throw e
        }
    }

    const setSeenMotifs = async () => {
        try {
            await axios.patch(
                `/motifs/revenu/${props.projetId}/${props.idArticleRevenu}`)
        } catch (e) {
            throw e
        }
    }

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
            <div style={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>

                <div>
                    <Typography fontWeight={400}
                        variant='body2' >Lien/Facture:</Typography>
                    <Typography component='a'
                        target='_blank'
                        href={props.lien ? props.lien :
                            `${process.env.REACT_APP_BASE_URL}${props.facture}`}
                        color='primary'
                        mb='1rem'
                    >Voir</Typography>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center'
                }}>

                    < Motif getMotifs={getMotifs}
                        setSeenMotifs={setSeenMotifs}
                        style={{ marginRight: '0.5rem' }} />
                    <Status status={props.etat} />
                </div>
            </div>
        </>
    );
};

export default InfoDetailRevenu;