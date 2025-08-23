<template>
    <div v-if="button1Url?.length || button2Url.length" :class="`button-pair ${centered ? 'centered' : 'decentered'}`">
        <ButtonLink v-if="button1Url?.length" type="primary" :link="button1Url" :icon="button1Icon">{{ button1Label }}</ButtonLink>
        <ButtonLink v-if="button2Url?.length" :link="button2Url" :icon="button2Icon">{{ button2Label }}</ButtonLink>
    </div>
</template>

<script setup>
const { button1Label, button1Icon, button1Url, button2Label, button2Icon, button2Url, centered } = defineProps({
    centered: { type: Boolean, required: false, default: true },
    button1Label: { type: String, required: false }, button1Icon: { type: String, required: false }, button1Url: { type: String, required: false },
    button2Label: { type: String, required: false }, button2Icon: { type: String, required: false }, button2Url: { type: String, required: false },
});
</script>

<style scoped>
.button-pair {
    display: flex;
    width: 100%;
    margin: 1.5rem 0;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
}

.button-pair.decentered {
    justify-content: flex-start !important;
}

@media screen and (max-width: 400px) {
    .button-pair {
        flex-direction: column;
    }
}
</style>