import React, { useState, useEffect } from 'react';
import Toolbar from '../../../components/toolbar/toolbar'
import InvestissementsTable from './investissements-table';
import FormInvestissement from '../form-investissement-charge';
import { useParams } from 'react-router-dom';
import DetailArticle from '../../../components/detail-article-realisation/detail-article-realisation';
import axios from 'axios';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../../../components/confirmation-dialog/confirmation-dialog';
import CustomModal from '../../../components/custom-modal/custom-modal';

const InvestissementsTab = props => {

    const { idProjet, tranche } = useParams()

    const [open, setOpen] = useState(false);
    const [investissements, setInvestissements] = useState([]);

    const [selectedItem, setSelectedItem] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const [openAlert, setOpenAlert] = useState(false);

    const handleDialogClickOpen = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const deleteInvestissement = async () => {
        await axios.delete(
            `previsions/${selectedItem.projetId}/${selectedItem.numeroTranche}/investissement/${selectedItem.idInvestissement}`)
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

    let formUI = null

    const [form, setForm] = useState('ajouter-modifier')

    switch (form) {
        case 'ajouter-modifier':
            formUI = <FormInvestissement
                values={selectedItem}
                type='investissement'
                projetId={idProjet}
                numeroTranche={tranche}
                afterSubmit={fetchInvestissements}
                onClose={handleDialogClose} />
            break;
        case 'details':
            formUI = <DetailArticle
                isRealisation={props.isRealisation ? true : false}
                type='investissement'
                selectedItem={selectedItem}
                afterSubmit={fetchInvestissements}
                onClose={handleDialogClose} />
            break;
        default:
            break;
    }

    useEffect(() => {
        fetchInvestissements()
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
                data={investissements} />
            <CustomModal open={open} onClose={handleDialogClose}>
                {formUI}
            </CustomModal>
            {selectedItem && <ConfirmationDialog open={openAlert}
                afterSubmit={fetchInvestissements}
                onClose={() => setOpenAlert(false)}
                onConfirm={deleteInvestissement}>
                Voulez vous vraiment supprimer cet article ?
            </ConfirmationDialog>}
        </div >
    );
};

export default InvestissementsTab;