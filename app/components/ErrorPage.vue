<template>
    <div class="error-page">
        <h1>{{ $t('error-page-title', { 'code': code }) }}</h1>
        <div class="content">
            <slot />
        </div>
        <ButtonLink @click="clearError({ redirect: backLink })" to="#" type="red" icon="fa6-solid:chevron-left">{{ $t('link-back') }}</ButtonLink>
    </div>
</template>

<script setup>
const { t } = useI18n();
const { code, backLink } = defineProps({
    code: {
        type: String,
        required: false,
        default: '404'
    },
    backLink: {
        type: String,
        required: false,
        default: '/'
    }
});
</script>

<style scoped>
.error-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 1.5rem 0;
}

.error-page .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
    margin-top: 1rem;
    margin-bottom: 2rem;
}
</style>