import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import classes from './navitem.module.css'
import React from 'react';
import { useLocation } from 'react-router-dom'

const Navitem = props => {
    const location = useLocation();
    return (
        <div className={classes.container}>
            <Link to={props.link} className={classes.lnk}
                style={{color:location.pathname.startsWith(props.link)?
                    props.theme.palette.primary.main : props.theme.palette.text.main}}>
                <span className={classes.icon}>
                    {props.icon}
                </span>
                <Typography display='inline' noWrap>{props.children}</Typography>
            </Link>
        </div>
    );
};

export default Navitem;