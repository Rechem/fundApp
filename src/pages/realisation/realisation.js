import React, { useEffect, useState } from 'react';
import classes from './realisation.module.css'
import {
    Box, Tabs, useTheme, Divider, Grid, MenuItem, Dialog,
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
import { fetchAllProjets } from '../../store/projetsSlice/reducer';
import { isSimpleUser, statusRealisation } from '../../utils'
import Status from '../../components/status/status';
import { isAdmin } from '../../utils';
import FormEvaluerPrevision from '../../components/form/form-evaluer-prevision/form-evaluer-prevision';

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
            setRealisation(null)
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

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
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

    const [realisation, setRealisation] = useState(null)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => !prev);
    };

    const fetchRealisationDetails = async () => {
        try {
            const response = await axios.get(`/realisations/${idProjet}/${tranche}`)
            setCurrentIdProjet(response.data.data.realisation.projet)
            setRealisation(response.data.data.realisation)
        } catch (e) {
            toast.error(e.response.data.message)
        }
    }

    useEffect(() => {
        fetchRealisationDetails()
    }, [idProjet, tranche])

    return (
        <>
            <div className={classes.headerContainer}>
                <Box sx={{
                    color: theme.palette.text.main,
                    typography: 'h3'
                }} className={classes.hdr}>
                    Réalisation
                </Box>
                {realisation && realisation.etat === statusRealisation.terminee &&
                    <div>
                        <Status status={realisation.etat} />
                    </div>}
            </div>
            {!realisation ?
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
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            <Box sx={{
                                color: theme.palette.text.main,
                                typography: 'subtitle2',
                            }} >
                                {realisation && realisation.valeurRealisation} DZD
                            </Box>
                        </Grid>
                    </Grid>
                    <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
                        <Box>
                        </Box>
                    </Dialog>
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
                    isRealisation={true}
                    cannotEdit={true} />
            </TabPanel>
            <TabPanel value={tabValue} index={1} >
                <SalairesTab setTotal={setTotal}
                    isRealisation={true}
                    cannotEdit={true} />
            </TabPanel>
            <TabPanel value={tabValue} index={2} >
                <ChargesTab setTotal={setTotal}
                    isRealisation={true}
                    cannotEdit={true} />
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
    );
};

export default Prevision;