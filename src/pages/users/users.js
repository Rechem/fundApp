import React, {useState} from 'react';
import classes from './users.module.css'
import { Typography } from '@mui/material';
import UsersTable from './users-table';
import { useTheme } from '@mui/material';
import Toolbar from '../../components/toolbar/toolbar';
import { useSelector } from 'react-redux';
import useDebounce from '../../custom-hooks/use-debounce';
import CustomModal from '../../components/custom-modal/custom-modal';

const Users = () => {

    const authenticationState = useSelector(state=>state.login)

    const theme = useTheme()

    const onChangeHandler = e => {
        const { name, value } = e.target
        setSearchInput(value)
    }

    const [searchInput, setSearchInput] = useState('')

    const debouncedSearchTerm = useDebounce(searchInput, 500);

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
                // onClick={handleOpenDialog}
                />
            <UsersTable />
        </>
    );
};

export default Users;