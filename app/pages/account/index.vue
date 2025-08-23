<template>
    <div>
        <NuxtLayout>
            <Head>
                <Title>{{ t('account-title') }}</Title>
                <Meta name="description" :content="t('account-description')" />
                <Meta name="og:image" content="thumbnail.png" />
                <Meta name="twitter:description" :content="t('account-description')" />
                <Meta name="twitter:image" content="thumbnail.png" />
                <Meta name="twitter:card" content="summary_large_image" />
                <Meta name="twitter:creator" content="@William27528" />
            </Head>
            <div id="page-content">
                <article class="account-page">
                    <Breadcrumbs :crumbs="[{ name: t('link-home'), link: '/' }]" />
                    <div class="account-grid">
                        <div class="profile grid-item shadow">
                            <h1 class="item-title">{{ $t('your-account') }}</h1>
                            <div class="profile-bg"></div>
                            <div class="item-body">
                                <div class="user-container shadow">
                                    <span>{{$t('logged-in-with-discord')}}</span>
                                    <div class="user-card">
                                        <NuxtImg class="avatar shadow" :src="user.avatar" width="75px" height="75px"
                                            :alt="t('user-avatar-alt-text', {'name': user.name})" placeholder="/images/placeholder-avatar.png" />
                                        <div class="user-details">
                                            <div class="name-role">
                                                <span class="name">{{ user.name }}</span>
                                                <Pill class="shadow" v-if="useIsUserRole(user, 'staff')">{{ $t(`user-role-${user.role.toLowerCase()}`) }}</Pill>
                                            </div>
                                            <div v-if="user.email" @click="editEmail(user.email)" class="email">
                                                <a href="#">
                                                    <span>{{ user.email }}</span>
                                                    <Icon class="icon" :name="`fa6-solid:${user.emailVerified ? 'check' : 'envelope'}`" />
                                                </a>
                                            </div>
                                            <div v-else>
                                                <a href="#" @click="editEmail('')">{{ $t('add-an-email-address') }}</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="management-buttons">
                                        <ButtonLink v-if="user.email && !user.emailVerified" @click="editEmail(user.email)" class="shadow" type="primary" icon="fa6-solid:envelope">{{ t('verify-email') }}</ButtonLink>
                                        <ButtonLink v-if="useIsUserRole(user, 'staff')" link="/admin" class="shadow" icon="fa6-solid:gear">{{ t('admin-panel') }}</ButtonLink>
                                        <ButtonLink link="/account/logout" class="shadow"  icon="fa6-solid:person-running">{{ t('link-log-out') }}</ButtonLink>
                                        <ButtonLink @click.capture="deleteAccount()" class="shadow"  type="red" icon="fa6-solid:trash-can">{{ t('delete-account') }}</ButtonLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Tabs class="tabs grid-item" :tabs="tabs" v-model:selected="activeTab">
                            <div v-if="activeTab === 'your-purchases'" class="item-body library">
                                <div v-if="purchases.length">
                                    <div class="purchases-grid">
                                        <div v-for="project in purchases.map(s => projects.find(p => p.slug === s))" class="purchase">
                                            <NuxtLink :to="`/project/${project.slug}`" class="cover shadow">
                                                <ProjectIcon :project="project" size="85px" transparent />
                                            </NuxtLink>
                                            <div class="details">
                                                <h2>{{ project.metadata.name }}</h2>
                                                <p>{{ project.metadata.tagline }}</p>
                                                <div class="buttons">
                                                    <ButtonLink v-if="project.metadata.listDownloads" icon="fa6-solid:download" type="primary" :to="`/project/${project.slug}/download`">{{ $t('link-download') }}</ButtonLink>
                                                    <ButtonLink icon="fa6-solid:info" :to="`/project/${project.slug}`">{{ $t('link-about') }}</ButtonLink>
                                                    <ButtonLink v-if="project.metadata.documentation" icon="fa6-solid:book" :to="`/docs/${project.slug}`">{{ $t('link-docs') }}</ButtonLink>
                                                    <ButtonLink icon="fa6-brands:discord" to="https://discord.gg/tVYhJfyDWG">{{ $t('link-support') }}</ButtonLink>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="notice">
                                        <IconifiedText icon="fa6-solid:box">{{ $t('refresh-purchases-notice') }}</IconifiedText>
                                        <ButtonLink v-if="user.emailVerified" @click="refreshPurchases()" type="primary" icon="fa6-solid:arrows-rotate">{{ $t('link-refresh') }}</ButtonLink>
                                        <ButtonLink v-else @click="editEmail(user.email)" type="primary" icon="fa6-solid:envelope">{{ $t('verify-email') }}</ButtonLink>
                                    </div>
                                </div>
                                <div v-else class="notice">
                                    <IconifiedText icon="fa6-solid:bag-shopping">{{ $t('no-products-notice') }} {{ $t('refresh-purchases-notice') }}</IconifiedText>
                                    <ButtonLink v-if="user.emailVerified" @click="refreshPurchases()" type="primary" icon="fa6-solid:arrows-rotate">{{ $t('link-refresh') }}</ButtonLink>
                                    <ButtonLink v-else @click="editEmail(user.email)" type="primary" icon="fa6-solid:envelope">{{ $t('verify-email') }}</ButtonLink>
                                </div>
                            </div>
                            <div v-if="activeTab === 'your-support-tickets'" class="item-body tickets">
                                <TicketsTable :user="user" />
                            </div>
                        </Tabs>
                    </div>
                </article>
            </div>
        </NuxtLayout>
    </div>
