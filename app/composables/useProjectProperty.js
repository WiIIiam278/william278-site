export const useProjectProperty = (project, property_key) => {
    return project?.metadata?.properties?.find(property => property.key === property_key)?.value;
}