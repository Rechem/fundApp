import React, { useState } from 'react';
import { useEffect } from 'react';
import './ticket.module.css'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CustomTextField } from '../../theme';
import classes from './ticket.module.css'
import { Typography, Button, useTheme, CircularProgress, Divider, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { isAdmin, isModo, statusTicket } from '../../utils';
import ConfirmationDialog from '../../components/confirmation-dialog/confirmation-dialog';
import { useNavigate } from 'react-router-dom';

const Ticket = () => {

    const navigate = useNavigate()

    const authenticationState = useSelector(state => state.login)

    const theme = useTheme()

    const { idTicket } = useParams()

    const [ticket, setTicket] = useState(null)

    const [loading, setIsLoading] = useState(null)

    const [isWriting, setIsWriting] = useState(false)

    const [openAlert, setOpenAlert] = useState(false)

    const [corp, setCorp] = useState('')

    const onChangeHandler = e => {
        const { name, value } = e.target
        setCorp(value)
    }

    const fetchTicket = async () => {
        try {
            const response = await axios.get(`/tickets/${idTicket}`)
            setTicket(response.data.data.ticket)
        } catch (e) {
            if (e.response.status === 404)
                    navigate('/notfound')
                else
                    toast.error(e.response.data.message)
        }
    }

    const submit = async e => {
        e.preventDefault()
        if (!isWriting)
            setIsWriting(true)
        else {
            if (corp !== '') {
                const requestObject = {
                    ticket: ticket.idTicket,
                    contenu: corp,
                }

                setIsLoading(true)
                try {
                    await axios.post(`/tickets/${ticket.idTicket}`, requestObject)
                    toast.success('Message envoyé')
                    await fetchTicket()
                } catch (e) {
                    toast.error(e.response.data.message)
                }
                setIsLoading(false)
                setIsWriting(false)
                setCorp('')
            }
        }
    }

    const fermerTicket = async () => {
        await axios.patch(`tickets/${ticket.idTicket}`, { etat: statusTicket.ferme })
    }

    useEffect(() => {
        if (authenticationState.user.idUser)
        fetchTicket()
    }, [authenticationState.user.idUser])

    return (
        <div className={classes.masterContainer}>
            <div className={classes.hdr}>
                <div>

                    <Typography color={theme.palette.text.main}
                        variant='h3' display='inline'>
                        Ticket{' '}
                    </Typography>
                    <Typography color={theme.palette.text.main}
                        variant='subtitle2' display='inline'>
                        n°{ticket && ticket.idTicket}
                    </Typography>
                </div>
                {!ticket ? <CircularProgress size='2rem' /> :
                    ticket.etat === statusTicket.ouvert ?
                    isAdmin(authenticationState) && <>
                            <Button
                                variant='contained'
                                onClick={() => setOpenAlert(true)}
                                disabled={loading}
                                startIcon={loading ?
                                    <CircularProgress size='1rem' color='background' />
                                    : null}>
                                <Typography color='white' fontWeight={500}>
                                    Marquer comme fermé
                                </Typography>
                            </Button>
                            <ConfirmationDialog open={openAlert}
                                afterSubmit={fetchTicket}
                                onClose={() => setOpenAlert(false)}
                                onConfirm={fermerTicket}>
                                Voulez vous vraiment fermer ce ticket ?
                            </ConfirmationDialog>
                        </>
                        :
                        <Typography variant='body2'>
                            Fermé le {dayjs(ticket.updatedAt).format('DD MMM YYYY à HH:mm')}</Typography>}
            </div>
            <div className={classes.container}>
                {!ticket ? <CircularProgress size='2rem' /> :
                    <>
                        <Paper className={classes.messages} variant='outlined'
                        style={{height : isWriting ? 'calc(100vh - 16.5rem)' :'calc(100vh - 11.5rem)'}}>
                            {ticket.messages.map((e, i) =>
                            (
                                <div className={classes.messageContainer} key={i}>
                                    <div>
                                        <img src={process.env.PUBLIC_URL + '/asf-logo-white.png'} alt='Avatar'
                                            className={classes.img} />
                                    </div>
                                    <div>
                                        <Typography display='inline'
                                            fontWeight={600}>
                                            {e.sentBy.prenom && e.sentBy.nom ?
                                                `${e.sentBy.prenom} ${e.sentBy.nom}` :
                                                isAdmin(authenticationState) ? 'Admin' :
                                                    isModo(authenticationState) ?
                                                        'Modérateur' : 'Utilisateur'}
                                        </Typography>
                                        <Typography variant='body2' display='inline-block' ml='0.5rem'>
                                            {dayjs(e.createdAt).format('DD MMM YYYY, HH:mm')}
                                        </Typography>
                                        <Typography className={classes.txt}>
                                            {e.contenu}
                                        </Typography>
                                    </div>
                                </div>
                            )
                            )}
                        </Paper>
                        {
                            ticket.etat === statusTicket.ouvert ?

                                <div className={classes.input}>
                                    {isWriting &&
                                        <>

                                            <CustomTextField
                                                name='body'
                                                id='body-id'
                                                fullWidth
                                                size='small' margin='none'
                                                multiline rows={3}
                                                value={corp}
                                                type='text' onChange={onChangeHandler}>
                                            </CustomTextField>
                                        </>
                                    }
                                    <div className={classes.btnContainer}>
                                        {isWriting && <Button variant='text'
                                            onClick={() => setIsWriting(false)}>
                                            <Typography color='primary' fontWeight={500}>
                                                Annuler
                                            </Typography>
                                        </Button>
                                        }
                                        <Button
                                            variant='contained'
                                            onClick={submit}
                                            disabled={loading}
                                            startIcon={loading ?
                                                <CircularProgress size='1rem' color='background' />
                                                : null}>
                                            <Typography color='white' fontWeight={500}>
                                                {isWriting ? 'Envoyer' : 'Ecrire'}
                                            </Typography>
                                        </Button>
                                    </div>
                                </div>
                                :
                                <Divider style={{marginTop :'1rem'}}>
                                    <Typography variant='body2'>
                                        Vous ne pouvez plus envoyer de messages dans ce ticket</Typography>
                                </Divider>

                        }
                    </>
                }
            </div>
        </div>
    );
};

export default Ticket;