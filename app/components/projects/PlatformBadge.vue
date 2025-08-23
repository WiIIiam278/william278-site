<template>
    <a :href="link" :title="`${verb} ${name}`" target="_blank">
        <NuxtImg placeholder="/images/placeholder-badge.png" :src="`/images/badges/${type}/${platform}.svg`" height="60px" format="webp" />
    </a>
</template>

<script setup>
const { platform, link, type } = defineProps({
    platform: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'platform'
    },
    link: {
        type: String,
        required: true
    }
})

// Format alt-text
const name = useCapitalized(platform);
const verb = ref(useCapitalized(type))
if (verb.value === 'Platform') {
    verb.value = 'Available on';
} else if (verb.value === 'Compatibility') {
    verb.value = 'Available for';
}
</script>