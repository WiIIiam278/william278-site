<template>
    <div class="latest-release" v-if="release">
        <div class="download-buttons">
            <a v-for="group of Object.keys(releaseGroups)" class="button" 
                :href="releaseGroups[group].length > 1 ? '#' : useDownloadUrl(project, channel, release, releaseGroups[group][0].distribution)"
                @click="releaseGroups[group].length > 1 ? openSelectorModal(group) : {}">
                <NuxtImg class="icon" :src="`/images/platforms/${group}.png`" width="2rem" height="2rem" />
                <div class="details">
                    <div class="name">{{ releaseGroups[group].length == 1 ? releaseGroups[group][0].distribution.description : useCapitalized(group) }}</div>
                    <div v-if="releaseGroups[group].length == 1" class="file">
                        <span class="file">{{ releaseGroups[group][0].name }}</span>
                        <span class="size-hash">
                            {{ $t('download-file-size', { 'size': useFormattedFileSize(releaseGroups[group][0].fileSize) }) }}
                        </span>
                    </div>
                    <div v-else class="file">
                        <span>
                            <span v-for="(download, index) of releaseGroups[group]">
                                {{ download.distribution.description }}<span v-if="releaseGroups[group].length > index + 1">/</span>
                            </span>
                        </span>
                        <span>
                            {{ $t('download-click-to-select') }}
                        </span>
                    </div>
                </div>
            </a>
        </div>
        <div class="changelog">
            <h2 class="release-name">{{ project.metadata.name }} {{ release.name }} ({{ useTimeFormat(release.timestamp) }})</h2>
            <MDC :value="release.changelog" tag="article" unwrap="p" />
        </div>
    </div>
</template>

<script setup>
const { t } = useI18n();
const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
const { project, channel } = defineProps({
    project: {
        type: Object,
        required: true
    },
    channel: {
        type: String,
        required: true
    }
})

const releaseGroups = ref({});
const release = await useLatestVersion(project.slug, channel);

// Create release groups map
release.value.downloads.forEach(download => {
    const { distribution } = download;
    const { groupName } = distribution;
    
    if (!releaseGroups.value[groupName]) {
        return releaseGroups.value[groupName] = [download];
    }
    releaseGroups.value[groupName].push(download);
})

const openSelectorModal = (group) => useDownloadSelector(
    t('download-select-distribution-version'), 
    { 
        project: project,
        channel: channel,
        release: release,
        downloads: releaseGroups.value[group] 
    }
);
</script>

<style scoped>
.latest-release {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    max-width: 100%;
    justify-content: space-between;
}

.latest-release .download-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    width: 40%;
}

.latest-release .changelog {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 60%;
    max-height: 500px;
    overflow-y: auto;
}

.changelog .release-name {
    width: fit-content;
    margin: 0 0 1rem 0;
}

.changelog:deep(article) {
    margin: 0;
}

@keyframes downloadGlow {
    0% {
        background-position: 100% 100%;
    }
    100% {
        background-position: 15% 15%;
    }
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
    text-decoration: none;
    background-color: var(--dark-gray);
    background: linear-gradient(transparent, #00fb9b1e);
    background-size: 200% 200%;
    animation: downloadGlow 0.5s normal forwards;
}

.button .icon {
    width: 2rem;
    max-height: 4rem;
}

.button .details {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.details .name {
    font-size: 1.1rem;
    font-weight: 700;
}

.details .file {
    color: var(--light-gray);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    display: flex;
    flex-direction: column;
}

@media screen and (max-width: 1100px) {
    .latest-release .download-buttons {
        width: 50%;
    }
}

@media screen and (max-width: 725px) {
    .latest-release {
        flex-direction: column-reverse;
    }

    .latest-release .download-buttons {
        width: 100%;
    }

    .latest-release .changelog {
        width: 100%;
    }
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