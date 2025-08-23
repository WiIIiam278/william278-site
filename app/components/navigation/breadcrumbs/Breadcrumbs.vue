<template>
    <div class="breadcrumbs">
        <div v-for="crumb of crumbs">
            <NuxtLink class="crumb-link" :to="crumb.link">{{ crumb.name }}</NuxtLink>
            <BreadcrumbDivider />
        </div>
    </div>
</template>

<script setup>
const { crumbs } = defineProps({
    crumbs: {
        type: Array,
        required: true
    }
})
</script>

<style scoped>
.breadcrumbs {
    display: flex;
    flex-direction: row;
    margin: 0.5rem 0;
}
</style>