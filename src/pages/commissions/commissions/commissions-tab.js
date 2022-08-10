import React, { useState, useEffect } from 'react';
import Toolbar from '../../../components/toolbar/toolbar';
import CommissionsTable from './commissions-table';
import useDebounce from '../../../custom-hooks/use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import FormCommission from '../../../components/form-commission/form-commission';
import { Dialog, Box } from '@mui/material';
import { fetchAllCommissions } from '../../../store/commissionsSlice/reducer';

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

    return (
        <div>
            <Toolbar onSearchChangeHandler={onChangeHandler}
            onClick={handleDialogClickOpen}
            searchValue={searchInput} buttonLabel='Ajourer une commission'/>
            <Dialog open={open} onClose={handleDialogClose}>
                <Box>
                    <FormCommission
                    onClose={handleDialogClose} />
                </Box>
            </Dialog>
            <CommissionsTable 
            commissions={commissionsState.commissions}
            isLoading={commissionsState.status === 'searching'}
            isEmptyFilterResults={commissionsState.commissions.length === 0 && debouncedSearchTerm !== ''}/>
        </div>
    );
};

export default CommissionTab;