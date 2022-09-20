import React, { useEffect, useState, useRef } from 'react';
import classes from './prevision.module.css'
import {
    Box, Tabs, useTheme, Divider, Grid, MenuItem, Dialog,
    CircularProgress, Popper, Grow, Button, Paper, Typography
} from '@mui/material';
import TabPanel from '../../components/tab-panel/tab-panel';
import { CustomSelect, CustomTab } from '../../theme';
import InvestissementsTab from './investissements-tab/investissements-tab';
import SalairesTab from './salaires-tab/salaires-tab';
import ChargesTab from './charges-tab/charges-tab';
import { useParams, useNavigate } from 'react-router-dom';
import CustomStepper from '../../components/custom-stepper/custom-stepper';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { isSimpleUser, statusPrevision } from '../../utils'
import Status from '../../components/status/status';
import { isAdmin } from '../../utils';
import FormEvaluerPrevision from '../../components/form/form-evaluer-prevision/form-evaluer-prevision';
import Motif from '../../components/motif/motif';
import ConfirmationDialog from '../../components/confirmation-dialog/confirmation-dialog';

const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)

const Prevision = () => {

    const navigate = useNavigate()

    const authenticationState = useSelector(state => state.login)

    const { idProjet, tranche } = useParams()

    const theme = useTheme()

    const textColor = theme.palette.text.main
    const primaryColor = theme.palette.primary.main


    const [tabValue, setTabValue] = useState(0);

    const myRef = useRef(null)
    const executeScroll = () => scrollToRef(myRef)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        executeScroll()
    };

    const [openDialog, setOpenDialog] = useState(false);

    const handleDialogClickOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const [openAlert, setOpenAlert] = useState(false);
    const [total, setTotal] = useState(0)

    const [prevision, setPrevision] = useState(null)

    const handleOpenAlert = () => {
        setOpenAlert(true)
    }

    const handleCloseAlert = () => {
        setOpenAlert(false)
    }


    const submitPrevision = async _ => {
            await axios.patch(`/previsions/${idProjet}/${tranche}`,
                { etat: statusPrevision.pending })
    }

    const fetchPrevisionDetails = async () => {
        try {
            const response = await axios.get(`/previsions/${idProjet}/${tranche}`)
            setPrevision(response.data.data.prevision)
        } catch (e) {
            if (e.response.status === 404)
                navigate('/notfound')
            else
                toast.error(e.response.data.message)
        }
    }

    const cannotEdit = !prevision ||
        !((prevision.etat === statusPrevision.brouillon
            || prevision.etat === statusPrevision.refused)
            && isSimpleUser(authenticationState))

    const getMotifs = async () => {
        try {
            const response = await axios.get(
                `/motifs/prevision/${prevision.projet.idProjet}/${prevision.numeroTranche}`)
            return response.data.data.motifsPrevision
        } catch (e) {
            throw e
        }
    }

    const setSeenMotifs = async () => {
        try {
            await axios.patch(
                `/motifs/prevision/${prevision.projet.idProjet}/${prevision.numeroTranche}`)
        } catch (e) {
            throw e
        }
    }

    const dispatchSeenPrevisions = async () => {
        if (isSimpleUser(authenticationState) && prevision&& !prevision.seenByUser
        ) {
            try {
                await axios.patch(`/previsions/seenByUser/${prevision.projet.idProjet}/${prevision.numeroTranche}`)
            } catch (e) {
            }
        }
    }

    useEffect(() => {
        if (authenticationState.user.idUser)
            fetchPrevisionDetails()
    }, [idProjet, tranche, authenticationState.user.idUser])

    useEffect(() => {
        if (authenticationState.user.idUser)
            dispatchSeenPrevisions()
    }, [prevision, authenticationState.user.idUser])

    return (
        <>
            <div className={classes.headerContainer} ref={myRef}>
                <Box sx={{
                    color: theme.palette.text.main,
                    typography: 'h3'
                }} className={classes.hdr}>
                    Prévision
                </Box>
                {!prevision ? <CircularProgress size='2rem' /> :
                    <div style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        < Motif getMotifs={getMotifs}
                            setSeenMotifs={setSeenMotifs}
                            style={{ marginRight: '1rem' }} />
                        {prevision.etat === statusPrevision.pending && isAdmin(authenticationState)
                            || ((prevision.etat === statusPrevision.brouillon || prevision.etat === statusPrevision.refused)
                                && isSimpleUser(authenticationState)) ?
                            <>
                                {isSimpleUser(authenticationState) &&
                                    <ConfirmationDialog
                                        open={openAlert}
                                        afterSubmit={fetchPrevisionDetails}
                                        onClose={handleCloseAlert}
                                        onConfirm={submitPrevision}>
                                            Voulez vous vraiment envoyer ces prévisions ?
                                    </ConfirmationDialog>
                                }
                                <Button variant='contained'
                                    onClick={isSimpleUser(authenticationState) ?  
                                        handleOpenAlert : handleDialogClickOpen}
                                    className={classes.submitButton}>
                                    <Box color='white'>
                                        {isAdmin(authenticationState) ? 'Evaluer' : 'Envoyer'}
                                    </Box>
                                </Button>
                            </> :
                            <div>
                                <Status status={prevision.etat} />
                            </div>
                        }
                    </div>
                }
            </div>
            {!prevision ?
                <CircularProgress sx={{ display: 'block', margin: 'auto' }}
                    size='2rem' /> :
                <>
                    <Grid container columns={12} columnSpacing={6} mb='2rem' rowSpacing='1rem'
                    className={classes.dboard}>
                        <Grid item xs={12} sm={4}
                        className={classes.center}
                            sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant='subtitle2'>
                                {prevision.projet.demande.denominationCommerciale}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}
                        className={classes.center}
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'column' }}>
                            <Box sx={{ typography: 'body2', color: textColor }} mb={1}>
                                Tranches
                            </Box>
                            {prevision.projet.tranche ?
                                <CustomStepper
                                    active={prevision.numeroTranche}
                                    steps={prevision.projet.tranche.nbTranches}
                                    activeSteps={prevision.maxTranche}
                                    onClick={Array(prevision.maxTranche).fill(0).map((e, i) =>
                                        `/projets/${idProjet}/prevision/${i + 1}`)}
                                /> :
                                <i style={{ display: 'block' }}>Pas encore soumis</i>
                            }
                        </Grid>
                        <Grid item xs={12} sm={4}
                        className={classes.center}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Typography
                                color={prevision.valeurPrevision >
                                    (prevision.projet.tranche.pourcentage[prevision.numeroTranche - 1]
                                        * prevision.projet.montant) ?
                                    theme.palette.error.main :
                                    theme.palette.text.main}
                                variant='subtitle2'
                                display='inline' >
                                {prevision.valeurPrevision}
                            </Typography>
                            <Typography
                                color={theme.palette.text.main}
                                variant='subtitle2'
                                display='inline'
                            >
                                / {
                                    prevision.projet.tranche.pourcentage[prevision.numeroTranche - 1]
                                    * prevision.projet.montant} DZD
                            </Typography>
                        </Grid>
                    </Grid>
                    <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
                        <Box>
                            <FormEvaluerPrevision
                                projetId={idProjet}
                                numeroTranche={tranche}
                                nom={prevision.projet.demande.denominationCommerciale}
                                valeur={prevision.valeurPrevision}
                                afterSubmit={fetchPrevisionDetails}
                                onClose={handleDialogClose} />
                        </Box>
                    </Dialog>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <CustomTab label="Investissements" />
                        <CustomTab label="Salaires" />
                        <CustomTab label="Charges externes" />
                    </Tabs>
                    <Divider />
                    <TabPanel value={tabValue} index={0} >
                        <InvestissementsTab setTotal={setTotal}
                            updatePrevision={fetchPrevisionDetails}
                            cannotEdit={cannotEdit} />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1} >
                        <SalairesTab setTotal={setTotal}
                            updatePrevision={fetchPrevisionDetails}
                            cannotEdit={cannotEdit} />
                    </TabPanel>
                    <TabPanel value={tabValue} index={2} >
                        <ChargesTab setTotal={setTotal}
                            updatePrevision={fetchPrevisionDetails}
                            cannotEdit={cannotEdit} />
                    </TabPanel>
                    <div className={classes.footer}>
                        <div>
                            <span>Total:</span>
                            <Box component='span'
                                sx={{ marginLeft: '0.5rem', color: primaryColor }}>{total} DZD</Box>
                        </div>
                    </div>
                </>
            }
        </>
    );
};

export default Prevision;