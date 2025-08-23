<template>
    <Pill :class="`${isSelected ? 'selected' : ''} ${isClickable ? 'clickable' : ''}`" v-on:click="onSelected" >
        {{ tag }}
    </Pill>
</template>

<script setup>
import Pill from './Pill.vue'

const { tag, showIcon, isClickable, isSelected } = defineProps({
    tag: {
        type: String,
        required: true
    },
    isClickable: {
        type: Boolean,
        default: false
    },
    isSelected: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['selected'])

const onSelected = () => {
    if (isClickable) {
        emit('selected', tag);
    }
}
</script>

<style scoped>
.clickable {
    cursor: pointer;
    border: 0.15rem solid transparent;
}

.clickable:hover {
    background-color: var(--dark-gray);
}

.selected {
    border: 0.125rem solid var(--light-gray);
}
</style>