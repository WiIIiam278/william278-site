<template>
    <div>
        <ErrorPage code="404">
            {{ $t('error-page-not-found') }}
        </ErrorPage>
    </div>
</template>

<script setup>
const { locale, t } = useI18n()
const localePath = useLocalePath()
</script>
