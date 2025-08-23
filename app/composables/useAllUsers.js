export const useAllUsers = async (pageNo, pageSize, nameFilter) => {
    const BASE_URL = useRuntimeConfig().public.API_BASE_URL;

    const searchParams = { page: pageNo, size: pageSize };
    if (nameFilter?.length) {
        searchParams.nameSearch = nameFilter;
    }
    
    const { auth, xsrf } = useAuth();
    const { data } = await useFetch(`${BASE_URL}/v1/users`, {
        method: 'GET',
        credentials: auth ? 'include' : 'omit',
        params: searchParams,
        headers: {
            'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
            'X-XSRF-TOKEN': xsrf
        },
    });

    return data;
}