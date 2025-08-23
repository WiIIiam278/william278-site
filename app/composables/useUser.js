export const useUser = async () => {
    const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
    
    const user = useNuxtData('user');
    const { auth, xsrf } = useAuth();
    const { data } = await useLazyFetch(`${BASE_URL}/v1/users/@me`, {
        method: 'GET',
        credentials: auth ? 'include' : 'omit',
        headers: {
            'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
            'X-XSRF-TOKEN': xsrf
        },
        key: 'user',
        default: () => user.value
    });

    return data;
}