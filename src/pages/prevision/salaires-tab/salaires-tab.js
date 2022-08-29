import React, { useState, useEffect } from 'react';
import Toolbar from '../../../components/toolbar/toolbar'
import SalairesTable from './salaires-table';
import FormSalaire from './form-salaire';
import { Box, Dialog } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SalairesTab = props => {

    const { idProjet, tranche } = useParams()

    const [open, setOpen] = useState(false);
    const [salaires, setSalaires] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const handleDialogClickOpen = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const fetchSalaires = async () => {
        setIsLoading(true)
        props.setTotal(0)
        try {
            const response = await axios.get(
                `/${props.isRealisation ? `realisations` : `previsions`}/${idProjet}/${tranche}/salaires`)
            setSalaires(response.data.data.results)
            if (props.isRealisation)
                props.setTotal(response.data.data.results.reduce(
                    (partialSum, e) => partialSum + e.Salaire.salaireMensuel * e.Salaire.nbPersonne * e.Salaire.nbMois, 0))
            else
                props.setTotal(response.data.data.results.reduce(
                    (partialSum, e) => partialSum + e.salaireMensuel * e.nbPersonne * e.nbMois, 0))
        } catch (e) {
            toast.error(e.response.data.message)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchSalaires()
    }, [idProjet, tranche])

    return (
        <div>
            <Toolbar style={{ marginBlock: '1rem' }}
                onClick={handleDialogClickOpen} hideButton={props.disabledAddButton} />
            <SalairesTable
                isRealisation={props.isRealisation ? true : false}
                isLoading={isLoading}
                salaires={salaires} />
            <Dialog open={open} onClose={handleDialogClose}>
                <Box>
                    <FormSalaire
                        projetId={idProjet}
                        numeroTranche={tranche}
                        afterSubmit={fetchSalaires}
                        onClose={handleDialogClose} />
                </Box>
            </Dialog>
        </div>
    );
};

export default SalairesTab;