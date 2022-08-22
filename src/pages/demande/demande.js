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
import FormComplement from '../../components/form-complement/form-complement';
import FormAccepter from '../../components/form-accepter/form-accepter';
import FormRefuser from '../../components/form-refuser/form-refuser';
import axios from 'axios';
import { isAdmin, isModo, isSimpleUser } from '../../utils';
import STATUS from '../../components/status/status-enum';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../../components/confirmation-dialog/confirmation-dialog'
import { useNavigate } from 'react-router-dom';

const getFileName = (response) => {
    const headerLine = response.headers['content-disposition'];
    const startFileNameIndex = headerLine.indexOf('"') + 1
    const endFileNameIndex = headerLine.lastIndexOf('"');
    const filename = headerLine.substring(startFileNameIndex, endFileNameIndex);
    return filename;
}

const downloadComplement = async id => {
    const BASE_URL = process.env.REACT_APP_BASE_URL
    const response = await axios.post(BASE_URL + `/complements/${id}/download`,
        { responseType: 'blob' })
    const fileName = getFileName(response)
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    if (typeof window.navigator.msSaveBlob === 'function') {
        window.navigator.msSaveBlob(
            response.data,
            fileName
        );
    } else {
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
    }
}

const Demande = () => {

    const navigate = useNavigate()

    const { idDemande } = useParams()

    const authenticationState = useSelector(state => state.login)

    const [openDialog, setOpenDialog] = useState(false)

    const [demande, setDemande] = useState('')
    const [isLoading, setIsloading] = useState(true)

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
            for await (const key of keys) {

                const formData = new FormData()
                formData.append('idComplement', key)
                formData.append('complementFile', files[key].file)
                // console.log(files[key].file);
                try {
                    // setLoading(true)
                    // await axios.patch('/complements', formData)
                    throw new Error()
                } catch (e) {
                    // throw e
                    //TOAST IT 
                    toast.error(`Une erreur est survenue lors de l'upload du document ${files[key].filename}`)
                }
                // setLoading(false)
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
                navigate('/notfound')
            }
        }
    }

    const deprogrammerDemande = async id => {
        try {
            await axios.patch(
                `/demandes`, { idDemande: id, etat: STATUS.pending })
            setOpenAlert(false)
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
        fetchDemande()
    }, [authenticationState.user.idUser])

    return (
        <React.Fragment>
            <div className={classes.hdr}>
                <Typography color={theme.palette.text.main}
                    variant='h3'>
                    Demande
                </Typography>
            </div>

            {isLoading ? <CircularProgress /> :
                <React.Fragment>
                    <Typography display='block' marginBottom='1rem'
                        variant='subtitle2' fontWeight={400}>
                        Demande {demande.idDemande}
                    </Typography>
                    <div className={classes.etatContainer}>
                        <Typography display='inline' marginRight='1rem'
                            fontWeight={600}>
                            Etat
                        </Typography>
                        <div >
                            <Typography className={classes.test}>
                            </Typography>
                            <Status status={demande.etat} />
                        </div>
                    </div>
                    <Typography marginBottom='0.5rem' fontWeight={600}>
                        Demandeur
                    </Typography>
                    <div className={classes.userContainer}>
                        <img src={process.env.PUBLIC_URL + '/asf-logo-white.png'} alt='Avatar'
                            className={classes.img} />
                        {demande &&
                            <Typography fontWeight={400}>{demande.user.nom} {demande.user.prenom}</Typography>
                        }
                    </div>
                    <Typography color={theme.palette.text.main}
                        marginBottom='0.5rem'
                        fontWeight={700}>
                        Détails sur l'entreprise
                    </Typography>
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
                                <Grid container columnSpacing={2} rowSpacing={2}>
                                    {demande.complements.map((c, i) => {
                                        return <Grid container item key={i} sm={6} columnSpacing={1} 
                                            className={classes.gridContainer}>
                                            <Grid xs={12} style={{ marginBottom: '0.5rem'}} item>
                                                {c.nomComplement}:
                                                {c.cheminComplement ?
                                                    <span onClick={() => downloadComplement(c.idComplement)} style={{ cursor: 'pointer' }}>
                                                        <Typography
                                                            color={theme.palette.primary.main}
                                                            display='inline' marginLeft='0.5rem'
                                                        >Voir</Typography>
                                                    </span>
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
                                                                disabled={demande.etat !== STATUS.complement}>
                                                                <input type='file'
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
                                                                <FormHelperText style={{marginLeft:'0.5rem'}}>
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
                                    && demande.etat === STATUS.complement &&
                                    <div className={classes.gridBtn}>
                                        <Button variant='contained'
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
                        (demande.etat !== STATUS.accepted && demande.etat !== STATUS.refused) &&
                        <>
                            <div className={classes.outerBtnContainer}>
                                <div className={classes.btnContainer}>
                                    <Button variant='outlined' className={classes.btnSecondary}
                                        onClick={openComplementForm}>
                                        <Typography color='primary'>Demander compléments</Typography>
                                    </Button>
                                    <Button variant='outlined' className={classes.btnSecondary}
                                        onClick={openRefuserForm}>
                                        <Typography color='primary'>Refuser</Typography>
                                    </Button>
                                    <Button variant={
                                        demande.etat === STATUS.programmee ?
                                            'outlined' : 'contained'}
                                        className={demande.etat === STATUS.programmee ?
                                            classes.btnSecondary : classes.btn}
                                        onClick={demande.etat === STATUS.programmee ?
                                            openDeprogrammerForm : openAccepterForm}>
                                        {demande.etat === STATUS.programmee ?
                                            <Typography color='primary'>Déprogrammer</Typography>
                                            : <Typography
                                                color='white' fontWeight={700}>
                                                {demande.etat === STATUS.preselectionnee ?
                                                    'Programmer' : 'Accepter'}
                                            </Typography>
                                        }
                                    </Button>
                                </div>
                            </div>
                            <Dialog
                                open={openDialog}
                                onClose={() => setOpenDialog(false)}
                                maxWidth='100%'>
                                <Box className={classes.modelContainer}>
                                    {formUI}
                                </Box>
                            </Dialog>
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