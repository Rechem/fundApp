import MaterialTable from "@material-table/core";
import React, { useEffect, useState } from 'react';
import { Paper, Typography, useTheme, Modal, Box } from "@mui/material";
import moment from "moment";

const cellStyle = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 100 }

const MembresTable = props => {

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
            title: "Nom",
            field: "nomMembre",
        },
        {
            title: "Prénom",
            field: "prenomMembre",
        },
        {
            title: "Adresse mail",
            field: "emailMembre",
        },
    ];

    return <React.Fragment>
        {/* <Modal
            open={open}
            onClose={handleClose}
        ><Box>
                <DetailsDemande {...selectedDemande} onClose={handleClose} />
            </Box>
        </Modal> */}
        <MaterialTable
            localization={{
                body:
                {
                    emptyDataSourceMessage: props.isEmptyFilterResults && !props.isLoading ?
                        "Aucun résultat" : "Aucun membre... pour l'instant"
                }
            }}
            columns={columns}
            data={props.membres}
            isLoading={props.isLoading}
            options={{ toolbar: false, paging: false, draggable: false, search: true, padding: 'dense' }}
            components={{ Container: props => <Paper {...props} elevation={0} /> }} />
    </React.Fragment>
};

export default MembresTable;