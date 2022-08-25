import React from 'react';
import MaterialTable from '@material-table/core';
import { Paper } from '@mui/material';

const MessagesTable = props => {

    const columns = [
        {
            title: "De",
            field: "sender",
            sorting: false,
            width : "10%"
        },
        {
            title: "Objet",
            field: "object",
            sorting: false,
        },
        {
            title: "Date/Heure",
            field: "dateMessage",
            sorting: false,
            width: '10%'
        },
    ];

    return (
        <MaterialTable
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
            options={{ toolbar: false, paging: false, draggable: false, search: true, padding: 'dense' }}
            components={{ Container: props => <Paper {...props} elevation={0} /> }} />
    );
};

export default MessagesTable;