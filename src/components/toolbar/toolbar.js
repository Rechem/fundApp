import React from 'react';
import classes from './toolbar.module.css'
import { Button, Typography, InputAdornment, IconButton, Grid } from '@mui/material';
// import { Refresh } from '@mui/icons-material';
import { SearchNormal1, Refresh } from 'iconsax-react';
import { CustomTextField } from '../../theme';
import PropTypes from 'prop-types';

const Toolbar = props => {
    return (<div className={[classes.toolbar, props.className].join(' ')} style={props.style}>
        {/* <div className={classes.container}> */}
        <Grid container columns={2} rowSpacing='1rem' >
            <Grid item xs={2} sm={1}>
                {!props.hideButton &&
                    <Button variant='outlined' className={classes.btn}
                        onClick={props.onClick}
                    >
                        <Typography color='primary' fontWeight={400}
                            variant='body2'>{props.buttonLabel ? props.buttonLabel : 'Ajouter'}</Typography>
                    </Button>
                }

            </Grid>
            <Grid item xs={2} sm={1}
            sx={{display:'flex', justifyContent: 'flex-end' }}>

                <IconButton
                    style={{ marginRight: '0.5rem' }}
                    onClick={props.onRefresh}>
                    <Refresh />
                </IconButton>
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
            </Grid>

        </Grid>
        {/* <div style={{
                marginLeft : props.hideButton ? 'auto' : 0
            }}>
            </div> */}
    </div>
        // </div>
    );
};

Toolbar.propTypes = {
    buttonLabel: PropTypes.string,
    onSearchChangeHandler: PropTypes.func.isRequired,
    searchValue: PropTypes.string.isRequired,
    hideButton: PropTypes.bool,
    onClick: PropTypes.func,
    onRefresh: PropTypes.func
}

export default Toolbar;