export const useDistributions = async (project) => {
    const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
    
    const { data } = await useFetch(`${BASE_URL}/v1/projects/${project}/distributions`, {
        key: `distributions-${project}`,
    });

    return data;
}