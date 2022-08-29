import React, { useState, useEffect } from 'react';
import Toolbar from '../../../components/toolbar/toolbar'
import InvestissementsTable from './investissements-table';
import { Box, Dialog } from '@mui/material';
import FormInvestissement from '../form-investissement-charge';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const InvestissementsTab = props => {

    const { idProjet, tranche } = useParams()

    const [open, setOpen] = useState(false);
    const [investissements, setInvestissements] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const handleDialogClickOpen = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const fetchInvestissements = async () => {
        setIsLoading(true)
        props.setTotal(0)
        try {
            const response = await axios.get(
                `/${props.isRealisation ? `realisations` : `previsions`}/${idProjet}/${tranche}/investissements`)
            setInvestissements(response.data.data.results)
            if (props.isRealisation)
                props.setTotal(response.data.data.results.reduce(
                    (partialSum, e) => partialSum + e.Investissement.montantUnitaire * e.Investissement.quantite, 0))
            else
                props.setTotal(response.data.data.results.reduce(
                    (partialSum, e) => partialSum + e.montantUnitaire * e.quantite, 0))
        } catch (e) {
            toast.error(e.response.data.message)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchInvestissements()
    }, [idProjet, tranche])

    return (
        <div>
            <Toolbar style={{ marginBlock: '1rem' }} onClick={handleDialogClickOpen}
                hideButton={props.disabledAddButton} />
            <InvestissementsTable
                isRealisation={props.isRealisation ? true : false}
                isLoading={isLoading}
                data={investissements} />
            <Dialog open={open} onClose={handleDialogClose}>
                <Box>
                    <FormInvestissement
                        type='investissement'
                        projetId={idProjet}
                        numeroTranche={tranche}
                        afterSubmit={fetchInvestissements}
                        onClose={handleDialogClose} />
                </Box>
            </Dialog>
        </div >
    );
};

export default InvestissementsTab;