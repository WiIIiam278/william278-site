<template>
    <div class="content-sidebar">
        <MDC :value="sidebar" class="content" tag="article" />
    </div>
</template>

<script setup>
const { sidebar, project } = defineProps({
    sidebar: {
        type: Object,
        required: true
    },
    project: {
        type: Object,
        required: true
    }
})
const { metadata: meta } = project;
</script>

<style scoped>
.content-sidebar:deep(h1), .content-sidebar:deep(h2), .content-sidebar:deep(h3) {
    margin-bottom: 1rem;
}
</style>