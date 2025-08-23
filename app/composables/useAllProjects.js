export const useAllProjects = async () => {
    const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
    
    const projects = useNuxtData('projects');
    const { data } = await useLazyFetch(`${BASE_URL}/v1/projects`, {
        key: 'projects',
        default: () => projects.value
    });
    
    return data;
}