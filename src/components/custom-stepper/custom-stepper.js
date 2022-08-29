import React from 'react';
import classes from './custom-stepper.module.css'
import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const CustomStepper = props => {

    const navigate = useNavigate()

    const theme = useTheme()

    const activeStyle = {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        cursor: 'pointer',
    }

    const selectedStyle = {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        height: '2.5rem',
        width: '2.5rem',
        cursor: 'pointer',
    }

    const activeItems = props.activeSteps

    if (!props.steps || !props.activeSteps || !props.onClick
        || props.steps < 0 || props.activeSteps !== props.onClick.length)
        return 'Paramètres incorrectes'

    return (
        <div className={props.className}>
            <div className={classes.container}>
                <div className={classes.item}
                    style={
                        props.active === 1 ? selectedStyle :
                            activeItems >= 1 ? activeStyle : null}
                    onClick={activeItems >= 1 && props.active !== 1 ?
                        () => navigate(props.onClick[0]) : null}
                >1</div>
                {Array(props.steps - 1).fill(0).map((s, index) => {
                    return <div key={index} className={classes.container}>
                        <div className={classes.separation}
                            style={activeItems >= index + 2 ?
                                activeStyle :
                                null}></div>
                        <div className={classes.item}

                            style={props.active === index + 2 ?
                                selectedStyle : activeItems >= index + 2 ?
                                    activeStyle : null}

                            onClick={activeItems >= index + 2 && props.active !== index + 2 ?
                                () => navigate(props.onClick[index + 1]) : null}>
                            {index + 2}</div>
                    </div>
                })}
            </div>
        </div>
    );
};

CustomStepper.propTypes = {
    steps: PropTypes.number,
    activeSteps: PropTypes.number,
    active: PropTypes.number,
    onClick: PropTypes.arrayOf(PropTypes.string),
}

export default CustomStepper;