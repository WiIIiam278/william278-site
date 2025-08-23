<template>
    <li class="mapping">
        <ControlGlyph v-if="control && buttonGlyph" :id="buttonGlyph" :name="control" />
        <div v-else>{{ control }}</div>:
        <ControlGlyph v-if="control && keyGlyph" :id="keyGlyph" :name="mapping" />
        <div v-else>&nbsp;{{ mapping }}</div>
    </li>
</template>

<script setup>  
const { control, mapping } = defineProps({
    control: {
        type: String,
        required: true
    },
    mapping: {
        type: String,
        required: true
    }
});

const buttonGlyph = computed(() => {
    if (control.indexOf('!') === 0) {
        return `button-${control.substring(1).toLowerCase()}.png`;
    }
    return null;
});

const keyGlyph = computed(() => {
    if (mapping.indexOf('!') === 0) {
        return `key-${mapping.substring(1).toLowerCase()}.png`;
    }
    return null;
});
</script>

<style scoped>
.mapping {
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>