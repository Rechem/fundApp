import React, { useState, useEffect } from 'react';
import { Typography, Button, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/system';
import classes from './mes-demandes.module.css'
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import FormDemande from '../../../components/form-demande/form-demande';
import Status from '../../../components/status/status'
import { STATUS } from '../../../components/status/status-enum'
import { useSelector, useDispatch } from 'react-redux'
import MesDemandesTable from './mes-demandes-table';
import { CustomTextField } from '../../../theme';
import { SearchNormal1 } from 'iconsax-react';
import useDebounce from '../../../custom-hooks/use-debounce';
import { fetchUserDemandes } from "../../../store/demandesSlice/reducer";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MesDemandes = () => {

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
                dispatch(fetchUserDemandes({ searchInput,
                    idUser :  authenticationState.user.idUser}))

        },
        [debouncedSearchTerm, authenticationState.user.idUser] // Only call effect if debounced search term changes
    );

    const theme = useTheme()

    return (
        <React.Fragment>
            <Typography color={theme.palette.text.main}
                variant='h3' className={classes.hdr}>
                Mes Demandes
            </Typography>
            <React.Fragment>
                <Dialog
                    fullScreen
                    open={open}
                    onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                ><FormDemande onClose={handleCloseDialog} /></Dialog>
                <div className={classes.toolbar}>
                    <Button variant='outlined' className={classes.btn}
                        onClick={handleOpenDialog}>
                        <Typography color='primary' fontWeight={400}
                            variant='body2'>Ajouter une demande</Typography>
                    </Button>
                    <CustomTextField
                        name='denominationCommerciale'
                        id='denomination-commerciale-field'
                        className={classes.field}
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
                </div>
            </React.Fragment>
            <MesDemandesTable
                isEmptyFilterResults={demandesState.demandes.length === 0 && debouncedSearchTerm !== ''}
                demandes={demandesState.demandes}
                isLoading={demandesState.status === 'searching'} />
        </React.Fragment>
    );
};

export default MesDemandes;