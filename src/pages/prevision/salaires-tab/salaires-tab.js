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
import { useSelector } from 'react-redux';
import useDebounce from '../../../custom-hooks/use-debounce';
import { flattenObject } from '../../../utils';

const SalairesTab = props => {

    const authenticationState = useSelector(state => state.login)

    const { idProjet, tranche } = useParams()

    const [open, setOpen] = useState(false);
    const [salaires, setSalaires] = useState([]);

    const [searchInput, setSearchInput] = useState('')
    const debouncedSearchTerm = useDebounce(searchInput, 500);

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
        if (authenticationState.user.idUser)
        fetchSalaires()
    }, [idProjet, tranche, authenticationState.user.idUser])

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

    const onChangeHandler = e => {
        const { name, value } = e.target
        setSearchInput(value)
    }

    let formUI = null

    const [form, setForm] = useState('ajouter')

    switch (form) {
        case 'ajouter-modifier':
            formUI = <FormSalaire
                values={selectedItem}
                projetId={idProjet}
                numeroTranche={tranche}
                afterSubmit={() => {
                    fetchSalaires()
                    props.updatePrevision()
                }}
                onClose={handleDialogClose} />
            break;
        case 'details':
            formUI = <DetailArticle
                type='salaire'
                isRealisation={props.isRealisation ? true : false}
                afterSubmit={()=>{
                    fetchSalaires()
                    props.updateRealisation()
                }}
                selectedItem={selectedItem}
                onClose={handleDialogClose} />
            break;
        default:
            break;
    }

    return (
        <div>
            <Toolbar style={{ marginBlock: '1rem' }}
                onClick={handleOpenAdd} hideButton={props.cannotEdit}
                onRefresh={fetchSalaires}
                searchValue={searchInput}
                        onSearchChangeHandler={onChangeHandler}/>
            <SalairesTable
                openDeleteConfirmation={handleOpenDelete}
                openEditForm={handleOpenEdit}
                handleOpenDetails={handleOpenDetails}
                cannotEdit={props.cannotEdit}
                isRealisation={props.isRealisation ? true : false}
                isLoading={isLoading}
                salaires={salaires.filter(r => {
                    const flat = flattenObject(r)
                    const values = Object.values(flat)
                    return values.concat(flat.nbPersonne*flat.nbMois*flat.salaireMensuel)
                    .some(e => e?.toString().toLowerCase()
                    .includes(debouncedSearchTerm.toLowerCase()))
                })} />
            <CustomModal open={open} onClose={handleDialogClose}>
                {formUI}
            </CustomModal>
            {selectedItem && <ConfirmationDialog open={openAlert}
                afterSubmit={() => {
                    fetchSalaires()
                    props.updatePrevision()}}
                onClose={() => setOpenAlert(false)}
                onConfirm={deleteSalaire}>
                Voulez vous vraiment supprimer cet article ?
            </ConfirmationDialog>}
        </div>
    );
};

export default SalairesTab;