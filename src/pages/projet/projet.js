import React, { useEffect, useState, useRef } from 'react';
import classes from './projet.module.css'
import {
    Grid, Divider, useTheme, Box, CircularProgress,
    Dialog, Button, ButtonGroup, MenuItem, MenuList,
    ClickAwayListener, Paper, Grow, Popper
} from '@mui/material';
import InfoDemande from '../../components/details-demande/info-demande';
import CustomStepper from '../../components/custom-stepper/custom-stepper';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import FormMontant from '../../components/form-montant/form-montant'
import FormTranche from '../../components/form-tranche/form-tranche';
import { Link } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { statusPrevision, statusRealisation } from '../../utils';

const Projet = props => {

    const navigate = useNavigate()

    const theme = useTheme()
    const primaryColor = theme.palette.primary.main
    const textColor = theme.palette.text.main

    const { idProjet } = useParams()

    const authenticationState = useSelector(state => state.login)

    const [projet, setProjet] = useState('')

    const [open, setOpen] = useState(false);


    const handleDialogOpen = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const [openButtonGroup, setOpenButtonGroup] = useState(false);
    const anchorRef = React.useRef(null);

    const handleToggleButtonGroup = () => {
        setOpenButtonGroup((prevOpen) => !prevOpen);
    };

    const handleCloseButtonGroup = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpenButtonGroup(false);
    };

    const inputFile = useRef(null)
    const fileUploadHandler = async (event) => {
        if (!event.target.files[0])
            return
        const formData = new FormData()

        formData.append('documentAccordFinancement', event.target.files[0])

        try {
            await axios.patch(`/projets/${projet.idProjet}`, formData)
            await fetchProjet()
        } catch (e) {
            toast.error(e.response.data.message)
        }
    }
    const onClickUpload = () => {
        inputFile.current.click();
    };

    const deleteDocument = async (e) => {
        handleCloseButtonGroup(e)
        try {
            await axios.delete(`/projets/${idProjet}/documentAccordFinancement`)
            await fetchProjet()
        } catch (e) {
            toast.error(e.response.data.message)
        }
    }

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

    const getMaxTranchePrevisions = () => {
        return projet.previsions.length === 0 ? 0 : Math.max(...projet.previsions.map(p => p.numeroTranche))
    }

    const getMaxTrancheRealisations = () => {
        return projet.realisations.length === 0 ? 0 : Math.max(...projet.realisations.map(p => p.numeroTranche))
    }

    useEffect(() => {
        fetchProjet()
    }, [authenticationState.user.idUser])

    const checkMontantTranche = () => {
        if (!projet.montant || !projet.tranche) {
            handleDialogOpen()
            return false
        } else
            return true
    }

    const viewPrevisions = async () => {
        if (!checkMontantTranche())
            return
        if (getMaxTranchePrevisions() === 0
            || (projet.previsions.find(r => r.numeroTranche === getMaxTranchePrevisions()).etat === statusPrevision.accepted
                && projet.realisations.length > 0 && getMaxTranchePrevisions() === getMaxTrancheRealisations()
                && projet.realisations.find(r => r.numeroTranche === getMaxTrancheRealisations()).etat === statusRealisation.terminee)) {
            try {
                await axios.post('/previsions', {
                    projetId: projet.idProjet,
                })
                toast.success("Succès")
                await fetchProjet()
            } catch (e) {
                toast.error(e.response.data.message)
            }
        } else {
            navigate(`prevision/${getMaxTranchePrevisions()}`)
        }

        // : projet.realisations.length > 0 ?
        //     projet.realisations.find(r => r.numeroTranche === getMaxTrancheRealisations).etat !== 'Terminée' ?
        //         'Réalisations' : `Débloquer prévisions (${getMaxTranchePrevisions}ème tranche)` : 'Réalisations'}
    }

    const viewRealisations = async () => {
        if (!checkMontantTranche())
            return

        if (projet.previsions.length > 0 &&
            projet.previsions.every(p => p.etat === statusPrevision.accepted)
            && getMaxTranchePrevisions() > getMaxTrancheRealisations()) {

            //should never happen
            if (projet.realisations.length !== 0
                && !projet.realisations.every(p => p.etat === statusRealisation.terminee))
                return toast.error('Il existe des réalisation non complètes')
            try {
                await axios.post('/realisations', {
                    projetId: projet.idProjet,
                })
                toast.success("Succès")
                await fetchProjet()
            } catch (e) {
                toast.error(e.response.data.message)
            }
        } else {
            navigate(`realisation/${getMaxTrancheRealisations()}`)
        }
    }

    const viewRevenu = () => {
        if (checkMontantTranche()) {

        }
    }

    const isDebloquerPrevision = () => getMaxTranchePrevisions() === 0
        || (projet.previsions.find(r => r.numeroTranche === getMaxTranchePrevisions()).etat !== statusPrevision.accepted
            && projet.realisations.length > 0 && getMaxTranchePrevisions() === getMaxTrancheRealisations()
            && projet.realisations.find(r => r.numeroTranche === getMaxTrancheRealisations()).etat === 'Terminée');

    const isPrevision = () =>
        projet.previsions.find(r => r.numeroTranche === getMaxTranchePrevisions()).etat !== statusPrevision.accepted

    const isDebloquerRealisation = () => projet.previsions.length > 0 &&
        projet.previsions.every(p => p.etat === statusPrevision.accepted)
        && getMaxTranchePrevisions() > getMaxTrancheRealisations()

    const isRealisation = () => projet.realisation.find(r => r.numeroTranche === getMaxTrancheRealisations()).etat !== 'Terminée'

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
                    <Grid item xs={12} sm={4}
                        className={classes.center}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <Box sx={{ typography: 'body2', color: textColor }} mb={1}>
                            Tranches
                        </Box>
                        {projet.tranche ?
                            <CustomStepper steps={projet.tranche.nbTranches} activeSteps={getMaxTranchePrevisions()} />
                            : <i style={{ display: 'block' }}>Pas encore soumis</i>}
                    </Grid>
                    <Grid container item xs={12} sm={4}
                        columnSpacing={1}
                    >
                        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Box sx={{ color: textColor }}  >
                                Montant accordé:
                            </Box>
                        </Grid>

                        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Box sx={{ fontWeight: 600, color: projet.montant ? primaryColor : theme.palette.warning.main }}    >
                                {projet.montant ?
                                    `${projet.montant}DZD` :
                                    <Button variant='contained'
                                        sx={{ padding: 0 }} onClick={handleDialogOpen}>
                                        <Box sx={{ color: 'white' }} >
                                            Définir
                                        </Box>
                                    </Button>
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Box sx={{ color: textColor }} >
                                Revenu:{' '}
                            </Box>
                        </Grid>
                        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Box sx={{ fontWeight: 600, color: primaryColor }}  >
                                {projet.revenu ? projet.revenu : 0}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <Box className={classes.center}
                sx={{ typography: 'body1', fontWeight: 600, color: theme.palette.warning.main, }}
                mb={1}>
                Montant et document d'accord de financement non soumis
            </Box>
            <Divider />
            <Box sx={{ typography: 'body1', fontWeight: 600, color: textColor, }}
                mb={0.5} mt={2}>
                Document d'accord de financement
            </Box>
            {projet.documentAccordFinancement &&
                <Box
                    component="a"
                    href={`${process.env.REACT_APP_BASE_URL}${projet.documentAccordFinancement}`}
                    target='_blank'
                    sx={{
                        color: theme.palette.primary.main,
                        display: 'inline',
                        marginRight: '1rem'
                    }}>
                    Télécharger
                </Box>}
            <div className={classes.fileBtnContainer}>
                <ButtonGroup variant='outlined' ref={anchorRef}>
                    <Button
                        onClick={onClickUpload}
                        className={classes.filebtn} >
                        <input type='file'
                            onChange={fileUploadHandler}
                            style={{ display: 'none' }} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                            id='file' ref={inputFile} />
                        {projet.documentAccordFinancement ? 'Remplacer' : 'Ajouter'}
                    </Button>
                    {projet.documentAccordFinancement &&
                        <Button
                            size="small" className={classes.filebtn}
                            onClick={handleToggleButtonGroup}
                        ><ArrowDropDownIcon /></Button>}
                </ButtonGroup>
                <Popper
                    sx={{
                        zIndex: 1,
                    }}
                    open={openButtonGroup}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin:
                                    placement === 'bottom' ? 'top right' : 'bottom right',
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleCloseButtonGroup}>
                                    <MenuList id="split-button-menu">
                                        <MenuItem onClick={deleteDocument}>
                                            <Box sx={{ typography: 'body2', color: 'red', width: '5.5rem' }}>
                                                Supprimer</Box>
                                        </MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
            <Box sx={{ typography: 'body1', fontWeight: 600, color: textColor, }}
                mb={1} mt={3}>
                Détails sur l'entreprise</Box>
            <InfoDemande {...projet.demande} />
            <Box sx={{ typography: 'body1', fontWeight: 600, color: textColor, }}
                mb={1} mt={3}>
                Historique</Box>

            <Grid container rowSpacing={1.5}>
                <Grid container item xs={12} sm={6} columnSpacing={0.5}>
                    <Grid item >
                        <Box sx={{ color: theme.palette.text.main }}>
                            Ajouté le:
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box sx={{ color: theme.palette.text.main, fontWeight: 600 }}>
                            {dayjs(projet.demande.createdAt).format("DD/MM/YYYY")}
                        </Box>
                    </Grid>
                </Grid>
                <Grid container item xs={12} sm={6} columnSpacing={0.5}>
                    <Box
                        component={Link}
                        to={`/demandes/${projet.demande.idDemande}`}
                        sx={{
                            color: theme.palette.primary.main,
                            display: 'inline',
                        }}
                    >
                        Voir demande

                    </Box>
                </Grid>
                <Grid container item xs={12} sm={6} columnSpacing={0.5}>
                    <Grid item >
                        <Box sx={{ color: theme.palette.text.main }}>
                            Accepté le:
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box sx={{ color: theme.palette.text.main, fontWeight: 600 }}>
                            {projet.demande.commission.dateCommission}
                        </Box>
                    </Grid>
                </Grid>
                <Grid container item xs={12} sm={6} columnSpacing={0.5}>
                    <Box component={Link}
                        to={`/commissions/${projet.demande.commission.idCommission}`}
                        sx={{
                            color: theme.palette.primary.main,
                            display: 'inline',
                        }}>
                        Voir commission
                    </Box>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleDialogClose}
                maxWidth='100%'>
                <Box className={classes.modelContainer}>
                    {projet.montant && !projet.tranche
                        && <FormTranche
                            idProjet={projet.idProjet}
                            montant={projet.montant}
                            afterSubmit={fetchProjet}
                            onClose={handleDialogClose}
                        />}
                    {!projet.montant && <FormMontant
                        idProjet={projet.idProjet}
                        nomProjet={projet.demande.denominationCommerciale}
                        afterSubmit={fetchProjet}
                        onClose={handleDialogClose}
                    />}
                </Box>
            </Dialog>
            <div className={classes.outerBtnContainer}>
                <div className={classes.btnContainer}>
                    <ButtonGroup>
                        <Button variant='outlined' className={classes.btn}
                            onClick={viewPrevisions}>
                            <Box sx={{ typography: 'body1', color: theme.palette.primary.main }}>
                                {getMaxTranchePrevisions() === 0 ? 'Débloquer prévisions (1ère tranche)'
                                    : projet.previsions.find(r => r.numeroTranche === getMaxTranchePrevisions()).etat === 'Terminée'
                                        && projet.realisations.length > 0 && getMaxTranchePrevisions() === getMaxTrancheRealisations()
                                        && projet.realisations.find(r => r.numeroTranche === getMaxTrancheRealisations()).etat === 'Terminée' ?
                                        `Débloquer prévisions (${getMaxTranchePrevisions()}ème tranche)` : 'Prévisions'}

                            </Box>
                        </Button>
                        {getMaxTranchePrevisions() > 0 &&
                            projet.realisations.length > 0 && getMaxTranchePrevisions() === getMaxTrancheRealisations()
                            && projet.realisations.find(r => r.numeroTranche === getMaxTrancheRealisations()).etat === 'Terminée'
                            &&
                            <Button
                                size="small"
                            // onClick={handleToggleButtonGroup}
                            ><ArrowDropDownIcon /></Button>}
                    </ButtonGroup>
                    {projet.previsions.length > 0 &&
                        projet.previsions.find(r => r.numeroTranche === 1).etat === statusPrevision.accepted
                        &&
                        <ButtonGroup>
                            <Button variant='outlined' className={classes.btn}
                                onClick={viewRealisations}>
                                <Box sx={{ typography: 'body1', color: theme.palette.primary.main }}>
                                    {getMaxTrancheRealisations() === 0 ? 'Débloquer réalisations (1ère tranche)'
                                        : projet.previsions.every(p => p.etat === statusPrevision.accepted)
                                            && getMaxTranchePrevisions() > getMaxTrancheRealisations()
                                            && projet.realisations.every(p => p.etat === statusRealisation.terminee)
                                            ? `Débloquer réalisations (${getMaxTrancheRealisations() + 1}ème tranche)` : 'Réalisations'}
                                </Box>
                            </Button>
                            {getMaxTrancheRealisations() > 0 &&
                                projet.previsions.every(p => p.etat === statusPrevision.accepted)
                                && getMaxTranchePrevisions() > getMaxTrancheRealisations()
                                && projet.realisations.every(p => p.etat === statusRealisation.terminee)
                                &&
                                <Button
                                    size="small"
                                // onClick={handleToggleButtonGroup}
                                ><ArrowDropDownIcon /></Button>}
                        </ButtonGroup>}
                    {/* TODO  */}
                    <Button variant='outlined' className={classes.btn}
                        onClick={viewRevenu}>
                        <Box sx={{ typography: 'body1', color: theme.palette.primary.main }}>
                            Débloquer revenus
                        </Box>
                    </Button>
                </div>
            </div>
        </>
};

export default Projet;