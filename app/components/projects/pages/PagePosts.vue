<template>
    <div class="container">
        <MDC class="title" v-if="title?.length" :value="title" tag="h1" unwrap="p" />
        <PostsStack class="posts" :count="count" :project="project" :displayProjects="false" />
    </div>
</template>

<script setup>
const { 
    project, title, count
} = defineProps({
    project: { type: Object, required: true },
    title: { type: String, required: false, default: '' },
    count: { type: Number, required: false, default: 3 }
})
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 1rem auto;
}

.container:deep(h1) {
    border: none !important;
    color: var(--white);
    font-size: 2rem;
    margin: 0;
    text-align: center;
}

.container.posts {
    width: 100%;
}
</style>