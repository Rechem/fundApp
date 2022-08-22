import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import classes from './navitem.module.css'
import React from 'react';
import { useLocation } from 'react-router-dom'

const Navitem = props => {
    const location = useLocation();
    // let containerClass = []
    return (
        <div className={
            location.pathname.startsWith(props.link)?
            [classes.container, classes.slctd].join(' '):
            classes.container}>
            <Link to={props.link} className={classes.lnk}
                style={{color:location.pathname.startsWith(props.link)?
                    props.theme.palette.primary.main : 'white'}}>
                <span className={classes.icon}>
                    {props.icon}
                </span>
                <Typography display='inline' noWrap
                fontWeight={
                    location.pathname.startsWith(props.link)?
                    700 : 400
                }
                className={classes.txt}>
                    {props.children}
                    </Typography>
            </Link>
        </div>
    );
};

export default Navitem;