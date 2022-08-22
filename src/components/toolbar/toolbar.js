import React from 'react';
import classes from './toolbar.module.css'
import { Button, Typography, InputAdornment } from '@mui/material';
import { SearchNormal1 } from 'iconsax-react';
import { CustomTextField } from '../../theme';
import PropTypes from 'prop-types';

const Toolbar = props => {
    return (<div className={[classes.toolbar, props.className].join(' ')}>
            <div className={classes.container}>
                {!props.hideButton &&
                    <Button variant='outlined' className={classes.btn}
                        onClick={props.onClick}
                    >
                        <Typography color='primary' fontWeight={400}
                            variant='body2'>{props.buttonLabel ? props.buttonLabel : 'Ajouter'}</Typography>
                    </Button>
                }
                <CustomTextField
                    name='searchInput'
                    id='searchInput-field'
                    className={classes.field}
                    size='small' margin='none'
                    type='text' onChange={props.onSearchChangeHandler}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchNormal1 />
                            </InputAdornment>
                        )
                    }}
                    value={props.searchValue} />
            </div>
        </div>
    );
};

Toolbar.propTypes = {
    buttonLabel: PropTypes.string,
    onSearchChangeHandler: PropTypes.func.isRequired,
    searchValue: PropTypes.string.isRequired,
    hideButton: PropTypes.bool,
    onClick: PropTypes.func,
}

export default Toolbar;