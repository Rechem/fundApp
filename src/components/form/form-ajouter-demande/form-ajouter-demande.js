import React, { useState, useEffect, useRef } from 'react';
import classes from './form-ajouter-demande.module.css'
import {
    Typography, Button, FormHelperText, FormControl,
    CircularProgress, useTheme
} from '@mui/material';
import SelectDemandeTable from './select-demande-table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllDemandes } from '../../../store/demandesSlice/reducer'
import tinycolor from 'tinycolor2';
import axios from 'axios';
import { toast } from 'react-toastify'
import Toolbar from '../../toolbar/toolbar';
import useDebounce from '../../../custom-hooks/use-debounce';
import { statusDemande } from '../../../utils';

const FormAjouterDemande = props => {

    const theme = useTheme()

    const demandesState = useSelector(state => state.demandes)
    const authenticationState = useSelector(state => state.login)

    const [searchInput, setSearchInput] = useState('')
    const debouncedSearchTerm = useDebounce(searchInput, 500);

    const dispatch = useDispatch()

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedDemandes, setSelectedDemandes] = useState([])

    const onSearchChangeHandler = e => {
        const { name, value } = e.target
        setSearchInput(value)
    }

    useEffect(() => {
        if (authenticationState.user.idUser)
            dispatch(fetchAllDemandes(debouncedSearchTerm));
    }, [authenticationState.user.idUser, debouncedSearchTerm])

    const onAddDemandeClick = async () => {
        if (selectedDemandes.length === 0) {
            setError('Pour celà, vous devez sélectioner au moins une demande.')
        }
        else {
            setIsLoading(true)
            let hasErrorOccured = false;

            for await (const demande of selectedDemandes) {
                let requestObject = {
                    idDemande: demande,
                    etat: statusDemande.programmee,
                    idCommission: props.idCommission
                }

                try {
                    await axios.patch(
                        `/demandes`,
                        requestObject)

                } catch (e) {
                    hasErrorOccured = true
                    toast.error(`Erreur lors de la programmation de la demande id=${demande.idDemande}`)

                }
            }
            setIsLoading(false)
            if (!hasErrorOccured){
                props.afterSubmit()
                props.onClose()
            }
        }

    }

    const handleClick = idDemande => {
        setError('')
        if (selectedDemandes.includes(idDemande)) {
            setSelectedDemandes(selectedDemandes.filter(d => d !== idDemande))
        } else
            setSelectedDemandes([...selectedDemandes, idDemande])
    }

    return (
        <div className={classes.container}>
            <div className={classes.hdrContainer}>
                <Typography variant='body1' fontWeight={700} display='inline'
                    marginBottom='2rem' marginRight='1rem'>
                    Ajouter une demande à cette commission
                </Typography>
                {isLoading && <CircularProgress size='1rem' />}
            </div>
            <Toolbar hideButton className={classes.toolbar}
            onSearchChangeHandler={onSearchChangeHandler}
            searchValue={searchInput}/>
            <div className={classes.table}>
                {selectedDemandes.length > 0 &&
                    <div style={{
                        padding: '1rem',
                        backgroundColor: tinycolor(theme.palette.primary.main).setAlpha(.1)
                    }}>
                        <Typography color='primary'>
                            {selectedDemandes.length} Demande(s) selectionnée(s)</Typography>
                    </div>
                }
                <SelectDemandeTable
                    selectedCommission={selectedDemandes}
                    selectedDemandes={selectedDemandes}
                    handleClick={handleClick}
                    demandes={demandesState.demandes}
                isLoading={demandesState.status === 'searching'}
                isEmptyFilterResults={demandesState.demandes.length === 0
                && debouncedSearchTerm !== ''
            }
                />
                <FormControl fullWidth
                    error={error !== ''}>
                    {error !== '' &&
                        <FormHelperText className={classes.helper}>
                            {error}
                        </FormHelperText>}
                </FormControl>
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
                    onClick={onAddDemandeClick}
                >
                    <Typography color='white' fontWeight={400}
                        variant='body1'>Ajouter</Typography>
                </Button>
            </div>
        </div>
    );
};

export default FormAjouterDemande;