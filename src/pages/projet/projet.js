import React, { useEffect, useState, useRef } from 'react';
import classes from './projet.module.css'
import {
    Grid, Divider, useTheme, Box, CircularProgress,
    Dialog, Button, ButtonGroup, MenuItem, MenuList,
    ClickAwayListener, Paper, Grow, Popper, Typography
} from '@mui/material';
import InfoDemande from '../../components/details-demande/info-demande';
import CustomStepper from '../../components/custom-stepper/custom-stepper';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import FormMontant from '../../components/form/form-montant/form-montant'
import FormTranche from '../../components/form/form-tranche/form-tranche';
import { Link } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { isAdmin, isSimpleUser, statusPrevision, statusRealisation, statusRevenu, getWarningMessages } from '../../utils';
import ConfirmationDialog from '../../components/confirmation-dialog/confirmation-dialog'
import CustomModal from '../../components/custom-modal/custom-modal';

const Projet = props => {

    const navigate = useNavigate()

    const theme = useTheme()
    const primaryColor = theme.palette.primary.main
    const textColor = theme.palette.text.main

    const { idProjet } = useParams()

    const authenticationState = useSelector(state => state.login)

    const [projet, setProjet] = useState(null)

    const [open, setOpen] = useState(false);

    const [openAlert, setOpenAlert] = useState(false)

    const handleDialogOpen = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };
    const [openButtonGroup2, setOpenButtonGroup2] = useState(false);

    const [openButtonGroup, setOpenButtonGroup] = useState(false);

    const anchorRef = React.useRef(null);
    const anchorRef2 = React.useRef(null);

    const handleToggleButtonGroup = () => {
        setOpenButtonGroup((prevOpen) => !prevOpen);
    };

    const handleCloseButtonGroup = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpenButtonGroup(false);
    };

    const handleToggleButtonGroup2 = () => {
        // debugger
        console.log(isPrevision);
        setOpenButtonGroup2((prevOpen) => !prevOpen);
    };

    const handleCloseButtonGroup2 = (event) => {
        if (anchorRef2.current && anchorRef2.current.contains(event.target)) {
            return;
        }
        setOpenButtonGroup2(false);
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
                if (e.response.status === 404)
                    navigate('/notfound')
                else
                    toast.error(e.response.data.message)
            }
        }
    }

    useEffect(() => {
        if (projet) {

            if (!projet.tranche && projet.montant && isSimpleUser(authenticationState)) {
                setForm('tranche')
                handleDialogOpen()
            } else if (!projet.montant && isAdmin(authenticationState)) {
                setForm('montant')
                handleDialogOpen()
            }
        }
    }, [projet])

    useEffect(() => {
        fetchProjet()
    }, [authenticationState.user.idUser])

    const dispatchSeenPrevisions = async () => {
        if (isSimpleUser(authenticationState) && projet && projet.previsions.length > 0
            && !projet.previsions[projet.previsions.length - 1].seenByUser
            && [statusPrevision.brouillon, statusPrevision.accepted]
                .includes(projet.previsions[projet.previsions.length - 1].etat)) {
            try {
                await axios.patch(`/previsions/seenByUser/${projet.idProjet}/${projet.previsions[projet.previsions.length - 1].numeroTranche}`)
            } catch (e) {
            }
        }
    }

    const dispatchSeenRealisations = async () => {
        if (isSimpleUser(authenticationState) && projet && projet.realisations.length > 0
            && !projet.realisations[projet.realisations.length - 1].seenByUser
            && projet.realisations[projet.realisations.length - 1].etat === statusRealisation.terminee) {
            try {
                await axios.patch(`/realisations/seenByUser/${projet.idProjet}/${projet.realisations[projet.realisations.length - 1].numeroTranche}`)
            } catch (e) {
            }
        }
    }

    const dispatchSeenRevenu = async () => {
        if (isSimpleUser(authenticationState) && projet && projet.revenu
            && !projet.revenu.seenByUser
            && projet.revenu.etat === statusRevenu.waiting) {
            try {
                await axios.patch(`/revenus/seenByUser/${projet.idProjet}`)
            } catch (e) {
            }
        }
    }

    useEffect(() => {
        dispatchSeenPrevisions()
        dispatchSeenRealisations()
        dispatchSeenRevenu()
    }, [projet, authenticationState.user.idUser])


    const isDebloquerPrevision = () =>
        projet.tranche && isAdmin(authenticationState) && (
            projet.previsions.length === 0
            || (projet.previsions.find(r => r.numeroTranche === projet.previsions.length).etat === statusPrevision.accepted
                && projet.realisations.length > 0 && projet.previsions.length === projet.realisations.length
                && projet.realisations.find(r => r.numeroTranche === projet.realisations.length).etat === statusRealisation.terminee
                && projet.previsions.length < projet.tranche.nbTranches));

    const isPrevision = () =>
        projet.previsions.length > 0 &&
        projet.previsions.find(r => r.numeroTranche === projet.previsions.length).etat !== statusPrevision.accepted

    const isDebloquerRealisation = () =>
        isAdmin(authenticationState) && projet.previsions.length > 0 &&
        projet.previsions.every(p => p.etat === statusPrevision.accepted)
        && projet.previsions.length === projet.realisations.length + 1

    const isRealisation = () => projet.realisations.length > 0
        && projet.previsions.length === projet.realisations.length
        && (projet.realisations[projet.realisations.length - 1].etat !== statusRealisation.terminee
            || projet.realisations[projet.realisations.length - 1].etat === statusRealisation.terminee
            && projet.realisations.length === projet.tranche.nbTranches)


    const debloquerPrevisions = async () => {
        if (isDebloquerPrevision()) {
            await axios.post('/previsions', {
                projetId: projet.idProjet,
            })
        }
    }

    const viewPrevisions = async () => {
        navigate(`prevision/${projet.previsions.length}`)
    }

    const debloquerRealisation = async () => {
        if (isDebloquerRealisation()) {
            await axios.post('/realisations', {
                projetId: projet.idProjet,
            })
        }
    }

    const viewRealisations = async () => {
        navigate(`realisation/${projet.realisations.length}`)
    }

    const viewRevenu = () => {
        navigate(`revenu`)
    }

    let formUI;

    const [form, setForm] = useState('')

    switch (form) {
        case 'montant':
            formUI = <FormMontant
                idProjet={projet.idProjet}
                nomProjet={projet.demande.denominationCommerciale}
                afterSubmit={fetchProjet}
                onClose={handleDialogClose} />
            break;
        case 'tranche':
            formUI = <FormTranche
                idProjet={projet.idProjet}
                montant={projet.montant}
                afterSubmit={fetchProjet}
                onClose={handleDialogClose} />
            break;

        default:
            break;
    }

    return !projet ?
        <CircularProgress size='2rem' style={{ marginTop: '1rem' }} /> :
        <>
            <Box sx={{
                color: theme.palette.text.main,
                typography: 'h3'
            }} className={classes.hdr}>
                Projet
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
                            <CustomStepper steps={projet.tranche.nbTranches}
                                activeSteps={projet.previsions.length || 0}
                            />
                            : isSimpleUser(authenticationState) && projet.montant ?
                                <Button variant='contained'
                                    sx={{ padding: 0 }}
                                    onClick={handleDialogOpen}>
                                    <Box sx={{ color: 'white' }} >
                                        Choisir
                                    </Box>
                                </Button> : <i style={{ display: 'block' }}>-</i>}
                    </Grid>
                    <Grid container item xs={12} sm={4}
                        columnSpacing={1}
                    >
                        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Box sx={{ color: textColor, textAlign: 'right' }}  >
                                Montant accordé:
                            </Box>
                        </Grid>

                        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            {projet.montant ?
                                <Box sx={{
                                    fontWeight: 600, color: projet.montant ? primaryColor : theme.palette.warning.main
                                    , textAlign: 'left'
                                }}    >
                                    {projet.montant} DZD
                                </Box> :
                                isSimpleUser(authenticationState) ?
                                    <>
                                        <i>-</i>
                                    </> :
                                    <Button variant='contained'
                                        sx={{ padding: 0 }}
                                        onClick={() => {
                                            setForm('tranche')
                                            handleDialogOpen()
                                        }}>
                                        <Box sx={{ color: 'white' }} >
                                            Définir
                                        </Box>
                                    </Button>
                            }

                        </Grid>
                        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Box sx={{ color: textColor, textAlign: 'right' }} >
                                Revenu:{' '}
                            </Box>
                        </Grid>
                        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Box sx={{ fontWeight: 600, color: primaryColor, textAlign: 'left' }}  >
                                {projet.revenu ? projet.revenu : 0}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            {getWarningMessages(projet, authenticationState).map((m, i) =>
                <Typography className={classes.center} key={i}
                    variant='body2' color={
                        m.priority > 1 ? theme.palette.success.main :
                            m.priority > 0 ? theme.palette.warning.main :
                                theme.palette.error.main}
                    fontWeight={600} mt={1}>
                    {m.message}
                </Typography>
            )}
            <Divider />
            <Box sx={{ typography: 'body1', fontWeight: 600, color: textColor, }}
                mb={0.5} mt={2}>
                Document d'accord de financement
            </Box>
            {projet.documentAccordFinancement ?
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
                </Box> :
                isSimpleUser(authenticationState) && <>-</>}
            {isAdmin(authenticationState) &&
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
            }
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
                <Grid item xs={12} sm={6} columnSpacing={0.5}>
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
                            {dayjs(projet.demande.commission.dateCommission).format('DD/MM/YYYY')}
                        </Box>
                    </Grid>
                </Grid>
                {isAdmin(authenticationState) &&
                    <Grid item xs={12} sm={6} columnSpacing={0.5}>
                        <Box component={Link}
                            to={`/commissions/${projet.demande.commission.idCommission}`}
                            sx={{
                                color: theme.palette.primary.main,
                                display: 'inline',
                            }}>
                            Voir commission
                        </Box>
                    </Grid>
                }
            </Grid>
            <CustomModal open={open} onClose={handleDialogClose}>
                {formUI}
            </CustomModal>
            {
                isAdmin(authenticationState) &&
                (isDebloquerPrevision() || isDebloquerRealisation()) &&
                <ConfirmationDialog
                    open={openAlert}
                    afterSubmit={fetchProjet}
                    onClose={() => setOpenAlert(false)}
                    onConfirm={isDebloquerPrevision() ? debloquerPrevisions : debloquerRealisation}>
                    {isDebloquerPrevision() ? `Voulez-vous vraiment débloquer les prévisions de la ${projet.previsions.length > 0
                        ? projet.previsions.length + 1 + 'ème' : '1ère'} tranche` :
                        `Voulez-vous vraiment débloquer les réalisations de la ${projet.realisations.length > 0
                            ? projet.realisations.length + 1 + 'ème' : '1ère'} tranche`}

                </ConfirmationDialog>
            }
            <div className={classes.outerBtnContainer}>
                {(isSimpleUser(authenticationState) || isAdmin(authenticationState)) &&
                    <div className={classes.btnContainer}>
                        <Grid container columns={2} rowSpacing='1rem' columnSpacing='1rem'>
                            {(isSimpleUser(authenticationState) && projet.previsions.length > 0
                                || isAdmin(authenticationState) && projet.montant && projet.tranche)
                                &&
                                <Grid item xs={2} md={1}>
                                    <div className={classes.btn}>
                                        <ButtonGroup ref={anchorRef2} fullWidth>
                                            {isAdmin(authenticationState) ?
                                                (isDebloquerRealisation() ?
                                                    <Button onClick={() => setOpenAlert(true)}
                                                        fullWidth>{`Débloquer réalisations ${projet.realisations.length > 0
                                                            ? projet.realisations.length + 1 + 'ème' : '1ère'} tranche`}</Button> :
                                                    (isDebloquerPrevision() ?
                                                        <Button onClick={() => setOpenAlert(true)}
                                                            fullWidth>{`Débloquer prévisions ${projet.previsions.length > 0
                                                                ? projet.previsions.length + 1 + 'ème' : '1ère'} tranche`}</Button> :
                                                        (isRealisation() ?
                                                            <Button onClick={viewRealisations}
                                                                fullWidth>Réalisations</Button> :
                                                            (isPrevision() ?
                                                                <Button onClick={viewPrevisions}
                                                                    fullWidth>Prévisions</Button> : null))))
                                                : projet.previsions.length === 0 ? null :
                                                    projet.previsions.length > projet.realisations.length ?
                                                        <Button onClick={viewPrevisions}
                                                            fullWidth>Prévisions</Button> :
                                                        <Button onClick={viewRealisations}
                                                            fullWidth>Réalisations</Button>
                                            }

                                            {(isSimpleUser(authenticationState) && projet.realisations.length > 0
                                                || isAdmin(authenticationState) && projet.previsions.length > 0 &&
                                                projet.previsions[0].etat === statusPrevision.accepted) &&
                                                <Button
                                                    size="small"
                                                    sx={{ maxWidth: '3rem' }}
                                                    onClick={handleToggleButtonGroup2}
                                                ><KeyboardArrowUpIcon /></Button>
                                            }
                                        </ButtonGroup>
                                    </div>
                                </Grid>

                            }
                            {(isSimpleUser(authenticationState) && projet.realisations.length > 0
                                || isAdmin(authenticationState) && projet.previsions.length > 0) &&
                                projet.previsions[0].etat === statusPrevision.accepted
                                &&
                                <Popper
                                    className={classes.btn}
                                    sx={{
                                        zIndex: 1,
                                    }}
                                    open={openButtonGroup2}
                                    anchorEl={anchorRef2.current}
                                    role={undefined}
                                    transition
                                    disablePortal
                                    placement='top'
                                >
                                    {({ TransitionProps, placement }) => (
                                        <Grow
                                            {...TransitionProps}
                                            style={{
                                                transformOrigin:
                                                    placement === 'bottom' ? 'center top' : 'center bottom',
                                            }}
                                        >
                                            <Paper >
                                                <ClickAwayListener onClickAway={handleCloseButtonGroup2}>
                                                    <MenuList id="split-button-menu" >
                                                        {isAdmin(authenticationState) &&
                                                            (isDebloquerPrevision() && projet.previsions.length > 0 ?
                                                                <MenuItem onClick={viewPrevisions}>
                                                                    Prévisions
                                                                </MenuItem> :
                                                                isDebloquerRealisation() && projet.realisations.length > 0 ?
                                                                    <MenuItem onClick={viewRealisations}>
                                                                        Réalisations
                                                                    </MenuItem> : null)
                                                        }

                                                        {isSimpleUser(authenticationState) ?
                                                            (projet.previsions.length > 0 &&
                                                                projet.previsions.length === projet.realisations.length ?
                                                                <MenuItem onClick={viewPrevisions}>
                                                                    Prévisions
                                                                </MenuItem> :
                                                                projet.realisations.length > 0 &&
                                                                    projet.realisations.length === projet.previsions.length - 1 ?
                                                                    <MenuItem onClick={viewRealisations}>
                                                                        Réalisations
                                                                    </MenuItem> : null) :
                                                            //admin
                                                            (projet.previsions[projet.previsions.length - 1].etat === statusPrevision.accepted
                                                                && (projet.realisations.length === projet.previsions.length - 1
                                                                    || projet.realisations[projet.realisations.length - 1].etat !== statusRealisation.terminee
                                                                    || (projet.realisations[projet.realisations.length - 1].etat === statusRealisation.terminee
                                                                        && projet.realisations.length === projet.tranche.nbTranches))) ?
                                                                <MenuItem onClick={viewPrevisions}>
                                                                    Prévisions
                                                                </MenuItem> :
                                                                ((projet.realisations.length === projet.previsions.length
                                                                    && projet.realisations[projet.realisations.length - 1].etat === statusRealisation.terminee
                                                                    && projet.realisations.length < projet.tranche.nbTranches) ||
                                                                    (projet.previsions[projet.previsions.length - 1].etat !== statusPrevision.accepted
                                                                        && projet.realisations.length === projet.previsions.length - 1)) ?
                                                                    <MenuItem onClick={viewRealisations}>
                                                                        Réalisations
                                                                    </MenuItem> : null}
                                                    </MenuList>
                                                </ClickAwayListener>
                                            </Paper>
                                        </Grow>
                                    )}
                                </Popper>


                            }

                            <Grid item xs={2} md={1}>
                                <Button variant='outlined'
                                    style={{ height: '100%' }}
                                    className={classes.btn} fullWidth
                                    onClick={viewRevenu}>
                                    Revenus
                                </Button>
                            </Grid>
                        </Grid >
                    </div>
                }
            </div >
        </>
};

export default Projet;