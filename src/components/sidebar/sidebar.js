import React from 'react';
import classes from './sidebar.module.css'
import Navitem from './navitem/navitem';
import { Story, Diagram, User, DocumentText1, HambergerMenu } from 'iconsax-react';
import { ReactComponent as ProjetsIcon } from './shuttle.svg';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Divider } from '@mui/material';
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
        icon: <ProjetsIcon fill='currentcolor'/>
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

const Sidebar = () => {

    const theme = useTheme();

    return (
        <div className={classes.root}>
            <div className={classes.container}>
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