</template>

<script setup>
import { validate } from 'email-validator'

const { locale, t } = useI18n();
const { auth, xsrf } = useAuth();

const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
const ASSETS_URL = useRuntimeConfig().public.ASSETS_BASE_URL;

const user = await useUser();
const projects = await useAllProjects()
const hasRequestedCode = ref(false)
const purchases = ref([]);
purchases.value = user.value.purchases;

const deleteAccount = () => {
    useConfirm(t('delete-account-confirm'), t('delete-account'), async (confirm) => {
        if (!confirm) return;
        try {
            await $fetch(`${BASE_URL}/v1/users/@me`, 
            { 
                method: 'DELETE',
                credentials: auth ? 'include' : 'omit',
                headers: {
                    'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
                    'X-XSRF-TOKEN': xsrf
                }
            });
            navigateTo('/account/logout')
        } catch (err) {
            useAlert('Failed to delete account: ' + err, 'Error');
        }
    })
}

const refreshPurchases = async () => {
    try {
        const refreshed = await $fetch(`${BASE_URL}/v1/users/@me/purchases`, 
        { 
            method: 'GET',
            credentials: auth ? 'include' : 'omit',
            headers: {
                'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
                'X-XSRF-TOKEN': xsrf
            }
        });
        purchases.value = Object.keys(refreshed);
    } catch (err) {
        useAlert('Failed to refresh purchases: ' + err, 'Error');
    }
}

const editEmail = (currentEmail) => {
    if (hasRequestedCode.value) {
        return verifyEmail(currentEmail);
    }
    useInput(t('verify-email-confirm'), t('send-verification-email'), currentEmail, (input) => validate(input), async (confirm, email) => {
        if (!confirm) return;
        try {
            await $fetch(`${BASE_URL}/v1/users/@me/email`, 
            { 
                method: 'POST',
                credentials: auth ? 'include' : 'omit',
                headers: {
                    'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
                    'X-XSRF-TOKEN': xsrf
                },
                body: email
            });
            hasRequestedCode.value = true;
            verifyEmail(email);
        } catch (err) {
            useAlert($t('email-rate-limited-copy'), $t('email-rate-limited'))
        }
    })
}

