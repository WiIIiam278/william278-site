<template>
    <div>
        <NuxtLayout v-if="post">
            <Head>
                <Title>William278.net &ndash; {{ $t('posts-title') }} &ndash; {{ post.title }}</Title>
                <Meta name="description" content="Latest news and update posts from William278.net." />
                <Meta name="og:image" content="thumbnail.png" />
                <Meta name="twitter:image" content="thumbnail.png" />
                <Meta name="twitter:card" content="summary_large_image" />
                <Meta name="twitter:creator" content="@William27528" />
            </Head>
            <article class="page-content">
                <BreadcrumbsBar>
                    <Breadcrumbs :crumbs="[{ name: $t('link-home'), link: '/' }, { name: $t('link-posts'), link: '/posts' }]" />
                    <div class="controls">
                        <ButtonLink v-if="canEdit" :icon="`fa6-solid:${editing ? 'floppy-disk' : 'pencil'}`" type="primary"  @click="savePost()">{{ $t(`post-action-${editing ? 'save' : 'edit'}`) }}</ButtonLink>
                        <ButtonLink v-if="!editing" icon="fa6-solid:chevron-left" type="red" to="/posts">{{ $t('link-back') }}</ButtonLink>
                        <ButtonLink v-if="editing" icon="fa6-solid:wrench" @click="editSlug()">{{ $t('post-action-edit-slug') }}</ButtonLink>
                        <ButtonLink v-if="editing" type="red" icon="fa6-solid:trash" @click="deletePost()">{{ $t('post-action-delete') }}</ButtonLink>
                    </div>
                </BreadcrumbsBar>
                <h1 v-if="!editing">{{ post.title }}</h1>
                <input class="title-editor" v-else v-model="post.title" :placeholder="t('post-title')">
                <div class="details">
                    <NuxtLink v-if="!editing && post.associatedProject" class="project" :to="`/project/${post.associatedProject.slug}`">
                        <IconifiedProject :project="post.associatedProject" size="24px" />
                    </NuxtLink>
                        <IconifiedText v-else-if="editing" icon="fa6-solid:box" class="project">
                        <select v-model="associated" :placeholder="t('post-category')">
                            <option :value="null">{{ $t('post-no-associated-project') }}</option>
                            <option v-for="project of allProjects" :value="project.slug">{{ project.metadata.name }}</option>
                        </select>
                    </IconifiedText>
                    <IconifiedText icon="fa6-solid:tag" class="category">
                        <Pill v-if="!editing && post.category?.length" class="pill">{{ $t(`post-category-${post.category}`) }}</Pill>
                        <select v-else v-model="post.category" :placeholder="t('post-category')">
                            <option value="changelogs">{{ $t('post-category-changelogs') }}</option>
                            <option value="blog">{{ $t('post-category-blog') }}</option>
                            <option value="news">{{ $t('post-category-news') }}</option>
                            <option value="promotions">{{ $t('post-category-promotions') }}</option>
                        </select>
                    </IconifiedText>
                    <div class="details-right">
                        <IconifiedText v-if="editing" icon="fa6-solid:image" class="image">
                            <span class="image-picker">
                                <button @click="useAssetInput(t('post-select-image'), t('select-image'), (_, selected) => post.imageUrl = selected)"><Icon name="fa6-solid:pencil" /></button>
                                <button v-if="post.imageUrl?.length" class="red" @click="post.imageUrl = null"><Icon name="fa6-solid:x" /></button>
                                <input disabled v-model="post.imageUrl" :placeholder="$t('post-image-tooltip')" />
                            </span>
                        </IconifiedText>
                        <IconifiedText v-else icon="fa6-solid:calendar" class="time">{{ useTimeFormat(post.timestamp, true) }}</IconifiedText>
                        <div class="author row">
                            <NuxtImg :src="post.authorAvatar ?? '/images/icons/william278.svg'" width="32px" height="32px" />
                            <span>{{ post.authorName ? useCapitalized(post.authorName) : 'Staff' }}</span>
                        </div>
                    </div>
                </div>
                <NuxtImg v-if="post.imageUrl" class="post-image shadow" :src="`${ASSETS_URL}/${post.imageUrl}`" :alt="post.title" />
                <MDC v-if="!editing" class="body" :value="post.body.length ? post.body : '<br/>'" />
                <TiptapEditor class="body" v-model="post.body" :placeholder="t('post-body')" v-else></TiptapEditor>
                <Notice title="Warning" type="warning" v-if="editing && post.versionUpdate">{{ $t('post-version-update-edit-warning') }}</Notice>
                <div class="buttons" v-if="!editing">
                    <ButtonLink icon="fa6-solid:chevron-left" :to="`/posts`">{{ $t('link-more-posts') }}</ButtonLink>
                    <ButtonLink v-if="post.versionUpdate && post.associatedProject" icon="fa6-solid:download" type="primary" :to="`/project/${post.associatedProject.slug}/download`">{{ $t('link-download') }}</ButtonLink>
                </div>
            </article>
        </NuxtLayout>
        <NuxtLayout v-else name="default">
            <ErrorPage code="404" back-link="/posts">
                <BreadcrumbLine>
                    <NuxtLink to="/">{{ $t('link-home') }}</NuxtLink>
                    <BreadcrumbDivider />
                    <NuxtLink to="/posts">{{ $t('link-posts') }}</NuxtLink>
                    <BreadcrumbDivider />
                    <InvalidPage :name="useRoute().params.slug" />
                </BreadcrumbLine>
                <div>{{ $t('error-post-not-found') }}</div>
            </ErrorPage>
        </NuxtLayout>
    </div>
