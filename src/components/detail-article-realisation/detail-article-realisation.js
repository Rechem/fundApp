import React, { useState, useRef } from 'react';
import classes from './detail-article-realisation.module.css'
import {
    Typography, Grid, Button, Radio, FormControl, CircularProgress,
    FormHelperText, RadioGroup, FormControlLabel, Divider, Box
} from '@mui/material';
import { CustomTextField } from '../../theme';
import { useSelector } from 'react-redux';
import { isAdmin, isSimpleUser, statusArticleRealisation } from '../../utils';
import ConfirmationDialog from '../confirmation-dialog/confirmation-dialog';
import axios from 'axios';
import Status from '../status/status';
import InfoDetailInvestissement from './info-detail-investissement';
import { ArrowRight2 } from 'iconsax-react';
import { toast } from 'react-toastify';
import InfoDetailSalaire from './info-detail-salaire';
import Motif from '../motif/motif';

const DetailArticle = props => {

    const authenticationState = useSelector(state => state.login)

    let item = props.selectedItem

    if (props.isRealisation) {
        if (props.type === 'investissement')
            item = props.selectedItem.Investissement
        else if (props.type === 'charge-externe')
            item = props.selectedItem.ChargeExterne
        else
            item = props.selectedItem.Salaire
        //add support for salaire
    }

    const [isEditing, setIsEditing] = useState(false)

    let canJustify = isSimpleUser(authenticationState) && props.isRealisation
        && (props.selectedItem.etat === statusArticleRealisation.waiting
            || props.selectedItem.etat === statusArticleRealisation.refused && isEditing)

    const [lien, setLien] = useState('')
    const [radio, setRadio] = useState('facture');
    const [errors, setErrors] = useState('')
    const [openAlert, setOpenAlert] = useState(false)

    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState('')

    const onChangeMessage = e => {
        setError('')
        setMessage(e.target.value)
    }

    const [step, setStep] = useState('initial');

    const setAccepterStep = () => {
        setStep('accepter')
    }

    const setRefuserStep = () => {
        setStep('refuser')
    }

    const setIntialStep = () => {
        setStep('initial')
    }

    const handleChangeRadio = (event) => {
        setRadio(event.target.value);
    };

    const onChangeHandler = e => {
        const { name, value } = e.target
        setLien(value)

        setErrors('')
    }

    const inputFile = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(null);

    const onClickUpload = () => {
        inputFile.current.click();
        setErrors('')
    };

    const fileUploadHandler = (event) => {
        setSelectedFile(event.target.files[0])
        setSelectedFileName(event.target.files[0].name)
    }

    const validate = () => {
        let temp = {}

        temp.lien = (radio === 'facture' && selectedFile === null)
            || (radio === 'lien' && lien === '') ?
            'Vous devez fournir un justificatif' : ''

        setErrors(temp.lien)
        return Object.values(temp).every(x => x === '')
    }

    const handleOpenDialog = () => {
        if (props.selectedItem.etat === statusArticleRealisation.refused
            && !isEditing)
            setIsEditing(true)
        else {
            if (validate())
                setOpenAlert(true)
        }
    }

    const submit = async () => {

        const formData = new FormData()

        if (radio === 'facture')
            formData.append("factureArticleRealisation", selectedFile)
        else
            formData.append("lien", lien)

        formData.append("projetId", item.projetId)
        formData.append("numeroTranche", item.numeroTranche)
        formData.append("type", props.selectedItem.type)
        formData.append("etat", statusArticleRealisation.pending)
        formData.append("lienOuFacture", radio)
        formData.append("idArticle", props.selectedItem.idArticle)

        try {
            await axios.patch('/realisations/article', formData)
            props.onClose()
        } catch (e) {
            throw e
        }
    }

    const submitEvaluation = async () => {
        let requestObject = {
            projetId: item.projetId,
            numeroTranche: item.numeroTranche,
            idArticle: props.selectedItem.idArticle,
            type: props.selectedItem.type,
        }
        switch (step) {
            case 'accepter':
                requestObject.etat = statusArticleRealisation.accepted
                break;
            case 'refuser':
                requestObject.etat = statusArticleRealisation.refused
                if (!message)
                    return setError('Vous devez indiquer le motif de refus')
                requestObject.message = message
                break;
            default:
                return toast.error('Etat invalide.')
        }

        setIsLoading(true)
        try {
            const response = await axios.patch(`/realisations/article/`,
                requestObject)
            setIsLoading(false)
            toast.success(response.data.message)
            props.afterSubmit()
            props.onClose()
        } catch (e) {
            toast.error(e.response.data.message)
            setIsLoading(false)
        }
    }

    const getMotifs = async () => {
        try {
            const response = await axios.get(
                `/motifs/realisation/${item.projetId}/${item.numeroTranche}/${props.selectedItem.type}/${props.selectedItem.idArticle}`)
            return response.data.data.motifsRealisation
        } catch (e) {
            throw e
        }
    }

    const setSeenMotifs = async () => {
        try {
            await axios.patch(
                `/motifs/realisation/${item.projetId}/${item.numeroTranche}/${props.selectedItem.type}/${props.selectedItem.idArticle}`)
        } catch (e) {
            throw e
        }
    }

    return (
        <div className={classes.container}>
            {
                step === 'initial' &&
                <>
                    {props.type === 'salaire' ?
                        <InfoDetailSalaire item={item} type={props.type} /> :
                        <InfoDetailInvestissement item={item} type={props.type} />
                    }
                    <>
                        {canJustify &&
                            <>
                                <Divider className={classes.txt} />
                                <Typography fontWeight={400}
                                    variant='body2' >Justificatif</Typography>
                                <div>
                                    <FormControl>
                                        <RadioGroup
                                            row
                                            name="controlled-radio-buttons-group"
                                            value={radio}
                                            onChange={handleChangeRadio}
                                        >
                                            <FormControlLabel value="facture" control={<Radio />}
                                                label={<Typography fontWeight={500}
                                                    variant='body1' >Facture</Typography>} />
                                            <FormControlLabel value="lien" control={<Radio />}
                                                label={<Typography fontWeight={500}
                                                    variant='body1' >Lien</Typography>} />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                                {radio === 'lien' &&
                                    <CustomTextField
                                        placeholder='http://www.example.com/'
                                        name='lien'
                                        id='lien-field'
                                        fullWidth
                                        size='small' margin='none'
                                        type='url' onChange={onChangeHandler}
                                        value={lien || ''}
                                    >
                                    </CustomTextField>
                                }
                                {radio === 'facture' &&
                                    <FormControl fullWidth
                                        error={errors.rapport !== ''}>
                                        <div className={classes.fileBtnContainer}>
                                            {!selectedFile && props.values && props.values.facture &&
                                                <Typography component='a'
                                                    target='_blank' mr='1rem'
                                                    href={`${process.env.REACT_APP_BASE_URL}${props.values.facture}`}
                                                    color='primary'
                                                >Voir</Typography>}
                                            <Button
                                                onClick={onClickUpload}
                                                className={classes.filebtn} variant='outlined'>
                                                <input type='file' accept='.pdf,.doc,.docx'
                                                    onChange={fileUploadHandler}
                                                    style={{ display: 'none' }}
                                                    id='file' ref={inputFile} />
                                                <Typography fontWeight={500}
                                                    variant='body2' color='primary'>
                                                    {selectedFile || (props.values && props.values.facture) ?
                                                        'Remplacer' : 'Ajouter'}
                                                </Typography>
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
                                    </FormControl>}
                                {errors !== '' &&
                                    <div>
                                        <FormControl error={errors !== ''}>
                                            <FormHelperText>
                                                {errors}
                                            </FormHelperText>
                                        </FormControl>
                                    </div>}
                                <ConfirmationDialog open={openAlert}
                                    afterSubmit={props.afterSubmit}
                                    onClose={() => {
                                        setOpenAlert(false)
                                    }}
                                    onConfirm={submit}>
                                    Voulez vous vraiment soummetre ce justificatif ?
                                </ConfirmationDialog>
                            </>
                        }
                        {props.isRealisation
                            && props.selectedItem.etat !== statusArticleRealisation.waiting
                            && !isEditing &&
                            <>
                                <Divider className={classes.txt} />
                                <Grid container columnSpacing={2} columns={2}
                                    sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Grid item xs={1}>
                                        <Typography fontWeight={400}
                                            variant='body2' >Justificatif</Typography>
                                        <Typography component='a'
                                            target='_blank'
                                            href={props.selectedItem.lien ? props.selectedItem.lien :
                                                `${process.env.REACT_APP_BASE_URL}${props.selectedItem.facture}`}
                                            color='primary'
                                            className={classes.txt}
                                        >Voir</Typography>

                                    </Grid>
                                    <Grid item xs={1}
                                        sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            < Motif getMotifs={getMotifs}
                                                setSeenMotifs={setSeenMotifs}
                                                style={{ marginRight: '0.5rem' }} />
                                            <Status status={props.selectedItem.etat} />
                                        </div>
                                    </Grid>
                                </Grid>
                            </>
                        }
                    </>
                </>
            }

            {
                step === 'accepter' &&
                <>
                    <Typography variant='subtitle2' fontWeight={700} mb='1.5rem'
                    >Accepter ce justificatif ?</Typography>
                    <Typography><i>Cette action est irréversible.</i></Typography>
                </>
            }

            {
                step === 'refuser' &&
                <>
                    <Typography variant='subtitle2' fontWeight={700} mb='1.5rem'
                    >Refuser ce justificatif ?</Typography>
                    <Typography variant='body2'>Veuillez indiquer le motif de refus:</Typography>
                    <CustomTextField
                        fullWidth
                        onChange={onChangeMessage}
                        value={message}
                        className={classes.field}
                        margin='none' size='small'
                        multiline rows={3}
                        {...(error && error !== ''
                            && { error: true, helperText: error })} />
                </>
            }
            {isSimpleUser(authenticationState) &&
                <div className={classes.btnContainer}>
                    <div></div>
                    <Button sx={{ marginRight: 'auto' }}
                        onClick={props.onClose}
                    >
                        <Typography fontWeight={500} color='primary'
                            variant='body2'>
                            Fermer</Typography>
                    </Button>
                    {(props.selectedItem.etat === statusArticleRealisation.waiting ||
                        props.selectedItem.etat === statusArticleRealisation.refused)
                        &&
                        <>
                            <div style={{ marginLeft: 'auto' }}></div>
                            < Button className={classes.btn}
                                onClick={handleOpenDialog} variant='contained'
                            >
                                <Typography color='white' fontWeight={500}
                                    variant='body2'>
                                    {props.selectedItem.etat === statusArticleRealisation.waiting
                                        || isEditing ? 'Justifier' : 'Modifier'}
                                </Typography>
                            </Button>
                        </>
                    }
                </div>
            }
            {isAdmin(authenticationState) &&
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className={classes.btnContainer}>

                        <Button sx={{ marginLeft: 'auto' }}
                            onClick={props.onClose}
                        >
                            <Typography fontWeight={500} color='primary'
                                variant='body2'>
                                Fermer</Typography>
                        </Button>
                        <div className={classes.subBtnContainer}>

                            {step !== 'initial' &&
                                <Button
                                    onClick={setIntialStep}
                                >
                                    <Typography fontWeight={400} color='primary'
                                        variant='body2'>
                                        Retour</Typography>
                                </Button>
                            }
                            {step === 'initial' &&
                                props.selectedItem.etat === statusArticleRealisation.pending
                                &&
                                <Button
                                    variant='outlined'
                                    onClick={setRefuserStep}
                                    endIcon={<ArrowRight2 />}
                                >
                                    <Typography fontWeight={400} color='primary'
                                        variant='body2'>Refuser</Typography>
                                </Button>
                            }
                            {step === 'initial' &&
                                (props.selectedItem.etat === statusArticleRealisation.pending
                                    || props.selectedItem.etat === statusArticleRealisation.refused)
                                &&
                                <Button className={classes.btn}
                                    variant='contained' onClick={setAccepterStep}
                                    endIcon={<ArrowRight2 color='white' />}
                                >
                                    <Typography color='white' fontWeight={400}
                                        variant='body2'>
                                        Accepter
                                    </Typography>
                                </Button>
                            }
                            {step !== 'initial' &&
                                <Button className={classes.btn}
                                    variant='contained'
                                    onClick={submitEvaluation}
                                    disabled={isLoading}
                                    startIcon={isLoading ?
                                        <CircularProgress size='1rem' color='background' />
                                        : null}
                                >
                                    <Typography color='white' fontWeight={400} variant='body2'>
                                        {step === 'accepter' ? 'Accepter' : 'Refuser'}
                                    </Typography>
                                </Button>}
                        </div>
                    </div>
                </div>}


        </div >
    );
};

export default DetailArticle;