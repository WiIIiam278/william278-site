<template>
    <div>
        <NuxtLayout>
            <h1>Logging in...</h1>
        </NuxtLayout>
    </div>
</template>

<script setup>
definePageMeta({
    title: computed(() => t('account-title')),
    description: computed(() => t('account-description')),
    middleware: ['login']
})
</script>