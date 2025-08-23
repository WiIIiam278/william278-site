<template>
    <div>
        <Title>{{ $t(`email-address-${status}-title`) }}</Title>
        <Meta name="description" :content="$t(`email-address-${status}-description`)" />
        <Meta name="og:description" :content="$t(`email-address-${status}-description`)" />
        <Meta name="twitter:description" :content="$t(`email-address-${status}-description`)" />
        <NuxtLayout class="layout">
            <div class="container">
                <h1>{{ $t(`email-address-${status}-title`) }}</h1>
                <Icon v-if="status === 'verified'" class="icon verified" name="fa6-solid:circle-check" />
                <Icon v-else-if="status === 'expired'" class="icon expired" name="fa6-solid:triangle-exclamation" />
                <p class="content">
                    {{ $t(`email-address-${status}-description`) }}
                </p>
                <ButtonLink v-if="auth" class="button" type="primary" to="/account" icon="fa6-solid:user">{{ $t('link-account') }}</ButtonLink>
                <ButtonLink v-else class="button" to="/account/login" icon="fa6-solid:key">{{ $t('link-log-in') }}</ButtonLink>
            </div>
        </NuxtLayout>
    </div>
</template>

<script setup>
const { auth } = await useAuth();
const { status } = useRoute()?.query;
if (!status || !['verified', 'expired'].includes(status)) {
    await navigateTo('/')
}
</script>

<style scoped>
h1, .content, .icon {
    text-align: center;
}

.container {
    margin: 2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.icon {
    margin-top: 1rem;
    font-size: 4rem;
}

.icon.verified {
    color: var(--accent);
}

.icon.expired {
    color: gold;
}

.content {
    align-content: center;
    text-align: center;
    max-width: 500px;
    color: var(--light-gray)
}

.button {
    margin: 1rem 0;
}
</style>