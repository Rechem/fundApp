import MaterialTable from "@material-table/core";
import React, { useEffect, useState } from 'react';
import Status from "../../../components/status/status";
import { Paper, Typography, useTheme, Modal, Box, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MoreVert } from "@mui/icons-material";

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
            align: 'left',
            render: rowData => props.isRealisation ? rowData[rowData.type].type.nomPoste : rowData.type.nomPoste
        },
        {
            title: "Nb. de mois",
            align: 'right',
            width: '15%',
            render: rowData => props.isRealisation ? rowData[rowData.type].nbMois : rowData.nbMois
        },
        {
            title: "Salaire Mensuel",
            align: 'right',
            width: '20%',
            render: rowData => props.isRealisation ? rowData[rowData.type].salaireMensuel : rowData.salaireMensuel
        },
        {
            title: "Nb. de personnes",
            align: 'right',
            render: rowData => props.isRealisation ? rowData[rowData.type].nbPersonne : rowData.nbPersonne
        },
        {
            title: "Total",
            align: 'right',
            width: '25%',
            render: (rowData) => props.isRealisation ?
                rowData[rowData.type].nbPersonne * rowData[rowData.type].salaireMensuel * rowData[rowData.type].nbMois
                : rowData.salaireMensuel * rowData.nbPersonne * rowData.nbMois
        },
        {
            title: "Détails",
            width: '15%',
            align: 'center',
            sorting: false,
            render: (rowData) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Button onClick={() => setSelectedItem(rowData.idArticlePrevision)}>
                        <Typography color={theme.palette.primary.main}>
                            {props.Realisation ? 'Détails' : 'Ouvrir'}</Typography>
                    </Button>
                    {!props.isRealisation &&
                        <IconButton size="small">
                            <MoreVert color='text' />
                        </IconButton>}
                </Box>
            ),
        },
    ];

    if (props.isRealisation)
        columns.splice(0, 0, ({
            title: "Etat",
            field: "etat",
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
            data={props.salaires}
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

export default SalairesTable;