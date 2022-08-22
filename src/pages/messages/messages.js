import React, { useState } from 'react';
import { Typography, useTheme, Button, InputAdornment, Paper } from '@mui/material';
import { CustomTextField } from '../../theme';
import { SearchNormal1 } from 'iconsax-react';
import classes from './messages.module.css'
import { useNavigate } from "react-router-dom";
import MessagesTable from './messages-table';
import Toolbar from '../../components/toolbar/toolbar'

const Messages = () => {

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

    return (
        <React.Fragment>
            <Typography color={theme.palette.text.main}
                variant='h3' className={classes.hdr}>
                Messages
            </Typography>
            <Toolbar className={classes.toolbar}
            onClick={onClickHandler} buttonLabel='Nouveau message'
            onSearchChangeHandler={onChangeHandler} searchValue={searchInput}/>
            <MessagesTable />
        </React.Fragment>
    );
};

export default Messages;