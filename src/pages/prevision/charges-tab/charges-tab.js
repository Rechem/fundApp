import React, { useState, useEffect } from 'react';
import Toolbar from '../../../components/toolbar/toolbar'
import InvestissementsTable from '../investissements-tab/investissements-table';
import FormInvestissement from '../form-investissement-charge';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Dialog, Box } from '@mui/material';

const ChargesTab = props => {
    //provide an argument to specify wheter its charge or investissement for the type.

    const { idProjet, tranche } = useParams()

    const [open, setOpen] = useState(false);
    const [chargesExternes, setChargesExternes] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const handleDialogClickOpen = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const fetchChargesExternes = async () => {
        setIsLoading(true)
        props.setTotal(0)
        try {
            const response = await axios.get(
                `/${props.isRealisation ? `realisations` : `previsions`}/${idProjet}/${tranche}/chargesexternes`)
            setChargesExternes(response.data.data.results)
            if (props.isRealisation)
                props.setTotal(response.data.data.results.reduce(
                    (partialSum, e) => partialSum + e.ChargeExterne.montantUnitaire * e.ChargeExterne.quantite, 0))
            else
                props.setTotal(response.data.data.results.reduce(
                    (partialSum, e) => partialSum + e.montantUnitaire * e.quantite, 0))
        } catch (e) {
            toast.error(e.response.data.message)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchChargesExternes()
    }, [idProjet, tranche])

    return (
        <div>
            <Toolbar style={{ marginBlock: '1rem' }} onClick={handleDialogClickOpen}
                hideButton={props.disabledAddButton} />
            <InvestissementsTable
                isRealisation={props.isRealisation ? true : false}
                isLoading={isLoading}
                data={chargesExternes} />
            <Dialog open={open} onClose={handleDialogClose}>
                <Box>
                    <FormInvestissement
                        type='charge-externe'
                        projetId={idProjet}
                        numeroTranche={tranche}
                        afterSubmit={fetchChargesExternes}
                        onClose={handleDialogClose} />
                </Box>
            </Dialog>
        </div>
    );
};

export default ChargesTab;