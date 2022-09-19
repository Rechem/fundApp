import React, { useState, useEffect } from 'react';
import { Message } from 'iconsax-react';
import { Tooltip, IconButton, useTheme, CircularProgress, Typography, Badge, Button } from '@mui/material';
import { toast } from 'react-toastify';
import CustomModal from '../custom-modal/custom-modal';
import classes from './motif.module.css'
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import {  isSimpleUser, } from '../../utils';

const Motif = props => {

    const authenticationState = useSelector(state => state.login)

    const theme = useTheme()

    const color = theme.palette.text.main

    const [open, setOpen] = useState(false)

    const [motifs, setMotifs] = useState([])

    const [invisible, setInvisible] = useState(true);

    const handleOpenModal = async () => {
        setOpen(true)
        if (isSimpleUser(authenticationState)) {
            try {
                await props.setSeenMotifs()
                setInvisible(true)
            } catch (e) {
                toast.error(e.response.data.message)
            }
        }
    }

    const getMotifs = async () => {
        try {
            const motifs = await props.getMotifs();
            setMotifs(motifs)
            if (motifs.length > 0 && motifs.some(m => m.seenByUser === false))
                setInvisible(false)

        } catch (e) {
            toast.error(e.response.data.message)
        }
    }

    useEffect(() => {
        if (authenticationState.user.idUser)
        getMotifs()
    }, [authenticationState.user.idUser])

    return (
        <div className={props.className} style={props.style} >
            <Tooltip title="Messages de l'admin">
                <IconButton onClick={handleOpenModal}>
                    <Badge color="warning" variant="dot"
                    invisible={invisible || !isSimpleUser(authenticationState)}>
                        <Message color={color} />
                    </Badge>
                </IconButton>
            </Tooltip>
            <CustomModal open={open} onClose={() => setOpen(false)}>
                <div className={classes.container}>
                    <Typography varaint='body1' fontWeight={700} mb='2rem'>
                        Messages de l'admin
                    </Typography>
                    {
                        !motifs ? <CircularProgress size='1rem' /> :
                            motifs.length > 0 ? motifs.map((e, i) =>
                                <div key={i}>
                                    <Typography fontWeight={700} mt='1rem' variant='body2'>
                                        {dayjs(e.dateMotif).format('DD/MM/YYYY - HH:mm')}:
                                    </Typography>
                                    <Typography >
                                        {e.contenuMotif}
                                    </Typography>
                                </div>) :
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <i>Aucun message</i>
                                </div>
                    }
                    <div className={classes.flexbox}>
                        <Button variant='text'
                            onClick={() => setOpen(false)}
                            sx={{ marginTop: '1rem', marginRight: 0 }}>
                            Fermer
                        </Button>
                    </div>
                </div>
            </CustomModal>
        </div>
    );
}

export default Motif;