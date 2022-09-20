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

export const getWarningMessages = (projet, authenticationState) => {

    let warningMessages = [];
    if (isSimpleUser(authenticationState)) {
        if (projet.montant && projet.tranche === null) {
            warningMessages.push({
                message:
                    `Vous devez choisir le nombre de tranche`,
                priority: 0
            })
        } else {
            if (projet.previsions.length > 0) {
                if (projet.previsions[projet.previsions.length - 1].etat !== statusPrevision.pending
                    && !projet.previsions[projet.previsions.length - 1].seenByUser) {
                    switch (projet.previsions[projet.previsions.length - 1].etat) {
                        case statusPrevision.accepted:
                            warningMessages.push({
                                message:
                                    `Vos prévisions pour la ${projet.previsions.length > 1
                                        ? projet.previsions.length + 'ème' : '1ère'} tranche ont été acceptées`,
                                priority: 2
                            })
                            break;
                        case statusPrevision.refused:
                            warningMessages.push({
                                message:
                                    `Vos prévisions pour la ${projet.previsions.length > 1
                                        ? projet.previsions.length + 'ème' : '1ère'} tranche ont été refusées`,
                                priority: 0
                            })
                            break;
                        case statusPrevision.brouillon:
                            warningMessages.push({
                                message:
                                    `Vous pouvez désormais ajouter les prévisions de la
                                ${projet.previsions.length > 1
                                        ? projet.previsions.length + 'ème' : '1ère'} tranche`,
                                priority: 2
                            })
                            break;

                        default:
                            break;
                    }
                }
            }

            if (projet.realisations.length > 0) {
                if (projet.realisations[projet.realisations.length - 1].etat !== statusRealisation.pending
                    && !(projet.realisations[projet.realisations.length - 1].etat === statusRealisation.terminee
                        && projet.realisations[projet.realisations.length - 1].seenByUser)) {
                    switch (projet.realisations[projet.realisations.length - 1].etat) {
                        case statusRealisation.waiting:
                        case statusRealisation.pendingWaiting:
                            warningMessages.push({
                                message:
                                    `Vous avez des realisations non justifiees`,
                                priority: 1
                            })
                            break;
                        case statusRealisation.terminee:
                            if (!projet.realisations[projet.realisations.length - 1].seenByUser)
                                warningMessages.push({
                                    message:
                                        `Toutes vos réalisations de la ${projet.realisations.length > 1
                                            ? projet.realisations.length + 'ème' : '1ère'} tranche on été acceptées`,
                                    priority: 2
                                })
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        if (projet.revenuProjet) {
            if (!projet.revenuProjet.seenByUser &&
                (projet.revenuProjet.etat === statusRevenu.waiting
                    || projet.revenuProjet.etat === statusRevenu.evaluated)) {
                if (projet.revenuProjet.etat === statusRevenu.waiting)
                    warningMessages.push({
                        message:
                            `Vous pouvez desormais ajouter des revenus`,
                        priority: 2
                    })
                else if (projet.revenuProjet.etat === statusRevenu.evaluated)
                    warningMessages.push({
                        message:
                            `Vous avez une mis a jour sur vos revenus`,
                        priority: 1
                    })

            }
        }
    } else {
        //admin
        if (projet.documentAccordFinancement === null)
            warningMessages.push({
                message:
                    `Document d'accord de financement non soumis`,
                priority: 1
            })
        if (projet.montant === null) {
            warningMessages.push({
                message:
                    `Monant de financement non soumis`,
                priority: 0
            })
        } else {
            if (projet.previsions.length > 0) {
                if (projet.previsions[projet.previsions.length - 1].etat === statusPrevision.pending) {
                    warningMessages.push({
                        message:
                            `Prévisions en attente evaluation`,
                        priority: 1
                    })
                } else {
                    // debloquer realisation
                    if (projet.previsions.length === projet.realisations.length + 1
                        && projet.previsions.every(p => p.etat === statusPrevision.accepted))
                        warningMessages.push({
                            message:
                                `Réalisations de la ${projet.realisations.length > 0
                                    ? projet.realisations.length + 1 + 'ème' : '1ère'} tranche non encore débloquées`,
                            priority: 1
                        })
                    else if (projet.previsions[projet.previsions.length - 1].etat === statusPrevision.accepted
                        && projet.realisations.length > 0 && projet.previsions.length === projet.realisations.length
                        && projet.realisations[projet.realisations.length - 1].etat === statusRealisation.terminee
                        && projet.previsions.length < projet.tranche.nbTranches)
                        warningMessages.push({
                            message:
                                `Prévisions de la ${projet.previsions.length + 1}ème tranche non encore débloquées`,
                            priority: 1
                        })


                }
            } else {
                if (projet.tranche)
                    warningMessages.push({
                        message:
                            `Prévisions de la 1ère tranche non encore débloquées`,
                        priority: 1
                    })
            }

            if (projet.realisations.length > 0) {
                if ([statusRealisation.pending, statusRealisation.pendingWaiting].
                    includes(projet.realisations[projet.realisations.length - 1].etat)) {
                    warningMessages.push({
                        message:
                            `Réalisations en attente évaluation`,
                        priority: 1
                    })
                }
            }
        }
        if (projet.revenuProjet) {
            if (projet.revenuProjet.etat === statusRevenu.pending) {
                warningMessages.push({
                    message:
                        `Revenus en attente évaluation`,
                    priority: 1
                })
            }
        }
    }

    return warningMessages.sort((a, b) => a.priority > b.priority ? 1 : -1)
}

export default roles