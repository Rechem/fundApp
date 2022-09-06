import React, { useEffect, useState, useRef } from 'react';
import classes from './prevision.module.css'
import {
    Box, Tabs, useTheme, Divider, Grid, MenuItem, Dialog,
    CircularProgress, Popper, Grow, Button, Paper
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
import { fetchAllProjets } from '../../store/projetsSlice/reducer';
import { isSimpleUser, statusPrevision } from '../../utils'
import Status from '../../components/status/status';
import { isAdmin } from '../../utils';
import FormEvaluerPrevision from '../../components/form/form-evaluer-prevision/form-evaluer-prevision';

const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)

const Prevision = () => {

    const navigate = useNavigate()

    const dispatch = useDispatch()
    const projetsState = useSelector(state => state.projets)
    const authenticationState = useSelector(state => state.login)

    const { idProjet, tranche } = useParams()

    const theme = useTheme()

    const textColor = theme.palette.text.main
    const primaryColor = theme.palette.primary.main

    const [currentIdProjet, setCurrentIdProjet] = useState(null)

    const handleChangeSelect = async (event) => {
        if (event.target.value.idProjet != idProjet) {
            setPrevision(null)
            navigate(`/projets/${event.target.value.idProjet}/prevision/1`)
        }
    };

    const handleCloseSelect = () => {
        setOpenSelect(false);
    };

    const handleOpenSelect = () => {
        setOpenSelect(true);
        dispatch(fetchAllProjets())
    };

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

    const [openSelect, setOpenSelect] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [total, setTotal] = useState(0)

    const [prevision, setPrevision] = useState(null)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => !prev);
    };

    const submitPrevision = async _ => {
        try {
            const response = await axios.patch(`/previsions/${idProjet}/${tranche}`,
                { etat: statusPrevision.pending })
            toast.success(response.data.message)
        } catch (e) {
            toast.error(e.response.data.message)
        }
        await fetchPrevisionDetails()
    }

    const fetchPrevisionDetails = async () => {
        try {
            const response = await axios.get(`/previsions/${idProjet}/${tranche}`)
            setCurrentIdProjet(response.data.data.prevision.projet)
            setPrevision(response.data.data.prevision)
        } catch (e) {
            toast.error(e.response.data.message)
        }
    }

    const cannotEdit = !prevision ||
    !((prevision.etat === statusPrevision.brouillon
        || prevision.etat === statusPrevision.refused)
    && isSimpleUser(authenticationState))

    useEffect(() => {
        fetchPrevisionDetails()
    }, [idProjet, tranche])

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
                    prevision.etat === statusPrevision.pending && isAdmin(authenticationState)
                        || ((prevision.etat === statusPrevision.brouillon || prevision.etat === statusPrevision.refused)
                            && isSimpleUser(authenticationState)) ?
                        <Button variant='contained'
                            onClick={isSimpleUser(authenticationState) ? submitPrevision : handleDialogClickOpen}
                            className={classes.submitButton}>
                            <Box color='white'>
                                {isAdmin(authenticationState) ? 'Evaluer' : 'Envoyer'}
                            </Box>
                        </Button> :
                        <div>
                            <Status status={prevision.etat} />
                        </div>
                }
            </div>
            {!prevision ?
                <CircularProgress sx={{ display: 'block', margin: 'auto' }}
                    size='2rem' /> :
                <>
                    <Grid container columns={12} columnSpacing={6} mb='2rem'>
                        <Grid item xs={12} sm={4}
                            sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', }}>
                            <CustomSelect
                                defaultValue=""
                                value={currentIdProjet}
                                renderValue={e => e.demande.denominationCommerciale}
                                size='small'
                                open={openSelect}
                                onClose={handleCloseSelect}
                                onOpen={handleOpenSelect}
                                onChange={handleChangeSelect}>
                                {projetsState.status === 'fetching' ?
                                    <MenuItem style={{ opacity: 1 }} disabled>
                                        <CircularProgress size='2rem' style={{ display: 'block', margin: 'auto' }} />
                                    </MenuItem>
                                    :
                                    projetsState.projets.map((e) => e.previsions.length > 0 ? <MenuItem
                                        key={e.idProjet} value={e}>
                                        {e.demande.denominationCommerciale}</MenuItem> : null)
                                }
                            </CustomSelect>
                        </Grid>
                        <Grid item xs={12} sm={4}
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'column' }}>
                            <Box sx={{ typography: 'body2', color: textColor }} mb={1}>
                                Tranches
                            </Box>
                            {prevision.projet.tranche ?
                                <CustomStepper
                                    active={prevision.numeroTranche}
                                    steps={prevision.projet.tranche.nbTranches}
                                    activeSteps={prevision.maxTranche}
                                    onClick={Array(prevision.maxTranche).fill(0).map((e,i) =>
                                        `/projets/${idProjet}/prevision/${i + 1}`)}
                                /> :
                                <i style={{ display: 'block' }}>Pas encore soumis</i>
                            }
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            <Box sx={{
                                color: theme.palette.text.main,
                                typography: 'subtitle2',
                            }} >
                                {prevision && prevision.valeurPrevision}
                                {' '}/ {prevision &&
                                    prevision.projet.tranche.pourcentage[prevision.numeroTranche - 1]
                                    * prevision.projet.montant} DZD
                            </Box>
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
                {/* </>
            } */}
            <Tabs value={tabValue} onChange={handleTabChange}>
                <CustomTab label="Investissements" />
                <CustomTab label="Salaires" />
                <CustomTab label="Charges externes" />
            </Tabs>
            <Divider />
            <TabPanel value={tabValue} index={0} >
                <InvestissementsTab setTotal={setTotal}
                    cannotEdit={cannotEdit} />
            </TabPanel>
            <TabPanel value={tabValue} index={1} >
                <SalairesTab setTotal={setTotal}
                    cannotEdit={cannotEdit} />
            </TabPanel>
            <TabPanel value={tabValue} index={2} >
                <ChargesTab setTotal={setTotal}
                    cannotEdit={cannotEdit} />
            </TabPanel>
            <div className={classes.footer}>
                <div>
                    <span>Total:</span>
                    <Box component='span'
                        sx={{ marginLeft: '0.5rem', color: primaryColor }}>{total} DZD</Box>
                </div>
                <Box>
                    <Button variant='text' onClick={handleClick}>
                        Aller a
                    </Button>
                    <Popper open={open} anchorEl={anchorEl} placement={'top-end'} transition>
                        {({ TransitionProps }) => (
                            <Grow {...TransitionProps} timeout={350}>
                                <Paper>
                                    The content of the Popper.
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Box>
            </div>
            </>
            }
        </>
    );
};

export default Prevision;