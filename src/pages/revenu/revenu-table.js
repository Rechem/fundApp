import MaterialTable from "@material-table/core";
import React, { useState } from 'react';
import Status from "../../components/status/status";
import { Paper, Typography, useTheme, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { isAdmin, isSimpleUser, statusArticleRevenu } from "../../utils";
import { useSelector } from "react-redux";
import CustomPopover from "../../components/popover/popover";

const cellStyle = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 100 }

const RevenusTable = props => {

    const authenticationState = useSelector(state => state.login)

    const navigate = useNavigate()

    const theme = useTheme()

    const columns = [
        {
            title: "Etat",
            field: "etat",
            width: '15%',
            align: 'center',
            render: (rowData) => <Status status={rowData.etat} />
        },
        {
            title: "Date début",
            field: "dateDebut",
        },
        {
            title: "Date fin",
            field: "dateFin",
        },
        {
            title: "Montant",
            field: 'montant',
            align: 'right',
        },
        {
            title: "Lien/Facture",
            field: "lien",
            align: 'center',
            render: (rowData) => (
                <Box
                    component="a"
                    href={rowData.lien ? rowData.lien :
                        `${process.env.REACT_APP_BASE_URL}${rowData.facture}`}
                    target='_blank'
                    sx={{ color: theme.palette.primary.main }}>
                    Voir</Box>),
        },
        {
            width: '15%',
            align: 'center',
            sorting: false,
            render: (rowData) => {
                let buttonMessage = 'Détails'
                let buttonVariant = 'text'

                let action = () => props.handleOpenDetails(rowData)

                if (rowData.etat === statusArticleRevenu.pending
                    && isAdmin(authenticationState)) {
                    buttonMessage = 'Evaluer'
                    buttonVariant = 'contained'
                }

                return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Button onClick={action}
                        variant={buttonVariant}>
                        <Typography color={buttonVariant === 'contained' ? 'white' : theme.palette.primary.main}>
                            {buttonMessage}</Typography>
                    </Button>
                    {isSimpleUser(authenticationState)
                        && rowData.etat !== statusArticleRevenu.accepted
                        &&
                        <CustomPopover
                            options={[
                                { label: 'Supprimer', action: () => props.openDeleteConfirmation(rowData) },
                            ]}
                        />}
                </Box>
            }
        },
    ];

    return <React.Fragment>
        <MaterialTable
            localization={{
                body:
                {
                    emptyDataSourceMessage: props.isEmptyFilterResults && !props.isLoading ?
                        "Aucun résultat" : "Rien à afficher"
                }
            }}
            columns={columns}
            data={props.revenus}
            isLoading={props.isLoading}
            options={{
                toolbar: false, draggable: false, padding: 'dense',
                pageSize: 10, paginationType: 'stepped', pageSizeOptions: [],
                rowStyle: (rowData, index) => ({
                    backgroundColor:
                        index % 2 !== 0 ? "#fff" : "#f7f7f7",
                }),
            }}
            components={{ Container: props => <Paper {...props} elevation={0} /> }} />
    </React.Fragment>
};

export default RevenusTable;