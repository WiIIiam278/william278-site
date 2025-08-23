<template>
    <div id="links">
        <ul>
            <li id="search">
                <AlgoliaDocSearch :translations="{'button': {'buttonText': t('search-button'), 'buttonAriaLabel': t('search-button')}}" />
            </li>
            <li>
                <NuxtLink to="/docs">
                    <IconifiedText icon="fa6-solid:book">{{ $t('link-docs') }}</IconifiedText>
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="https://discord.gg/tVYhJfyDWG" target="_blank">
                    <IconifiedText icon="fa6-brands:discord">{{ $t('link-support') }}</IconifiedText>
                </NuxtLink>
            </li>
            <li v-if="user && useIsUserRole(user, 'staff')">
                <NuxtLink to="/admin">
                    <IconifiedText icon="fa6-solid:gear">{{ $t('link-admin') }}</IconifiedText>
                </NuxtLink>
            </li>
            <li v-if="user">
                <NuxtLink class="account-link" to="/account">
                    <NuxtImg v-if="user?.avatar" class="shadow avatar" width="32px" height="32px"
                        placeholder="/images/placeholder-avatar.png"
                        :src="user.avatar" :alt="`${user.name} Discord avatar`" />
                    <span>{{ $t('link-account') }}</span>
                </NuxtLink>
            </li>
            <li v-else>
                <NuxtLink to="/account/login">
                    <IconifiedText icon="fa6-solid:key">{{ $t('link-log-in') }}</IconifiedText>
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>

<script setup>
const user = await useUser()
const { t } = useI18n()
</script>

<style scoped>

#search {
    all: unset;
    display: flex;
    margin-right: 0.75rem;
}

#links ul {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin: 0;
    padding: 0;
    list-style: none;
    white-space: nowrap !important;
}

.account-link {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
}

.account-link img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
}

@media screen and (max-width: 500px) {
    #links {
        padding-top: 1.5rem;
        width: 85vw;
    }

    #links ul {
        flex-direction: column-reverse;
        width: 100%;
        gap: 1.5rem;
        font-size: 1.3rem;
        font-weight: 500;
    }

    #links ul li, #search {
        width: 100% !important;
    }

    .account-link {
        gap: 0.4rem;
    }

    .account-link .avatar {
        width: 24px !important;
        height: 24px !important;
    }

    #search {
        padding-top: 0.6rem;
    }
}
</style>