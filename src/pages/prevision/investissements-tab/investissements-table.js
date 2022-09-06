import MaterialTable from "@material-table/core";
import React, { useEffect, useState } from 'react';
import Status from "../../../components/status/status";
import { Paper, Typography, useTheme, IconButton, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MoreVert } from "@mui/icons-material";
import CustomPopover from "../../../components/popover/popover";
import { isAdmin, isSimpleUser, statusArticleRealisation } from "../../../utils";
import { useSelector } from "react-redux";

const cellStyle = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 100 }

const InvestissementsTable = props => {

    const authenticationState = useSelector(state => state.login)

    const navigate = useNavigate()

    const theme = useTheme()

    const [open, setOpen] = React.useState(false);

    const handleOpen = item => {
        setSelectedItem(item)
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const [selectedItem, setSelectedItem] = useState(null)

    const columns = [
        {
            title: "Type",
            width: '25%',
            align: 'left',
            render: rowData => props.isRealisation ? rowData[rowData.type].type.nomType : rowData.type.nomType
        },
        {
            title: "Montant unitaire",
            align: 'right',
            render: rowData => props.isRealisation ? rowData[rowData.type].montantUnitaire : rowData.montantUnitaire
        },
        {
            title: "Lien/Facture",
            field: "lien",
            align: 'center',
            render: (rowData) => (
                <Box
                    component="a"
                    href={
                        props.isRealisation ?
                            rowData[rowData.type].lien ? rowData[rowData.type].lien :
                                `${process.env.REACT_APP_BASE_URL}${rowData[rowData.type].facture}`
                            : rowData.lien ? rowData.lien :
                                `${process.env.REACT_APP_BASE_URL}${rowData.facture}`
                    }
                    target='_blank'
                    sx={{ color: theme.palette.primary.main }}>
                    Voir</Box>),
        },
        {
            title: "Quantité",
            align: 'right',
            width: '5%',
            render: rowData => props.isRealisation ? rowData[rowData.type].quantite : rowData.quantite
        },
        {
            title: "Total",
            align: 'right',
            width: '20%',
            render: (rowData) => props.isRealisation ? rowData[rowData.type].quantite * rowData[rowData.type].montantUnitaire
                : rowData.montantUnitaire * rowData.quantite
        },
        {
            width: '15%',
            align: 'center',
            sorting: false,
            render: (rowData) => {

                let buttonMessage = 'Détails'
                let buttonVariant = 'text'

                let action = () => props.handleOpenDetails(rowData)

                if (props.isRealisation
                    && rowData.etat === statusArticleRealisation.pending
                    && isAdmin(authenticationState)) {
                    buttonMessage = 'Evaluer'
                    buttonVariant = 'contained'
                } else if (props.isRealisation
                    && isSimpleUser(authenticationState)
                    && (rowData.etat === statusArticleRealisation.waiting
                        || rowData.etat === statusArticleRealisation.refused)) {
                    buttonMessage = 'Justifier'
                    buttonVariant = 'contained'
                }

                return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Button onClick={action}
                        variant={buttonVariant}>
                        <Typography color={buttonVariant === 'contained' ? 'white' : theme.palette.primary.main}>
                            {buttonMessage}</Typography>
                    </Button>
                    {!props.cannotEdit &&
                        <CustomPopover
                            options={[
                                { label: 'Modifer', action: () => props.openEditForm(rowData) },
                                { label: 'Supprimer', action: () => props.openDeleteConfirmation(rowData) },
                            ]}

                        />}
                </Box>
            }
        },
    ];

    if (props.isRealisation)
        columns.splice(0, 0, ({
            title: "Etat",
            width: '15%',
            align: 'center',
            render: (rowData) => <Status status={rowData.etat} />
        }));

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
            data={props.data}
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

export default InvestissementsTable;