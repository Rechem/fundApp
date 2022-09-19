import MaterialTable from "@material-table/core";
import React, { useEffect, useState } from 'react';
import Status from "../../components/status/status";
import { Paper, Typography, useTheme, FormControl, Box, MenuItem } from "@mui/material";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { isSimpleUser, statusDemande } from "../../utils";
import { CustomSelect } from "../../theme";
import tinycolor from "tinycolor2";
import { fetchAllDemandes } from "../../api/api-calls";
import { useSelector } from "react-redux";
import CustomPopover from '../../components/popover/popover'

const cellStyle = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 100 }

const DemandesTable = props => {

    const authenticationState = useSelector(state => state.login)

    const location = useLocation();

    const [searchParams] = useSearchParams();
    const user = searchParams.get('user')

    const theme = useTheme()

    const onChangeHandler = (e, id) => {
        const { name, value } = e.target
        props.updateEtatDemandes(id, value)
    }

    const columns = [
        { title: "ID", field: "idDemande", width: "5%", cellStyle, sorting: false },
        {
            title: "Etat",
            field: "etat",
            width: '15%',
            align: 'center',
            render: (rowData) => {
                if (!props.isBeingEdited)
                    return <Status status={rowData.etat} />
                else {
                    let backgroundColor, color;
                    if (props.etatDemandes[rowData.idDemande] === statusDemande.accepted) {
                        backgroundColor = tinycolor(theme.palette.success.main).setAlpha(.1)
                        color = theme.palette.success.main
                    } else if (props.etatDemandes[rowData.idDemande] === statusDemande.refused) {
                        backgroundColor = tinycolor(theme.palette.error.main).setAlpha(.1)
                        color = theme.palette.error.main
                    } else {
                        backgroundColor = 'transparent';
                        color = 'inherit';
                    }

                    return (
                        <FormControl size='small'>
                            <CustomSelect
                                value={props.etatDemandes[rowData.idDemande]}
                                displayEmpty={true}
                                renderValue={(value) =>
                                    <Typography variant='body2' color={color} fontWeight={500}>
                                        {value}</Typography>}
                                onChange={(e) => onChangeHandler(e, rowData.idDemande)}
                                style={{ width: '7rem', color, backgroundColor }}                    >
                                <MenuItem
                                    variant
                                    style={{ color: theme.palette.success.main }}
                                    value={statusDemande.accepted}>
                                    {statusDemande.accepted}
                                </MenuItem>
                                <MenuItem
                                    style={{ color: theme.palette.error.main }}
                                    value={statusDemande.refused}>
                                    {statusDemande.refused}
                                </MenuItem>
                            </CustomSelect>
                        </FormControl>)
                }
            },
        },

        { title: "Forme juridique", field: "formeJuridique", width: '15%', cellStyle },
        { title: "Dénomination", field: "denominationCommerciale", cellStyle },
        { title: "Montant", field: "montant", cellStyle },
        {
            title: "Détails",
            width: '10%',
            sorting: false,
            render: (rowData) => (
                <Box sx={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', columnGap: '0.5rem'
                }}>
                    <Link to={`/demandes/${rowData.idDemande}`}
                        style={{ textDecoration: 'none' }}>
                        <Typography
                            color={theme.palette.primary.main}
                            display='inline'
                        >Détails</Typography>
                    </Link>
                    {props.canDeprogram &&
                        <CustomPopover
                            options={[
                                { label: 'Déprogrammer', action: () => props.openDeleteConfirmation(rowData) },
                            ]}
                        />}
                </Box>),
        },
    ];

    return <MaterialTable
        // localization={{
        //     body: "Rien à afficher"
        // }}
        tableRef={props.tableRef}
        columns={columns}
        // data={props.demandes}
        data={location.pathname.startsWith('/commissions') ?
            props.demandes : query => {
                // if (authenticationState.user.idUser) {
                    let idUser = null

                    if (user)
                        idUser = user

                    return fetchAllDemandes({ idUser: user, search: props.searchValue })(query)
                // }
            }}
        options={{
            toolbar: false, draggable: false, search: true, padding: 'dense',
            pageSize: 10, paginationType: 'stepped', pageSizeOptions: [],
            rowStyle: (rowData, index) => ({
                backgroundColor:
                    index % 2 !== 0 ? "#fff" : "#f7f7f7",
            })
        }}
        components={{ Container: props => <Paper {...props} elevation={0} /> }} />
};

export default DemandesTable;