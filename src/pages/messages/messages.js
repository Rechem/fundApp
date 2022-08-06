import React, { useState } from 'react';
import { Typography, useTheme, Button, InputAdornment, Paper } from '@mui/material';
import { CustomTextField } from '../../theme';
import { SearchNormal1 } from 'iconsax-react';
import classes from './messages.module.css'
import { useNavigate } from "react-router-dom";
import MessagesTable from './messages-table';

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
            <div className={classes.toolbar}>
                <Button variant='outlined' className={classes.btn}
                onClick={onClickHandler}>
                    <Typography color='primary' fontWeight={400}
                        variant='body2'>Nouveau message</Typography>
                </Button>
                <CustomTextField
                    name='denominationCommerciale'
                    id='denomination-commerciale-field'
                    className={classes.field}
                    size='small' margin='none'
                    type='text' onChange={onChangeHandler}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchNormal1 />
                            </InputAdornment>
                        )
                    }}
                    value={searchInput} />
            </div>
            <MessagesTable />
        </React.Fragment>
    );
};

export default Messages;