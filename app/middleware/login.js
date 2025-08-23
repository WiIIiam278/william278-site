export default defineNuxtRouteMiddleware((to, from) => {
    const { path: referrer } = from;
    if (referrer && !['/', '/account/login'].includes(referrer)) {
        useAuthRedirectPath().value = referrer;
    }

    return navigateTo(`${useRuntimeConfig().public.API_BASE_URL}/login`, { external: true })
})