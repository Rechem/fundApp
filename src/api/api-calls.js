import axios from "axios";

export const fetchAllDemandes = ({ idUser, search, etat }) => query =>
    new Promise(async (resolve, reject) => {

        const params = {
            page: query.page,
            size: query.pageSize
        }

        if (idUser) {
            params.idUser = idUser
        }

        if (search) {
            params.search = search
        }

        if (etat) {
            params.etat = etat
        }

        if (query.orderBy) {
            params.sortBy = query.orderBy.field
            params.orderBy = query.orderDirection
        }

        axios.get('/demandes', { params }).then(resp => {
            resolve({ ...resp.data.data })
        }
        )

    })

export const fetchAllCommissions = ({ search, etat }) => query =>
    new Promise(async (resolve, reject) => {
        const params = {
            page: query.page,
            size: query.pageSize
        }

        if (search) {
            params.search = search
        }

        if (etat) {
            params.etat = etat
        }

        if (query.orderBy) {
            params.sortBy = query.orderBy.field
            params.orderBy = query.orderDirection
        }

        axios.get('/commissions', { params }).then(resp => {
            resolve({ ...resp.data.data })
        }
        )

    })


export const fetchAllUsers = ({ search }) => query =>
    new Promise(async (resolve, reject) => {
        const params = {
            page: query.page,
            size: query.pageSize
        }

        if (search) {
            params.search = search
        }

        if (query.orderBy) {
            params.sortBy = query.orderBy.field
            params.orderBy = query.orderDirection
        }

        axios.get('/users', { params }).then(resp => {
            resolve({ ...resp.data.data })
        }
        )

    })

export const fetchAllTickets = ({idUser, search }) => query =>
    new Promise(async (resolve, reject) => {
        const params = {
            page: query.page,
            size: query.pageSize
        }

        if (idUser) {
            params.idUser = idUser
        }

        if (search) {
            params.search = search
        }

        if (query.orderBy) {
            params.sortBy = query.orderBy.field
            params.orderBy = query.orderDirection
        }

        axios.get('/tickets', { params }).then(resp => {
            resolve({ ...resp.data.data })
        }
        )

    })

export const fetchAllProjets = async ({ idUser, search, page, size = 8 }) => {
    const response = await axios.get('/projets',
        {
            params: {
                idUser,
                search,
                page,
                size
            }
        })
    return response
}
