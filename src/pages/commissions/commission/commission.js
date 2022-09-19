import React, { useState, useEffect, useRef, createRef } from 'react';
import classes from './commission.module.css'
import {
    useTheme, Typography, MenuItem, CircularProgress,
    Button, Dialog, Box, FormHelperText, FormControl,
    Chip
} from '@mui/material';
import { CustomSelect } from '../../../theme'
import Status from '../../../components/status/status'
import { statusCommission, statusDemande } from '../../../utils';
import Toolbar from '../../../components/toolbar/toolbar';
import DemandesTable from '../../demandes/demandes-table';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import FormCommission from '../../../components/form/form-commission/form-commission';
import dayjs from 'dayjs'
import CreationProjetsInfo from '../../../components/creation-projets-info/creation-projets-info';
import { useNavigate } from 'react-router-dom'
import FormAjouterDemande from '../../../components/form/form-ajouter-demande/form-ajouter-demande';
import { toast } from 'react-toastify';
import useDebounce from '../../../custom-hooks/use-debounce';
import ConfirmationDialog from '../../../components/confirmation-dialog/confirmation-dialog';

const Commission = () => {

    const { idCommission } = useParams()

    const theme = useTheme()

    const [searchInput, setSearchInput] = useState('')

    const debouncedSearchTerm = useDebounce(searchInput, 500);

    const [etatCommission, setEtatCommission] = useState(statusCommission.pending)
    const [etatDemandes, setEtatDemandes] = useState({})
    const authenticationState = useSelector(state => state.login)

    const [commission, setCommission] = useState('')
    const [projets, setProjets] = useState([])
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

    const [selectedDemande, setSelectedDemande] = useState(null)

    const [openAlert, setOpenAlert] = useState(false)

    const deprogrammerDemande = async () => {
        await axios.patch(`/demandes`, {
            idDemande: selectedDemande.idDemande,
            etat: statusDemande.pending,
        })
    }

    const openDeleteConfirmation = demande => {
        setSelectedDemande(demande)
        setOpenAlert(true)
    }

    const navigate = useNavigate();
    const inputFile = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(null);

    const onChangeHandler = e => {
        const { name, value } = e.target
        setEtatCommission(value)
        if (value === statusCommission.pending)
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

    const validateCommission = () => {

        let temp = {}

        const demandesAreValid = Object.values(etatDemandes)
            .every(d => d === statusDemande.accepted || d === statusDemande.refused)

        temp.demandes = commission.demandes.length > 0 ? !demandesAreValid ? "L'état d'une ou plusieurs demande n'as pas été modifié" : ''
            : "Vous n'avez pas de demandes pour cette commission"
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

    const showProjects = () => {
        navigate('/projets');
    }

    const fetchCommission = async () => {
        if (authenticationState.user.idUser) {
            try {
                const response = await axios.get(`/commissions/${idCommission}`)
                setCommission(response.data.data.commission);
                setEtatCommission(response.data.data.commission.etat)
                if (response.data.data.commission.etat === statusCommission.pending) {
                    let etatDemandesDraft = {}
                    response.data.data.commission.demandes.forEach(d => {
                        etatDemandesDraft = { ...etatDemandesDraft, [d.idDemande]: d.etat }
                    });
                    setEtatDemandes(etatDemandesDraft)
                }
            } catch (e) {
                if (e.response.status === 404)
                    navigate('/notfound')
                else
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
        if (authenticationState.user.idUser)
            fetchCommission()
    }, [authenticationState.user.idUser])

    return (
        <React.Fragment>
            <div className={classes.hdr}>
                <Typography color={theme.palette.text.main}
                    variant='h3'>
                    Commission
                </Typography>
                {commission && commission.etat === statusCommission.pending &&
                    <Button variant='contained' className={classes.btn}
                        disabled={etatCommission === statusCommission.pending}
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
                                <Typography color={theme.palette.text.main} display='inline'>
                                    Etat
                                </Typography>
                                {commission.etat === statusCommission.pending ?
                                    <CustomSelect
                                        id='select-etat'
                                        value={etatCommission}
                                        onChange={onChangeHandler}
                                        name='etat'
                                        className={classes.slct}>
                                        <MenuItem
                                            className={classes.item}
                                            value={statusCommission.pending}>
                                            {statusCommission.pending}
                                        </MenuItem>
                                        <MenuItem
                                            value={statusCommission.terminee}
                                            className={classes.item}>
                                            {statusCommission.terminee}
                                        </MenuItem>
                                    </CustomSelect> :
                                    <Status status={commission.etat} />
                                }
                            </div>
                            <div className={classes.txt}>
                                <Typography color={theme.palette.text.main}
                                    marginRight='0.5rem'
                                    display='inline'>
                                    Président
                                </Typography>
                                {commission &&
                                    <Typography color={theme.palette.text.main}
                                        display='inline'>
                                        <Chip style={{ cursor: 'text' }}
                                            label={`${commission.president.nomMembre} ${commission.president.prenomMembre}`} />
                                    </Typography>
                                }
                            </div>
                            <div className={classes.txt}>
                                <Typography color={theme.palette.text.main}
                                    marginRight='0.5rem'
                                    display='inline'>
                                    Membres
                                </Typography>
                                {commission &&
                                    <Typography color={theme.palette.text.main}
                                        display='inline'>
                                        {commission.membres.map((c, i) => <Chip key={c.idMembre}
                                            label={`${c.nomMembre} ${c.prenomMembre}`}
                                            style={{ marginRight: '0.25rem', marginBottom: '0.25rem', cursor: 'text' }} />)}
                                    </Typography>
                                }
                            </div>
                        </div>

                        <div className={classes.rightColumn}>
                            <Typography color={theme.palette.text.main}>
                                {commission.dateCommission}
                            </Typography>
                            {commission.etat === statusCommission.pending &&
                                <Button variant='outlined' onClick={openEditDialog}
                                    className={[classes.btn, classes.btnSecondary].join(' ')}>
                                    <Typography color='primary'>
                                        Modifier
                                    </Typography>
                                </Button>
                            }
                        </div>
                    </div>
                    {etatCommission === statusCommission.terminee &&
                        <div className={classes.txt}>
                            <Typography color={theme.palette.text.main}
                                display='inline' marginRight='0.5rem'
                            >Rapport de commission
                            </Typography>
                            {commission.rapportCommission ?
                                <Box
                                    component="a"
                                    href={`${process.env.REACT_APP_BASE_URL}${commission.rapportCommission}`}
                                    target='_blank' sx={{
                                        color: theme.palette.primary.main,
                                        display: 'inline',
                                    }}
                                >Voir</Box> :
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
                                        {errors.rapport !== '' &&
                                            <FormHelperText>
                                                {errors.rapport}
                                            </FormHelperText>}
                                    </div>
                                </FormControl>
                            }
                        </div>
                    }
                    <div className={classes.demandesContainer}>
                        <FormControl fullWidth
                            error={errors.demandes !== ''}>
                            <Box sx={{ typography: 'subtitle2' }}>
                                Demandes
                                {errors.demandes !== '' &&
                                    <FormHelperText style={{ display: 'inline-block', marginLeft: '0.5rem' }}>
                                        {errors.demandes}
                                    </FormHelperText>}
                            </Box>
                        </FormControl>
                        <Toolbar className={classes.toolbar}
                            onRefresh={fetchCommission}
                            hideButton={commission.etat === statusCommission.terminee}
                            onClick={openAjouterDemandeDialog} />
                        <DemandesTable
                            canDeprogram={commission.etat !== statusCommission.terminee}
                            etatDemandes={etatDemandes}
                            updateEtatDemandes={updateEtatDemandes}
                            openDeleteConfirmation={openDeleteConfirmation}
                            demandes={commission.demandes}
                            isBeingEdited={etatCommission === statusCommission.terminee
                                && commission.etat === statusCommission.pending} />
                        {selectedDemande &&
                            <ConfirmationDialog
                                open={openAlert}
                                afterSubmit={fetchCommission}
                                onClose={() => setOpenAlert(false)}
                                onConfirm={deprogrammerDemande}>
                                Voulez-vous vraiment déprogrammer ({selectedDemande.formeJuridique}) {selectedDemande.denominationCommerciale}?
                            </ConfirmationDialog>
                        }
                    </div>
                </React.Fragment>
            }
        </React.Fragment >
    );
};

export default Commission;