<template>
    <div>
        <NuxtLayout>
            <h1>Logging out...</h1>
        </NuxtLayout>
    </div>
</template>

<script setup>
definePageMeta({
    title: computed(() => t('account-title')),
    description: computed(() => t('account-description')),
    middleware: ['logout']
})
</script>