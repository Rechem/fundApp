import React, { useState, useEffect } from 'react';
import Toolbar from '../../../components/toolbar/toolbar';
import MembresTable from './membres-table';
import useDebounce from '../../../custom-hooks/use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMembres, addMembre } from '../../../store/membresSlice/reducer';
import { Dialog, Box } from '@mui/material';
import FormMembre from '../../../components/form-membre/form-membre';

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

    const handleDialogClickOpen = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const clickAddMembre = async data => {
        await dispatch(addMembre(data))
        dispatch(fetchAllMembres())
        handleDialogClose()
    }

    useEffect(() => {
        if (authenticationState.user.idUser)
            dispatch(fetchAllMembres(debouncedSearchTerm));
    }, [authenticationState.user.idUser, debouncedSearchTerm])

    return (
        <div>
            <Toolbar onSearchChangeHandler={onChangeHandler} onClick={handleDialogClickOpen}
                searchValue={searchInput} buttonLabel='Ajourer un membre' />
            <Dialog open={open} onClose={handleDialogClose}>
                <Box>
                    <FormMembre
                        addMembre={clickAddMembre}
                        onClose={handleDialogClose} />
                </Box>
            </Dialog>
            <MembresTable membres={membresState.membres}
                isLoading={membresState.status === 'searching'}
                isEmptyFilterResults={membresState.membres.length === 0 && debouncedSearchTerm !== ''} />
        </div>
    );
};

export default MembresTab;