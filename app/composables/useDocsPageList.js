export const useDocsPageList = async (project) => {
    const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
    
    const pages = await $fetch(`${BASE_URL}/v1/projects/${project}/docs`);
    
    return Object.entries(pages);
}