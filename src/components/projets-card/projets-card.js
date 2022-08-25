import React from 'react';
import { Paper, Grid, Button, useTheme, Box, useMediaQuery } from '@mui/material'
import classes from './projets-card.module.css'
import CustomStepper from '../custom-stepper/custom-stepper';
import { useNavigate } from 'react-router-dom';

const ProjetsCard = props => {

    const navigate = useNavigate()

    const theme = useTheme()
    const primaryColor = theme.palette.primary.main
    const textColor = theme.palette.text.main

    return (
        <Paper variant="outlined" className={classes.container}>
            <Grid container columns={12} columnSpacing={6} rowSpacing={2}>
                <Grid container item md={8} xs={12} rowSpacing={3} columnSpacing={2} >
                    <Grid item container md={7} xs={12} sm={6}
                    columnSpacing={2} className={classes.center} sx={{ alignItems: 'center' }}>
                        <Grid item className={classes.center}>
                            <img src={process.env.PUBLIC_URL + '/asf-logo-white.png'} alt='Avatar'
                                className={classes.img} />
                        </Grid>
                        <Grid item xs={12} sm>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column' }}>
                                <div>{props.denominationCommerciale}</div>
                                <Box sx={{
                                    typography: 'body2', color: textColor,
                                    textDecoration: 'underline', cursor: 'pointer',
                                }} >
                                    {props.nom} {props.prenom}
                                </Box>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item md={5} xs={12} sm={6}
                        className={classes.center}>
                            <Box sx={{ typography: 'body2', color: textColor }}>
                                Tranches
                            </Box>
                            {props.tranche ?
                            <CustomStepper steps={props.tranche.nbTranches} activeSteps={[1, 2]}
                                className={classes.stepper} />
                                : <i>Pas encore soumis</i>}
                    </Grid>
                    <Grid item md={7} xs={12} sm={6} className={classes.center}>
                        <Box sx={{ fontWeight: 600, color: textColor }} component='span'>
                            Montant accordé:{' '}
                        </Box>
                        <Box sx={{ fontWeight: 600, color: props.montant ? primaryColor :theme.palette.warning.main}}
                        component='span'>
                            {props.montant ? `${props.montant}DZD` : <i>Non spécifié</i>}
                        </Box>
                    </Grid>
                    <Grid item md={5} xs={12} sm={6} className={classes.center}>
                        <Box sx={{ fontWeight: 600, color: textColor }} component='span'>
                            Revenu:{' '}
                        </Box>
                        <Box sx={{ fontWeight: 600, color: primaryColor }} component='span'>
                        {props.revenu ? props.revenu : 0}
                        </Box>
                    </Grid>
                </Grid>
                <Grid item md={4} xs={12}>
                    <div style={{
                        display: 'flex', height: '100%',
                        justifyContent: 'space-around', flexDirection: 'column'
                    }}>
                        <Button variant='contained' onClick={()=> navigate(`${props.idProjet}`)}>
                            <Box sx={{ color: 'white' }}>
                                Détails
                            </Box>
                        </Button>
                    </div>
                </Grid>
            </Grid>
            <Box className={classes.center}
            sx={{ typography: 'body2', color: theme.palette.warning.main,
            fontWeight: 600 }} mt={1}>
                Montant et document d'accord de financement non soumis
            </Box>
        </Paper>
    );
};

export default ProjetsCard;