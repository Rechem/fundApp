import MaterialTable from "@material-table/core";
import React, { useEffect, useState } from 'react';
import { Paper, Typography, useTheme, } from "@mui/material";
import axios from "axios";
import CustomPopover from "../../../components/popover/popover";
import ConfirmationDialog from "../../../components/confirmation-dialog/confirmation-dialog";

const cellStyle = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 100 }

const MembresTable = props => {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const theme = useTheme()

    const columns = [
        {
            title: "ID",
            field: "idMembre",
            width: '5%'
        },
        {
            title: "Nom",
            field: "nomMembre",
        },
        {
            title: "Prénom",
            field: "prenomMembre",
            width: '30%'
        },
        {
            title: "Adresse mail",
            field: "emailMembre",
        },
        {
            title: "Action",
            align: 'center',
            sorting: false,
            render: (rowData) =>
            (<CustomPopover
            membre={{
                idMembre : rowData.idMembre,
                nomMembre : rowData.nomMembre,
                prenomMembre : rowData.prenomMembre,
                emailMembre : rowData.emailMembre,
            }}
            
            />)
        },
    ];

    return <React.Fragment>
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
            options={{
                toolbar: false,  draggable: false, search: true, padding: 'dense',
                pageSize: 8, paginationType: 'stepped', pageSizeOptions: [], 
                rowStyle: (rowData, index) => ({
                    backgroundColor:
                        index % 2 !== 0 ? "#fff" : "#f7f7f7",
                }),
            }}
            components={{ Container: props => <Paper {...props} elevation={0} /> }} />
    </React.Fragment>
};

export default MembresTable;