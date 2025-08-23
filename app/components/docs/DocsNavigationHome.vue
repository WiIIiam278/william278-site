<template>
    <div>
        <div class="top-banner">
            <div class="project-name">
                <ProjectIcon class="icon" :project="project" size="100px" transparent />
                <h1>{{ $t('docs-title', { project: meta.name }) }}</h1>
            </div>
            <p>{{ $t('docs-intro', { project: meta.name, tagline: meta.tagline }) }}</p>
        </div>
        <DocsNavigationMini v-if="navigation" :project="project" />
    </div>
</template>

<script setup>
const ASSETS_URL = useRuntimeConfig().public.ASSETS_BASE_URL;
const { project } = defineProps({
    project: {
        type: Object,
        required: true
    }
})
const { metadata: meta } = project;
const { documentationNav: navigation } = meta || {};
</script>

<style scoped>
.top-banner {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    background: linear-gradient(180deg, #142B42 0%, #08111B 100%);
    height: 275px;
    border-radius: 0.5rem;
    margin: 0.5rem 0 2rem 0;
}

.project-name .icon {
    width: 100px;
    height: 100px;
    aspect-ratio: 1;
    margin-bottom: 0.5rem;
}

.project-name h1, p {
    border: 0;
    margin: 0;
}
</style>