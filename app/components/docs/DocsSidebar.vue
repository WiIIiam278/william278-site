<template>
    <div>
        <div class="sidebar-top">
            <NuxtLink class="project-title" :to="`/docs/${project.slug}`">
                <IconifiedProject centered :project="project" size="48px" />
            </NuxtLink>
            <div class="project-buttons">
                <ButtonLink :href="`/project/${project.slug}`" icon="fa6-solid:info" >
                    {{ $t('link-about') }}
                </ButtonLink>
                <ButtonLink v-if="meta.listDownloads" :href="`/project/${project.slug}/download`" icon="fa6-solid:download" >
                    {{ $t('link-download') }}
                </ButtonLink>
                <ButtonLink v-if="meta.github" :href="meta.github" icon="fa6-brands:github" />
            </div>
        </div>
        <DocsNavigationSidebar v-if="navigation?.length" :navigation="navigation" :currentPage="currentPage" :project="project" />
        <DocsContentSidebar v-else-if="sidebar" :sidebar="sidebar" :project="project" />
        <div class="sidebar-bottom">
            <ButtonLink v-for="link in meta.links" 
                :key="link.url" :link="link.url" :icon="useLinkIcon(link)"></ButtonLink>
        </div>
    </div>
</template>

<script setup>
const { project } = defineProps({
    project: {
        type: Object,
        required: true
    },
    currentPage: {
        type: String,
        required: false
    }
})
const { metadata: meta } = project;
const { documentationNav: navigation } = meta || {};
const { content: sidebar } = !navigation?.length && project ? await useDocsPage(project.slug.toLowerCase(), '_sidebar') : '';
</script>

<style scoped>
.sidebar-top {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.sidebar-top .project-title {
    color: white !important;
    font-size: x-large;
    font-weight: bold;
}

.sidebar-top .project-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
}

.sidebar-bottom {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 1.5rem 0 0.25rem 0;
    gap: 0.75rem;
}
</style>