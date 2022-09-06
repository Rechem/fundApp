import React from 'react';
import classes from './profil.module.css'

const Profil = () => {
    return (
        <>
            <Typography color={theme.palette.text.main}
                variant='h3' className={classes.hdr}>
                Utilisateurs
            </Typography>
            <Toolbar buttonLabel='Ajouter un utilisateur'
                className={classes.toolbar}
                searchValue={searchInput}
                onSearchChangeHandler={onChangeHandler}
            // onClick={handleOpenDialog}
            />
        </>
    );
};

export default Profil;