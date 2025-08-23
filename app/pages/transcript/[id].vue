<template>
    <div>
        <NuxtLayout v-if="data" name="sidebar">
            <Head>
                <Title>{{ $t('ticket-transcript-title', { 'ticket': data.ticket.id }) }}</Title>
                <Meta name="description" :content="t('ticket-transcript-description')" />
                <Meta name="og:description" :content="t('ticket-transcript-description')" />
                <Meta name="twitter:description" :content="t('ticket-transcript-description')" />
                <Meta name="og:title" :content="`${t('ticket-transcript-title', {'ticket': data.ticket.id})} &ndash; ${t('index-title')}`" />
                <Meta name="twitter:title" :content="`${t('ticket-transcript-title', {'ticket': data.ticket.id})} &ndash; ${t('index-title')}`" />
                <Meta name="og:image" content="thumbnail.png" />
                <Meta name="twitter:image" content="thumbnail.png" />
                <Meta name="twitter:card" content="summary_large_image" />
                <Meta name="twitter:creator" content="@William27528" />
            </Head>
            <Breadcrumbs :crumbs="[{ name: t('link-home'), link: '/' }, { name: t('link-transcript'), link: `/transcript/${id}` }]" />
            <h1>{{ $t('ticket-transcript-ticket-number', {'ticket': data.ticket.id }) }}</h1>
            <TranscriptMessages :data="data" />
            <template #sidebar>
                <TranscriptSidebar :data="data" :url="useTranscriptUrl(id)" />
            </template>
        </NuxtLayout>
        <NuxtLayout v-else name="default">
            <ErrorPage :code="404">{{ $t('error-transcript-not-found') }}</ErrorPage>
        </NuxtLayout>
    </div>
</template>

<script setup>
const { t } = useI18n()
const { id } = useRoute()?.params
const { value: data } = await useTranscript(id)
</script>