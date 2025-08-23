<template>
    <div>
        <NuxtLayout name="sidebar">
            <div id="page-content">
                <article class="admin-page">
                    <Breadcrumbs :crumbs="[{ name: $t('link-home'), link: '/' }]" />
                    <h1>{{ tabs.find(t => t.id === activeTab)?.name ?? $t('admin-panel') }}</h1>
                    <div v-if="activeTab === 'dashboard'">
                        <AdminDashboard />
                    </div>
                    <div v-if="activeTab === 'projects'">
                        <ProjectEditor />
                    </div>
                    <div v-if="activeTab === 'pages'">
                        <ProjectPageEditor />
                    </div>
                    <div v-if="activeTab === 'upload'">
                        <VersionUploader />
                    </div>
                    <div v-if="activeTab === 'users'">
                        <UsersTable :user="user" @show-tickets="showUserTickets" :searchPrefill="searchPrefill" />
                    </div>
                    <div v-if="activeTab === 'tickets'">
                        <TicketsTable @show-user="showUser" :searchPrefill="searchPrefill" />
                    </div>
                    <div v-if="activeTab === 'transactions'">
                        <TransactionsTable @show-user="showUser" />
                    </div>
                    <div v-if="activeTab === 'assets'">
                        <AssetManager />
                    </div>
                </article>
            </div>
            <template #sidebar>
                <div class="sidebar">
                    <h1>{{ $t('admin-panel') }}</h1>
                    <div class="links">
                        <div v-for="tab in tabs" :class="`link link-section ${tab.id === activeTab ? 'selected' : ''}`">
                            <div class="name-link" @click="changeTab(tab.id)">
                                <div class="page-name">
                                    <Icon class="icon" :name="tab.icon" />
                                    <span class="title">{{ tab.name }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup>
const user = await useUser();
const activeTab = defineModel('activeTab')
const searchPrefill = defineModel('')

const tabs = [];
if (useIsUserRole(user.value, 'staff')) {
    tabs.unshift({ id: 'tickets', name: 'Tickets', icon: 'fa6-solid:ticket', path: '/admin#tickets' })
    tabs.unshift({ id: 'users', name: 'Users', icon: 'fa6-solid:user', path: '/admin#users' })
    tabs.unshift({ id: 'assets', name: 'Assets', icon: 'fa6-solid:image', path: '/admin#assets' })
    activeTab.value = 'tickets'
}
if (useIsUserRole(user.value, 'admin')) {
    tabs.unshift({ id: 'transactions', name: 'Transactions', icon: 'mdi:coins', path: '/admin#transactions' })
    tabs.unshift({ id: 'upload', name: 'Upload', icon: 'mdi:upload', path: '/admin#upload' })
    tabs.unshift({ id: 'pages', name: 'Pages', icon: 'mdi:globe', path: '/admin#pages' })
    tabs.unshift({ id: 'projects', name: 'Projects', icon: 'fa6-solid:star', path: '/admin#projects' })
    tabs.unshift({ id: 'dashboard', name: 'Dashboard', icon: 'mdi:chart-line', path: '/admin#dashboard' })
    activeTab.value = 'dashboard'
}

definePageMeta({
    middleware: ['staff']
})

const changeTab = (tab) => {
    activeTab.value = tab;
    searchPrefill.value = '';
}

const showUserTickets = (user) => {
    activeTab.value = 'tickets'
    searchPrefill.value = user;
}

const showUser = (user) => {
    activeTab.value = 'users'
    searchPrefill.value = user;
}
</script>

<style scoped>
.admin-page {
    margin-bottom: 2rem;
}

.sidebar h1 {
    border: none;
    text-align: center;
    margin: 0.5rem 0;
    font-size: 1.5rem;
}

.sidebar h2 {
    margin-bottom: 0.75rem;
    font-size: 1.3rem;
}

.link {
    border-top: 0.125rem solid var(--gray);
    color: var(--accent);
    cursor: pointer;
}

.link .title {
    padding: 0.25rem 0;
}

.link-section {
    padding: 0 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.link-section:hover {
    filter: brightness(100%);
    background-color: var(--gray);
    transition: ease-in-out 0.1s;
}

.link-section .name-link {
    width: 100%
}

.page-name {
    padding: 0.7rem 0;
}

.page-name:hover {
    text-decoration: underline;
}

.selected {
    background-color: var(--gray);
    color: var(--white);
}

.page-name .icon {
    margin-right: 0.75rem;
    font-size: 1.2rem;
}
</style>