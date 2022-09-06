import React, { useState, useEffect } from 'react';
import Toolbar from '../../../components/toolbar/toolbar';
import MembresTable from './membres-table';
import useDebounce from '../../../custom-hooks/use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMembres, addMembre } from '../../../store/membresSlice/reducer';
import { Dialog, Box } from '@mui/material';
import FormMembre from '../../../components/form/form-membre/form-membre';
import classes from './membres-tab.module.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../../../components/confirmation-dialog/confirmation-dialog';

const MembresTab = () => {

    const dispatch = useDispatch()
    const membresState = useSelector(state => state.membres)
    const authenticationState = useSelector(state => state.login)

    const onChangeHandler = e => {
        const { name, value } = e.target
        setSearchInput(value)
    }

    const [searchInput, setSearchInput] = useState('')
    const debouncedSearchTerm = useDebounce(searchInput, 500);

    const [open, setOpen] = useState(false);

    const addMembreClick = () => {
        setSelectedMembre(null)
        handleDialogClickOpen()
    }

    const handleDialogClickOpen = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (authenticationState.user.idUser)
            dispatch(fetchAllMembres(debouncedSearchTerm));
    }, [authenticationState.user.idUser, debouncedSearchTerm])

    const [selectedMembre, setSelectedMembre] = useState(null)

    const openEditForm = membre => {
        setSelectedMembre(membre)
        handleDialogClickOpen()
    }

    const openDeleteConfirmation = membre => {
        setSelectedMembre(membre)
        setOpenAlert(true)
    }

    const supprimerMembre = async () => {
        try {
            await axios.delete(`/membres/${selectedMembre.idMembre}`)
            toast.success("Succès")
            setOpenAlert(false)
        } catch (e) {
            toast.error(e.response.data.message)
        }
    }

    const [openAlert, setOpenAlert] = useState(false)

    return (
        <div>
            <Toolbar className={classes.toolbar}
                onSearchChangeHandler={onChangeHandler}
                onClick={addMembreClick}
                searchValue={searchInput} buttonLabel='Ajouter un membre' />

            <Dialog open={open} onClose={handleDialogClose}>
                <Box>
                    <FormMembre
                        membre={selectedMembre}
                        afterSubmit={() => dispatch(fetchAllMembres())}
                        onClose={handleDialogClose} />
                </Box>
            </Dialog>
            {selectedMembre &&
                <ConfirmationDialog
                    open={openAlert}
                    afterSubmit={() => dispatch(fetchAllMembres())}
                    onClose={() => setOpenAlert(false)}
                    onConfirm={supprimerMembre}>
                    Voulez-vous vraiment supprimer {selectedMembre.nomMembre} {selectedMembre.prenomMembre} ?
                </ConfirmationDialog>
            }
            <MembresTable
                openDeleteConfirmation={openDeleteConfirmation}
                openEditForm={openEditForm}
                membres={membresState.membres}
                isLoading={membresState.status === 'searching'}
                isEmptyFilterResults={debouncedSearchTerm !== '' && membresState.membres.length === 0}
            />
        </div>
    );
};

export default MembresTab;