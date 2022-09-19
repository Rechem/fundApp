import React from 'react';
import MaterialTable from '@material-table/core';
import { Paper, useTheme, Typography, Tooltip } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import classes from './messages.module.css'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchAllTickets } from '../../api/api-calls';
// import relativeTime from 'dayjs/plugin/relativeTime'
// import 'dayjs/locale/fr'
// dayjs.locale('fr')
// dayjs.extend(relativeTime)

const cellStyle = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 250 }

const MessagesTable = props => {

    const authenticationState = useSelector(state => state.login)

    const theme = useTheme()

    const columns = [
        {
            title: "De",
            field: "username",
            align: 'center',
            cellStyle,
            render: (rowData) => {
                return <Link to={`/users/${rowData.idUser}`}
                    style={{ textDecoration: 'none' }}>
                    <Tooltip title={rowData.nom !== null || rowData.prenom !== null ?
                        `${rowData.nom} ${rowData.prenom}` : <i>(vide)</i>}>
                        <div className={classes.userContainer}>
                            <img src={process.env.PUBLIC_URL + '/asf-logo-white.png'} alt='Avatar'
                                className={classes.img} />
                        </div>
                    </Tooltip>
                </Link>
            }
        },
        {
            title: "Etat",
            field: "etat",
            cellStyle,
            width: '10%'
        },
        {
            title: "Objet",
            field: "objet",
            cellStyle,
            width: '30%',
        },
        {
            title: "Motif",
            field: "motif",
            cellStyle,
            width: '30%',
        },
        {
            title: "Date/Heure",
            align: 'right',
            sorting: false,
            render: (rowData) => {
                return <div style={{ display: 'flex', flexDirection: 'column', }}>
                    <Typography variant='body2'>
                        {dayjs(rowData.createdAt).format('HH:mm')}
                    </Typography>
                    <Typography variant='body2'>
                        {dayjs(rowData.createdAt).format('DD MMM YYYY')}
                    </Typography>
                </div >
            }
        },
        {
            sorting: false,
            render: (rowData) => <Link to={`/tickets/${rowData.idTicket}`}
                style={{ textDecoration: 'none' }}>
                <Typography
                    color={theme.palette.primary.main}
                    display='inline'
                >Voir</Typography>
            </Link>
        },
    ];

    return (
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
            data={query => {
                // if (authenticationState.user.idUser) {

                    return fetchAllTickets({ search: props.searchValue })(query)
                // }
            }}
            isLoading={props.isLoading}
            options={{ toolbar: false, paging: false, draggable: false, search: true, padding: 'dense' }}
            components={{ Container: props => <Paper {...props} elevation={0} /> }} />
    );
};

export default MessagesTable;