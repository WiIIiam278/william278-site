<template>
    <NuxtLink v-if="!$slots.default && icon" :to="link ?? '#'">
        <Icon :name="icon" class="button-icon" />
    </NuxtLink>
    <NuxtLink v-else :to="link">
        <button :class="`${type}`">
            <span v-if="icon">
                <IconifiedText :icon="icon">
                    <slot :use="$slots.default" mdc-unwrap="p" />
                </IconifiedText>
            </span>
            <span v-else>
                <slot :use="$slots.default" mdc-unwrap="p" />
            </span>
        </button>
    </NuxtLink>
</template>

<script setup>
const { link, icon, type } = defineProps({
    link: {
        type: String,
        required: false
    },
    icon: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false,
        default: ''
    }
});
</script>

<style scoped>
a {
    text-decoration: none !important;
}

a .button-icon {
    margin-top: 0.15rem;
    font-size: 1.6rem;
}
</style>