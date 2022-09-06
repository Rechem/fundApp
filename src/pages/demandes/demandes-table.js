import MaterialTable from "@material-table/core";
import React, { useEffect, useState } from 'react';
import Status from "../../components/status/status";
import { Paper, Typography, useTheme, FormControl, Box, MenuItem } from "@mui/material";
import moment from "moment";
import { Link } from "react-router-dom";
import { statusDemande } from "../../utils";
import { CustomSelect } from "../../theme";
import tinycolor from "tinycolor2";

const cellStyle = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 100 }

const DemandesTable = props => {

    const theme = useTheme()

    const onChangeHandler = (e, id) => {
        const { name, value } = e.target
        props.updateEtatDemandes(id, value)
    }

    const columns = [
        // {
        //     title: "Date dépôt",
        //     field: "createdAt",
        //     width:'15%',
        //     render: (rowData) => moment(rowData.createdAt).format("DD/MM/YYYY"),
        // },
        { title: "ID", field: "idDemande", width: "5%", cellStyle },
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

        // { title: "Nom", field: "user.nom", cellStyle },
        { title: "Forme juridique", field: "formeJuridique", width: '15%', cellStyle },
        { title: "Dénomination", field: "denominationCommerciale", cellStyle },
        { title: "Montant", field: "montant", cellStyle },
        {
            title: "Détails",
            width: '10%',
            sorting: false,
            render: (rowData) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                    {/* {isSimpleUser(authenticationState)
                        && rowData.etat !== statusArticleRevenu.accepted
                        &&
                        <CustomPopover
                            options={[
                                { label: 'Supprimer', action: () => props.openDeleteConfirmation(rowData) },
                            ]}
                        />} */}
                    <Link to={`/demandes/${rowData.idDemande}`}
                        style={{ textDecoration: 'none' }}>
                        <Typography
                            color={theme.palette.primary.main}
                            display='inline'
                        >Détails</Typography>
                    </Link>
                </Box>),
        },
    ];

    return <MaterialTable
        localization={{
            body:
            {
                emptyDataSourceMessage: props.isEmptyFilterResults && !props.isLoading ?
                    "Aucun résultat" : "Rien à afficher"
            }
        }}
        columns={columns}
        data={props.demandes}
        isLoading={props.isLoading}
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