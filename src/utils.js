const roles = {
    roleSimpleUser: 'simpleUser',
    roleModerator: 'moderator',
    roleAdmin: 'admin',
    roleSuperAdmin: 'superAdmin'
}

export const statusUser = {
    banned: 'Désactivé',
    confirmed: 'Confirmé',
    notConfirmed: 'Non confirmé',
}

export const getRoleName = (role) => {
    switch (role) {
        case roles.roleSimpleUser:
            return 'Simple utilisateur'
        case roles.roleModerator:
            return 'Modérateur'
        case roles.roleAdmin:
            return 'Administrateur'
        default:
            return 'Inconnu'
    }
}

export const statusPrevision = {
    accepted: 'Acceptée',
    refused: 'Refusée',
    pending: 'En attente évaluation',
    brouillon: 'Brouillon',
}

export const statusRealisation = {
    waiting: 'En attente saisie',
    pending: 'En attente évaluation',
    terminee: 'Terminée',
}

export const statusArticleRealisation = {
    accepted: 'Acceptée',
    refused: 'Refusée',
    pending: 'En attente évaluation',
    waiting: "En attente saisie",
}

export const statusCommission = {
    pending: 'En attente',
    terminee: 'Terminée',
}

export const statusDemande = {
    accepted: 'Acceptée',
    refused: 'Refusée',
    pending: 'En attente évaluation',
    complement: 'Besoin complément',
    programmee: 'Programmée',
    preselectionnee: 'Préselectionnée',
}

export const statusArticleRevenu = {
    accepted: 'Acceptée',
    refused: 'Refusée',
    pending: 'En attente évaluation',
}

export const isAdmin = (authenticationState) => {
    return authenticationState.user.role === roles.roleAdmin
}

export const isModo = (authenticationState) => {
    return authenticationState.user.role === roles.roleModerator
}

export const isSimpleUser = (authenticationState) => {
    return authenticationState.user.role === roles.roleSimpleUser
}

export default roles