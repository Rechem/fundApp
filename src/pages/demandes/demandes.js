import React, { useState, useEffect, createRef } from 'react';
import { Typography, Dialog } from '@mui/material';
import { useTheme } from '@mui/system';
import classes from './demandes.module.css'
import Slide from '@mui/material/Slide';
import { useSelector, useDispatch } from 'react-redux'
import DemandesTable from './demandes-table';
import { CustomTextField } from '../../theme';
import { SearchNormal1 } from 'iconsax-react';
import useDebounce from '../../custom-hooks/use-debounce';
import { isAdmin, isModo, isSimpleUser } from '../../utils';
import FormDemande from '../../components/form/form-demande/form-demande';
import Toolbar from '../../components/toolbar/toolbar';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Demandes = () => {

    const navigate = useNavigate()

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

    const authenticationState = useSelector(state => state.login)

    const [searchInput, setSearchInput] = useState('')

    const debouncedSearchTerm = useDebounce(searchInput, 500);

    const tableRef = createRef()

    const refreshTable = () => {
        tableRef.current.onQueryChange();
    }

    useEffect(refreshTable,[debouncedSearchTerm])

    const theme = useTheme()


    return (
        <React.Fragment>
            <Typography color={theme.palette.text.main}
                variant='h3' className={classes.hdr}>
                    {
                        
                    }
                {isAdmin(authenticationState) ? 'Demandes' : 'Mes demandes'}
            </Typography>
            <Dialog
                fullScreen
                open={open}
                onClose={handleCloseDialog}
                TransitionComponent={Transition}
            ><FormDemande onClose={handleCloseDialog} afterSubmit={refreshTable}/></Dialog>
            <Toolbar
                buttonLabel='Ajouter une demande'
                className={classes.toolbar}
                searchValue={searchInput}
                onSearchChangeHandler={onChangeHandler}
                onRefresh={refreshTable}
                onClick={handleOpenDialog}
                hideButton={!isSimpleUser(authenticationState)} />
            <DemandesTable
                // isEmptyFilterResults={demandesState.demandes.length === 0 && debouncedSearchTerm !== ''}
                tableRef={tableRef}
                searchValue={debouncedSearchTerm}/>
        </React.Fragment>
    );
};

export default Demandes;