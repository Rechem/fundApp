import React from 'react';
import MaterialTable from '@material-table/core';
import Status from '../../components/status/status';
import { Box, Paper, useTheme } from '@mui/material';
import axios from 'axios';
import { getRoleName, statusUser } from '../../utils';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import classes from './users.module.css'
import { fetchAllUsers } from '../../api/api-calls';

const UsersTable = props => {

    const theme = useTheme()

    const columns = [
        {
            title: "Nom complet",
            field: 'nom-complet',
            align: 'left',
            render: (rowData) => {
                return <div className={classes.userContainer}>
                    <img src={process.env.PUBLIC_URL + '/asf-logo-white.png'} alt='Avatar'
                        className={classes.img} />
                    {rowData.prenomNom !== null ? rowData.prenomNom : <i>(vide)</i>}
                </div>
            }
        },
        {
            title: "Rôle",
            field : 'roleId',
            align: 'left',
            render: (rowData) => getRoleName(rowData.role.nomRole)
        },
        {
            title: "Date inscription",
            align: 'right',
            field : 'createdAt',
            render: (rowData) => dayjs(rowData.createdAt).format("DD/MM/YYYY")
        },
        {
            title: "Etat inscription",
            sorting : false,
            align: 'center',
            render: (rowData) => <Status status={
                rowData.isBanned ? statusUser.banned :
                    rowData.completedSignUp ? statusUser.completed
                        : statusUser.notCompleted
            } />
        },
        {
            title: "Profil",
            align: 'center',
            width: '10%',
            sorting: false,
            render: (rowData) => (
                <Box
                    component={Link}
                    to={`${rowData.idUser}`}
                    sx={{ color: theme.palette.primary.main }}>
                    Voir</Box>),
        },
    ];

    return (
        <MaterialTable
            tableRef={props.tableRef}
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
            data={query => fetchAllUsers({ search: props.searchValue, })(query)}
        />
    );
};

export default UsersTable;