<template>
    <div class="container">
        <PageAsset :class="`${shadow === 'true' ? 'shadow' : ''}`" :src="image" :alt="alt" width="100%" />
    </div>
</template>

<script setup>
const { image, alt, shadow } = defineProps({
    image: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        required: false,
        default: null
    },
    shadow: {
        type: String,
        required: false,
        default: 'true'
    }
})
</script>

<style scoped>
.container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>