const roles = {
    roleSimpleUser: 'simpleUser',
    roleModerator: 'moderator',
    roleAdmin: 'admin',
    roleSuperAdmin: 'superAdmin'
}

export const statusUser = {
    banned: 'Désactivé',
    completed: 'Complétée',
    notCompleted: 'Non Complétée',
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
    pendingWaiting : 'En attente évaluation et saisie',
    evaluatedWaiting : 'Evalué en attente saisie',
    evaluatedPending : 'Evalué en attente évaluation',
    evaluated : 'Evalué',
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

export const statusRevenu = {
    waiting: 'En attente saisie',
    pending: 'En attente évaluation',
    evaluated: 'Evalué',
}

export const motifTicket = {
    rdv: 'Demander un rendez-vous',
    renseignement: 'Demander un renseignement',
    reclamation: 'Faire une réclamation',
    autre: 'Autre',
}

export const statusTicket = {
    ouvert: 'Ouvert',
    ferme: 'Fermé',
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

export function flattenObject(ob) {
    var toReturn = {};

    for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) == 'object' && ob[i] !== null) {
            var flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}

export default roles