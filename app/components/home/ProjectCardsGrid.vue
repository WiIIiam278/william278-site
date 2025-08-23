<template>
    <div>
        <div class="grid-title">
            <h1>{{ $t('index-grid-header') }}</h1>
            <div class="filter-tags">
                <Icon class="tag-icon" name="fa6-solid:tag" />
                <span class="filters">
                    <template v-for="tag in featuredTags">
                        <TagPill :tag="tag" isClickable :isSelected="selectedTags.includes(tag)" @selected="onTagSelected" />
                    </template>
                </span>
            </div>
        </div>
        <div class="projects-grid">
            <template v-if="filtered?.length" v-for="(project, index) in filtered">
                <ProjectCard v-if="expanded || index < shown" :index="index" :key="project.slug" :project="project" />
            </template>
            <div v-else class="dummy" v-for="i in 6">
                <div class="title pulsing"></div>
                <div class="pills">
                    <div class="pill pulsing" v-for="i in 3"></div>
                </div>
                <div class="text">
                    <div class="line pulsing" v-for="i in 2"></div>
                </div>
            </div>
        </div>
        <div class="below-grid" v-if="filtered?.length > shown">
            <a class="grid-size-button" @click="expanded = !expanded">
                <IconifiedText v-if="expanded" icon="fa6-solid:chevron-up">{{ $t('index-grid-collapse') }}</IconifiedText>
                <IconifiedText v-else icon="fa6-solid:chevron-down">{{ $t('index-grid-expand') }}</IconifiedText>
            </a>
        </div>
    </div>
</template>

<script setup>
const expanded = ref(false);
const selectedTags = ref([]);
    
const { projects, shown, featuredTags } = defineProps({
    projects: {
        type: Array,
        required: true
    },
    shown: {
        type: Number,
        default: 6
    },
    featuredTags: {
        type: Array,
        required: false,
        default: ['minecraft', 'game', 'library', 'web']
    }
});

const filtered = computed(() => {
    let filtered;
    if (projects && selectedTags.value.length) {
        filtered = projects.filter(p => !p.metadata?.tags || selectedTags.value.every(tag => p.metadata.tags.includes(tag)));
    } else {
        filtered = projects || [];
    }
    return filtered.sort((a, b) => (a.metadata?.sortWeight || 0) - (b.metadata?.sortWeight || 0));
});

const onTagSelected = (tag) => {
    if (selectedTags.value.includes(tag)) {
        selectedTags.value.splice(selectedTags.value.indexOf(tag), 1);
    } else {
        selectedTags.value.push(tag);
    }
}
</script>

<style scoped>
.projects-grid {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
}

.dummy {
    border: 0.125rem solid var(--gray);
    border-radius: 0.5rem;
    min-width: 50%;
    max-width: 100%;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    margin: 0.5rem 0.5rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

.dummy:deep(div) {
    border-radius: 0;
}

.dummy .title {
    width: 150px;
    height: 1.5rem;
    border-radius: 0;
    margin-bottom: 0.8rem;
}

.dummy .pills {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.pills .pill {
    width: 60px;
    height: 1.5rem;
    border-radius: 0.5rem;
}

.text .line {
    width: 240px;
    height: 1.2rem;
    margin: 0.5rem 0;
}

.grid-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    padding: 0 0.5rem;
}

.grid-title h1 {
    margin: 0;
}

@media screen and (max-width: 1000px) {
    .grid-title {
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
    }

    .grid-title h1 {
        margin-bottom: 0.5rem;
    }
}

.tag-icon {
    font-size: 1.25rem;
    margin-right: 0.5rem;
    color: var(--light-gray);
}

.below-grid {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 0.3rem;
}

.grid-size-button:hover {
    cursor: pointer;
}
</style>