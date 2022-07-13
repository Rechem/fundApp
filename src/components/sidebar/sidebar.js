import React from 'react';
import classes from './sidebar.module.css'
import Navitem from './navitem/navitem';
import { Story, Diagram, User, DocumentText1, ArrowLeft2 } from 'iconsax-react';
import { ReactComponent as ProjetsIcon } from './shuttle.svg';
import { Link } from 'react-router-dom';
import { Typography, Divider, IconButton } from '@mui/material';
import { useTheme } from '@emotion/react';
import 'animate.css';
import { useState } from 'react';
import Scrollbar from 'react-perfect-scrollbar'

const NAVLIST = [
    {
        name: 'Dashboard',
        link: '/dashboard',
        icon: <Diagram variant='Outline' />
    },
    {
        name: 'Projets',
        link: '/projets',
        icon: <ProjetsIcon fill='currentcolor' />
    },
    {
        name: 'Demandes',
        link: '/demandes',
        icon: <DocumentText1 variant='Outline' />
    },
    {
        name: 'Commissions',
        link: '/commisions',
        icon: <Story variant='Outline' />
    },
    {
        name: 'Utilisateurs',
        link: '/users',
        icon: <User variant='Outline' />
    },
]

const Sidebar = props => {

    const theme = useTheme();
    

    let rootClass = props.isCollapsed ?
        [classes.root, classes.hidden].join(' ') :
        [classes.root, classes.shown].join(' ')
    return (
        <div className={rootClass}>
            <div className={classes.container}>
                <div className={classes.closeIcon}>
                    <IconButton onClick={props.closeSideBar}>
                        <ArrowLeft2 />
                    </IconButton>
                </div>
                <div className={classes.logo}>
                    LOGO<br />PLACEHOLDER
                </div>
                <div>
                    {NAVLIST.map(item =>
                        <Navitem link={item.link} key={item.name}
                            icon={item.icon} theme={theme}>
                            {item.name}</Navitem>)}
                </div>
                <div className={classes.disconnect}>
                    <Divider className={classes.dvdr} />
                    <Link className={classes.strtch}
                        to='/disconnect'>
                        <Typography color={theme.palette.error.main}
                            noWrap>Déconnexion</Typography>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;