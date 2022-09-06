import React, { useState, useEffect } from 'react';
import Toolbar from '../../../components/toolbar/toolbar';
import CommissionsTable from './commissions-table';
import useDebounce from '../../../custom-hooks/use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import FormCommission from '../../../components/form/form-commission/form-commission';
import { Dialog, Box } from '@mui/material';
import { fetchAllCommissions } from '../../../store/commissionsSlice/reducer';
import classes from './commissions-tab.module.css'
import axios from 'axios';

const CommissionTab = () => {

    const dispatch = useDispatch()
    const commissionsState = useSelector(state => state.commissions)
    const authenticationState = useSelector(state => state.login)

    const onChangeHandler = e => {
        const { name, value } = e.target
        setSearchInput(value)
    }

    const [searchInput, setSearchInput] = useState('')

    const debouncedSearchTerm = useDebounce(searchInput, 500);

    const [open, setOpen] = useState(false);

    const handleDialogClickOpen = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (authenticationState.user.idUser)
            dispatch(fetchAllCommissions(debouncedSearchTerm));
    }, [authenticationState.user.idUser, debouncedSearchTerm])

    const addCommissionHandler = async (president, membres, dateCommission) => {
        try {
            await axios.post('/commissions', { president, membres, dateCommission })
            handleDialogClose()
        } catch (e) {
            //TOAST IT
        }
    }

    return (
        <div>
            <Toolbar className={classes.toolbar}
                onClick={handleDialogClickOpen}
                onSearchChangeHandler={onChangeHandler}
                searchValue={searchInput} buttonLabel='Ajourer une commission' />
            <Dialog open={open} onClose={handleDialogClose} maxWidth='100%'>
                <Box className={classes.modelContainer}>
                    <FormCommission
                        afterSubmit={()=>dispatch(fetchAllCommissions(debouncedSearchTerm))}
                        onClose={handleDialogClose} />
                </Box>
            </Dialog>
            <CommissionsTable
                commissions={commissionsState.commissions}
                isLoading={commissionsState.status === 'searching'}
                isEmptyFilterResults={commissionsState.commissions.length === 0 && debouncedSearchTerm !== ''} />
        </div>
    );
};

export default CommissionTab;