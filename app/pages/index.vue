<template>
    <div>
        <NuxtLayout name="home">
            <Head>
                <Title>{{ $t('index-title') }}</Title>
                <Meta name="description" :content="t('index-intro')" />
                <Meta name="og:image" content="thumbnail.png" />
                <Meta name="twitter:description" :content="t('index-intro')" />
                <Meta name="twitter:image" content="thumbnail.png" />
                <Meta name="twitter:card" content="summary_large_image" />
                <Meta name="twitter:creator" content="@William27528" />
            </Head>
            <div id="page-content">
                <div id="left-column">
                    <ProjectCardsGrid :projects="projects" />
                </div>
                <div id="right-column">
                    <MainHeader :title="t('index-title')" :tagline="t('index-tagline')" icon="/images/icons/william278.svg" />
                    <ProjectShowcaseGallery :projects="projects" />
                    <MDC :value="t('index-intro')" />
                    <div class="intro-buttons">
                        <ButtonLink v-if="!user" icon="fa6-solid:key" type="primary" to="/account/login">{{ $t('link-log-in') }}</ButtonLink>
                        <ButtonLink v-else icon="fa6-solid:user" type="primary" to="/account">{{ $t('link-account') }}</ButtonLink>
                        <ButtonLink icon="fa6-brands:discord" to="https://discord.gg/tVYhJfyDWG" target="_blank">{{ $t('link-support') }}</ButtonLink>
                        <ButtonLink icon="fa6-solid:at" @click="useContactInfo($t)">{{ $t('link-contact') }}</ButtonLink>
                    </div>
                    <PostsStack class="posts" :count="1" />
                </div>
            </div>
        </NuxtLayout>
    </div>
</template>

<script setup>
const { t } = useI18n()
const user = await useUser();
const projects = await useAllProjects();

// Show contact info if requested
const { query } = useRoute();
if (query['show_contact']) {
    useContactInfo(t);
}
</script>

<style scoped>
#page-content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    margin: 0 auto;
    padding-top: 1.5rem;
    max-width: 1400px;
    width: 95vw;
}

#left-column {
    flex: 1;
    padding: 0 1rem;
}

#right-column {
    flex: 1;
    padding: 0 1rem;
}

.intro-buttons {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.posts {
    margin-bottom: 1rem;
}

/* Less than 725px */
@media screen and (max-width: 725px) {
    #page-content {
        flex-direction: column-reverse;
        max-width: 85vw;
        margin: 0 auto;
    }

    #left-column {
        margin-top: 0.5rem;
        max-width: 100%;
        width: 100%;
        padding: 0;
    }

    #right-column {
        max-width: 100%;
        width: 100%;
        padding: 0;
        padding-bottom: 0.5rem;
        border-bottom: 0.15rem solid var(--gray);
    }
}
</style>