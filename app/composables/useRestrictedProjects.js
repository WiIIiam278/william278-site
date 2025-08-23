export const useRestrictedProjects = async () => {
    return (await useAllProjects())?.value?.filter(project => project.restricted) ?? [];
}