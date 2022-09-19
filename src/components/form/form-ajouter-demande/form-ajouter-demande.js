import React, { useState, useEffect, createRef } from 'react';
import classes from './form-ajouter-demande.module.css'
import {
    Typography, Button, FormHelperText, FormControl,
    CircularProgress, useTheme
} from '@mui/material';
import SelectDemandeTable from './select-demande-table';
import tinycolor from 'tinycolor2';
import axios from 'axios';
import { toast } from 'react-toastify'
import Toolbar from '../../toolbar/toolbar';
import useDebounce from '../../../custom-hooks/use-debounce';
import { statusDemande } from '../../../utils';

const FormAjouterDemande = props => {

    const theme = useTheme()

    const [searchInput, setSearchInput] = useState('')
    const debouncedSearchTerm = useDebounce(searchInput, 500);

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedDemandes, setSelectedDemandes] = useState([])

    const onSearchChangeHandler = e => {
        const { name, value } = e.target
        setSearchInput(value)
    }

    const tableRef = createRef()

    const refreshTable = () => {
        tableRef.current.onQueryChange();
    }

    useEffect(refreshTable,[debouncedSearchTerm])

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
                <Typography variant='body1' fontWeight={700}
                    marginBottom='1rem' marginRight='1rem'>
                    Ajouter une demande à cette commission
                </Typography>
            <Toolbar hideButton className={classes.toolbar}
            onSearchChangeHandler={onSearchChangeHandler}
            onRefresh={refreshTable}
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
                searchValue={debouncedSearchTerm}
                tableRef={tableRef}
                    selectedCommission={selectedDemandes}
                    selectedDemandes={selectedDemandes}
                    handleClick={handleClick}
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
                disabled={isLoading}
                startIcon={isLoading ?
                    <CircularProgress size='1rem' color='background' />
                    : null}
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