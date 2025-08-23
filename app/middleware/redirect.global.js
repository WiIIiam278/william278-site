export default defineNuxtRouteMiddleware((to, from) => {
    const { value: redirect } = useAuthRedirectPath()    
    useAuthRedirectPath().value = null;
    if (!redirect || redirect === '/account/login') {
        return;
    }

    if (redirect === '/') {
        return navigateTo('/account')
    }
    if (redirect !== to.path) {
        return navigateTo(redirect);
    }
})