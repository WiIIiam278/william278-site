<template>
    <NuxtImg v-if="icon?.length" :src="`${ASSETS_URL}/${icon}`" :width="size" :height="size" format="webp" fit="fill"
        :placeholder="`/images/placeholder-${transparent ? 'icon-transparent' : 'icon'}.png`" />
</template>

<script setup>
const ASSETS_URL = useRuntimeConfig().public.ASSETS_BASE_URL;
const { project, size, sizes, transparent } = defineProps({
    project: {
        type: Object,
        required: true
    },
    size: {
        type: String,
        required: false,
        default: null
    },
    transparent: {
        type: Boolean,
        required: false,
        default: false
    }
});
const { metadata: meta } = project;

// Determine icon
const icon = ref(null);
if (transparent) {
    icon.value =  meta.icons['PNG_TRANSPARENT'];
    icon.value = !icon.value?.length ? meta.icons['SVG_TRANSPARENT'] : icon.value;
}
icon.value = !icon.value?.length ? meta.icons['PNG'] : icon.value;
icon.value = !icon.value?.length ? meta.icons['SVG'] : icon.value;
</script>