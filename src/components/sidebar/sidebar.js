import React, { useEffect } from 'react';
import classes from './sidebar.module.css'
import Navitem from './navitem/navitem';
import { Story, Diagram, User, DocumentText1, Add, Sms, ProfileCircle } from 'iconsax-react';
import { ReactComponent as ProjetsIcon } from './shuttle.svg';
import { Typography, Divider, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../store/loginSlice/reducer';
import roles from '../../utils';


const NAVLIST = [
    {
        name: 'Dashboard',
        link: '/dashboard',
        icon: <Diagram variant='Outline' />,
        allowed: [roles.roleModerator, roles.roleAdmin]
    },
    {
        name: 'Projets',
        link: '/projets',
        icon: <ProjetsIcon fill='currentcolor' />,
        allowed: [roles.roleModerator, roles.roleAdmin, roles.roleSimpleUser]
    },
    {
        name: 'Demandes',
        link: '/demandes',
        icon: <DocumentText1 variant='Outline' />,
        allowed: [roles.roleModerator, roles.roleAdmin, roles.roleSimpleUser]
    },
    {
        name: 'Commissions',
        link: '/commissions',
        icon: <Story variant='Outline' />,
        allowed: [roles.roleModerator, roles.roleAdmin]
    },
    {
        name: 'Messages',
        link: '/messages',
        icon: <Sms variant='Outline' />,
        allowed: [roles.roleModerator, roles.roleAdmin, roles.roleSimpleUser]
    },
    {
        name: 'Utilisateurs',
        link: '/users',
        icon: <User variant='Outline' />,
        allowed: [roles.roleModerator, roles.roleAdmin]
    },
    {
        name: 'Mon profile',
        link: '/users',
        icon: <ProfileCircle variant='Outline' />,
        allowed: [roles.roleModerator, roles.roleAdmin, roles.roleSimpleUser]
    },
]
const Sidebar = props => {

    let rootClass = classes.root

    const dispatch = useDispatch()
    const authenticationState = useSelector(state => state.login)

    const theme = useTheme();


    if (!props.isCollapsed) {
        if (rootClass !== classes.root) {
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
                        <Add className={classes.icon} />
                    </IconButton>
                </div>
                <div className={classes.logo}>
                    <img src={process.env.PUBLIC_URL + '/asf-logo-white.png'}
                        className={classes.img}
                        alt='asf-logo' />
                </div>
                <div>
                    {NAVLIST.map(item => item.allowed.includes(authenticationState.user.role) &&
                        <Navitem link={item.link} key={item.name}
                            icon={item.icon} theme={theme}>
                            {item.name}</Navitem>)
                    }
                </div>
                <div className={classes.disconnect}>
                    <Divider className={classes.dvdr} />
                    <a onClick={disconnect} className={classes.strtch}>
                        <Typography color={theme.palette.error.main}
                            noWrap>Déconnexion</Typography>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;