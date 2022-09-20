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
import { useSelector } from 'react-redux';
import useDebounce from '../../../custom-hooks/use-debounce';
import { flattenObject } from '../../../utils';
import CustomModal from '../../../components/custom-modal/custom-modal';

const ChargesTab = props => {
    //provide an argument to specify wheter its charge or investissement for the type.

    const authenticationState = useSelector(state => state.login)

    const { idProjet, tranche } = useParams()

    const [open, setOpen] = useState(false);
    const [chargesExternes, setChargesExternes] = useState([]);

    const [searchInput, setSearchInput] = useState('')
    const debouncedSearchTerm = useDebounce(searchInput, 500);

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

    const onChangeHandler = e => {
        const { name, value } = e.target
        setSearchInput(value)
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
                afterSubmit={() => {
                    fetchChargesExternes()
                    props.updatePrevision()
                }}
                onClose={handleDialogClose} />
            break;
        case 'details':
            formUI = <DetailArticle
                isRealisation={props.isRealisation ? true : false}
                type='charge-externe'
                afterSubmit={() => {
                    fetchChargesExternes()
                    props.updateRealisation()
                }}
                selectedItem={selectedItem}
                onClose={handleDialogClose} />
            break;
        default:
            break;
    }

    useEffect(() => {
        if (authenticationState.user.idUser)
            fetchChargesExternes()
    }, [idProjet, tranche, authenticationState.user.idUser])

    return (
        <div>
            <Toolbar style={{ marginBlock: '1rem' }} onClick={handleOpenAdd}
                hideButton={props.cannotEdit}
                onRefresh={fetchChargesExternes}
                searchValue={searchInput}
                onSearchChangeHandler={onChangeHandler} />
            <InvestissementsTable
                openDeleteConfirmation={handleOpenDelete}
                openEditForm={handleOpenEdit}
                handleOpenDetails={handleOpenDetails}
                cannotEdit={props.cannotEdit}
                isRealisation={props.isRealisation ? true : false}
                isLoading={isLoading}
                data={chargesExternes.filter(r => {
                    const flat = flattenObject(r)
                    const values = Object.values(flat)
                    return values.concat(flat.montantUnitaire * flat.quantite)
                        .some(e => e?.toString().toLowerCase()
                            .includes(debouncedSearchTerm.toLowerCase()))
                })} />
            <CustomModal open={open} onClose={handleDialogClose}>
                {formUI}
            </CustomModal>
            {selectedItem && <ConfirmationDialog open={openAlert}
                afterSubmit={() => {
                    fetchChargesExternes()
                    props.updatePrevision()
                }}
                onClose={() => setOpenAlert(false)}
                onConfirm={deleteInvestissement}>
                Voulez vous vraiment supprimer cet article ?
            </ConfirmationDialog>}
        </div>
    );
};

export default ChargesTab;