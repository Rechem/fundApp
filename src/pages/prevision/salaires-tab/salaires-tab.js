import React, { useState, useEffect } from 'react';
import Toolbar from '../../../components/toolbar/toolbar'
import SalairesTable from './salaires-table';
import FormSalaire from './form-salaire';
import CustomModal from '../../../components/custom-modal/custom-modal';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DetailArticle from '../../../components/detail-article-realisation/detail-article-realisation';
import ConfirmationDialog from '../../../components/confirmation-dialog/confirmation-dialog';

const SalairesTab = props => {

    const { idProjet, tranche } = useParams()

    const [open, setOpen] = useState(false);
    const [salaires, setSalaires] = useState([]);

    const [selectedItem, setSelectedItem] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const [openAlert, setOpenAlert] = useState(false);

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

    const deleteSalaire = async () => {
        await axios.delete(
            `previsions/${selectedItem.projetId}/${selectedItem.numeroTranche}/salaire/${selectedItem.idSalaire}`)
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

    const [form, setForm] = useState('ajouter')

    switch (form) {
        case 'ajouter-modifier':
            formUI = <FormSalaire
                values={selectedItem}
                projetId={idProjet}
                numeroTranche={tranche}
                afterSubmit={fetchSalaires}
                onClose={handleDialogClose} />
            break;
        case 'details':
            formUI = <DetailArticle
                type='salaire'
                isRealisation={props.isRealisation ? true : false}
                afterSubmit={fetchSalaires}
                selectedItem={selectedItem}
                onClose={handleDialogClose} />
            break;
        default:
            break;
    }

    return (
        <div>
            <Toolbar style={{ marginBlock: '1rem' }}
                onClick={handleOpenAdd} hideButton={props.cannotEdit} />
            <SalairesTable
                openDeleteConfirmation={handleOpenDelete}
                openEditForm={handleOpenEdit}
                handleOpenDetails={handleOpenDetails}
                cannotEdit={props.cannotEdit}
                isRealisation={props.isRealisation ? true : false}
                isLoading={isLoading}
                salaires={salaires} />
            <CustomModal open={open} onClose={handleDialogClose}>
                {formUI}
            </CustomModal>
            {selectedItem && <ConfirmationDialog open={openAlert}
                afterSubmit={fetchSalaires}
                onClose={() => setOpenAlert(false)}
                onConfirm={deleteSalaire}>
                Voulez vous vraiment supprimer cet article ?
            </ConfirmationDialog>}
        </div>
    );
};

export default SalairesTab;