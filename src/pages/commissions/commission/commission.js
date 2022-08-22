import React, { useState, useEffect, useRef } from 'react';
import classes from './commission.module.css'
import {
    useTheme, Typography, MenuItem, CircularProgress,
    Button, Dialog, Box, FormHelperText, FormControl,
    Chip
} from '@mui/material';
import { CustomSelect } from '../../../theme'
import Status from '../../../components/status/status'
import STATUS from '../../../components/status/status-enum'
import Toolbar from '../../../components/toolbar/toolbar';
import DemandesTable from '../../demandes/demandes-table';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import FormCommission from '../../../components/form-commission/form-commission';
import dayjs from 'dayjs'
import CreationProjetsInfo from '../../../components/creation-projets-info/creation-projets-info';
import { useNavigate } from 'react-router-dom'
import FormAjouterDemande from '../../../components/form-ajouter-demande/form-ajouter-demande';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Commission = () => {

    const { idCommission } = useParams()

    const theme = useTheme()

    const [etatCommission, setEtatCommission] = useState(STATUS.pending)
    const [etatDemandes, setEtatDemandes] = useState({})
    const authenticationState = useSelector(state => state.login)

    const [commission, setCommission] = useState('')
    const [projets, setProjets] = useState([])
    // const [isLoading, setIsloading] = useState(true)
    const [errors, setErrors] = useState({})

    const updateEtatDemandes = (id, etat) => {
        setErrors({ ...errors, demandes: '' })
        setEtatDemandes({ ...etatDemandes, [id]: etat })
    }

    const [open, setOpen] = useState(false);
    const [dialog, setDialog] = useState('edit'); //'edit', 'notification' 

    const openEditDialog = () => {
        setDialog('edit')
        setOpen(true);
    };

    const openCreationDialog = () => {
        setDialog('notification')
        setOpen(true);
    };

    const openAjouterDemandeDialog = () => {
        setDialog('ajouter-demande')
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const navigate = useNavigate();
    const inputFile = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(null);

    const onChangeHandler = e => {
        const { name, value } = e.target
        setEtatCommission(value)
        if (value === STATUS.pending)
            setErrors({})
    }

    const onClickUpload = () => {
        inputFile.current.click();
        setErrors({ ...errors, rapport: '' })
    };

    const fileUploadHandler = (event) => {
        setSelectedFile(event.target.files[0])
        setSelectedFileName(event.target.files[0].name)
    }

    const validateCommission = async () => {

        let temp = {}


        const demandesAreValid = Object.values(etatDemandes)
            .every(d => d === STATUS.accepted || d === STATUS.refused)

        temp.demandes = !demandesAreValid ? "L'état d'une ou plusieurs demande n'as pas été modifié" : ""
        temp.rapport = !selectedFile ? "Vous devez ajouter le rapport de commission" : ''

        setErrors({ ...temp })
        return Object.values(temp).every(x => x === '')
    }

    const acceptCommission = async () => {
        if (validateCommission()) {
            const formData = new FormData()
            const demandes = commission.demandes.map((d, i) => {
                return { etat: etatDemandes[d.idDemande], idDemande: d.idDemande }
            })
            formData.append('idCommission', commission.idCommission)
            formData.append('demandes', JSON.stringify(demandes))
            formData.append('rapportCommission', selectedFile)

            try {
                const response = await axios.patch('/commissions/accept', formData)
                setProjets(response.data.data.projets)
                openCreationDialog()
                await fetchCommission()
            } catch (e) {
                toast.error(e.response.data.message)
            }
        }
    }

    // const updateCommission = async ({ president, membres, dateCommission }) => {
    //     try {
    //         await axios.patch('/commissions', {
    //             idCommission: commission.idCommission,
    //             president: president.idMembre,
    //             membres: membres.map((m, i) => m.idMembre),
    //             dateCommission
    //         })
    //         setCommission({ ...commission, president, membres, dateCommission: dayjs(dateCommission).format("DD/MM/YYYY") })
    //     } catch (e) {
    //         throw e;
    //         //TOAST IT in the modal
    //     }
    // }

    const showProjects = () => {
        navigate('/projets');
    }

    const fetchCommission = async () => {
        if (authenticationState.user.idUser) {
            try {
                const response = await axios.get(`/commissions/${idCommission}`)
                setCommission(response.data.data.commission);
                setEtatCommission(response.data.data.commission.etat)
                if (etatCommission === STATUS.pending) {
                    let etatDemandesDraft = {}
                    response.data.data.commission.demandes.forEach(d => {
                        etatDemandesDraft = { ...etatDemandesDraft, [d.idDemande]: d.etat }
                    });
                    setEtatDemandes(etatDemandesDraft)
                }
            } catch (e) {
                toast.error(e.response.data.message)
            }
        }
    }

    let formUI = null

    switch (dialog) {
        case 'edit':
            formUI = <FormCommission
                idCommission={commission.idCommission}
                values={{
                    president: commission.president,
                    membres: commission.membres,
                    dateCommission: dayjs(commission.dateCommission, "DD/MM/YYYY"),
                }}
                afterSubmit={fetchCommission}
                onClose={handleDialogClose} />

            break;
        case 'notification':
            formUI = <CreationProjetsInfo
                projets={projets}
                afterSubmit={showProjects}
                onClose={handleDialogClose} />
            break;
        case 'ajouter-demande':
            formUI = <FormAjouterDemande
                afterSubmit={fetchCommission}
                idCommission={commission.idCommission}
                onClose={handleDialogClose} />
            break;
        default:
            break;
    }

    useEffect(() => {
        fetchCommission()
    }, [authenticationState.user.idUser])

    return (
        <React.Fragment>
            <div className={classes.hdr}>
                <Typography color={theme.palette.text.main}
                    variant='h3'>
                    Commission
                </Typography>
                {commission &&
                    <Button variant='contained' className={classes.btn}
                        disabled={etatCommission === STATUS.pending}
                        onClick={acceptCommission}>
                        <Typography color='white'>
                            <strong>Sauvgarder</strong>
                        </Typography>
                    </Button>}

            </div>
            {!commission ? <CircularProgress size='2rem' style={{ marginTop: '1rem' }} /> :
                <React.Fragment>
                    <Dialog open={open} onClose={handleDialogClose}
                        maxWidth='100%'>
                        <Box className={classes.modelContainer}>
                            {formUI}
                        </Box>
                    </Dialog>
                    <div className={classes.container}>
                        <div className={classes.leftColumn}>
                            <div className={classes.etatContainer}>
                                <Typography color={theme.palette.text.main} display='inline'
                                    fontWeight={700} >
                                    Etat
                                </Typography>
                                {commission.etat === STATUS.pending ?
                                    <CustomSelect
                                        id='select-etat'
                                        value={etatCommission}
                                        onChange={onChangeHandler}
                                        name='etat'
                                        className={classes.slct}>
                                        <MenuItem
                                            className={classes.item}
                                            value={STATUS.pending}>
                                            {STATUS.pending}
                                        </MenuItem>
                                        <MenuItem
                                            value={STATUS.terminee}
                                            className={classes.item}>
                                            {STATUS.terminee}
                                        </MenuItem>
                                    </CustomSelect> :
                                    <Status status={commission.etat} />
                                }
                            </div>
                            {etatCommission === STATUS.terminee &&
                                <div className={classes.txt}>
                                    <Typography color={theme.palette.text.main}
                                        display='inline' fontWeight={700} marginRight='0.5rem'
                                    >Rapport de commission
                                    </Typography>
                                    {commission.rapportCommission ?
                                        <span style={{ cursor: 'pointer' }}>
                                            <Typography
                                                color={theme.palette.primary.main}
                                                display='inline'
                                            >Voir</Typography>
                                        </span> :
                                        <FormControl fullWidth
                                            error={errors.rapport !== ''}>
                                            <div className={classes.fileBtnContainer}>
                                                <Button
                                                    onClick={onClickUpload}
                                                    className={classes.filebtn} variant='outlined'>
                                                    <input type='file' accept='.pdf,.doc,.docx'
                                                        onChange={fileUploadHandler}
                                                        style={{ display: 'none' }}
                                                        id='file' ref={inputFile} />
                                                    {selectedFile ? 'Remplacer' : 'Ajouter'}
                                                </Button>
                                                {selectedFile &&
                                                    <Typography variant='body2'
                                                        style={{
                                                            textOverflow: 'ellipsis',
                                                            overflow: 'hidden',
                                                        }}
                                                        noWrap>
                                                        {selectedFileName}
                                                    </Typography>}
                                            </div>
                                            {errors.rapport !== '' &&
                                                <FormHelperText className={classes.helper}>
                                                    {errors.rapport}
                                                </FormHelperText>}
                                        </FormControl>
                                    }
                                </div>
                            }
                            <div className={classes.txt}>
                                <Typography color={theme.palette.text.main}
                                    fontWeight={700} marginRight='0.5rem'
                                    display='inline'>
                                    Président
                                </Typography>
                                {commission &&
                                    <Typography color={theme.palette.text.main}
                                        display='inline'>
                                        <Chip style={{cursor : 'text'}}
                                        label={`${commission.president.nomMembre} ${commission.president.prenomMembre}`}/>
                                    </Typography>
                                }
                            </div>
                            <div className={classes.txt}>
                                <Typography color={theme.palette.text.main}
                                    fontWeight={700} marginRight='0.5rem'
                                    display='inline'>
                                    Membres
                                </Typography>
                                {commission &&
                                    <Typography color={theme.palette.text.main}
                                        display='inline'>
                                        {commission.membres.map((c, i) => <Chip key={c.idMembre}
                                        label={`${c.nomMembre} ${c.prenomMembre}`}  
                                        style={{marginRight:'0.25rem', marginBottom: '0.25rem', cursor : 'text'}}/>)}
                                    </Typography>
                                }
                            </div>
                        </div>
                        <div className={classes.rightColumn}>
                            <Typography color={theme.palette.text.main}>
                                {commission.dateCommission}
                            </Typography>
                            {commission.etat === STATUS.pending &&
                                <Button variant='outlined' onClick={openEditDialog}
                                    className={[classes.btn, classes.btnSecondary].join(' ')}>
                                    <Typography color='primary'>
                                        Modifier
                                    </Typography>
                                </Button>
                            }
                        </div>
                    </div>
                    <div className={classes.demandesContainer}>
                        <Typography variant='subtitle2'>
                            Demandes
                        </Typography>
                        <Toolbar className={classes.toolbar}
                            hideButton={commission.etat === STATUS.terminee}
                            onClick={openAjouterDemandeDialog} />
                        <DemandesTable
                            etatDemandes={etatDemandes}
                            updateEtatDemandes={updateEtatDemandes}
                            demandes={commission.demandes}
                            isBeingEdited={etatCommission === STATUS.terminee
                                && commission.etat === STATUS.pending} />
                        <FormControl fullWidth
                            error={errors.demandes !== ''}>
                            {errors.demandes !== '' &&
                                <FormHelperText style={{ margin: 'auto' }}>
                                    {errors.demandes}
                                </FormHelperText>}
                        </FormControl>
                    </div>
                </React.Fragment>
            }
        </React.Fragment >
    );
};

export default Commission;