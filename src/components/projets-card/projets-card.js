import React from 'react';
import { Paper, Grid, Button, useTheme, Box, useMediaQuery, Typography } from '@mui/material'
import classes from './projets-card.module.css'
import CustomStepper from '../custom-stepper/custom-stepper';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isSimpleUser, statusPrevision, statusRealisation, statusRevenu } from '../../utils'

const ProjetsCard = props => {

    const authenticationState = useSelector(state => state.login)

    const getMaxTranchePrevisions = () => {
        return props.previsions.length === 0 ? 0 : Math.max(...props.previsions.map(p => p.numeroTranche))
    }

    const navigate = useNavigate()

    const theme = useTheme()
    const primaryColor = theme.palette.primary.main
    const textColor = theme.palette.text.main

    let warningMessages = [];
    if (isSimpleUser(authenticationState)) {
        if (props.montant && props.tranche === null) {
            warningMessages.push({
                message:
                    `Vous devez choisir le nombre de tranche`,
                priority: 0
            })
        } else {
            if (props.previsions.length > 0) {
                if (props.previsions[props.previsions.length - 1].etat !== statusPrevision.pending
                    && !props.previsions[props.previsions.length - 1].seenByUser) {
                    switch (props.previsions[props.previsions.length - 1].etat) {
                        case statusPrevision.accepted:
                            warningMessages.push({
                                message:
                                    `Vos prévisions pour la ${props.previsions.length > 1
                                        ? props.previsions.length + 'ème' : '1ère'} tranche ont été acceptées`,
                                priority: 2
                            })
                            break;
                        case statusPrevision.refused:
                            warningMessages.push({
                                message:
                                    `Vos prévisions pour la ${props.previsions.length > 1
                                        ? props.previsions.length + 'ème' : '1ère'} tranche ont été refusées`,
                                priority: 0
                            })
                            break;
                        case statusPrevision.brouillon:
                            warningMessages.push({
                                message:
                                    `Vous pouvez désormais ajouter les prévisions de la
                                ${props.previsions.length > 1
                                        ? props.previsions.length + 'ème' : '1ère'} tranche`,
                                priority: 2
                            })
                            break;

                        default:
                            break;
                    }
                }
            }

            if (props.realisations.length > 0) {
                if (props.realisations[props.realisations.length - 1].etat !== statusRealisation.pending
                    && !(props.realisations[props.realisations.length - 1].etat === statusRealisation.terminee
                        && props.realisations[props.realisations.length - 1].seenByUser)) {
                    switch (props.realisations[props.realisations.length - 1].etat) {
                        case statusRealisation.waiting:
                        case statusRealisation.pendingWaiting:
                            warningMessages.push({
                                message:
                                    `Vous avez des realisations non justifiees`,
                                priority: 1
                            })
                            break;
                        case statusRealisation.terminee:
                            if (!props.realisations[props.realisations.length - 1].seenByUser)
                                warningMessages.push({
                                    message:
                                        `Toutes vos réalisations de la ${props.realisations.length > 1
                                            ? props.realisations.length + 'ème' : '1ère'} tranche on été acceptées`,
                                    priority: 2
                                })
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        if (props.revenuProjet) {
            if (!props.revenuProjet.seenByUser &&
                (props.revenuProjet.etat === statusRevenu.waiting
                    || props.revenuProjet.etat === statusRevenu.evaluated)) {
                if (props.revenuProjet.etat === statusRevenu.waiting)
                    warningMessages.push({
                        message:
                            `Vous pouvez desormais ajouter des revenus`,
                        priority: 2
                    })
                else if (props.revenuProjet.etat === statusRevenu.evaluated)
                    warningMessages.push({
                        message:
                            `Vous avez une mis a jour sur vos revenus`,
                        priority: 1
                    })

            }
        }
    } else {
        //admin
        if (props.documentAccordFinancement === null)
            warningMessages.push({
                message:
                    `Document d'accord de financement non soumis`,
                priority: 1
            })
        if (props.montant === null) {
            warningMessages.push({
                message:
                    `Monant de financement non soumis`,
                priority: 0
            })
        } else {
            if (props.previsions.length > 0) {
                if (props.previsions[props.previsions.length - 1].etat === statusPrevision.pending) {
                    warningMessages.push({
                        message:
                            `Prévisions en attente evaluation`,
                        priority: 1
                    })
                } else {
                    // debloquer realisation
                    if (props.previsions.length === props.realisations.length + 1
                        && props.previsions.every(p => p.etat === statusPrevision.accepted))
                        warningMessages.push({
                            message:
                                `Réalisations de la ${props.realisations.length > 0
                                    ? props.realisations.length + 1 + 'ème' : '1ère'} tranche non encore débloquées`,
                            priority: 1
                        })
                    else if (props.previsions[props.previsions.length - 1].etat === statusPrevision.accepted
                        && props.realisations.length > 0 && props.previsions.length === props.realisations.length
                        && props.realisations[props.realisations.length - 1].etat === statusRealisation.terminee
                        && props.previsions.length < props.tranche.nbTranches)
                        warningMessages.push({
                            message:
                                `Prévisions de la ${props.previsions.length + 1}ème tranche non encore débloquées`,
                            priority: 1
                        })


                }
            } else {
                if (props.tranche)
                    warningMessages.push({
                        message:
                            `Prévisions de la 1ère tranche non encore débloquées`,
                        priority: 1
                    })
            }

            if (props.realisations.length > 0) {
                if ([statusRealisation.pending, statusRealisation.pendingWaiting].
                    includes(props.realisations[props.realisations.length - 1].etat)) {
                    warningMessages.push({
                        message:
                            `Réalisations en attente évaluation`,
                        priority: 1
                    })
                }
            }
        }
        if (props.revenuProjet) {
            if (props.revenuProjet.etat === statusRevenu.pending) {
                warningMessages.push({
                    message:
                        `Revenus en attente évaluation`,
                    priority: 1
                })
            }
        }
    }

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
                                    textDecoration: 'underline',
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
                            <CustomStepper steps={props.tranche.nbTranches} activeSteps={getMaxTranchePrevisions()}
                                className={classes.stepper} />
                            : <i>-</i>}
                    </Grid>
                    <Grid item md={7} xs={12} sm={6} className={classes.center}>
                        <Box sx={{ fontWeight: 600, color: textColor }} component='span'>
                            Montant accordé:{' '}
                        </Box>
                        <Box sx={{ fontWeight: 600, color: props.montant ? primaryColor : theme.palette.text.main }}
                            component='span'>
                            {props.montant ? `${props.montant}DZD` : <i>-</i>}
                        </Box>
                    </Grid>
                    <Grid item md={5} xs={12} sm={6} className={classes.center}>
                        <Box sx={{ fontWeight: 600, color: textColor }} component='span'>
                            Revenu:{' '}
                        </Box>
                        <Box sx={{ fontWeight: 600, color: primaryColor }} component='span'>
                            {props.totalRevenu}
                        </Box>
                    </Grid>
                </Grid>
                <Grid item md={4} xs={12}>
                    <div style={{
                        display: 'flex', height: '100%',
                        justifyContent: 'space-around', flexDirection: 'column'
                    }}>
                        <Button variant='contained' onClick={() => navigate(`${props.idProjet}`)}>
                            <Box sx={{ color: 'white' }}>
                                Détails
                            </Box>
                        </Button>
                    </div>
                </Grid>
            </Grid>
            {warningMessages.sort((a, b) => a.priority > b.priority ? 1 : -1).map((m, i) =>
                <Typography className={classes.center} key={i}
                    variant='body2' color={
                        m.priority > 1 ? theme.palette.success.main :
                            m.priority > 0 ? theme.palette.warning.main :
                                theme.palette.error.main}
                    fontWeight={600} mt={1}>
                    {m.message}
                </Typography>
            )}
        </Paper>
    );
};

export default ProjetsCard;