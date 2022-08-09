import React, { useState, useEffect } from 'react';
import Toolbar from '../../../components/toolbar/toolbar';
import CommissionsTable from './commissions-table';
import useDebounce from '../../../custom-hooks/use-debounce';
import { useDispatch, useSelector } from 'react-redux';

const CommissionTab = () => {

    const dispatch = useDispatch()
    // const membresState = useSelector(state => state.membres)
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

    const clickAddMembre = data =>{
        // dispatch(addMembre(data))
    }

    useEffect(() => {
        // if (authenticationState.user.idUser)
            // dispatch(fetchAllMembres(debouncedSearchTerm));
    }, [authenticationState.user.idUser, debouncedSearchTerm])

    return (
        <div>
            <Toolbar onSearchChangeHandler={onChangeHandler}
            onClick={handleDialogClickOpen}
            searchValue={searchInput} buttonLabel='Ajourer une commission'/>
            <CommissionsTable/>
        </div>
    );
};

export default CommissionTab;