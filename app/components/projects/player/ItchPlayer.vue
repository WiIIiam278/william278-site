<template>
    <div class="shadow frame">
        <iframe v-if="playing"
            :src="gameUrl"  frameBorder="0" scrolling="no"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen allowTransparency>
        </iframe>
        <div v-else class="start" :style="`background: ${coverBg ? `url(${coverBg})` : 'none'}`">
            <button class="primary" @click="playing = true">
                <Icon name="fa6-solid:play" />
            </button>
        </div>
    </div>
</template>

<script setup>
const { gameUrl, coverBg } = defineProps({
    gameUrl: {
        type: String,
        required: true
    },
    coverBg: {
        type: String,
        required: false
    }
});
const playing = ref(false);
</script>

<style scoped>
.frame {
    background-color: var(--gray) !important;
    max-width: 960px !important;
    max-height: 540px !important;
    width: 100%;
    height: 100vh;
}

.frame iframe {
    border-radius: 0.5rem;
    width: 100% !important;
    height: 100% !important;
}

.start {
    height: 100%;
    width: 100%;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
    filter: brightness(80%);
}

.start button {
    font-size: 2rem;
    width: 90px;
    height: 90px;
    padding-bottom: 1rem;
    border: 0.15rem solid #333333 !important;
    border-radius: 0.5rem;
    background: #191919;
    background: linear-gradient(#2b2b2b, #00fb9b35);
    box-shadow: 0 0 0.75rem rgba(0, 0, 0, 0.2);
}

.start button:hover {
    background: #191919 !important;
    background: linear-gradient(#2b2b2b, #00fb9b35) !important;
    border: 0.15rem solid #00fb9a !important;
    box-shadow: none !important;
}
</style>