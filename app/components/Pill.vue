<template>
    <span :class="`pill ${color}`">
        <slot />
    </span>
</template>

<style scoped>
.pill {
    padding: 0.2rem 0.4rem;
    border-radius: 0.5rem;
    white-space: nowrap;
    margin: 0 0.15rem;
    width: fit-content;
}

.light-gray {
    background-color: var(--gray);
}

.dark-gray {
    background-color: var(--dark-gray);
}
</style>

<script setup>
const { color} = defineProps({
    color: {
        type: String,
        required: false,
        default: 'light-gray'
    }
})
</script>