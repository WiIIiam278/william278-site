export const useVersions = async (project, channel, distribution, pageNo, pageSize) => {
    const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
    
    const { data } = await useFetch(`${BASE_URL}/v1/projects/${project}/channels/${channel}/distributions/${distribution}/versions`,
        { params: { page: pageNo, size: pageSize } }
    );
    
    return data;
}