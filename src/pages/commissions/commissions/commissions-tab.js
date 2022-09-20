import React, { useState, useEffect, createRef } from 'react';
import Toolbar from '../../../components/toolbar/toolbar';
import CommissionsTable from './commissions-table';
import useDebounce from '../../../custom-hooks/use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import FormCommission from '../../../components/form/form-commission/form-commission';
import { Dialog, Box } from '@mui/material';
import classes from './commissions-tab.module.css'
import axios from 'axios';
import CustomModal from '../../../components/custom-modal/custom-modal';

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

    const tableRef = createRef()

    const refreshTable = () => {
        tableRef.current.onQueryChange();
    }

    useEffect(refreshTable,[debouncedSearchTerm])

    return (
        <div>
            <Toolbar className={classes.toolbar}
                onClick={handleDialogClickOpen}
                onSearchChangeHandler={onChangeHandler}
                onRefresh={refreshTable}
                searchValue={searchInput} buttonLabel='Ajourer une commission' />
            <CustomModal open={open} onClose={handleDialogClose} >
                    <FormCommission
                        afterSubmit={refreshTable}
                        onClose={handleDialogClose} />
            </CustomModal>
            <CommissionsTable
            tableRef={tableRef}
            searchValue={debouncedSearchTerm}
                // commissions={commissionsState.commissions}
                // isLoading={commissionsState.status === 'searching'}
                // isEmptyFilterResults={commissionsState.commissions.length === 0 && debouncedSearchTerm !== ''}
                />
        </div>
    );
};

export default CommissionTab;