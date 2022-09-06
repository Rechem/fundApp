import React, { useState, useEffect } from 'react';
import { Typography, Dialog } from '@mui/material';
import { useTheme } from '@mui/system';
import classes from './demandes.module.css'
import Slide from '@mui/material/Slide';
import { useSelector, useDispatch } from 'react-redux'
import DemandesTable from './demandes-table';
import { CustomTextField } from '../../theme';
import { SearchNormal1 } from 'iconsax-react';
import useDebounce from '../../custom-hooks/use-debounce';
import { fetchAllDemandes, fetchUserDemandes } from '../../store/demandesSlice/reducer';
import { isAdmin, isModo, isSimpleUser } from '../../utils';
import FormDemande from '../../components/form/form-demande/form-demande';
import Toolbar from '../../components/toolbar/toolbar';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Demandes = () => {

    const [open, setOpen] = React.useState(false);

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

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
                {isAdmin(authenticationState) ? 'Demandes' : 'Mes demandes'}
            </Typography>
            <Dialog
                fullScreen
                open={open}
                onClose={handleCloseDialog}
                TransitionComponent={Transition}
            ><FormDemande onClose={handleCloseDialog} /></Dialog>
            <Toolbar
                buttonLabel='Ajouter une demande'
                className={classes.toolbar}
                searchValue={searchInput}
                onSearchChangeHandler={onChangeHandler}
                onClick={handleOpenDialog}
                hideButton={!isSimpleUser(authenticationState)} />
            <DemandesTable
                isEmptyFilterResults={demandesState.demandes.length === 0 && debouncedSearchTerm !== ''}
                demandes={demandesState.demandes}
                isLoading={demandesState.status === 'searching'} />
        </React.Fragment>
    );
};

export default Demandes;