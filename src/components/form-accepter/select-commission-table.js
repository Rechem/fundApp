import MaterialTable from "@material-table/core";
import React, { useEffect, useState } from 'react';
import { Paper, Typography, useTheme, Radio, Box } from "@mui/material";
import { Link } from "react-router-dom";

const cellStyle = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 100 }

const SelectCommissionTable = props => {

    const theme = useTheme()



    // const commissionsData = props.commissions.map(c=>{...c, })

    const columns = [
        {
            width: '5%',
            render: (rowData) => <Radio
                checked={rowData.idCommission === props.selectedCommission}
                value={rowData.idCommission} />,
        },
        {
            title: "Date",
            width: '10%',
            field: 'dateCommission',
            align: 'center',
            render: (rowData) =>
                <Typography align="left" marginX='1rem'>
                    {rowData.dateCommission}
                </Typography>

        },
        {
            title: "Président",
            align: 'center',
            render: (rowData) =>
                <Typography align="left" marginX='1rem'
                >{rowData.president.nomMembre} {rowData.president.prenomMembre}
                </Typography>
        },
        {
            title: "Demandes",
            field: "nbDemandes",
            align: 'center',
            width: '20%'
        },
        {
            title: "Détails",
            width: '10%',
            align: 'center',
            sorting: false,
            render: (rowData) => (
                <Link to={`/commissions/${rowData.idCommission}`}
                    style={{ textDecoration: 'none' }}
                    target="_blank">
                    <Typography
                        color={theme.palette.primary.main}
                        display='inline'
                    >Voir</Typography>
                </Link>),
        },
    ];

    return <React.Fragment>
        <MaterialTable
            localization={{
                body:
                {
                    emptyDataSourceMessage: props.isEmptyFilterResults && !props.isLoading ?
                        "Aucun résultat" : "Vous n'avez pas de demandes"
                }
            }}
            onRowClick={(_, rowData) => { props.onChangeHandler(rowData.idCommission) }}
            columns={columns}
            data={props.commissions}
            isLoading={props.isLoading}
            options={{
                toolbar: false, draggable: false, search: true, padding: 'dense',
                pageSize: 4, paginationType: 'stepped', pageSizeOptions: [],
                rowStyle: (rowData, index) => ({
                    backgroundColor:
                        index % 2 !== 0 ? "#fff" : "#f7f7f7",
                    cursor: 'pointer'
                }),
            }}
            components={{ Container: props => <Paper {...props} elevation={0} /> }} />
    </React.Fragment>
};

export default SelectCommissionTable;