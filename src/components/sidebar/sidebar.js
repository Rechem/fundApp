import React, { useEffect } from 'react';
import classes from './sidebar.module.css'
import Navitem from './navitem/navitem';
import { Story, Diagram, User, DocumentText1, ArrowLeft2, Sms } from 'iconsax-react';
import { ReactComponent as ProjetsIcon } from './shuttle.svg';
import { Typography, Divider, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../store/loginSlice/reducer';

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
    // {
    //     name: 'Commissions',
    //     link: '/commisions',
    //     icon: <Story variant='Outline' />
    // },
    {
        name: 'Mes demandes',
        link: '/mes-demandes',
        icon: <DocumentText1 variant='Outline' />
    },
    {
        name: 'Messages',
        link: '/messages',
        icon: <Sms variant='Outline' />
    },
    // {
    //     name: 'Utilisateurs',
    //     link: '/users',
    //     icon: <User variant='Outline' />
    // },
]

const Sidebar = props => {

    let rootClass = classes.root

    const dispatch = useDispatch()
    const loginState = useSelector(state => state.login)

    const theme = useTheme();


    if (!props.isCollapsed) {
        if (rootClass !== classes.root){
            rootClass = [classes.root, classes.shown].join(' ')
        }
    } else {
        rootClass = [classes.root, classes.hidden].join(' ')
    }

    const disconnect = () => {
        dispatch(signOut())
    }
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
                    <a onClick={disconnect} className={classes.strtch}
                        to='/disconnect'>
                        <Typography color={theme.palette.error.main}
                            noWrap>Déconnexion</Typography>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;