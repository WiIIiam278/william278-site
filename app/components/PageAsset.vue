<template>
    <video v-if="isVideo" preload="true" autoplay muted loop playsinline
        :style="`width: ${width}; height: ${height}`">
        <source :src="url">
    </video>
    <NuxtImg v-else :class="pickerMode ? 'cursor' : ''" :src="url"
        :width="width" :height="height" :sizes="sizes" :alt="alt"/>
</template>

<script setup>
const ASSETS_URL = useRuntimeConfig().public.ASSETS_BASE_URL;
const { src, alt, width, height, sizes } = defineProps({
    src: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        required: false,
        default: null
    },
    width: {
        type: String,
        required: false,
        default: null
    },
    height: {
        type: String,
        required: false,
        default: null
    },
    sizes: {
        type: String,
        required: false,
        default: null
    },
});

const KNOWN_VIDEO_TYPES = ['MP4', 'AVI', 'MOV', 'WMV', 'MKV', 'FLV', 'MPEG', '3GP']
const URL_PATTERN = new RegExp("^(http|https)://", "i");

const isVideo = KNOWN_VIDEO_TYPES.find(v => src.toLowerCase().endsWith(v.toLowerCase()));
const isExternal = URL_PATTERN.test(src);
const url = isExternal ? src : `${ASSETS_URL}/${src}`;
</script>