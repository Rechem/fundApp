import React, { useState, useEffect, useRef } from 'react';
import {
    Typography, useTheme, Button, Dialog, Box, CircularProgress,
    Grid, FormHelperText, FormControl
} from '@mui/material';
import classes from './demande.module.css'
import InfoDemande from '../../components/details-demande/info-demande';
import Status from '../../components/status/status';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import FormComplement from '../../components/form/form-complement/form-complement';
import FormAccepter from '../../components/form/form-accepter/form-accepter';
import FormRefuser from '../../components/form/form-refuser/form-refuser';
import axios from 'axios';
import { isAdmin, isModo, isSimpleUser } from '../../utils';
import { statusDemande } from '../../utils';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../../components/confirmation-dialog/confirmation-dialog'
import { useNavigate, Link } from 'react-router-dom';
import Motif from '../../components/motif/motif';
import CustomModal from '../../components/custom-modal/custom-modal';

const Demande = () => {

    const navigate = useNavigate()

    const { idDemande } = useParams()

    const authenticationState = useSelector(state => state.login)

    const [openDialog, setOpenDialog] = useState(false)

    const [demande, setDemande] = useState('')
    const [isLoading, setIsloading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [files, setFiles] = useState({});
    const [isValid, setValidating] = useState({});
    const refs = useRef([])

    useEffect(() => {
        if (demande)
            refs.current = refs.current.slice(0, demande.complements.length);

    }, [demande.complements]);

    const theme = useTheme()

    const [form, setForm] = useState('')
    const [openAlert, setOpenAlert] = useState(false)

    const closeDialog = () => {

    }

    const openAccepterForm = () => {
        setForm('accepter')
        setOpenDialog(true)
    }

    const openDeprogrammerForm = () => {
        setOpenAlert(true)
    }

    const openRefuserForm = () => {
        setForm('refuser')
        setOpenDialog(true)
    }
    const openComplementForm = () => {
        setForm('complement')
        setOpenDialog(true)
    }

    const onClickUpload = (inputFile, id) => {
        inputFile.click();
        setValidating({ ...isValid, [id]: true })
    };

    const fileUploadHandler = (event, c) => {
        setFiles({
            ...files, [c.idComplement]: {
                file: event.target.files[0],
                filename: event.target.files[0].name,
                nomComplement: c.nomComplement,
                cheminComplement: c.cheminComplement
            }
        })
    }

    const validateAndSubmitComplements = async () => {
        demande.complements.forEach(c => {
            setValidating(prevState => ({
                ...prevState,
                [c.idComplement]: c.cheminComplement || (files[c.idComplement] && files[c.idComplement].filename)

            }))
        })
        const filesValid = demande.complements.every(c => c.cheminComplement || files[c.idComplement])

        if (filesValid) {
            const keys = Object.keys(files)

            setSubmitting(true)
            let hasErrorOccured = false;
            for await (const key of keys) {

                const formData = new FormData()
                formData.append('idComplement', key)
                formData.append('complementFile', files[key].file)

                try {
                    await axios.patch('/complements', formData)

                } catch (e) {
                    hasErrorOccured = true
                    toast.error(`Une erreur est survenue lors de l'upload du document ${files[key].filename}`)
                }

            }
            setSubmitting(false)
            await fetchDemande()
            if (!hasErrorOccured) {
                toast.success("Succès")
            }
        }
    }

    const fetchDemande = async () => {
        if (authenticationState.user.idUser) {
            try {
                setIsloading(true)
                const response = await axios.get(`/demandes/${idDemande}`)
                setDemande(response.data.data.demande);
                setIsloading(false)
            } catch (e) {
                if (e.response.status === 404)
                    navigate('/notfound')
                else
                    toast.error(e.response.data.message)
            }
        }
    }

    const deprogrammerDemande = async id => {
        try {
            await axios.patch(
                `/demandes`, { idDemande: id, etat: statusDemande.pending })
            setOpenAlert(false)
        } catch (e) {
            throw e
        }
    }

    const getMotifs = async () => {
        try {
            const response = await axios.get(
                `/motifs/demande/${demande.idDemande}`)
            return response.data.data.motifsDemande
        } catch (e) {
            throw e
        }
    }

    const setSeenMotifs = async () => {
        try {
            await axios.patch(
                `/motifs/demande/${demande.idDemande}`)
        } catch (e) {
            throw e
        }
    }

    let formUI = null;

    switch (form) {
        case 'accepter':
            formUI = <FormAccepter
                idDemande={demande.idDemande}
                etat={demande.etat}
                afterSubmit={fetchDemande}
                onClose={() => setOpenDialog(false)} />
            break;
        case 'refuser':
            formUI = <FormRefuser
                idDemande={demande.idDemande}
                afterSubmit={fetchDemande}
                onClose={() => setOpenDialog(false)} />
            break;
        case 'complement':
            formUI = <FormComplement
                idDemande={demande.idDemande}
                afterSubmit={fetchDemande}
                onClose={() => setOpenDialog(false)} />
            break;
        default:
            formUI = null
            break;
    }

    useEffect(() => {
        if (authenticationState.user.idUser)
            fetchDemande()
    }, [authenticationState.user.idUser])

    return (
        <React.Fragment>
            <div className={classes.hdr}>
                <Typography color={theme.palette.text.main}
                    variant='h3' display='inline'>
                    Demande{' '}
                </Typography>
                <Typography color={theme.palette.text.main}
                    variant='subtitle2' display='inline' fontWeight={400}>
                    Id{demande && demande.idDemande}
                </Typography>
            </div>
            {isLoading ? <CircularProgress /> :
                <React.Fragment>
                    <div className={classes.etatContainer}>
                        <div className={classes.etatSubContainer}>
                            <Typography display='inline' marginRight='1rem'
                                fontWeight={600}>
                                Etat
                            </Typography>
                            <div>
                                <Status status={demande.etat} />
                            </div>
                        </div>
                        < Motif getMotifs={getMotifs}
                            setSeenMotifs={setSeenMotifs} />
                    </div>
                    <Box sx={{ fontWeight: 700, color: theme.palette.text.main, }} mb={1.5}
                    >Demandeur</Box>
                    <Box component={Link}
                        to={isSimpleUser(authenticationState) ? '/me' : `/users/${demande.userId}`}
                        sx={{
                            display: 'inline',
                            color: theme.palette.text.primary
                        }}>
                        <div className={classes.userContainer}>
                            <img src={process.env.PUBLIC_URL + '/asf-logo-white.png'} alt='Avatar'
                                className={classes.img} />
                            {demande &&

                                <Typography fontWeight={400}>{demande.user.nom} {demande.user.prenom}</Typography>
                            }
                        </div>
                    </Box>
                    <Box sx={{ fontWeight: 700, color: theme.palette.text.main, }} mb={1.5}
                    >Détails sur l'entreprise</Box>
                    <InfoDemande {...demande} />
                    {demande && demande.complements.length > 0 &&
                        <>
                            <Typography color={theme.palette.text.main}
                                marginBottom='0.5rem'
                                marginTop='2rem'
                                fontWeight={700}>
                                Compléments
                            </Typography>
                            <div>
                                <Grid container columnSpacing={2} rowSpacing={1.5}>
                                    {demande.complements.map((c, i) => {
                                        return <Grid container item key={i} sm={6} columnSpacing={1}
                                            className={classes.gridContainer}>
                                            <Grid xs={12} item style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography sx={{ display: 'block' }}>
                                                    {c.nomComplement}:
                                                </Typography>
                                                {c.cheminComplement ?
                                                    <Box
                                                        component="a"
                                                        href={`${process.env.REACT_APP_BASE_URL}${c.cheminComplement}`}
                                                        target='_blank' sx={{
                                                            color: theme.palette.primary.main,
                                                            display: 'inline', marginLeft: '0.5rem'
                                                        }}>
                                                        Voir
                                                    </Box >
                                                    : !isSimpleUser(authenticationState) ?
                                                        <Typography variant='body2' noWrap display='inline'
                                                            marginLeft='0.5rem'>
                                                            <i>Pas encore fourni</i>
                                                        </Typography>
                                                        : null
                                                }
                                            </Grid>
                                            {!c.cheminComplement &&
                                                isSimpleUser(authenticationState) &&
                                                <Grid xs={12} item>
                                                    <FormControl error={isValid && [c.idComplement] in isValid && !isValid[c.idComplement]}
                                                        fullWidth style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                        }}>
                                                        <div className={classes.fileBtnContainer}>
                                                            <Button
                                                                onClick={() => onClickUpload(refs.current[i], c.idComplement)}
                                                                className={classes.filebtn} variant='outlined'
                                                                disabled={demande.etat !== statusDemande.complement}>
                                                                <input type='file'
                                                                accept='.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpeg,.jpg,.png'
                                                                    onChange={(e) => fileUploadHandler(e, c)}
                                                                    style={{ display: 'none' }}
                                                                    id='file' ref={el => refs.current[i] = el} />
                                                                {files[c.idComplement] ? 'Remplacer' : 'Ajouter'}
                                                            </Button>
                                                            {files[c.idComplement] &&
                                                                <Typography variant='body2' noWrap display='inline'
                                                                    marginLeft='0.5rem'
                                                                    style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                                                    {files[c.idComplement].filename}
                                                                </Typography>}
                                                            {isValid && [c.idComplement] in isValid && !isValid[c.idComplement] &&
                                                                <FormHelperText style={{ marginLeft: '0.5rem' }}>
                                                                    Vous devez fournir un fichier
                                                                </FormHelperText>}
                                                        </div>
                                                    </FormControl>
                                                </Grid>
                                            }
                                            {/* <Grid item style={{ height: '100%' }}></Grid> */}
                                        </Grid>
                                    })}
                                </Grid>
                                {isSimpleUser(authenticationState) &&
                                    !demande.complements.every(c => c.cheminComplement)
                                    && demande.etat === statusDemande.complement &&
                                    <div className={classes.gridBtn}>
                                        <Button variant='contained'
                                            disabled={submitting}
                                            startIcon={submitting ?
                                                <CircularProgress color='background'
                                                    size='1rem' marginRight={1} /> :
                                                null}
                                            onClick={validateAndSubmitComplements}
                                        >
                                            <Typography color='white'
                                                fontWeight={700}>Envoyer</Typography>
                                        </Button>
                                    </div>
                                }
                            </div>
                        </>}
                    {isAdmin(authenticationState) &&
                        demande.etat !== statusDemande.accepted &&
                        <>
                            <div className={classes.outerBtnContainer}>
                                <div className={classes.btnContainer}>
                                    <Grid container columns={3} rowSpacing='1rem' columnSpacing='1rem'>
                                        <Grid item xs={3} md={1}>
                                            <Button variant='outlined' className={classes.btnSecondary}
                                                onClick={openComplementForm}>
                                                <Typography color='primary'>Demander compléments</Typography>
                                            </Button>
                                        </Grid>
                                        {demande.etat !== statusDemande.refused &&
                                            <Grid item xs={3} md={1}>
                                                <Button variant='outlined' className={classes.btnSecondary}
                                                    onClick={openRefuserForm}>
                                                    <Typography color='primary'>Refuser</Typography>
                                                </Button>
                                            </Grid>
                                        }
                                        <Grid item xs={3} md={1}>
                                            <Button variant={
                                                demande.etat === statusDemande.programmee ?
                                                    'outlined' : 'contained'}
                                                className={demande.etat === statusDemande.programmee ?
                                                    classes.btnSecondary : classes.btn}
                                                onClick={demande.etat === statusDemande.programmee ?
                                                    openDeprogrammerForm : openAccepterForm}>
                                                {demande.etat === statusDemande.programmee ?
                                                    <Typography color='primary'>Déprogrammer</Typography>
                                                    : <Typography
                                                        color='white' fontWeight={500}>
                                                        {demande.etat === statusDemande.preselectionnee ?
                                                            'Programmer' : 'Accepter'}
                                                    </Typography>
                                                }
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                            <CustomModal open={openDialog}
                                onClose={() => setOpenDialog(false)}>
                                {formUI}
                            </CustomModal>
                            <ConfirmationDialog open={openAlert} onClose={() => setOpenAlert(false)}
                                onConfirm={() => deprogrammerDemande(demande.idDemande)}
                                afterSubmit={fetchDemande}>
                                Etes-vous sûr de vouloir déprogrammer cette demande ?
                            </ConfirmationDialog>
                        </>
                    }
                </React.Fragment>}
        </React.Fragment>
    );
};

export default Demande;