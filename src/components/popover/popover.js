import React, { useState } from 'react';
import {Menu, MenuItem, IconButton } from '@mui/material';
import { MoreVert } from '@mui/icons-material';

const CustomPopover = props => {

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);

    return (
        <div>
            <IconButton onClick={handleClick}  size="small">
                <MoreVert />
            </IconButton>

            <Menu
                keepMounted
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                {props.options && props.options.map((o, i) => {
                    return <MenuItem key={i}
                        onClick={() => {
                            handleClose()
                            o.action()
                        }}>
                        {o.label}
                    </MenuItem>
                })}
            </Menu>
        </div>
    );
};

export default CustomPopover;