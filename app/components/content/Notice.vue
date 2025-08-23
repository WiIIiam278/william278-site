<template>
    <blockquote :class="`notice ${type}`">
        <IconifiedText :icon="getIcon(type)">
            <span class="title">{{ title }}</span>
        </IconifiedText>
        <span class="body">
            <slot :use="$slots.default" mdc-unwrap="p" />
        </span>
    </blockquote>
</template>

<script setup>

const { title, type } = defineProps({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'info'
    }
});

const getIcon = (type) => type === 'info' ? 'fa6-solid:circle-info' : 'fa6-solid:triangle-exclamation'
</script>

<style scoped>
.notice {
    padding: 0.5rem;
    margin-top: 0;
}

.title {
    margin-right: 0.5rem;
    font-weight: 600;
}

.body {
    color: var(--light-gray) !important;
}

.info {
    color: skyblue !important;
}

.warning {
    color: gold !important;
}
</style>