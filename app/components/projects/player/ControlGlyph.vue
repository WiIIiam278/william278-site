<template>
        <NuxtImg :src="`/images/controller/${id}`" width="32px" height="32px" :alt="`${name} Glyph`" class="glyph" />
</template>

<script setup>
const { id, name } = defineProps({
    id: String,
    name: String
});
</script>

<style scoped>
.glyph {
    width: 2rem;
    height: 2rem;
    margin: 0 0.25rem;
}
</style>