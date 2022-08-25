import React, { useState, useEffect } from 'react';
import Toolbar from '../../../components/toolbar/toolbar'
import InvestissementsTable from './investissements-table';
import { Box, Dialog } from '@mui/material';
import FormInvestissement from './form-investissement';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const InvestissementsTab = props => {

    const { idProjet, tranche } = useParams()

    const [open, setOpen] = useState(false);
    const [investissements, setInvestissements] = useState([]);

    const handleDialogClickOpen = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const fetchInvestissements = async () => {
        try {
            const response = await axios.get(`/previsions/${idProjet}/${tranche}/investissements`)
            setInvestissements(response.data.data.investissements)
        } catch (e) {
            toast.error(e.response.data.message)
        }
    }

    useEffect(() => {
        fetchInvestissements()
    }, [])

    return (
        <div>
            <Toolbar style={{ marginBlock: '1rem' }} onClick={handleDialogClickOpen} />
            <InvestissementsTable 
            investissements={investissements}/>
            <Dialog open={open} onClose={handleDialogClose}>
                <Box>
                    <FormInvestissement
                        projetId={idProjet}
                        numeroTranche={tranche}
                        // afterSubmit={()=>dispatch(fetchAllCommissions(debouncedSearchTerm))}
                        onClose={handleDialogClose} />
                </Box>
            </Dialog>
        </div >
    );
};

export default InvestissementsTab;