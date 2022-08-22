const roles = {
    roleSimpleUser: 'simpleUser',
    roleModerator: 'moderator',
    roleAdmin: 'admin',
    roleSuperAdmin: 'superAdmin'
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