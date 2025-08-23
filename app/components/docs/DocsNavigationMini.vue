<template>
    <div class="mini-navigation">
        <div class="section" v-for="section of navigation">
            <div v-if="showHeaders" class="title">{{ section.name }}</div>
            <div class="links">
                <div class="link" v-for="link of section.children">
                    <div class="link-section">
                        <NuxtLink class="name-link" :to="getLinkFor(link)" :title="link.title">
                            <div class="page-name">
                                <Icon class="icon" :name="link.icon" />
                                <span>{{ link.title }}</span>
                            </div>
                        </NuxtLink>
                        <Icon @click="navigateTo(link.url, { external: true })" class="external-link" name="heroicons-outline:external-link" v-if="isExternalLink(link)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { project } = defineProps({
    project: {
        type: Object,
        required: true
    },
    showHeaders: {
        type: Boolean,
        required: false,
        default: true
    }
})
const { metadata: meta } = project;
const { documentationNav: navigation } = meta || {};

const isExternalLink = (link) => (link.url.indexOf('http://') === 0 || link.url.indexOf('https://') === 0)
const getLinkFor = (link) => isExternalLink(link) ? link.url : `/docs/${project.slug}/${link.url}`;
</script>

<style scoped>
.mini-navigation {
    margin: 1rem 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1.5rem;
}

.section .title {
    color: var(--light-gray);
    border-bottom: 0.125rem solid var(--gray);
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
}

.links .link {
    width: 250px;
}

.link-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.link-section .name-link {
    margin: 0.5rem 0;
    width: 100%;
}

.link-section .external-link {
    font-size: 1.2rem;
    color: var(--accent);
    cursor: pointer;
}

.page-name .icon {
    margin-right: 0.5rem;
    font-size: 1.2rem;
}
</style>