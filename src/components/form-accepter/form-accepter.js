import React, { useState, useEffect } from 'react';
import { Typography, Button, FormHelperText, FormControl, CircularProgress, Box } from '@mui/material';
import classes from './form-accepter.module.css'
import SelectCommissionTable from './select-commission-table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCommissions } from '../../store/commissionsSlice/reducer';
import useDebounce from '../../custom-hooks/use-debounce';
import axios from 'axios';
import STATUS from '../status/status-enum';
import Toolbar from '../toolbar/toolbar';
import { toast } from 'react-toastify';

const FormAccepter = props => {

    const [searchInput, setSearchInput] = useState('')
    const debouncedSearchTerm = useDebounce(searchInput, 500);

    const dispatch = useDispatch()
    const commissionsState = useSelector(state => state.commissions)
    const authenticationState = useSelector(state => state.login)

    const [selectedCommission, setSelectedCommission] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false);

    const onChangeHandler = value => {
        setError('')
        setSelectedCommission(value)
    }

    const onSearchChangeHandler = e => {
        const { name, value } = e.target
        setSearchInput(value)
    }

    useEffect(() => {
        if (authenticationState.user.idUser)
            dispatch(fetchAllCommissions(debouncedSearchTerm));
    }, [authenticationState.user.idUser, debouncedSearchTerm])

    const onAddToCommissionClick = () => {
        if (!selectedCommission) {
            setError('Pour celà, vous devez choisir une commission.')
        } else {
            accepterDemande(selectedCommission)
        }
    }

    const accepterDemande = async idCommission => {

        setIsLoading(true)
        let requestObject = { idDemande: props.idDemande, etat: STATUS.preselectionnee }

        if (idCommission) {
            requestObject.etat = STATUS.programmee
            requestObject.idCommission = idCommission
        }

        try {
            await axios.patch(
                `/demandes`,
                requestObject)
            setIsLoading(false)
            props.onClose()
            props.afterSubmit()
        } catch (e) {
            toast.error(e.response.data.message)
            setIsLoading(false)
        }
    }

    return (
        <div className={classes.container}>
            <div>
                <Typography variant='body1' fontWeight={700} display='inline'
                    marginBottom='0.5rem' marginRight='1rem'>
                    Ajouter à une commission
                </Typography>
                {isLoading && <CircularProgress size='1rem' />}
            </div>
            <div className={classes.table}>
                <Toolbar hideButton
                onSearchChangeHandler={onSearchChangeHandler}
                searchValue={searchInput}/>
                <SelectCommissionTable
                    selectedCommission={selectedCommission}
                    onChangeHandler={onChangeHandler}
                    commissions={commissionsState.commissions}
                    isLoading={commissionsState.status === 'searching'}
                    isEmptyFilterResults={commissionsState.commissions.length === 0
                        && debouncedSearchTerm !== ''
                    } />
                <FormControl fullWidth
                    error={error !== ''}>
                    {error !== '' &&
                        <FormHelperText className={classes.helper}>
                            {error}
                        </FormHelperText>}
                </FormControl>
            </div>
            <div className={classes.buttons}>
                <div>
                    {props.etat !== STATUS.preselectionnee &&
                        <Button className={classes.btnSecondary}
                            onClick={() => accepterDemande(null)}
                        >
                            <Typography fontWeight={400} color='primary'
                                variant='body1'>Accepter et programmer ultérieurement</Typography>
                        </Button>
                    }
                </div>
                <div className={classes.btnContainer}>

                    <Button className={classes.btnSecondary}
                        onClick={props.onClose}
                    >
                        <Typography fontWeight={400} color='primary'
                            variant='body1'>Annuler</Typography>
                    </Button>
                    <Button
                        variant='contained'
                        onClick={onAddToCommissionClick}
                    >
                        <Typography color='white' fontWeight={400}
                            variant='body1'>
                            Accepter
                        </Typography>
                    </Button>
                </div>
            </div>
        </div >
    );
};

export default FormAccepter;