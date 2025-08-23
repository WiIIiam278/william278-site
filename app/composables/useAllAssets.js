export const useAllAssets = async (pageNo, pageSize, fileNameFilter = null, contentTypeFilter = null) => {
    const BASE_URL = useRuntimeConfig().public.API_BASE_URL;

    const searchParams = { page: pageNo, size: pageSize };
    if (fileNameFilter?.length) {
        searchParams.fileNameSearch = fileNameFilter;
    }
    if (contentTypeFilter?.length) {
        searchParams.contentTypeFilter = contentTypeFilter;
    }
    
    const { auth, xsrf } = useAuth();
    const { data } = await useFetch(`${BASE_URL}/v1/assets`, {
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