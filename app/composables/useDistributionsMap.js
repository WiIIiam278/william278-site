export const useDistributionsMap = (dists) => {
    const groups = {};

    dists.value.forEach(dist => {
        if (!groups[dist.groupName]) {
            groups[dist.groupName] = [];
        }
        groups[dist.groupName].push(dist)
    });

    return groups;
}