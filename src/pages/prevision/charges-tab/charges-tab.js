import React, { useState, useEffect } from 'react';
import Toolbar from '../../../components/toolbar/toolbar'
import InvestissementsTable from '../investissements-tab/investissements-table';
import FormInvestissement from '../form-investissement-charge';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Modal, Box } from '@mui/material';
import DetailArticle from '../../../components/detail-article-realisation/detail-article-realisation';
import ConfirmationDialog from '../../../components/confirmation-dialog/confirmation-dialog';

const ChargesTab = props => {
    //provide an argument to specify wheter its charge or investissement for the type.

    const { idProjet, tranche } = useParams()

    const [open, setOpen] = useState(false);
    const [chargesExternes, setChargesExternes] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [openAlert, setOpenAlert] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);

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

    const deleteInvestissement = async () => {
        await axios.delete(
            `previsions/${selectedItem.projetId}/${selectedItem.numeroTranche}/charge-externe/${selectedItem.idChargeExterne}`)
    }

    const handleOpenDelete = (item) => {
        setSelectedItem(item)
        setOpenAlert(true)
    }

    const handleOpenEdit = (item) => {
        setForm('ajouter-modifier')
        setSelectedItem(item)
        handleDialogClickOpen()
    }

    const handleOpenDetails = (item) => {
        setForm('details')
        setSelectedItem(item)
        handleDialogClickOpen()
    }

    const handleOpenAdd = () => {
        setSelectedItem(null)
        setForm('ajouter-modifier')
        handleDialogClickOpen()
    }

    let formUI = null

    const [form, setForm] = useState('ajouter-modifier')

    switch (form) {
        case 'ajouter-modifier':
            formUI = <FormInvestissement
                values={selectedItem}
                type='charge-externe'
                projetId={idProjet}
                numeroTranche={tranche}
                afterSubmit={fetchChargesExternes}
                onClose={handleDialogClose} />
            break;
        case 'details':
            formUI = <DetailArticle
                isRealisation={props.isRealisation ? true : false}
                type='charge-externe'
                afterSubmit={fetchChargesExternes}
                selectedItem={selectedItem}
                onClose={handleDialogClose} />
            break;
        default:
            break;
    }

    useEffect(() => {
        fetchChargesExternes()
    }, [idProjet, tranche])

    return (
        <div>
            <Toolbar style={{ marginBlock: '1rem' }} onClick={handleOpenAdd}
                hideButton={props.cannotEdit} />
            <InvestissementsTable
                openDeleteConfirmation={handleOpenDelete}
                openEditForm={handleOpenEdit}
                handleOpenDetails={handleOpenDetails}
                cannotEdit={props.cannotEdit}
                isRealisation={props.isRealisation ? true : false}
                isLoading={isLoading}
                data={chargesExternes} />
            <Modal open={open} onClose={handleDialogClose}>
                <Box>
                    {formUI}
                </Box>
            </Modal>
            {selectedItem && <ConfirmationDialog open={openAlert}
                afterSubmit={fetchChargesExternes}
                onClose={() => setOpenAlert(false)}
                onConfirm={deleteInvestissement}>
                Voulez vous vraiment supprimer cet article ?
            </ConfirmationDialog>}
        </div>
    );
};

export default ChargesTab;