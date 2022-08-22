import React from 'react';
import classes from './custom-stepper.module.css'
import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';

const CustomStepper = props => {

    const theme = useTheme()

    const activeStyle = {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    }

    const selectedStyle = {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        height: '2.5rem',
        width: '2.5rem',
    }

    const activeItems = props.activeSteps

    return (
        <div className={props.className}>
            <div className={classes.container}>
                <div className={classes.item}
                    style={
                        props.active === 1 ?
                            selectedStyle :
                            activeItems.includes(1) ?
                                activeStyle :
                                null}>1</div>
                {Array(props.steps - 1).fill(0).map((s, index) => {
                    return <React.Fragment key={index}>
                        <div className={classes.separation}></div>
                        <div className={classes.item}
                            style={props.active === index + 2 ?
                                selectedStyle :
                                activeItems.includes(index + 2) ?
                                    activeStyle :
                                    null}>
                            {index + 2}</div>
                    </React.Fragment>
                })}
            </div>
        </div>
    );
};

CustomStepper.propTypes = {
    steps: PropTypes.number.isRequired,
    activeSteps: PropTypes.array,
    stepsLabels: PropTypes.array,
    active: PropTypes.number,
    onClick: PropTypes.func,
    //add colors later
}

export default CustomStepper;