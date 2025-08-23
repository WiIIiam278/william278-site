export const useDownloadUrl = (project, channel, release, dist) => {
    const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
    return `${BASE_URL}/v1/projects/${project.slug}/channels/${channel}/versions/${release.name}/distributions/${dist.name}`;
}