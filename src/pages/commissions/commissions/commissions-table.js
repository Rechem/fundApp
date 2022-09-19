import MaterialTable from "@material-table/core";
import React, { useEffect, useState } from 'react';
import Status from "../../../components/status/status";
import { Paper, Typography, useTheme, Modal, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchAllCommissions } from "../../../api/api-calls";
import dayjs from "dayjs";

const cellStyle = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 100 }

const CommissionsTable = props => {

    const navigate = useNavigate()

    const theme = useTheme()

    const columns = [
        {
            title: "Date",
            field: 'dateCommission',
            align: 'center',
            render: (rowData) =>
                <Typography align="left" marginX='1rem'>
                    {rowData.dateCommission}
                </Typography>,
        },
        {
            title: "Etat",
            field: "etat",
            width: '15%',
            align: 'center',
            render: (rowData) => <Status status={rowData.etat} />,
        },

        {
            title: "Président",
            field: 'nomPrenomPresident',
            align: 'center',
            render: (rowData) =>
                <Typography align="left" marginX='2rem'
                >{rowData.nomPrenomPresident}
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
            width: '15%',
            align: 'center',
            sorting: false,
            render: (rowData) => (
                <span onClick={() => navigate(`${rowData.idCommission}`)} style={{ cursor: 'pointer' }}>
                    <Typography
                        color={theme.palette.primary.main}
                        display='inline'
                    >Voir</Typography>
                </span>),
        },
    ];

    return <React.Fragment>
        <MaterialTable
            tableRef={props.tableRef}
            // localization={{
            //     body:
            //     {
            //         emptyDataSourceMessage: props.isEmptyFilterResults && !props.isLoading ?
            //             "Aucun résultat" : "Rien à afficher"
            //     }
            // }}
            columns={columns}
            data={query => fetchAllCommissions({ search: props.searchValue, })(query)
                // props.commissions
            }
            // isLoading={props.isLoading}
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

export default CommissionsTable;