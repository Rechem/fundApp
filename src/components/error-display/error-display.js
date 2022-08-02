import React from 'react';
import classes from './error-display.module.css'
import { Danger } from 'iconsax-react'
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
const tinycolor = require('tinycolor2')

const ErrorDisplay = props => {
    const theme = useTheme()

    return (
        <div className={classes.container}
            style={{ backgroundColor: tinycolor(theme.palette.error.main).setAlpha(.1) }}>
            <span className={classes.row}>
                <Danger variant='Outline'
                color={theme.palette.error.main}
                size={20} className={classes.icon}/>
                <Typography variant='body2'
                    display='inline'
                    color={theme.palette.error.main}
                    className={classes.txt}>
                    {props.children}</Typography>
            </span>
        </div>
    );
};

export default ErrorDisplay;