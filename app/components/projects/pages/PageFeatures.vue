<template>
    <div class="features">
        <div class="feature" v-if="feature1Title?.length">
            <div class="icon-container shadow" :style="`background-color: ${iconBackgroundColor1}; background: linear-gradient(180deg, ${iconBackgroundColor1} 0%, ${iconBackgroundColor2} 100%);`">
                <Icon class="icon" v-if="feature1Icon?.length" :name="feature1Icon" />
            </div>
            <MDC :value="feature1Title" tag="h2" unwrap="p" />
            <MDC class="body" v-if="feature1Body?.length" :value="feature1Body" tag="div" unwrap="p" />
        </div>
        <div class="feature" v-if="feature2Title?.length">
            <div class="icon-container shadow" :style="`background-color: ${iconBackgroundColor1}; background: linear-gradient(180deg, ${iconBackgroundColor1} 0%, ${iconBackgroundColor2} 100%);`">
                <Icon class="icon" v-if="feature2Icon?.length" :name="feature2Icon" />
            </div>
            <MDC :value="feature2Title" tag="h2" unwrap="p" />
            <MDC class="body" v-if="feature2Body?.length" :value="feature2Body" tag="div" unwrap="p" />
        </div>
        <div class="feature" v-if="feature3Title?.length">
            <div class="icon-container shadow" :style="`background-color: ${iconBackgroundColor1}; background: linear-gradient(180deg, ${iconBackgroundColor1} 0%, ${iconBackgroundColor2} 100%);`">
                <Icon class="icon" v-if="feature3Icon?.length" :name="feature3Icon" />
            </div>
            <MDC :value="feature3Title" tag="h2" unwrap="p" />
            <MDC class="body" v-if="feature3Body?.length" :value="feature3Body" tag="div" unwrap="p" />
        </div>
    </div>
</template>

<script setup>
const { 
    iconBackgroundColor1, iconBackgroundColor2,
    feature1Title, feature1Icon, feature1Body,
    feature2Title, feature2Icon, feature2Body,
    feature3Title, feature3Icon, feature3Body 
} = defineProps({
    iconBackgroundColor1: { type: String, default: 'transparent' }, iconBackgroundColor2: { type: String, default: 'transparent' },
    feature1Title: { type: String }, feature1Icon: { type: String }, feature1Body: { type: String },
    feature2Title: { type: String }, feature2Icon: { type: String }, feature2Body: { type: String },
    feature3Title: { type: String }, feature3Icon: { type: String }, feature3Body: { type: String } 
})
</script>

<style scoped>
.features {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
    margin: 2rem 0;
    margin-bottom: 3rem;
}

.features .feature {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 1rem 0;
    width: 30%;
}

.feature:deep(h2) {
    border: none;
    margin: 0.5rem 0;
}

.feature .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    width: 4rem;
    height: 4rem;
}

.feature .icon-container .icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    padding-top: 0.3rem;
}

.feature:deep(.body) {
    text-align: center;
    color: var(--light-gray)
}

@media screen and (max-width: 800px) {
    .features {
        flex-direction: column;
    }

    .features .feature {
        width: 100%;
    }
}
</style>