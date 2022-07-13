import React from 'react';
import classes from './demandes.module.css'
import Sidebar from '../../components/sidebar/sidebar';
import { Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/system';
import { useState, useEffect } from 'react';
import { ArrowRight2 } from 'iconsax-react'
const Demandes = () => {

    const theme = useTheme()

    const [isCollapsed, setCollapse] = useState(true)

    const closeSideBar = () => setCollapse(true)
    const openSideBar = () => setCollapse(false)

    let containerClass = isCollapsed ?
        [classes.container, classes.hidden].join(' ') :
        [classes.container, classes.shown].join(' ')

    //i copied this shit from stack overflow and it works
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [width]);

    useEffect(() => {
        if (width >= 480)
            openSideBar()
        else
            closeSideBar()
    }, [width]);

    
    return (
        <div className={classes.root}>
            <Sidebar isCollapsed={isCollapsed} closeSideBar={closeSideBar} />
            <div className={classes.openIcon}>
                <IconButton onClick={openSideBar}>
                    <ArrowRight2 />
                </IconButton>
            </div>
            <div className={containerClass}>
                <div className={classes.content}>
                    <Typography color={theme.palette.text.main}
                        variant='h3'>
                        Demandes
                    </Typography>
                </div>
            </div>
        </div>
    );
};

export default Demandes;