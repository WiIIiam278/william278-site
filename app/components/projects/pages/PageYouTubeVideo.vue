<template>
    <div class="container">
        <iframe class="video shadow" type="text/html" width="640" height="360" frameborder="0"
                :src="`https://www.youtube.com/embed/${videoId}?color=white&disablekb=1&playsinline=0&rel=0`">
        </iframe>
    </div>
</template>

<script setup>
const { videoId } = defineProps({
    videoId: {
        type: String,
        required: true
    }
})
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: auto;
    margin: 1.5rem 0;
}

.container .video {
    border-radius: 0.5rem;
}
</style>