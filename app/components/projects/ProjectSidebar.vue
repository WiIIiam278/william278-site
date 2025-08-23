<template>
    <div class="project-sidebar">
        <div class="header">
            <div class="meta">
                <h1 class="name">{{ meta.name }}</h1>
                <div class="pills">
                    <TagPill v-for="tag in meta.tags" :tag="tag" />
                </div>
            </div>
            <div class="icon" v-if="meta.icons">
                <ProjectIcon :project="project" size="75px" />
            </div>
        </div>
        <div class="tagline">{{ meta.tagline }}</div>
        <div class="buttons" v-if="meta.documentation || meta.github">
            <ButtonLink v-if="meta.documentation" :link="`/docs/${project.slug}`" icon="fa6-solid:book" >
                {{ $t('link-docs') }}
            </ButtonLink>
            <ButtonLink v-if="meta.github" icon="fa6-brands:github" :link="meta.github" >
                {{ $t('project-link-github') }}
            </ButtonLink>
            <ButtonLink class="platform" v-for="link in meta.links" :link="link.url" :icon="useLinkIcon(link)" />
        </div>
        <div class="stats">
            <div class="stat" v-if="project.restricted && meta.suggestedRetailPrice">
                <div class="stat-descriptor">{{ $t('project-price') }}</div>
                <div class="stat-data">
                    {{$t('project-price-sterling', {'price': meta.suggestedRetailPrice.toFixed(2)})}}
                </div>
            </div>
            <div class="stat" v-if="meta.license?.length && meta.license !== 'All Rights Reserved'">
                <div class="stat-descriptor">{{ $t('project-license') }}</div>
                <div class="stat-data">
                    <IconifiedText icon="fa6-solid:scale-balanced">
                        {{ meta.license }}
                    </IconifiedText>
                </div>
            </div>
            <div class="stat" v-if="stats.downloadCount">
                <div class="stat-descriptor">{{ $t('project-downloads') }}</div>
                <div class="stat-data">
                    <IconifiedText icon="fa6-solid:download">
                        {{ 
                            stats.downloadCount >= 1000
                                ? (stats.downloadCount / 1000).toFixed(1) + 'k' 
                                : stats.downloadCount
                        }}
                    </IconifiedText>
                </div>
            </div>
            <div class="stat" v-if="stats.averageRating && stats.numberOfRatings">
                <div class="stat-descriptor">{{ $t('project-average-rating') }}</div>
                <div class="stat-data">
                    <IconifiedText icon="fa6-solid:star">
                        {{ stats.averageRating.toFixed(1) }}
                        <span class="sub-data">({{ stats.numberOfRatings }})</span>
                    </IconifiedText>
                </div>
            </div>
            <div class="stat" v-if="stats.onlinePlayers">
                <div class="stat-descriptor">{{ $t('project-online-players') }}</div>
                <div class="stat-data">
                    <IconifiedText icon="fa6-solid:users">{{ 
                            stats.onlinePlayers >= 1000
                                ? (stats.onlinePlayers / 1000).toFixed(1) + 'k' 
                                : stats.onlinePlayers
                        }}
                    </IconifiedText>
                </div>
            </div>
            <div class="stat" v-if="stats.onlineServers">
                <div class="stat-descriptor">{{ $t('project-online-servers') }}</div>
                <div class="stat-data">
                    <IconifiedText icon="fa6-solid:server">{{ 
                            stats.onlineServers >= 1000
                                ? (stats.onlineServers / 1000).toFixed(1) + 'k' 
                                : stats.onlineServers
                        }}
                    </IconifiedText>
                </div>
            </div>
        </div>
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
const { metadata: meta, stats } = project;
</script>

<style scoped>
.project-sidebar {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    gap: 0.5rem;
}

.header {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
}

.header .meta {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.meta .name {
    margin-bottom: 0;
}

.meta .pills {
    display: flex;
    margin-left: -0.1rem;
}

.header .icon {
    width: 5rem;
    height: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon img,
.icon object {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
}

.tagline {
    margin: 0.8rem 0;
}

.gallery .image {
    width: 100%;
    height: auto;
    display: none;
}

.gallery .shown {
    display: block !important;
}

.image img {
    max-height: 16rem;
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 0.5rem;
}

.buttons {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex-wrap: wrap;
}

.buttons .platform {
    font-size: 0.9rem;
    margin-bottom: 0.2rem;
    margin-left: 0.2rem;
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

.stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0.5rem;
    margin: 0.5rem 0;
}

.stats .stat {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 0.125rem solid var(--gray);
    border-radius: 0.5rem;
    padding: 0.4rem 0.5rem;
}

.stats .stat:hover {
    -webkit-box-shadow: inset 0 0 0.25rem transparent;
    -moz-box-shadow: inset 0 0 0.25rem transparent;
    box-shadow: inset 0 0 0.25rem transparent;
    animation: hoverGlow 0.5s ease both;
}

.stat .sub-data {
    color: var(--light-gray);
}

.stat .stat-descriptor {
    font-size: 0.9rem;
    color: var(--light-gray);
}

.stat .license-link {
    margin-left: 0.3rem;
    font-size: 0.8rem;
}

/* Less than 800px */
@media screen and (max-width: 50rem) {
    .project-sidebar {
        min-width: 100%;
    }
}

/* Less than 650px */
@media screen and (max-width: 40.625rem) {

    /* Align everything centrally */
    .project-sidebar {
        align-items: center;
        margin: 1rem 0;
        max-width: 85vw;
    }

    /* Move the icon to the top */
    .header {
        flex-direction: column-reverse;
        text-align: center;
    }

    .header .meta {
        margin-bottom: 0.5rem;
    }

    .tagline {
        text-align: center;
    }

    .buttons {
        text-align: center;
    }

    .meta .pills {
        justify-content: center;
    }
}
</style>