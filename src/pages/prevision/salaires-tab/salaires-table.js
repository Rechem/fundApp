import MaterialTable from "@material-table/core";
import React, { useEffect, useState } from 'react';
import Status from "../../../components/status/status";
import { Paper, Typography, useTheme, Modal, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const cellStyle = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 100 }

const SalairesTable = props => {

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
            title: "Poste",
            field: 'poste',
            align: 'center',
            render: (rowData) =>
                <Typography align="left" marginX='1rem'>
                    {rowData.dateCommission}
                </Typography>,
        },
        {
            title: "Nb. de mois",
            field: "nbMois",
            align: 'center',
            width: '20%'
        },
        {
            title: "Salaire Mensuel",
            field: "salaireMensuel",
            align: 'center',
            width: '20%'
        },
        {
            title: "Nb. de personnes",
            field: "nbPersonnes",
            align: 'center',
            width: '20%'
        },
        {
            title: "Total",
            field: "nbPersonnes",
            align: 'center',
            width: '20%'
        },
        {
            title: "Détails",
            width: '15%',
            align: 'center',
            sorting: false,
            render: (rowData) => (
                <span onClick={() => setSelectedItem(rowData.idArticlePrevision)} style={{ cursor: 'pointer' }}>
                    <Typography
                        color={theme.palette.primary.main}
                        display='inline'
                    >Voir</Typography>
                </span>),
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
            data={props.salaires}
            isLoading={props.isLoading}
            options={{
                toolbar: false, draggable: false, search: true, padding: 'dense',
                pageSize: 10, paginationType: 'stepped', pageSizeOptions: [],
                rowStyle: (rowData, index) => ({
                    backgroundColor:
                        index % 2 !== 0 ? "#fff" : "#f7f7f7",
                }),
            }}
            components={{ Container: props => <Paper {...props} elevation={0} /> }} />
    </React.Fragment>
};

export default SalairesTable;