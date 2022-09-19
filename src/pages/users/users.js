import React, { useState, createRef, useEffect } from 'react';
import classes from './users.module.css'
import { Typography } from '@mui/material';
import UsersTable from './users-table';
import { useTheme } from '@mui/material';
import Toolbar from '../../components/toolbar/toolbar';
import { useSelector } from 'react-redux';
import useDebounce from '../../custom-hooks/use-debounce';
import CustomModal from '../../components/custom-modal/custom-modal';
import FormAddUser from '../../components/form/form-add-user/form-add-user';

const Users = () => {

    const tableRef = createRef()

    const authenticationState = useSelector(state => state.login)

    const theme = useTheme()

    const onChangeHandler = e => {
        const { name, value } = e.target
        setSearchInput(value)
    }

    const [searchInput, setSearchInput] = useState('')

    const debouncedSearchTerm = useDebounce(searchInput, 500);

    const [open, setOpen] = useState(false)

    const handleDialogClickOpen = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const refreshTable = () => {
        tableRef.current.onQueryChange();
    }

    useEffect(() => {
        if (authenticationState.user.idUser)
            refreshTable()
    }, [debouncedSearchTerm, authenticationState.user.idUser])

    return (
        <>
            <Typography color={theme.palette.text.main}
                variant='h3' className={classes.hdr}>
                Utilisateurs
            </Typography>
            <Toolbar buttonLabel='Ajouter un utilisateur'
                className={classes.toolbar}
                searchValue={searchInput}
                onSearchChangeHandler={onChangeHandler}
                onClick={handleDialogClickOpen}
                onRefresh={refreshTable}
            />
            <CustomModal open={open} onClose={handleDialogClose}>
                <FormAddUser
                    onClose={handleDialogClose}
                    afterSubmit={refreshTable}
                />
            </CustomModal>
            <UsersTable
                tableRef={tableRef}
                searchValue={debouncedSearchTerm}/>
        </>
    );
};

export default Users;