import React, { useState, useEffect } from 'react';
import Toolbar from '../../../components/toolbar/toolbar';
import MembresTable from './membres-table';
import useDebounce from '../../../custom-hooks/use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMembres, addMembre } from '../../../store/membresSlice/reducer';
import { Dialog, Box } from '@mui/material';
import FormMembre from '../../../components/form-membre/form-membre';
import classes from './membres-tab.module.css'

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

    useEffect(() => {
        if (authenticationState.user.idUser)
            dispatch(fetchAllMembres(debouncedSearchTerm));
    }, [authenticationState.user.idUser, debouncedSearchTerm])

    return (
        <div>
            <Toolbar className={classes.toolbar}
                onSearchChangeHandler={onChangeHandler} onClick={handleDialogClickOpen}
                searchValue={searchInput} buttonLabel='Ajouter un membre' />
            <Dialog open={open} onClose={handleDialogClose}>
                <Box>
                    <FormMembre
                        afterSubmit={()=>dispatch(fetchAllMembres())}
                        onClose={handleDialogClose} />
                </Box>
            </Dialog>
            <MembresTable membres={membresState.membres}
                isLoading={membresState.status === 'searching'}
                isEmptyFilterResults={debouncedSearchTerm !== '' && membresState.membres.length === 0}
            />
        </div>
    );
};

export default MembresTab;