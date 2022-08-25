import React from 'react';
import MaterialTable from "@material-table/core";
import Status from "../../components/status/status";
import { Paper, Typography, Modal, Box, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { CustomCheckBox } from "../../theme";
import { useTheme } from '@emotion/react';
import tinycolor from 'tinycolor2';

const cellStyle = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 100 }

const SelectDemandeTable = props => {

    const theme = useTheme()

    const columns = [
        {
            render: (rowData) => <CustomCheckBox
                onClick={() => {
                    console.log(props.selectedDemandes);
                    props.handleClick(rowData.idDemande)
                }}
                checked={props.selectedDemandes.includes(rowData.idDemande)}
                value={rowData.idDemande} />,
        },
        { title: "ID", field: "idDemande", width: "5%", cellStyle },
        {
            title: "Etat",
            field: "etat",
            width: '15%',
            align: 'center',
            render: (rowData) => <Status status={rowData.etat} />
        },
        { title: "Forme juridique", field: "formeJuridique", width: '15%', cellStyle },
        { title: "Dénomination", field: "denominationCommerciale", cellStyle },
        { title: "Montant", field: "montant", cellStyle },
        {
            title: "Détails",
            width: '10%',
            sorting: false,
            render: (rowData) => (
                <Link to={`/demandes/${rowData.idDemande}`}
                    style={{ textDecoration: 'none' }}>
                    <Typography
                        color={theme.palette.primary.main}
                        display='inline'
                    >Voir</Typography>
                </Link>),
        },
    ];

    // const columns = [
    //     {
    //         render: (rowData) => <CustomCheckBox
    //             onClick={() => {
    //                 console.log(props.selectedDemandes);
    //                 props.handleClick(rowData.idDemande)
    //             }}
    //             checked={props.selectedDemandes.includes(rowData.idDemande)}
    //             value={rowData.idDemande} />,
    //     },
    //     { title: "ID", field: "idDemande", width: "5%", cellStyle },
    //     {
    //         title: "Etat",
    //         field: "etat",
    //         width: '15%',
    //         align: 'center',
    //         render: (rowData) => <Status status={rowData.etat} />

    //     },
    //     { title: "Forme juridique", field: "formeJuridique", width: '15%', cellStyle },
    //     { title: "Dénomination", field: "denominationCommerciale", cellStyle },
    //     { title: "Montant", field: "montant", cellStyle },
    //     {
    //         title: "Détails",
    //         width: '10%',
    //         sorting: false,
    //         render: (rowData) => (
    //             <Link to={`/demandes/${rowData.idDemande}`}
    //                 style={{ textDecoration: 'none' }}>
    //                 <Typography
    //                     color={theme.palette.primary.main}
    //                     display='inline'
    //                 >Voir</Typography>
    //             </Link>),
    //     },
    // ];

    return <MaterialTable
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
        options={{
            toolbar: false, draggable: false, search: false, padding: 'dense',
            pageSize: 4, paginationType: 'stepped', pageSizeOptions: [],
            rowStyle: (rowData, index) => ({
                backgroundColor:
                    index % 2 !== 0 ? "#fff" : "#f7f7f7",
            }),
        }}
        components={{ Container: props => <Paper {...props} elevation={0} /> }} />
};

export default SelectDemandeTable;