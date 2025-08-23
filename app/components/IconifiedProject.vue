<template>
    <span :class="`iconified-project ${centered ? 'centered' : ''}`">
        <ProjectIcon v-if="meta.icons" class="icon" :project="project" :size="size" />
        <span class="name">
            {{ meta.name ? meta.name : project.slug }}
        </span>
    </span>
</template>

<style scoped>
.iconified-project {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: max-content;
}

.centered {
    margin: 0 auto;
    justify-content: center;
}

.iconified-project .icon {
    margin-right: 0.2em;
    margin-top: 0.25em;
}

.iconified-project .icon object {
    width: 1.2em;
    min-width: 1.2em;
    aspect-ratio: 1;
}

.iconified-project .icon img {
    width: 1.2em;
    min-width: 1.2em;
    aspect-ratio: 1;
}

.iconified-project .name {
    margin-left: 0.2em;
}
</style>

<script setup>
const { project, centered, size } = defineProps({
    project: {
        type: Object,
        required: true
    },
    centered: {
        type: Boolean,
        default: false,
        required: false
    },
    size: {
        type: String,
        required: false,
        default: '32px'
    }
})
const { metadata: meta } = project;
</script>