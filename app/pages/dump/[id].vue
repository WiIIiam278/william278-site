<template>
    <div>
        <NuxtLayout v-if="dump?.project && project && dump.schemaVersion === SUPPORTED_SCHEMA_VERSION" name="sidebar">
            <Head>
                <Title>{{ $t('dump-viewer-title-project', { 'project': project.metadata.name }) }}</Title>
                <Meta name="description" :content="t('dump-viewer-description')" />
                <Meta name="og:description" :content="t('dump-viewer-description')" />
                <Meta name="twitter:description" :content="t('dump-viewer-description')" />
                <Meta name="og:title" :content="`${t('dump-viewer-title-project', { 'project': project.metadata.name })} &ndash; ${t('index-title')}`" />
                <Meta name="twitter:title" :content="`${t('dump-viewer-title-project', { 'project': project.metadata.name })} &ndash; ${t('index-title')}`" />
                <Meta name="og:image" content="thumbnail.png" />
                <Meta name="twitter:image" content="thumbnail.png" />
                <Meta name="twitter:card" content="summary_large_image" />
                <Meta name="twitter:creator" content="@William27528" />
            </Head>
            <Breadcrumbs :crumbs="[{ name: t('link-home'), link: '/' }, { name: t('link-dump'), link: `/dump/${id}` }]" />
            <h1>{{ $t('dump-viewer-title-project', { 'project': project.metadata.name }) }} {{ getDisplayFor(selected) }}</h1>
            <div v-if="selected">
                <div v-if="selected === 'overview'">
                    <ServerDumpStatus :status="dump.status" />
                </div>
                <div v-else-if="selected === 'plugins'">
                    <ServerDumpPlugins :plugins="dump.plugins" />
                </div>
                <ServerDumpFile v-else :contents="config" :lang="getLangFor(selected)" />
            </div>
            <div v-else class="placeholder">
                <div v-for="i in 3" class="pulsing"></div>
            </div>
            <template #sidebar>
                <ServerDumpSidebar @select="onSelected" :selected="selected" :data="dump" :project="project" :id="id" />
            </template>
        </NuxtLayout>
        <NuxtLayout v-else name="default">
            <ErrorPage v-if="id.length !== 10" code="400">{{ $t('error-dump-bad-id') }}</ErrorPage>
            <ErrorPage v-else code="404">{{ $t('error-dump-not-found') }}</ErrorPage>
        </NuxtLayout>
    </div>
</template>

<script setup>
const SUPPORTED_SCHEMA_VERSION = 1;
const { t } = useI18n();
const { params, hash } = useRoute();
const { id } = params; 

const selected = ref(null);
const config = ref('');
const dump = await useDump(id);
const project = dump.value?.project ? await useProject(dump.value.project.id) : null;

// Change tabs
const updateConfig = (val) => {
    if (val === 'latest.log') {
        config.value = dump.value.latestLog;
    } else if (val !== 'overview' && val !== 'plugins') {
        config.value = getContentsFor(val);
    }
}
const onSelected = (val) => {
    selected.value = val;
    navigateTo(`#${val}`);
    updateConfig(val);
}

// Get config file contents & lang
const getContentsFor = (selected) => dump.value.files.find(f => f.fileName === selected).fileContents;
const getLangFor = (selected) => {
    if (selected === 'latest.log') {
        return 'log';
    }
    
    let lang = dump.value.files.find(f => f.fileName === selected)?.fileLang;
    if (lang) {
        return lang;
    } else if (selected.endsWith('.json')) {
        return 'json';
    } else if (selected.endsWith('.toml')) {
        return 'toml';
    } else if (selected.endsWith('.txt')) {
        return 'txt';
    }
    return 'yaml';
}

// Get display text
const getDisplayFor = (val) => {
    if (val === null) {
        return '';
    }
    if (['overview', 'plugins'].indexOf(val) > -1) {
        return `– ${useCapitalized(val)}`;
    }
    return `– ${val}`
}

// Load page based on anchor hash
onMounted(() => {
    selected.value = hash?.length ? hash.substring(1).toLowerCase() : 'overview';
    updateConfig(selected.value);
});
</script>

<style scoped>
h1 {
    padding-bottom: 0.25rem;
    border-bottom: 0.125rem solid var(--gray);
}

.placeholder {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    gap: 1rem;
}

.placeholder div {
    width: calc(50% - 1rem);
    height: 300px;
}
</style>