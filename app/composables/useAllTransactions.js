export const useAllTransactions = async (pageNo, pageSize, emailSearch = null) => {
    const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
    const searchParams = { page: pageNo, size: pageSize };
    if (emailSearch) {
        searchParams.emailSearch = emailSearch;
    }

    const { auth, xsrf } = useAuth();
    const { data } = await useFetch(`${BASE_URL}/v1/transactions`, {
        method: 'GET',
        credentials: auth ? 'include' : 'omit',
        params: searchParams,
        headers: {
            'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
            'X-XSRF-TOKEN': xsrf
        }
    });

    return data;
}