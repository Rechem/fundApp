import React, { useEffect, useState } from 'react';
import classes from './realisation.module.css'
import {
    Box, Tabs, useTheme, Divider, Grid, Typography, Dialog,
    CircularProgress, Popper, Grow, Button, Paper
} from '@mui/material';
import TabPanel from '../../components/tab-panel/tab-panel';
import { CustomSelect, CustomTab } from '../../theme';
import InvestissementsTab from '../prevision/investissements-tab/investissements-tab';
import SalairesTab from '../prevision/salaires-tab/salaires-tab';
import ChargesTab from '../prevision/charges-tab/charges-tab';
import { useParams, useNavigate } from 'react-router-dom';
import CustomStepper from '../../components/custom-stepper/custom-stepper';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { isSimpleUser, statusRealisation } from '../../utils'
import Status from '../../components/status/status';
import { isAdmin } from '../../utils';
import FormEvaluerPrevision from '../../components/form/form-evaluer-prevision/form-evaluer-prevision';

const Prevision = () => {

    const navigate = useNavigate()

    const authenticationState = useSelector(state => state.login)

    const { idProjet, tranche } = useParams()

    const theme = useTheme()

    const textColor = theme.palette.text.main
    const primaryColor = theme.palette.primary.main

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const [total, setTotal] = useState(0)

    const [realisation, setRealisation] = useState(null)

    const fetchRealisationDetails = async () => {
        try {
            const response = await axios.get(`/realisations/${idProjet}/${tranche}`)
            setRealisation(response.data.data.realisation)
        } catch (e) {
            if (e.response.status === 404)
                navigate('/notfound')
            else
                toast.error(e.response.data.message)
        }
    }

    const dispatchSeenRealisations = async () => {
        if (isSimpleUser(authenticationState) && realisation && !realisation.seenByUser) {
            try {
                await axios.patch(`/realisations/seenByUser/${realisation.projet.idProjet}/${realisation.numeroTranche}`)
            } catch (e) {
            }
        }
    }

    useEffect(() => {
        if (authenticationState.user.idUser)
            fetchRealisationDetails()
    }, [idProjet, tranche, authenticationState.user.idUser])


    useEffect(() => {
        if (authenticationState.user.idUser)
            dispatchSeenRealisations()
    }, [realisation, authenticationState.user.idUser])

    return (
        <>
            <div className={classes.headerContainer}>
                <Typography
                    color={theme.palette.text.main}
                    variant='h3' className={classes.hdr}>
                    Réalisation
                </Typography>
                {realisation && realisation.etat === statusRealisation.terminee &&
                    <div>
                        <Status status={realisation.etat} />
                    </div>}
            </div>
            {!realisation ?
                <CircularProgress sx={{ display: 'block', margin: 'auto' }}
                    size='2rem' /> :
                <>
                    <Grid container columns={12} columnSpacing={6} mb='2rem' rowSpacing='1rem'
                        className={classes.dboard}>
                        <Grid item xs={12} sm={4}
                            className={classes.center}
                            sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant='subtitle2'>
                                {realisation.projet.demande.denominationCommerciale}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}
                            className={classes.center}
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'column' }}>
                            <Typography variant='body2' color={textColor} mb={1}>
                                Tranches
                            </Typography>
                            {realisation.projet.tranche ?
                                <CustomStepper
                                    active={realisation.numeroTranche}
                                    steps={realisation.projet.tranche.nbTranches}
                                    activeSteps={realisation.maxTranche}
                                    onClick={Array(realisation.maxTranche).fill(0).map((e, i) =>
                                        `/projets/${idProjet}/realisation/${i + 1}`)}
                                /> :
                                <i style={{ display: 'block' }}>Pas encore soumis</i>
                            }
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}
                            className={classes.center}>
                            <Typography
                                color={theme.palette.text.main}
                                variant='subtitle2'>
                                {realisation && realisation.valeurRealisation} DZD
                            </Typography>
                        </Grid>
                    </Grid>
                </>
            }
            <Tabs value={tabValue} onChange={handleTabChange}>
                <CustomTab label="Investissements" />
                <CustomTab label="Salaires" />
                <CustomTab label="Charges externes" />
            </Tabs>
            <Divider />
            <TabPanel value={tabValue} index={0} >
                <InvestissementsTab setTotal={setTotal}
                    updateRealisation={fetchRealisationDetails}
                    isRealisation={true}
                    cannotEdit={true} />
            </TabPanel>
            <TabPanel value={tabValue} index={1} >
                <SalairesTab setTotal={setTotal}
                    updateRealisation={fetchRealisationDetails}
                    isRealisation={true}
                    cannotEdit={true} />
            </TabPanel>
            <TabPanel value={tabValue} index={2} >
                <ChargesTab setTotal={setTotal}
                    updateRealisation={fetchRealisationDetails}
                    isRealisation={true}
                    cannotEdit={true} />
            </TabPanel>
            <div className={classes.footer}>
                <div>
                    <span>Total:</span>
                    <Box component='span'
                        sx={{ marginLeft: '0.5rem', color: primaryColor }}>{total} DZD</Box>
                </div>
            </div>
        </>
    );
};

export default Prevision;