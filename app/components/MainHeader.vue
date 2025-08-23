<template>
    <div class="main-header">
        <div class="header-text">
            <h1>{{ title }}</h1>
            <p v-if="tagline" class="tagline">{{ tagline }}</p>
        </div>
        <NuxtImg v-if="icon" :src="icon" width="64px" height="64px" class="head-graphic shadow" alt="Logo" />
    </div>
</template>

<style scoped>
.main-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.main-header .header-text {
    display: flex;
    flex-direction: column;
}

.header-text h1 {
    margin: 0;
}

.header-text p {
    margin: 0;
    font-size: large;
}

.head-graphic {
    display: flex;
    justify-content: flex-end;
    border-radius: 0.5em;
    width: 64px;
    height: 64px;
}
</style>

<script setup>
const { title, tagline, icon } = defineProps({
    title: {
        type: String,
        required: true
    },
    tagline: {
        type: String,
        required: false,
    },
    icon: {
        type: String,
        required: false
    }
})
</script>