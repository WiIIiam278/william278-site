export const useIsUserRole = (user, minRole) => {
    const { role } = user;
    if (!role) {
        return false;
    }
    minRole = minRole.toLowerCase();
    switch (role.toLowerCase()) {
        case 'admin':
            return true;
        case 'staff':
            return minRole === 'staff' || minRole === 'admin';
    }
    return minRole === 'user';
}