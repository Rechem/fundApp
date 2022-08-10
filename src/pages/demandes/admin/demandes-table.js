import MaterialTable from "@material-table/core";
import React, { useEffect, useState } from 'react';
import Status from "../../../components/status/status";
import { Paper, Typography, useTheme, Modal, Box } from "@mui/material";
import DetailsDemande from "../../../components/details-demande/details-demande";
import moment from "moment";

const cellStyle = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 100 }

const DemandesTable = props => {

    const theme = useTheme()

    const [open, setOpen] = React.useState(false);
    const handleOpen = demande => {
        setSelectedDemande(demande)
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const [selectedDemande, setSelectedDemande] = useState({})

    const columns = [
        {
            title: "Date dépôt",
            field: "createdAt",
            width:'15%',
            render: (rowData) => moment(rowData.createdAt).format("DD/MM/YYYY"),
        },
        {
            title: "Etat",
            field: "etat",
            render: (rowData) => <Status status={rowData.etat} />,
        },
        
        { title: "Nom", field: "user.nom", cellStyle },
        { title: "Prénom", field: "user.prenom", cellStyle },
        { title: "Dénomination", field: "denominationCommerciale", cellStyle },
        { title: "Montant", field: "montant", cellStyle },
        {
            title: "Détails",
            width:'15%',
            sorting: false,
            render: (rowData) => (
                <span onClick={() => handleOpen(rowData)} style={{ cursor: 'pointer' }}>
                    <Typography
                        color={theme.palette.primary.main}
                        display='inline'
                    >Voir</Typography>
                </span>),
        },
    ];

    return <React.Fragment>
        <Modal
            open={open}
            onClose={handleClose}
        ><Box>
                <DetailsDemande {...selectedDemande} onClose={handleClose} />
            </Box>
        </Modal>
        <MaterialTable
            localization={{
                body:
                {
                    emptyDataSourceMessage: props.isEmptyFilterResults && !props.isLoading ?
                    "Aucun résultat" : "Vous n'avez pas de demandes"
                }
            }}
            columns={columns}
            data={props.demandes}
            isLoading={props.isLoading}
            options={{ toolbar: false, paging: false, draggable: false, search: true, padding:'dense' }}
            components={{ Container: props => <Paper {...props} elevation={0} /> }} />
    </React.Fragment>
};

export default DemandesTable;