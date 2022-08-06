import React, { useState, useEffect } from 'react';
import { Typography, Button, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/system';
import classes from './demandes.module.css'
import Slide from '@mui/material/Slide';
import { useSelector, useDispatch } from 'react-redux'
import DemandesTable from './demandes-table';
import { CustomTextField } from '../../../theme';
import { SearchNormal1 } from 'iconsax-react';
import useDebounce from '../../../custom-hooks/use-debounce';
import { fetchAllDemandes } from '../../../store/demandesSlice/reducer';


const Demandes = () => {

    const onChangeHandler = e => {
        const { name, value } = e.target
        setSearchInput(value)
    }

    const dispatch = useDispatch()
    const authenticationState = useSelector(state => state.login)
    const demandesState = useSelector(state => state.demandes)

    const [searchInput, setSearchInput] = useState('')

    const debouncedSearchTerm = useDebounce(searchInput, 500);

    useEffect(
        () => {
            if (authenticationState.user.idUser)
                dispatch(fetchAllDemandes(searchInput))

        },
        [debouncedSearchTerm, authenticationState.user.idUser] // Only call effect if debounced search term changes
    );

    const theme = useTheme()

    return (
        <React.Fragment>
            <Typography color={theme.palette.text.main}
                variant='h3' className={classes.hdr}>
                Demandes
            </Typography>
            <CustomTextField
                name='searchInput'
                id='searchInput-field'
                className={classes.search}
                size='small' margin='none'
                type='text' onChange={onChangeHandler}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchNormal1 />
                        </InputAdornment>
                    )
                }}
                value={searchInput} />
            <DemandesTable
                isEmptyFilterResults={demandesState.demandes.length === 0 && debouncedSearchTerm !== ''}
                demandes={demandesState.demandes}
                isLoading={demandesState.status === 'searching'} />
        </React.Fragment>
    );
};

export default Demandes;