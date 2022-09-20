import React, { useState } from 'react';
import classes from './profil.module.css'
import { Typography, useTheme, Grid, Button, CircularProgress } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { isAdmin } from '../../utils';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { WILAYA } from '../inscription/wilayas';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import FormResetPassword from '../../components/form/form-reset-pw/form-reset-pw';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../components/custom-modal/custom-modal';
import ConfirmationDialog from '../../components/confirmation-dialog/confirmation-dialog';

const Profil = () => {

    const navigate = useNavigate()

    const authenticationState = useSelector(state => state.login)

    const location = useLocation();
    const { idUser } = useParams()
    const [user, setUser] = useState(null)
    const [isFetching, setIsFetching] = useState(false)
    const [open, setOpen] = useState(false)

    const handlOpenDialog = () => {
        setOpen(true)
    }
    const handlCloseDialog = () => {
        setOpen(false)
    }

    const [openAlert, setOpenAlert] = useState(false)

    const handlOpenAlert = () => {
        setOpenAlert(true)
    }
    const handlCloseAlert = () => {
        setOpenAlert(false)
    }

    const INFO = [
        {
            title: 'Date de naissance', value: user && user.dateNaissance ?
                dayjs(user.dateNaissance).format("DD/MM/YYYY") : '',
            key: 'dateNaissance',
        },
        {
            title: 'Wilaya de naissance', value: user && user.wilayaNaissance ?
                WILAYA.find(w => w.numero === user.wilayaNaissance).designation : '',
            key: 'designation',
        },
        {
            title: 'Téléphone', value: user ? user.telephone || '' : '',
            key: 'telephone',
        },
        {
            title: 'Sexe', value: user ? user.sexe || '' : '',
            key: 'sexe',
        },]

    const navigateToDemandes = () => {
        if (location.pathname.startsWith('/users')) {
            navigate(`/demandes?user=${user.idUser}`)
        } else {
            navigate(`/demandes`)
        }
    }

    const navigateToProjets = () => {
        if (location.pathname.startsWith('/users')) {
            navigate(`/projets?user=${user.idUser}`)
        } else {
            navigate(`/projets`)
        }
    }

    const theme = useTheme()

    const fetchUserDetails = async () => {

        if (authenticationState.user.idUser) {
            setIsFetching(true)
            try {
                let response

                if (location.pathname.startsWith('/users')) {
                    response = await axios.get(`/users/${idUser}`)
                } else
                    response = await axios.get(`/users/${authenticationState.user.idUser}`)

                setUser(response.data.data.user)
                // setValues(response.data.data.user)
            } catch (e) {
                if (e.response.status === 404)
                    navigate('/notfound')
                else
                    toast.error(e.response.data.message)
            }
            setIsFetching(false)
        }
    }

    useEffect(() => {
        fetchUserDetails()
    }, [authenticationState.user.idUser, location.pathname])

    const toggleBan = async () => {
        await axios.patch(`users/ban/${user.idUser}`, {
            banned : !user.banned
        })
    }

    return (
        <>
            <Typography color={theme.palette.text.main}
                variant='h3' className={classes.hdr}>
                {location.pathname.startsWith('/users') ? 'Profil' : 'Mon profil'}
            </Typography>
            {isFetching && <CircularProgress />}
            {!isFetching && user !== null &&
                <>
                    <ConfirmationDialog
                        open={openAlert}
                        afterSubmit={fetchUserDetails}
                        onClose={handlCloseAlert}
                        onConfirm={toggleBan}>
                        {user.banned ? 'Voulez vous vraiment réactiver ce compte ?' :
                            'Voulez vous vraiment désactiver ce compte ?'}
                    </ConfirmationDialog>
                    <CustomModal open={open} onClose={handlCloseDialog}>
                        <FormResetPassword isAdmin={isAdmin(authenticationState)}
                            onClose={handlCloseDialog} idUser={user.idUser} />
                    </CustomModal>
                    <div style={{
                        maxWidth: '40rem', marginInline: 'auto',
                    }}>
                        <div className={classes.container}>
                            <div className={classes.center}>
                                <img src={process.env.PUBLIC_URL + '/asf-logo-white.png'} alt='Avatar'
                                    className={classes.img} />
                            </div>
                            <div className={classes.center}>
                                <div>
                                    <Typography variant='subtitle2' display='inline'
                                        style={{ textTransform: 'capitalize' }}>{user.prenom}{' '}</Typography>
                                    <Typography variant='subtitle2' display='inline'
                                        style={{ textTransform: 'uppercase' }}>{user.nom}</Typography>
                                </div>
                                <Typography >{user.email}</Typography>
                            </div>
                        </div>
                        {user.nbDemandes > 0 &&
                            <Grid container columns={2}
                                columnSpacing={2}
                                rowSpacing={1}>
                                <Grid item xs={1} sm={1}>
                                    <Button variant='outlined'
                                        fullWidth
                                        onClick={navigateToDemandes}>
                                        Demandes ({user.nbDemandes})
                                    </Button>
                                </Grid>
                                {user.nbProjets > 0 &&
                                    <Grid item xs={1} sm={1}>
                                        <Button variant='outlined'
                                            fullWidth
                                            onClick={navigateToProjets}>
                                            Projets ({user.nbProjets})
                                        </Button>
                                    </Grid>
                                }
                            </Grid>
                        }
                        <Grid container columns={2} columnSpacing='1rem'
                            rowSpacing='0.5rem' sx={{ marginTop: '0.5rem' }}>
                            {INFO.map((e, i) =>
                                <Grid item xs={2} sm={1} key={i}>
                                    <Typography display='inline'
                                        fontWeight={600}>{e.title}{': '}</Typography>

                                    <Typography display='inline'
                                        style={{ textTransform: 'capitalize' }}>
                                        {e.value}</Typography>
                                </Grid>
                            )}
                            <Grid item xs={2}>
                                <Typography display='inline'
                                    fontWeight={600}>Adresse: </Typography>
                                <Typography display='inline'>{user.adress}</Typography>
                            </Grid>
                        </Grid>
                        {
                            user.idUser !== authenticationState.user.idUser &&
                            <Button
                                style={{ marginTop: '1rem' }}
                                display='block'
                                variant='text'
                                color='error'
                                onClick={handlOpenAlert}>
                                <Typography variant='body2' color='error'>
                                    {user.banned ? 'Réactiver' : 'Désactiver'}
                                </Typography>
                            </Button>
                        }
                        <div className={classes.btnContainer}>
                            <Button
                                onClick={handlOpenDialog}
                                display='block'
                                variant='text'>
                                Réinitialiser mot de passe
                            </Button>
                        </div>
                    </div>
                </>
            }
        </>
    );
};

export default Profil;