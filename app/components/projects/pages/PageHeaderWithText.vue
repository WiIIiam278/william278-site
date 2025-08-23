<template>
    <div class="container">
        <MDC v-if="title?.length" :value="title" tag="h1" unwrap="p" />
        <MDC v-if="body?.length" :value="body" tag="p" unwrap="p" />
        <slot />
    </div>
</template>

<script setup>
const { 
    title, body, color1, color2
} = defineProps({
    title: { type: String, required: false, default: '' },
    body: { type: String, required: false, default: '' }
})
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;
}

.container:deep(h1) {
    border: none !important;
    color: var(--white);
    font-size: 2rem;
    margin: 0;
    text-align: center;
}

.container:deep(p) {
    margin-top: 1rem;
    text-align: center;
    max-width: 65%;
}
</style>

