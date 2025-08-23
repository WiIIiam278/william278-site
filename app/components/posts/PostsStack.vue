<template>
    <div class="container">
        <hr v-if="!project" />
        <h2 v-if="!project">{{ $t('index-posts-header') }}</h2>
        <div class="posts" v-if="posts?.content?.length">
            <PostPreview v-for="post of posts.content" :post="post" :displayProject="displayProjects" />
        </div>
        <IconifiedText class="error" icon="fa6-solid:info" v-else>{{ $t('posts-none') }}</IconifiedText>
        <ButtonLink icon="fa6-solid:newspaper" to="/posts">{{ $t('link-more-posts') }}</ButtonLink>
    </div>
</template>

<script setup>
const { count, project, displayProjects } = defineProps({
    count: {
        type: Number,
        required: false,
        default: 5
    },
    project: {
        type: Object,
        required: false
    },
    displayProjects: {
        type: Boolean,
        required: false,
        default: true
    }
})

const posts = project ? await useAllProjectPosts(project.slug, 0, count) : await useAllPosts(0, count);
</script>

<style scoped>
.container hr {
    margin: 1rem 0 0rem 0;
}

.container h2 {
    margin: 0;
    padding: 0;
    border: none;
}

.posts {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0.5rem 0;
    width: 100%;
}

.error {
    display: flex;
    justify-content: center;
    margin: 2rem auto;
    width: 100%;
    color: var(--light-gray);
}
</style>