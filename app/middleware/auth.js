export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await useUser();
    const url = useRequestURL();
    if (!user.value) {
        return navigateTo(`${useRuntimeConfig().public.API_BASE_URL}/login?redirect=${url?.pathname}`, { external: true })
    }
})