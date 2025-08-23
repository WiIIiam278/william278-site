<template>
    <div v-if="projects?.length && slides?.length" class="gallery shadow" @mouseover="hovering = true" @mouseleave="hovering = false">
        <div v-for="(slide, index) in slides" class="gallery-item" :key="index"
            :style="`transform: translateY(-${slideOffset}%); z-index: ${index + 1};`">
            <PageAsset class="image" placeholder="/images/placeholder-banner.png" :src="slide.img" :alt="slide.alt" sizes="md:550px sm:300px" @click="navigateTo(slide.link)" />
        </div>
        <div class="button">
            <NuxtLink class="link shadow" :to="slides[slide].link">{{ slides[slide].name }}</NuxtLink>
        </div>
        <div class="progress-pips">
            <div v-for="(_, index) in slides" @click="slide = index" :class="`pip ${slide === index ? 'selected' : ''}`"></div>
        </div>
    </div>
    <div v-else class="gallery pulsing"></div>
</template>

<script setup>
const { projects, speed } = defineProps({
    projects: {
        type: Array,
        required: true
    },
    speed: {
        type: Number,
        required: false,
        default: 7500
    }
})

// Determine slides
const hovering = ref(false);
const slide = ref(0);
const slideOffset = computed(() => slide.value * 100)
const slides = computed(() => (projects ?? [])
    .filter((proj) => useProjectProperty(proj, 'showcase_image'))
    .map((proj) => {
        return { 
            img: useProjectProperty(proj, 'showcase_image'), 
            link: `/project/${proj.slug}`, 
            name: proj.metadata.name,
            alt: useProjectProperty(proj, 'showcase_alt_text') ?? proj.metadata.tagline
        }
    }));

// Slide switching beahviour
const nextSlide = () => slide.value < slides.length - 1 ? (slide.value++) : (slide.value = 0);
if (slides.length > 1) {
    onMounted(() => setInterval(() => !hovering.value ? nextSlide() : {}, speed));
}
</script>

<style scoped>
.gallery {
    overflow: hidden;
    width: 100%;
    height: 200px;
    position: relative;
    border-radius: 0.5rem;
    cursor: pointer;
}

.gallery .gallery-item {
    transition: transform 0.5s ease;
}

.gallery-item .image {
    width: 100%;
    height: 100vh;
    object-fit: cover;
    max-height: 200px;
    border-radius: 0.5rem;
}

.gallery .button {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1.25rem 0.8rem;
    width: 100%;
}

.button .link {
    font-size: 1.2rem;
    font-weight: bold;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 0.5rem 0.5rem;
    border-radius: 0.5rem;
}

.gallery .progress-pips {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-right: auto;
    right: 1rem;
    top: 0;
    height: 200px;
}

.progress-pips .pip {
    cursor: pointer;
    width: 1rem;
    height: 1rem;
    background-color: rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    border-radius: 50%;
}

.pip.selected {
    border: 0.15rem solid var(--gray);
}

.pip:hover {
    border: 0.15rem solid var(--accent);
}
</style>