import React, { useState, useEffect } from 'react';
import { Typography, Grid, CircularProgress, MenuItem, Box } from '@mui/material';
import { useTheme } from '@mui/system';
import classes from './revenu.module.css'
import Slide from '@mui/material/Slide';
import { useSelector, useDispatch } from 'react-redux'
import useDebounce from '../../custom-hooks/use-debounce';
import { isAdmin, isModo, isSimpleUser } from '../../utils';
import RevenusTable from './revenu-table'
import Toolbar from '../../components/toolbar/toolbar';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomModal from '../../components/custom-modal/custom-modal';
import DetailRevenu from '../../components/form/form-revenu/detail-revenu';
import ConfirmationDialog from '../../components/confirmation-dialog/confirmation-dialog';
import { flattenObject } from '../../utils';

const Revenu = () => {

    const navigate = useNavigate()

    const { idProjet } = useParams()

    const onChangeHandler = e => {
        const { name, value } = e.target
        setSearchInput(value)
    }

    const [selectedItem, setSelectedItem] = useState(null);

    const [openAlert, setOpenAlert] = useState(false);
    const authenticationState = useSelector(state => state.login)

    const [searchInput, setSearchInput] = useState('')
    const [type, setType] = useState('ajouter')

    const [revenu, setRevenu] = useState(null)

    const [isLoading, setIsLoading] = useState(true)
    const [open, setOpen] = useState(false)

    const debouncedSearchTerm = useDebounce(searchInput, 500);

    const fetchAllRevenus = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`revenus/${idProjet}`)
            setRevenu(response.data.data)
            setIsLoading(false)
        } catch (e) {
            if (e.response.status === 404)
                navigate('/notfound')
            else
                toast.error(e.response.data.message)
        }
    }

    const handleDialogClickOpen = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const deleteRevenu = async () => {
        await axios.delete(
            `revenus/${selectedItem.projetId}/${selectedItem.idArticleRevenu}`)
    }

    const handleOpenDelete = (item) => {
        setSelectedItem(item)
        setOpenAlert(true)
    }

    const handleOpenDetails = (item) => {
        setType('detail')
        setSelectedItem(item)
        handleDialogClickOpen()
    }

    const handleOpenAdd = () => {
        setType('ajouter')
        setSelectedItem(null)
        handleDialogClickOpen()
    }


    useEffect(
        () => {
            if (authenticationState.user.idUser)
                fetchAllRevenus()
        },
        [idProjet, authenticationState.user.idUser] // Only call effect if debounced search term changes
    );

    const dispatchSeenRevenu = async () => {
        if (isSimpleUser(authenticationState) && revenu && revenu.revenu && !revenu.revenu.seenByUser) {
            try {
                await axios.patch(`/revenus/seenByUser/${revenu.projet.idProjet}`)
            } catch (e) {
            }
        }
    }

    useEffect(() => {
        dispatchSeenRevenu()
    }, [revenu])

    const theme = useTheme()

    return (
        <React.Fragment>
            <Typography color={theme.palette.text.main}
                variant='h3' className={classes.hdr}>
                Revenu
            </Typography>

            {!revenu ?
                <CircularProgress sx={{ display: 'block', margin: 'auto' }}
                    size='2rem' /> :
                <>
                    <Grid container columns={12} columnSpacing={6} mb='2rem' rowSpacing='1rem'
                        className={classes.dboard}>
                        <Grid item xs={12} sm={6}
                            sx={{ display: 'flex', alignItems: 'center' }}
                            className={classes.center}>
                            <Typography variant='subtitle2'>
                                {revenu.projet.demande.denominationCommerciale}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}
                            className={classes.center}>
                            <Typography
                                color={theme.palette.text.main}
                                variant='subtitle2'>
                                {revenu.revenu.valeur} DZD
                            </Typography>
                        </Grid>
                    </Grid>

                    <Toolbar
                        buttonLabel='Ajouter un revenu'
                        className={classes.toolbar}
                        searchValue={searchInput}
                        onSearchChangeHandler={onChangeHandler}
                        onClick={handleOpenAdd}
                        hideButton={!isSimpleUser(authenticationState)}
                        onRefresh={fetchAllRevenus} />

                    <CustomModal open={open} onClose={handleDialogClose}>
                        <DetailRevenu
                            onClose={handleDialogClose}
                            type={type}
                            values={selectedItem}
                            projetId={idProjet}
                            afterSubmit={fetchAllRevenus}
                            selectedItem={selectedItem} />
                    </CustomModal>

                    <RevenusTable
                        openDeleteConfirmation={handleOpenDelete}
                        handleOpenDetails={handleOpenDetails}
                        isLoading={isLoading}
                        revenus={revenu.revenu.revenus.filter(r => {
                            const values = Object.values(flattenObject(r))
                            return values.some(e => e?.toString().toLowerCase()
                                .includes(debouncedSearchTerm.toLowerCase()))
                        })}
                    />
                    {selectedItem && <ConfirmationDialog open={openAlert}
                        afterSubmit={fetchAllRevenus}
                        onClose={() => setOpenAlert(false)}
                        onConfirm={deleteRevenu}>
                        Voulez vous vraiment supprimer ce revenu ?
                    </ConfirmationDialog>}
                </>}
        </React.Fragment >

    );
};

export default Revenu;