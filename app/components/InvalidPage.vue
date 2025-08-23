<template>
    <div class="invalid-page">{{ name }}</div>
</template>

<script setup>
const { name } = defineProps({
    name: {
        type: String,
        required: true
    }
})
</script>

<style scoped>
.invalid-page {
    color: var(--light-gray);
    display: inline;
    margin: 0 0;
    text-decoration: line-through;
    max-width: 10rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>