import React, { useEffect, useState } from 'react';
import classes from './projets.module.css'
import { Typography, useTheme, CircularProgress } from '@mui/material';
import ProjetsCard from '../../components/projets-card/projets-card';
import Toolbar from '../../components/toolbar/toolbar'
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProjets } from '../../store/projetsSlice/reducer';
import useDebounce from '../../custom-hooks/use-debounce';

const Projets = () => {

    const dispatch = useDispatch()

    const authenticationState = useSelector(state => state.login)
    const projetsState = useSelector(state => state.projets)

    const theme = useTheme()

    const onChangeHandler = e => {
        const { name, value } = e.target
        setSearchInput(value)
    }

    const [searchInput, setSearchInput] = useState('')

    const debouncedSearchTerm = useDebounce(searchInput, 500);

    useEffect(() => {
        if (authenticationState.user.idUser)
            dispatch(fetchAllProjets(debouncedSearchTerm));
    }, [authenticationState.user.idUser, debouncedSearchTerm])

    return (
        <>
            <Typography color={theme.palette.text.main}
                variant='h3' className={classes.hdr}>
                Projets
            </Typography>
            <Toolbar className={classes.toolbar}
                hideButton onSearchChangeHandler={onChangeHandler}
                value={searchInput} />
            <div className={classes.projectsList}>
                {projetsState.status === 'fetching' &&
                    <CircularProgress size='2rem' style={{ marginTop: '1rem' }} />}
                {projetsState.projets &&
                    projetsState.projets.map((p, i) => {
                        return <ProjetsCard key={i}
                        denominationCommerciale={p.demande.denominationCommerciale}
                        tranche={p.tranche}
                        montant={p.montant}
                        nom={p.demande.user.nom}
                        prenom={p.demande.user.prenom}
                        revenu={p.revenu}
                        idProjet={p.idProjet}
                        />
                    })}
            </div>
        </>
    );
};

export default Projets;