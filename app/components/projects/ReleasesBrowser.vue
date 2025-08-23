<template>
    <div class="releases-menu">
        <h3 class="channel-picker" v-if="releaseChannels.length">
            <span>{{ $t('download-browse-all') }}</span>
            <select :disabled="releaseChannels.length <= 1" v-model="selectedChannel" @change="updateVersions(pageNumber, itemsPerPage)">
                <option v-for="channel in releaseChannels" :key="channel" :value="channel">{{ useCapitalized(channel) }}
                </option>
            </select>
            <span>{{ $t('download-versions') }}</span>
        </h3>
        <div class="version-options">
            <div v-if="distGroups.length > 1" class="option dist-group-picker">
                <label for="dist-group-select">{{ $t('download-filter-label') }}</label>
                <label id="dist-group-select" v-for="group in distGroups" :for="`dist-group-${group}`"
                    :key="group" :class="`dist-group ${selectedDistGroup === group ? 'selected' : ''}`">
                    <NuxtImg class="icon" width="48px" height="48px" :src="`/images/platforms/${group}.png`" placeholder="/images/placeholder-avatar.png" />
                    <span class="name">{{ useCapitalized(group) }}</span>
                    <input type="radio" :id="`dist-group-${group}`" name="dist-group" :value="group" v-model="selectedDistGroup"
                        @change="updateVersions(pageNumber, itemsPerPage)" />
                </label>
            </div>
            <div v-if="distGroups.length > 1 && distMap[selectedDistGroup]?.length > 1" class="dist-picker" >
                <label for="dist-select">{{ $t('download-version-label') }}</label>
                <select id="dist-select" v-model="selectedDist" @change="updateVersions(pageNumber, itemsPerPage)">
                    <option v-for="dist in distMap[selectedDistGroup]" :key="dist.name" :value="dist">{{ dist.description }}</option>
                </select>
                <Pill v-if="selectedDist?.archived">{{ $t('distribution-archived') }}</Pill>
                <Pill v-else-if="selectedDist?.statusLabel">{{ selectedDist.statusLabel }}</Pill>
            </div>
        </div>
        <div v-if="versions.value?.content?.length" class="version-browser">
            <table class="versions">
                <tr class="version" v-for="version in versions.value.content"
                    @click="useAlert(getChangelog(version), `${project.metadata.name} ${version.name} (${useTimeFormat(version.timestamp, true)})`, null, true)">
                    <td @click.stop class="button-area">
                        <a class="download-button" :href="useDownloadUrl(project, selectedChannel, version, selectedDist)">
                            <IconifiedText icon="fa6-solid:download">{{ version.name }}</IconifiedText>
                        </a>
                    </td>
                    <MDC :value="getChangelog(version, true)" tag="td" unwrap="p" class="download-changelog" />
                    <td class="download-date">
                        {{ new Date(version.timestamp).toLocaleDateString() }}
                    </td>
                </tr>
            </table>
            <Pagination :data="versions.value" v-on:update="(page, perPage) => updateVersions(page, perPage)" />
        </div>
        <div v-else class="error versions">
            <IconifiedText icon="fa6-solid:circle-info">
                <h4>{{ $t('download-distribution-no-versions', {
                    'channel': selectedChannel, 'project':
                        project.metadata.name, 'distribution': selectedDist.description}) }}</h4>
            </IconifiedText>
        </div>
    </div>
</template>

<script setup>
const getChangelog = (release, short = false) => !short ? release.changelog : release.changelog.split('\n')[0];
const { project, defaultChannel } = defineProps({
    project: {
        type: Object,
        required: true
    },
    defaultChannel: {
        type: String,
        required: false
    }
});

// Project data
const releaseChannels = project.releaseChannels;
const dists = await useDistributions(project.slug);
const distMap = useDistributionsMap(dists);
const distGroups = Object.keys(distMap);
const versions = ref([]);

// Current selections
const selectedChannel = ref(defaultChannel ?? releaseChannels[0]);
const selectedDist = ref(dists.value[0]);
const selectedDistGroup = ref(dists.value[0].groupName);
const pageNumber = ref(1);
const itemsPerPage = ref(15);

// Version data
const updateVersions = (async (page, perPage) => {
    selectedDist.value = distMap[selectedDistGroup.value].map(g => g.name).includes(selectedDist.value.name) ? selectedDist.value : distMap[selectedDistGroup.value][0];
    pageNumber.value = Math.max(1, page || pageNumber.value);
    itemsPerPage.value = Math.max(15, perPage || itemsPerPage.value);
    versions.value = await useVersions(project.slug, selectedChannel.value, selectedDist.value?.name, pageNumber.value - 1, itemsPerPage.value);
});
await updateVersions(pageNumber.value, itemsPerPage.value);
</script>

<style scoped>
.releases-menu {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    width: 100%;
    margin: 2rem 0;
}

.releases-menu .channel-picker {
    text-align: center;
    margin-bottom: 0.5rem;
    border-bottom: 0.15rem solid var(--gray);
    padding-bottom: 0.5rem;
}

.channel-picker select,
.dist-picker select {
    width: 200px;
    font-weight: bold;
    margin: 0 0.7rem;
}

.version-options {
    display: flex;
    justify-content: space-between;
}

.option select {
    width: 150px;
}

.dist-group-picker .dist-group {
    padding: 0.3rem 0.5rem;
    border: 0.15rem solid var(--gray);
    border-radius: 0.5rem;
    background-color: var(--gray);
    color: var(--accent);
    cursor: pointer;
    display: flex;
}

.dist-group:hover {
    background-color: var(--dark-gray);
}

.dist-group .icon {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
}

.dist-group .name {
    font-size: 1rem;
    font-family: 'Nunito', sans-serif;
    font-weight: 500;
    flex: 1;
}

.dist-group.selected {
    border-color: var(--accent);
}

.dist-group input[type="radio"] {
    display: none;
}

.version-options .option {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.versions {
    display: flex;
    flex-direction: column;
}

.versions .version {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.5rem;
    gap: 1rem;
    background-color: transparent;
    cursor: pointer;
}

.version .button-area a {
    width: max-content;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
}

.version:deep(tr), .version:deep(td) {
    margin: 0;
    padding: 0;
    border: none;
}

.version:deep(.download-changelog) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 40vw;
    max-height: 1.5rem;
}

.version .download-date {
    margin-left: auto;
    color: var(--light-gray);
}

.download-buttons .button {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    border: 0.15rem solid var(--gray);
    border-radius: 0.5rem;
    background-color: var(--gray);
    color: var(--accent);
    cursor: pointer;
}

.download-buttons .button:hover, .version .download-button:hover {
    background-color: var(--dark-gray);
    background: linear-gradient(transparent, #00fb9b1e);
    text-decoration: none;
}

.versions .version:hover {
    background-color: var(--dark-gray);
    border-radius: 0.5rem;
    transition: background-color 0.1s;
}

.version .download-button {
    display: flex;
    justify-content: center;
    padding: 0.5rem;
    border: 0.15rem solid var(--gray);
    min-width: 4.5rem;
    border-radius: 0.5rem;
    background-color: var(--gray);
    color: var(--accent);
    cursor: pointer;
}

.error {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 2rem 0;
}
</style>