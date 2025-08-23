<template>
    <div v-if="project.slug && meta" class="project-card shadow">
        <div class="header">
            <NuxtLink class="image hover-image" v-if="meta.icons" :to="`/project/${project.slug}`">
                <ProjectIcon :project="project" size="64px" />
            </NuxtLink>
            <div class="details">
                <NuxtLink :to="`/project/${project.slug}`">
                    <h3 class="name">{{ meta.name ? meta.name : project.slug }}</h3>
                </NuxtLink>
                <div class="pills">
                    <TagPill v-for="tag in meta.tags.slice(0, 3)" :tag="tag" :key="tag" />
                </div>
            </div>
        </div>
        <div class="body">
            <div class="description">
                <div class="tagline" v-if="meta.tagline">
                    <IconifiedText class="archived" v-if="meta.archived" icon="fa6-solid:box-archive">
                        {{$t('project-archived')}}
                    </IconifiedText>
                    <p>{{ meta.tagline }}</p>
                </div>
                <div class="buttons">
                    <ButtonLink v-if="meta.listDownloads" :link="`/project/${project.slug}/download`" icon="fa6-solid:download">
                        {{$t('link-download')}}
                    </ButtonLink>
                    <ButtonLink v-if="meta.documentation" :link="`/docs/${project.slug}`" icon="fa6-solid:book">
                        {{$t('link-docs')}}
                    </ButtonLink>
                    <ButtonLink v-if="meta.github && !(meta.listDownloads && meta.documentation)" icon="fa6-brands:github" :link="meta.github"></ButtonLink>
                    <ButtonLink v-if="!(meta.listDownloads && meta.documentation)" v-for="link in meta.links.slice(0, (meta.listDownloads || meta.documentation) ? 2 : 3)" 
                        :key="link.url" :link="link.url" :icon="useLinkIcon(link)"></ButtonLink>
                </div>
            </div>
            <div class="stats" v-if="stats">
                <div class="stat" v-if="stats.downloadCount">
                    <IconifiedText :title="$t('project-downloads')" icon="fa6-solid:download">
                        {{ stats.downloadCount >= 1000 ? (stats.downloadCount / 1000).toFixed(1) + 'k' : stats.downloadCount }}
                    </IconifiedText>
                </div>
                <div class="stat" :title="$t('project-average-rating')" v-if="stats.averageRating">
                    <IconifiedText icon="fa6-solid:star">
                        {{ parseFloat(stats.averageRating).toFixed(1) }}
                    </IconifiedText>
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
    }
})
const { metadata: meta, stats } = project;
</script>

<style scoped>
.project-card {
    border: 0.125rem solid var(--gray);
    border-radius: 0.5rem;
    min-width: 50%;
    max-width: 100%;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    margin: 0.5rem 0.5rem;
    padding: 0.75rem;
}

@keyframes hoverGlow {
	0% {
        -webkit-box-shadow: inset 0 0 0.25rem transparent;
        -moz-box-shadow: inset 0 0 0.25rem transparent;
        box-shadow: inset 0 0 0.25rem transparent;
	}
	100% {
        -webkit-box-shadow: inset 0 0 3rem var(--gray);
        -moz-box-shadow: inset 0 0 3rem var(--gray);
        box-shadow: inset 0 0 3rem var(--gray);
	}
}

.project-card:hover {
    -webkit-box-shadow: inset 0 0 0.25rem transparent;
    -moz-box-shadow: inset 0 0 0.25rem transparent;
    box-shadow: inset 0 0 0.25rem transparent;
    animation: hoverGlow 0.5s ease both;
}

.header {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
}

.details {
    display: flex;
    justify-self: flex-end;
    margin-right: auto;
    flex-direction: column;
}

.image {
    justify-self: flex-end;
}

.image img {
    max-width: 64px;
    max-height: 64px;
    min-width: 64px;
    min-height: 64px;
    height: 100%;
    border-radius: 0.5em;
}

.image object {
    max-width: 64px;
    max-height: 64px;
    min-width: 64px;
    min-height: 64px;
    height: 100%;
    border-radius: 0.5rem;
}

.name {
    margin: 0;
}

.pills {
    display: flex;
    flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    margin: 0.4rem -0.2rem;
    font-size: 0.9rem;
    align-items: center;
}

.description {
    display: flex;
    flex-direction: column;
}

.tagline .archived {
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    color: var(--light-gray)
}

.buttons {
    display: flex;
    flex-wrap: wrap;
    margin-top: auto;
    justify-self: flex-end;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    gap: 0.35rem;
}

.stats {
    display: flex;
    flex-direction: column;
    color: var(--light-gray);
    justify-content: flex-end;
    align-items: flex-end;
    margin-left: auto;
    font-size: 0.9rem;
}

.stats .stat {
    white-space: nowrap;
}

.body {
    width: 100%;
    display: flex;
    flex-direction: row;
}

/* Smaller than 350px */
@media only screen and (max-width: 22em) {
    .project-card {
        flex-direction: column;
    }

    .header {
        flex-direction: column;
        align-items: center;
    }

    .body {
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .stats {
        margin-top: 0.5rem;
        margin-left: 0;
        flex-direction: row;
        gap: 1rem;
    }

    .image {
        margin-bottom: 0.5rem;
    }

    .details {
        margin-right: 0;
        align-items: center;
    }

    .buttons {
        justify-content: center;
    }
}
</style>