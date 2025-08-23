export const useAllPosts = async (pageNo, pageSize, categoryFilter) => {
    const BASE_URL = useRuntimeConfig().public.API_BASE_URL;

    const searchParams = { page: pageNo, size: pageSize };
    if (categoryFilter?.length) {
        searchParams.categoryFilter = categoryFilter;
    }
    const { data } = await useFetch(`${BASE_URL}/v1/posts`, { params: searchParams });

    return data;
}