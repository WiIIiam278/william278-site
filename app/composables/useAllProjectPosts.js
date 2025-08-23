export const useAllProjectPosts = async (project, pageNo, pageSize) => {
    const BASE_URL = useRuntimeConfig().public.API_BASE_URL;

    const pageParams = { page: pageNo, size: pageSize };
    const { data } = await useFetch(`${BASE_URL}/v1/projects/${project}/posts`, { params: pageParams });
    return data;
}