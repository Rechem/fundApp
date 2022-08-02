import classes from './layout.module.css'
import Sidebar from '../sidebar/sidebar';
import { Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/system';
import { useState, useEffect } from 'react';
import { ArrowRight2 } from 'iconsax-react';

const Layout = props => {

    const theme = useTheme()

    const [isCollapsed, setCollapse] = useState(false)

    const closeSideBar = () => setCollapse(true)
    const openSideBar = () => setCollapse(false)

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [width]);

    useEffect(() => {
        if (width >= 600)
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
            <div className={classes.container}>
                <div className={classes.content}>
                    {props.children}
                </div>
            </div>
        </div>
    );
};

export default Layout;