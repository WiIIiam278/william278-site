<template>
    <div v-if="!canDownload">
        <div class="dummy-release">
            <div class="buttons">
                <div class="download pulsing" v-for="i in 2"></div>
            </div>
            <div class="changelog">
                <div class="title pulsing"></div>
                <div class="body pulsing" v-for="i in 6"></div>
                <div class="end"></div>
            </div>
        </div>
        <div class="dummy-menu">
            <div class="title pulsing"></div>
            <hr/>
            <div class="platforms">
                <div class="platform pulsing" v-for="i in 2"></div>
            </div>
            <div class="releases">
                <div class="release" v-for="i in 8">
                    <div class="button pulsing"></div>
                    <div class="text pulsing"></div>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="project.releaseChannels.length" class="downloads-menu">
        <LatestRelease :project="project" :channel="DEFAULT_CHANNEL" />
        <ReleasesBrowser :project="project" :defaultChannel="DEFAULT_CHANNEL" />
    </div>
    <div v-else class="error">
        <IconifiedText icon="fa6-solid:circle-info"><h3>{{ $t('download-no-versions') }}</h3></IconifiedText>
        <p>{{ $t('download-no-versions-copy') }}</p>
    </div>
</template>

<script setup>
const DEFAULT_CHANNEL = 'release';
const user = await useUser();
const { t } = useI18n();
const { project } = defineProps({
    project: {
        type: Object,
        required: true
    }
});

const canDownload = !project.restricted || user.value && (useIsUserRole(user.value, 'staff') || user.value.purchases.some(p => p === project.slug));
if (!canDownload) {
    useUpsell(t('download-get-resource-license', {'name': project.metadata.name}), project);
}
</script>

<style scoped>
.error {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 2rem 0;
}

.dummy-release {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1rem;
}

.dummy-release .buttons {
    width: 50%;
    display: flex;
    gap: 1.5rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.buttons .download {
    width: 90%;
    height: 6rem;
}

.dummy-release .changelog {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.changelog .title {
    width: 85%;
    height: 3rem;
}

.changelog .body {
    width: 100%;
    height: 1.6rem;
}

.dummy-menu {
    display: flex;
    flex-direction: column;
}

.dummy-menu .title {
    height: 2rem;
    width: 50%;
    margin: auto;
    margin-top: 2rem;
    margin-bottom: 0;
}

.dummy-menu hr {
    margin: 1rem 0;
}

.dummy-menu .platforms {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin-bottom: 2rem;
}

.platforms .platform {
    width: 6.5rem;
    height: 2.5rem;
}

.releases {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    width: 100%;
}

.releases .release {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    height: 4rem;
}

.release .button {
    width: 8rem;
    height: 2.5rem;
}

.release .text {
    width: 75%;
    height: 1.75rem;
}
</style>