<template>
    <div>
        <NuxtLayout v-if="content" name="sidebar">
            <template #default>

                <Head>
                    <Title>{{ title }} &ndash; {{ $t('docs-title', { 'project': meta.name }) }} &ndash; {{
                        $t('index-title') }}</Title>
                    <Meta name="og:title"
                        :content="`${title} &ndash; ${t('docs-title', { 'project': meta.name })} &ndash; ${t('index-title')}`" />
                    <Meta name="twitter:title"
                        :content="`${title} &ndash; ${t('docs-title', { 'project': meta.name })} &ndash; ${t('index-title')}`" />
                    <Meta name="description" :content="description" />
                    <Meta name="og:description" :content="description" />
                    <Meta name="twitter:description" :content="description" />
                    <Meta name="og:image" content="thumbnail.png" />
                    <Meta name="twitter:image" content="thumbnail.png" />
                    <Meta name="twitter:card" content="summary_large_image" />
                    <Meta name="twitter:creator" content="@William27528" />
                </Head>
                <ArchivalNotice v-if="meta.archived" :name="meta.name" />
                <BreadcrumbsBar>
                    <Breadcrumbs :crumbs="breadcrumbs" />
                </BreadcrumbsBar>
                <article class="documentation">
                    <div v-if="params.topic">
                        <h1 v-if="params.topic">{{ title }}</h1>
                        <MDC :value="content" tag="article" />
                    </div>
                    <DocsNavigationHome v-else :project="project" />
                </article>
            </template>
            <template #sidebar>
                <DocsSidebar :project="project" :currentPage="params.topic" />
            </template>
        </NuxtLayout>
        <NuxtLayout v-else name="default">
            <ErrorPage v-if="!project || !meta?.documentation" code="404" back-link="/docs">
                <BreadcrumbLine>
                    <NuxtLink to="/">{{ $t('link-home') }}</NuxtLink>
                    <BreadcrumbDivider />
                    <NuxtLink to="/docs">{{ $t('link-docs') }}</NuxtLink>
                    <BreadcrumbDivider />
                    <InvalidPage v-if="useRoute().params.project" :name="useRoute().params.project" />
                </BreadcrumbLine>
                <div>{{ $t('error-project-not-found') }}</div>
            </ErrorPage>
            <ErrorPage v-else code="404" :back-link="`/docs/${useRoute().params.project}`">
                <BreadcrumbLine>
                    <NuxtLink to="/">{{ $t('link-home') }}</NuxtLink>
                    <BreadcrumbDivider />
                    <NuxtLink to="/docs">{{ $t('link-docs') }}</NuxtLink>
                    <BreadcrumbDivider />
                    <NuxtLink :to="`/docs/${project.slug}`">{{ meta.name }}</NuxtLink>
                    <BreadcrumbDivider />
                    <InvalidPage v-if="useRoute().params.topic" :name="useRoute().params.topic" />
                </BreadcrumbLine>
                <div>{{ $t('error-page-not-found') }}</div>
            </ErrorPage>
        </NuxtLayout>
    </div>
</template>

<script setup>
const { locale, t } = useI18n()
const { params } = useRoute()

// Get project
const project = await useProject(params.project.toLowerCase());

// Get sidebar and content
const { metadata: meta } = project.value || {};
const { title, content } = project.value ? await useDocsPage(params.project.toLowerCase(), params.topic ? params.topic.toLowerCase() : 'home', locale) : { title: '', content: '' };

const description = computed(() => {
    if (!content) return '';

    let desc = content.replace(/<[^>]+>/g, '');
    if (desc.includes('\n')) {
        desc = desc.split('\n')[0];
    }

    return desc.length > 128 ? `${desc.slice(0, 128)}...` : desc;
});

// Breadcrumbs
const breadcrumbs = [{ name: t('link-home'), link: '/' }, { name: t('link-docs'), link: '/docs' }];
if (params.topic) {
    breadcrumbs.push({ name: meta.name, link: `/docs/${project.value.slug}` });
}
</script>