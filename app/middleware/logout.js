export default defineNuxtRouteMiddleware(async (to, from) => {
    await useNuxtData('user', null)
    return navigateTo(`${useRuntimeConfig().public.API_BASE_URL}/logout`, { external: true })
})