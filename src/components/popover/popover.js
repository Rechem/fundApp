import React, { useState } from 'react';
import { Dialog, Box, Typography, useTheme, Menu, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import ConfirmationDialog from '../confirmation-dialog/confirmation-dialog';
import { useDispatch } from 'react-redux';
import { fetchAllMembres } from '../../store/membresSlice/reducer';
import FormMembre from '../form-membre/form-membre';

const CustomPopover = props => {

    const dispatch = useDispatch()

    const theme = useTheme()

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const supprimerMembre = async () => {
        try {
            await axios.delete(`/membres/${props.membre.idMembre}`)
            setOpenAlert(false)
        } catch (e) {
            toast.error(e.response.data.message)
        }
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const [openAlert, setOpenAlert] = useState(false)

    const open = Boolean(anchorEl);

    const [openForm, setOpenForm] = useState(false);

    const handleDialogClickOpen = () => {
        setOpenForm(true);
    };

    const handleDialogClose = () => {
        setOpenForm(false);
    };

    return (
        <div>
            <span onClick={handleClick} style={{ cursor: 'pointer' }}>
                <Typography
                    color={theme.palette.primary.main}
                    display='inline'
                >Modifier/Supprimer</Typography>
            </span>
            <Menu
                keepMounted
                id={props.id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <MenuItem selected={false} onClick={() => {
                    handleClose()
                    handleDialogClickOpen()
                }}>
                    Modifer
                </MenuItem>
                <MenuItem selected={false} onClick={() => {
                    handleClose();
                    setOpenAlert(true);
                }}>
                    Supprimer
                </MenuItem>
            </Menu>
            <ConfirmationDialog
                open={openAlert}
                afterSubmit={() => dispatch(fetchAllMembres())}
                onClose={() => setOpenAlert(false)}
                onConfirm={supprimerMembre}>
                Voulez-vous vraiment supprimer {props.membre.nomMembre} {props.membre.prenomMembre} ?
            </ConfirmationDialog>
            <Dialog open={openForm} onClose={handleDialogClose}>
                <Box>
                    <FormMembre
                        membre={props.membre}
                        afterSubmit={() => dispatch(fetchAllMembres())}
                        onClose={handleDialogClose} />
                </Box>
            </Dialog>
        </div>
    );
};

export default CustomPopover;