</template>

<script setup>
import { useAssetInput } from '../../composables/useAssetInput';

const ASSETS_URL = useRuntimeConfig().public.ASSETS_BASE_URL;
const FRONTEND_URL = useRuntimeConfig().public.FRONTEND_BASE_URL;
const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
const SLUG_REGEX = new RegExp(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const validateSlug = (slug) => SLUG_REGEX.test(slug);

const { t } = useI18n()
const { auth, xsrf } = useAuth();
const { slug } = useRoute()?.params;

const associated = defineModel('associated');
const editing = ref(false);
const slugChanged = ref(false);

const user = await useUser();
const post = await usePost(slug);
associated.value = post?.value?.associatedProject?.slug ?? null;
const canEdit = user.value ? useIsUserRole(user.value, 'admin') : false;
const allProjects = canEdit ? await useAllProjects() : null;

const savePost = async () => {
    if (editing.value) {
        await putPost();
    }
    editing.value = !editing.value;

    if (slugChanged.value) {
        navigateTo(`/posts/${post.value.slug}`, { external: true });
    }
}

const editSlug = async () => {
    useInput(t('post-enter-slug'), t('post-action-edit-slug', { 'url': FRONTEND_URL }),
            post.value.slug, (input) => validateSlug(input), async (confirm, slug) => {
        if (!confirm) return;
        post.value.slug = slug;
        slugChanged.value = true;
        await savePost();
    })
}

const putPost = async () => {
    post.value.associatedProject = associated.value ? await useProject(associated.value) : null;
    post.value = await $fetch(`${BASE_URL}/v1/posts/${slug}`, 
    { 
        method: 'PUT',
        credentials: auth ? 'include' : 'omit',
        headers: {
            'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
            'X-XSRF-TOKEN': xsrf
        },
        body: JSON.stringify(post.value)
    });
}

const deletePost = async () => {
    useConfirm(t('post-delete-confirm'), t('post-action-delete'), async (confirm) => {
        if (!confirm) return;
        try {
            await $fetch(`${BASE_URL}/v1/posts/${slug}`, 
            { 
                method: 'DELETE',
                credentials: auth ? 'include' : 'omit',
                headers: {
                    'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
                    'X-XSRF-TOKEN': xsrf
                }
            });
        } catch (err) {
            useAlert('Failed to delete post: ' + err, 'Error');
            return;
        }
        navigateTo('/posts');
    })
}
</script>

<style scoped>
.page-content {
    margin: 1rem 0;
    max-width: 95vw;
    width: 1000px;
}

.page-content h1 {
    margin-top: 0;
    margin-bottom: 0.5rem;;
}

.page-content .title-editor {
    width: 100%;
    margin: 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 800;
}

.details, .details-right {
    display: flex;
    gap: 1rem;
    color: var(--light-gray)
}

.details-right {
    margin-left: auto;
}

.warning {
    color: gold;
}

.controls {
    display: flex;
    flex-direction: row;
    justify-content: end;
    width: 100%;
    gap: 0.5rem;
}

.row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    flex-wrap:  wrap;
}

.details .author {
    gap: 0.5rem;
}

.image-picker button {
    width: 36px;
    height: 36px;
    line-height: 0.5rem;
    margin: 0 0.2rem;
    font-size: 0.9rem;
}

.details .image input {
    background-color: transparent;
    border: none;
    width: min-content;
    max-width: min-content;
    text-overflow: ellipsis;
    font-family: unset;
    line-height: 0rem;
    color: var(--light-gray) !important;
}

.row img {
    width: 32px;
    border-radius: 50%;
}

.post-image {
    width: 100%;
    height: auto;
    max-height: 380px;
    object-fit: cover;
    border-radius: 0.5rem;
    margin: 1rem 0.5rem 0 0;
    background-color: var(--dark-gray);
}

textarea.body {
    width: 100%;
    min-height: 40vh;
    margin: 0.5rem 0;
}

.category .pill {
    color: white;
    font-size: 0.9rem;
}

.time select {
    width: 120px;
}

.project {
    display: flex;
    align-items: center;
}

.project select {
    width: 200px;
}

.buttons {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    margin-top: 1.5rem;
}
</style>