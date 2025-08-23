export const useLatestVersion = async (project, channel) => {
    const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
    
    const { data } = await useFetch(
        `${BASE_URL}/v1/projects/${project}/channels/${channel}/versions/latest`,
        {
            deep: true
        }
    );
    
    return data;
}