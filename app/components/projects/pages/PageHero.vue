<template>
    <div class="hero shadow" :style="`background-color: ${color1}; background: linear-gradient(180deg, ${color1} 0%, ${color2} 100%);`">
        <PageHeaderWithText class="header" :title="title ?? project.metadata.name" :body="body">
            <slot />
        </PageHeaderWithText>
    </div>
</template>

<script setup>
const { 
    project, title, body, color1, color2
} = defineProps({
    project: { type: Object, required: true },
    title: { type: String, required: false, default: '' },
    body: { type: String, required: false, default: '' },
    color1: { type: String, required: false, default: 'transparent' },
    color2: { type: String, required: false, default: 'transparent' },
})
</script>

<style scoped>
.hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    min-height: 13.5rem;
    width: 100%;
}

.hero .header {
    margin-top: 1rem;
}
</style>