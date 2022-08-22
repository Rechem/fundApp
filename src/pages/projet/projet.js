import React, { useEffect, useState } from 'react';
import classes from './projet.module.css'
import { Grid, Divider, useTheme, Box, CircularProgress, Typography, Button } from '@mui/material';
import InfoDemande from '../../components/details-demande/info-demande';
import CustomStepper from '../../components/custom-stepper/custom-stepper';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Projet = props => {

    const theme = useTheme()
    const primaryColor = theme.palette.primary.main
    const textColor = theme.palette.text.main

    const { idProjet } = useParams()

    const authenticationState = useSelector(state => state.login)

    const [projet, setProjet] = useState('')

    const fetchProjet = async () => {
        if (authenticationState.user.idUser) {
            try {
                const response = await axios.get(`/projets/${idProjet}`)
                setProjet(response.data.data.projet);
            } catch (e) {
                toast.error(e.response.data.message)
            }
        }
    }

    useEffect(() => {
        fetchProjet()
    }, [authenticationState.user.idUser])

    return !projet ?
        <CircularProgress size='2rem' style={{ marginTop: '1rem' }} /> :
        <>
            <Box sx={{
                color: theme.palette.text.main,
                typography: 'h3'
            }} className={classes.hdr}>
                TalabaStore
            </Box>
            <div className={classes.dashboard}>
                <Grid container columns={12} columnSpacing={6} rowSpacing={2}>
                    <Grid item container xs={12} sm={4} columnSpacing={2}
                        className={classes.center} sx={{ alignItems: 'center' }}>
                        <Grid item className={classes.center}>
                            <img src={process.env.PUBLIC_URL + '/asf-logo-white.png'} alt='Avatar'
                                className={classes.img} />
                        </Grid>
                        <Grid item xs={12} sm>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column' }}>
                                <div>{projet.demande.denominationCommerciale}</div>
                                <Box sx={{
                                    typography: 'body2', color: textColor,
                                    textDecoration: 'underline', cursor: 'pointer',
                                }} >
                                    {projet.demande.user.nom} {projet.demande.user.prenom}
                                </Box>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                        <Box sx={{ typography: 'body2', color: textColor }}>
                            Tranches
                        </Box>
                        {projet.tranche ?
                            <CustomStepper steps={projet.tranche.nbTranches} activeSteps={[1, 2]}
                                className={classes.stepper} />
                            : <i style={{ display: 'block' }}>Pas encore soumis</i>}
                    </Grid>
                    <Grid continer item xs={12} sm={4}
                        className={classes.alignFlexRight}>
                        <div className={classes.alignRight}>
                            <Box sx={{ color: textColor }} >
                                Montant accordé:{' '}
                            </Box>
                            <Box sx={{ color: textColor }}>
                                Revenu:{' '}
                            </Box>
                        </div>
                        <div>
                            <Box sx={{ fontWeight: 600, color: projet.montant ? primaryColor : theme.palette.warning.main }}>
                                {projet.montant ?
                                projet.montant :
                                <Button variant='outlined'
                                sx={{padding : 0}}>Définir</Button>}
                            </Box>
                            <Box sx={{ fontWeight: 600, color: primaryColor }}>
                                {projet.revenu ? projet.revenu : 0}
                            </Box>
                        </div>
                    </Grid>
                </Grid>
            </div>
            <Box className={classes.center}
                sx={{ typography: 'body1', fontWeight: 600, color: theme.palette.warning.main, }}
                marginY={2}>
                Montant et document d'accord de financement non soumis
            </Box>
            <Divider />
            <InfoDemande {...projet.demande} />
            <div className={classes.outerBtnContainer}>
                <div className={classes.btnContainer}>
                    <Button variant='outlined' className={classes.btn}
                    // onClick={openComplementForm}
                    >Prévisions
                    </Button>
                    <Button variant='outlined' className={classes.btn}
                    // onClick={openRefuserForm}
                    >Réalisations
                    </Button>
                    <Button variant='outlined' className={classes.btn}
                    // onClick={demande.etat === STATUS.programmee ?
                    >Revenu
                    </Button>
                </div>
            </div>
        </>
};

export default Projet;