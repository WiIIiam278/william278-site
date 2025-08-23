<template>
    <div class="navigation">
        <div class="section" v-for="section of navigation">
            <div class="title">{{ section.name }}</div>
            <div class="links">
                <div class="link" v-for="link of section.children">
                    <div :class="`link-section ${selectedState(link)}`">
                        <NuxtLink class="name-link" :to="getLinkFor(link)" :title="link.title">
                            <div class="page-name">
                                <Icon class="icon" :name="link.icon" />
                                <span>{{ link.title }}</span>
                            </div>
                        </NuxtLink>
                        <Icon @click="expandCollapseLink(link)" class="expand-collapse"
                            :name="getLinkExpandIcon(link)" v-if="link.children?.length" />
                        <Icon @click="navigateTo(link.url, { external: true })" class="external-link" name="heroicons-outline:external-link" v-else-if="isExternalLink(link)" />
                    </div>
                    <div class="link child" v-if="isLinkExpanded(link)" v-for="sublink of link.children">
                        <div :class="`link-section ${selectedState(sublink)}`">
                            <NuxtLink class="name-link" :to="getLinkFor(sublink)" :title="sublink.title">
                                <div class="page-name">
                                    <Icon class="icon" :name="sublink.icon" />
                                    <span>{{ sublink.title }}</span>
                                </div>
                            </NuxtLink>
                            <Icon @click="navigateTo(sublink.url, { external: true })" class="external-link" name="heroicons-outline:external-link" v-if="isExternalLink(link)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { navigation, project, currentPage } = defineProps({
    navigation: {
        type: Object,
        required: true
    },
    project: {
        type: Object,
        required: true
    },
    currentPage: {
        type: String,
        required: true
    }
});
const { metadata: meta } = project;
const expandedLinks = ref([]);

const getLinkIndex = (link) => expandedLinks.value.indexOf(link.url);
const isLinkExpanded = (link) => getLinkIndex(link) > -1 || link.url === currentPage || link.children.find(c => c.url === currentPage);
const getLinkExpandIcon = (link) => `fa6-solid:chevron-${isLinkExpanded(link) ? 'down' : 'right'}`
const expandCollapseLink = (link) => getLinkIndex(link) > -1
    ? expandedLinks.value.splice(getLinkIndex(link), 1)
    : expandedLinks.value.push(link.url);
const isExternalLink = (link) => (link.url.indexOf('http://') === 0 || link.url.indexOf('https://') === 0)
const getLinkFor = (link) => isExternalLink(link) ? link.url : `/docs/${project.slug}/${link.url}`;
const selectedState = (link) => currentPage === link.url ? 'selected' : ''
</script>

<style scoped>
.navigation .section .title {
    color: var(--light-gray);
    margin-bottom: 0.5rem;
}

.section {
    margin: 1.75rem 0;
    border-bottom: 0.125rem solid var(--gray);
}

.link {
    border-top: 0.125rem solid var(--gray);
}

.link .title {
    padding: 0.25rem 0;
}

.link-section {
    padding: 0 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.link-section:hover {
    filter: brightness(100%);
    background-color: var(--gray);
    transition: ease-in-out 0.1s;
}

.link-section .name-link {
    width: 100%
}

.link-section .expand-collapse, .link-section .external-link {
    color: var(--white);
    margin-right: 0.5rem;
    font-size: 1.3rem;
    cursor: pointer;
}

.page-name {
    padding: 0.65rem 0;
}

.selected {
    background-color: var(--gray);
}

.selected:deep(a) {
    color: var(--white);
    text-decoration: none !important;
}

.link.child .page-name {
    margin-left: 1rem;
}

.page-name .icon {
    margin-right: 0.75rem;
    font-size: 1.2rem;
}
</style>