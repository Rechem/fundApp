import React from 'react';
import MaterialTable from '@material-table/core';
import Status from '../../components/status/status';
import { Box, Paper, useTheme } from '@mui/material';
import axios from 'axios';
import { getRoleName, statusUser } from '../../utils';
import dayjs from 'dayjs';

const UsersTable = props => {

    const theme = useTheme()

    const columns = [
        {
            title: "Utilisateur",
            align: 'left',
            render: (rowData) => rowData.prenomNom !== null ? rowData.prenomNom : <i>(vide)</i>
        },
        {
            title: "Rôle",
            align: 'left',
            render: (rowData) => getRoleName(rowData.role.nomRole)
        },
        {
            title: "Date inscription",
            align: 'right',
            render: (rowData) => dayjs(rowData.createdAt).format("DD/MM/YYYY")
        },
        {
            title: "Etat inscription",
            align: 'center',
            render: (rowData) => <Status status={
                rowData.isBanned ? statusUser.banned :
                    rowData.completedSignUp ? statusUser.confirmed
                        : statusUser.notConfirmed
            } />
        },
        {
            title: "Profil",
            align: 'center',
            width: '15%',
            sorting: false,
            render: (rowData) => (
                <Box
                    component="a"
                    href={`/users/${rowData.idUser}`}
                    target='_blank'
                    sx={{ color: theme.palette.primary.main }}>
                    Voir</Box>),
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
            options={{
                toolbar: false, draggable: false, padding: 'dense',
                pageSize: 10, paginationType: 'stepped', pageSizeOptions: [],
                rowStyle: (rowData, index) => ({
                    backgroundColor:
                        index % 2 !== 0 ? "#fff" : "#f7f7f7",
                }),
            }}
            components={{ Container: props => <Paper {...props} elevation={0} /> }}
            data={query =>
                new Promise(async (resolve, reject) => {
                    let url = '/users?'

                    if (query.search) {
                        url += `search=${query.search}`
                    }
                    //sorting 
                    if (query.orderBy) {
                        url += `&sortBy=${query.orderBy.field}&orderBy=${query.orderDirection}`
                    }
                    //pagination
                    url += `&page=${query.page}`
                    url += `&size=${query.pageSize}`

                    axios.get(url).then(resp => {
                        resolve({ ...resp.data.data })
                    }
                    )

                })
            }
        />
    );
};

export default UsersTable;