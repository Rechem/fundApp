import React, { useState, useEffect } from 'react';
import { Typography, Grid, CircularProgress, MenuItem, Box } from '@mui/material';
import { useTheme } from '@mui/system';
import classes from './revenu.module.css'
import Slide from '@mui/material/Slide';
import { useSelector, useDispatch } from 'react-redux'
import { CustomSelect } from '../../theme';
import { SearchNormal1 } from 'iconsax-react';
import useDebounce from '../../custom-hooks/use-debounce';
import { isAdmin, isModo, isSimpleUser } from '../../utils';
import RevenusTable from './revenu-table'
import Toolbar from '../../components/toolbar/toolbar';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchAllProjets } from '../../store/projetsSlice/reducer';
import CustomModal from '../../components/custom-modal/custom-modal';
import DetailRevenu from '../../components/form/form-revenu/detail-revenu';
import ConfirmationDialog from '../../components/confirmation-dialog/confirmation-dialog';

const Revenu = () => {

    const navigate = useNavigate()

    const { idProjet } = useParams()

    const onChangeHandler = e => {
        const { name, value } = e.target
        setSearchInput(value)
    }

    const [selectedItem, setSelectedItem] = useState(null);

    const [openAlert, setOpenAlert] = useState(false);

    const [currentIdProjet, setCurrentIdProjet] = useState(null)
    const [openSelect, setOpenSelect] = useState(false);

    const handleChangeSelect = async (event) => {
        if (event.target.value.idProjet != idProjet) {
            setRevenu(null)
            navigate(`/projets/${event.target.value.idProjet}/revenu`)
        }
    };

    const handleCloseSelect = () => {
        setOpenSelect(false);
    };

    const handleOpenSelect = () => {
        setOpenSelect(true);
        dispatch(fetchAllProjets())
    };

    const dispatch = useDispatch()
    const authenticationState = useSelector(state => state.login)
    const projetsState = useSelector(state => state.projets)

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
            setCurrentIdProjet(response.data.data.projet)
            setRevenu(response.data.data.revenus)
            setIsLoading(false)
        } catch (e) {
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
            `revenus/${selectedItem.projetId}/${selectedItem.idRevenu}`)
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
            fetchAllRevenus()
        },
        [idProjet] // Only call effect if debounced search term changes
    );

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
                    <Grid container columns={12} columnSpacing={6} mb='2rem'>
                        <Grid item xs={12} sm={6}
                            sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', }}>
                            <CustomSelect
                                defaultValue=""
                                value={currentIdProjet}
                                renderValue={e => e.demande.denominationCommerciale}
                                size='small'
                                open={openSelect}
                                onClose={handleCloseSelect}
                                onOpen={handleOpenSelect}
                                onChange={handleChangeSelect}>
                                {projetsState.status === 'fetching' ?
                                    <MenuItem style={{ opacity: 1 }} disabled>
                                        <CircularProgress size='2rem' style={{ display: 'block', margin: 'auto' }} />
                                    </MenuItem>
                                    :
                                    projetsState.projets.map((e) => e.previsions.length > 0 ? <MenuItem
                                        key={e.idProjet} value={e}>
                                        {e.demande.denominationCommerciale}</MenuItem> : null)
                                }
                            </CustomSelect>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            <Box sx={{
                                color: theme.palette.text.main,
                                typography: 'subtitle2',
                            }} >
                                {revenu.valeur} DZD
                            </Box>
                        </Grid>
                    </Grid>

                    <Toolbar
                        buttonLabel='Ajouter un revenu'
                        className={classes.toolbar}
                        searchValue={searchInput}
                        onSearchChangeHandler={onChangeHandler}
                        onClick={handleOpenAdd}
                        hideButton={!isSimpleUser(authenticationState)} />

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
                        revenus={revenu.revenus}
                    />
                    {selectedItem && <ConfirmationDialog open={openAlert}
                        afterSubmit={fetchAllRevenus}
                        onClose={() => setOpenAlert(false)}
                        onConfirm={deleteRevenu}>
                        Voulez vous vraiment supprimer ce revenu ?
                    </ConfirmationDialog>}
                </>}
        </React.Fragment>

    );
};

export default Revenu;