const verifyEmail = (email, wrongCode = false) => {
    if (wrongCode) {
        hasRequestedCode.value = false
    }
    useInput(!wrongCode ? t('verify-email-sent-to', {'email': email}) : t('verify-email-wrong-code'), t('verify-email'), '', (input) => input?.length == 6, async (confirm, code) => {
        if (!confirm) return;
        try {
            await $fetch(`${BASE_URL}/v1/users/${user.value.id}/email/${code}`, 
            { 
                method: 'GET',
                params: {
                    'redirect': false
                }
            });
            return useAlert(t('email-verified-thank-you'), t('verify-email'), (_) => {
                navigateTo('/account/logout')
            })
        } catch (err) {
            verifyEmail(email, true)
        }
    })
}

const tabs = [
    { id: 'your-purchases', name: t('your-purchases') },
    { id: 'your-support-tickets', name: t('your-support-tickets') }
];
const activeTab = defineModel('activeTab');
activeTab.value = 'your-purchases';

definePageMeta({
    middleware: ['auth']
})
</script>

<style scoped>
#page-content {
    margin-top: 1rem;
}

.account-page {
    width: 1200px;
    max-width: 95vw;
}

.account-grid {
    display: flex;
    flex-direction: column;
}

.account-grid .grid-item {
    display: flex;
    flex-direction: column;
}

.grid-item .item-title {
    margin-top: 0;
    background-color: var(--background);
}

.profile .item-body {
    height: 100%;
}

.profile .management-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    width: 100%;
    align-items: center;
    justify-content: center;
}

.item-body {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}

@keyframes pan {
  0% {
    transform: translate(-50%, 0%)
  }

  100% {
    transform: translate(0%, 0%)
  }
}

.profile .item-title {
    margin-bottom: 0;
}

.profile  {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    background: linear-gradient(180deg, #142B42 0%, #08111B 100%);
    height: 300px;
    border-radius: 0 0 0.5rem 0.5rem;
}

.profile .user-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgb(33, 33, 33, 0.95);
    padding: 1rem;
    width: 40%;
    min-width: 500px;
    border-radius: 0.5rem;
    gap: 1rem;
}

.profile-bg {
    background-image: url('/images/icons/promo-grid.svg');
    animation: pan 60s linear infinite;
    height: 100%;
    width: 200%;
    z-index: -1;
    opacity: 25%;
    position: absolute;
}

.purchases-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 1.5rem;
    margin: 1.5rem 0;
}

.purchases-grid .purchase {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

.purchase .cover {
    width: 100%;
    max-width: 10rem;
    min-width: 5rem;
    aspect-ratio: 10 / 14;
    border-radius: 0.5rem;
    background: linear-gradient(180deg, #142B42 0%, #08111B 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.cover .logo {
    min-width: 50px;
    width: 85px;
    aspect-ratio: 1;
}

.details h2 {
    font-size: larger;
    margin: 0;
}

.details p {
    color: var(--light-gray);
}

.details .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

/* Tablet purchases grid */
@media screen and (max-width: 850px) {
    .purchases-grid {
        display: flex;
        flex-direction: column;
    }
}

/* Mobile user container */
@media screen and (max-width: 550px) {
    .profile-bg {
        visibility: hidden;
    }
    
    .profile {
        height: fit-content !important;
        background: none;
    }

    .profile .user-container {
        width: 100%;
        background-color: transparent;
    }

    /* management buttons */
    .profile .management-buttons {
        flex-direction: column;
        align-items: center;
    }
}

.user-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
}

.user-card .name {
    font-size: 1.4rem;
    font-weight: 700;
}

.user-card .name-role {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
}

.user-card .email a {
    font-family: 'JetBrains Mono', monospace;
    color: var(--light-gray) !important;
}

.user-card .email a .icon {
    color: var(--accent);
}

.user-card .email span {
    padding-right: 0.4rem;
}

.user-card .avatar {
    border-radius: 50%;
    height: 75px;
    width: 75px;
}

.delete-account:hover {
    cursor: pointer;
}

.notice {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    align-items: center;
    justify-content: center;
    margin: 2.5rem auto;
    color: var(--light-gray)
}
</style>