<template>
    <div id="page-body">
        <Head>
            <Meta name="og:image" content="thumbnail.png" />
            <Meta name="twitter:image" content="thumbnail.png" />
            <Meta name="twitter:card" content="summary_large_image" />
            <Meta name="twitter:creator" content="@William27528" />
        </Head>
        <Navbar />
        <div>
            <ErrorPage :code="error.statusCode.toString()">
                {{ message }}
            </ErrorPage>
        </div>
        <Footer />
    </div>
</template>

<style scoped>
#page-body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
</style>

<script setup>
const { t } = useI18n()
const { error } = defineProps({
    error: {
        type: Object,
        required: true
    }
})
const message = JSON.parse(error?.data ?? '{}')?.error ?? error.message;

useHead({
    titleTemplate: (titleChunk) => {
        return `${t('site-name')} - Error ${error.statusCode}`;
    },
    meta: [
        {
            name: 'description',
            content: 'Easily-accessible documentation and information site for all of William278\'s Minecraft plugins, projects & games'
        }
    ],
})
</script>