import React, { useState, createRef, useEffect } from 'react';
import { Typography, useTheme, Button, InputAdornment, Paper } from '@mui/material';
import classes from './messages.module.css'
import { useNavigate } from "react-router-dom";
import MessagesTable from './messages-table';
import Toolbar from '../../components/toolbar/toolbar'
import useDebounce from '../../custom-hooks/use-debounce';
import { useSelector } from 'react-redux';

const Messages = () => {

    const authenticationState = useSelector(state=>state.login)

    const tableRef = createRef()

    const theme = useTheme()

    const navigate = useNavigate()

    const onClickHandler = () => {
        navigate('new')
    }

    const onChangeHandler = e => {
        const { name, value } = e.target
        setSearchInput(value)
    }

    const [searchInput, setSearchInput] = useState('')
    
    const debouncedSearchTerm = useDebounce(searchInput, 500);

    const refreshTable = () => {
        tableRef.current.onQueryChange();
    }

    useEffect(() => {
        if (authenticationState.user.idUser)
            refreshTable()
    }, [debouncedSearchTerm, authenticationState.user.idUser])

    return (
        <React.Fragment>
            <Typography color={theme.palette.text.main}
                variant='h3' className={classes.hdr}>
                Messages
            </Typography>
            <Toolbar className={classes.toolbar}
            onClick={onClickHandler} buttonLabel='Nouveau message'
            onSearchChangeHandler={onChangeHandler} searchValue={searchInput}
            onRefresh={refreshTable}/>
            <MessagesTable
            tableRef={tableRef}
            searchValue={debouncedSearchTerm}/>
        </React.Fragment>
    );
};

export default Messages;