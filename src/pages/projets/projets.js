import React, { useEffect, useState } from 'react';
import classes from './projets.module.css'
import {
    Typography, useTheme, CircularProgress, Pagination,
    Button, PaginationItem
} from '@mui/material';
import ProjetsCard from '../../components/projets-card/projets-card';
import Toolbar from '../../components/toolbar/toolbar'
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProjets } from '../../api/api-calls';
import useDebounce from '../../custom-hooks/use-debounce';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

const Projets = () => {

    // const dispatch = useDispatch()

    const authenticationState = useSelector(state => state.login)
    // const projetsState = useSelector(state => state.projets)
    const [searchParams] = useSearchParams();
    const user = searchParams.get('user')

    const theme = useTheme()

    const onChangeHandler = e => {
        const { name, value } = e.target
        setSearchInput(value)
    }

    const [searchInput, setSearchInput] = useState('')

    const debouncedSearchTerm = useDebounce(searchInput, 500);

    const [projets, setProjets] = useState([])

    const [isLoading, setIsLoading] = useState(false);

    const [page, setPage] = useState(1);

    const [count, setCount] = useState(0);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const fetchAndSetProjets = async () => {
        let idUser = null

        if (user)
            idUser = user

        const PAGESIZE = 4
        setIsLoading(true)
        try {
            const response = await fetchAllProjets({ idUser, search: debouncedSearchTerm, page: page - 1, size: PAGESIZE })
            setProjets(response.data.data.projets)
            setCount(Math.ceil(response.data.data.count / PAGESIZE))
        } catch (e) {
            toast.error(e.response.data.message)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (authenticationState.user.idUser) {


            fetchAndSetProjets()
        }

    }, [page, debouncedSearchTerm, authenticationState.user.idUser])

    return (
        <>
            <Typography color={theme.palette.text.main}
                variant='h3' className={classes.hdr}>
                Projets
            </Typography>
            <Toolbar className={classes.toolbar}
                hideButton onSearchChangeHandler={onChangeHandler}
                searchValue={searchInput}
                onRefresh={fetchAndSetProjets} />
            <div className={classes.projectsList}>
                {isLoading ?
                    <CircularProgress size='2rem' style={{ marginTop: '1rem' }} />
                    : projets.map((p, i) => {
                        return <ProjetsCard key={i}
                            denominationCommerciale={p.demande.denominationCommerciale}
                            tranche={p.tranche}
                            montant={p.montant}
                            nom={p.demande.user.nom}
                            prenom={p.demande.user.prenom}
                            totalRevenu={p.totalRevenu}
                            previsions={p.previsions}
                            realisations={p.realisations}
                            idProjet={p.idProjet}
                            revenuProjet={p.revenuProjet}
                            documentAccordFinancement={p.documentAccordFinancement}
                        />
                    })}
            </div>
            <Pagination count={count} showFirstButton sx={{
                '& .MuiButtonBase-root.MuiPaginationItem-root.Mui-selected': {
                    color: theme.palette.primary.main,
                    fontWeight: 600
                },
            }}
                shape="rounded" showLastButton page={page} onChange={handleChange}

            />
        </>
    );
};

export default Projets;