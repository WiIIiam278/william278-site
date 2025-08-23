export const useAllProjects = async (lazy = false) => {
    const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
    
    const projects = useNuxtData('projects');
    const { data } = lazy ? await useLazyFetch(`${BASE_URL}/v1/projects`, {
        key: 'projects',
        default: () => projects.value || []
    }) : await useFetch(`${BASE_URL}/v1/projects`);

    return data;
}