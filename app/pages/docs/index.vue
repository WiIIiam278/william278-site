<template>
    <div>
        <Head>
            <Title>{{ $t('docs-home-title') }}</Title>
            <Meta name="og:title" :content="`${t('link-docs')} &ndash; ${t('index-title')}}`" />
            <Meta name="twitter:title" :content="`${t('link-docs')} &ndash; ${t('index-title')}}`" />
            <Meta name="og:image"  content="thumbnail.png" />
            <Meta name="twitter:image"  content="thumbnail.png" />
            <Meta name="twitter:card" content="summary_large_image" />
            <Meta name="twitter:creator" content="@William27528" />
        </Head>
        <NuxtLayout>
            <article class="page-content">
                <Breadcrumbs :crumbs="[{ name: t('link-home'), link: '/' }]" />
                <h1>{{ $t('docs-home-title') }}</h1>
                <p>{{ $t('docs-home-copy') }}</p>
                <div class="docs-sitemap" v-if="projects.filter(p => p.metadata.documentation)?.length">
                    <div class="project-section" v-for="project in projects.filter(p => p.metadata.documentation).sort((p1, p2) => p2.stats.downloadCount - p1.stats.downloadCount)">
                        <hr/>
                        <NuxtLink class="project-title" :href="`/docs/${project.slug}`">
                            <ProjectIcon :project="project" size="32px" />
                            <span>{{ project.metadata.name }}</span>
                        </NuxtLink>
                        <DocsNavigationMini class="project-navigation" v-if="project.metadata?.documentationNav?.length" :showHeaders="false" :project="project" />
                        <div class="project-buttons">
                            <ButtonLink v-if="project.metadata.listDownloads" :href="`/project/${project.slug}/download`" icon="fa6-solid:download" >
                                {{ $t('link-download') }}
                            </ButtonLink>
                            <ButtonLink v-if="project.metadata.github" :href="project.metadata.github" icon="fa6-brands:github" >
                                {{ $t('project-link-github') }}
                            </ButtonLink>
                        </div>
                    </div>
                </div>
                <div v-else class="dummy docs-sitemap">
                    <div class="project-section" v-for="i in 2">
                        <hr/>
                        <div class="project-title pulsing"></div>
                        <div class="project-links">
                            <div class="link pulsing" v-for="i in 14"></div>
                        </div>
                        <div class="project-buttons">
                            <div class="button pulsing" v-for="i in 2"></div>
                        </div>
                    </div>
                </div>
            </article>
        </NuxtLayout>
    </div>
</template>

<script setup>
const ASSETS_URL = useRuntimeConfig().public.ASSETS_BASE_URL;
const { t } = useI18n();
const projects = await useAllProjects();
</script>

<style scoped>
.docs-sitemap {
    margin-bottom: 2rem;
}

.project-section {
    padding: 0.5rem 0;
}

.project-title {
    margin-top: 0.25em;
    font-size: x-large;
    font-weight: bold;
    line-height: 1.75rem;
    color: white !important;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
}

.project-title .icon {
    width: 1.75rem;
    aspect-ratio: 1;
}

.project-links {
    margin: 1rem 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 0.35rem;
}

.project-navigation {
    margin: 1rem 0;
}

.project-buttons {
    display: flex;
    gap: 0.5rem;
    margin-top: 1.5rem;
}

.footer {
    margin-top: 2rem;
    font-size: small;
}

.page-content {
    margin-top: 1rem;
    max-width: 95vw;
    width: 1100px;
}

.page-content h1 {
    margin-top: 0;
}

/* Dummy version */
.dummy .project-section .project-title {
    width: 180px;
    height: 1.6rem;
}

.dummy .project-section .project-links {
    margin-top: 2.25rem;
}

.dummy .project-section .project-links .link {
    width: 200px;
    height: 1.4rem;
}

.dummy .project-section .project-buttons .button {
    width: 120px;
    height: 2.75rem;
}

/* Mobile columns */
@media screen and (max-width: 875px) {
    .project-links {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
    }
}

@media screen and (max-width: 550px) {
    .project-links {
        grid-template-columns: repeat(1, 1fr);
        grid-template-rows: repeat(1, 1fr);
    }
}
</style>