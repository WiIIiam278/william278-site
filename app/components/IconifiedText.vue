<template>
    <div class="iconified-text">
        <Icon :name="icon" class="icon" />
        <span class="text">
            <slot />
        </span>
    </div>
</template>

<style scoped>
.iconified-text {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}

.iconified-text .icon {
    font-size: 115%;
    margin-right: 0.175rem;
    margin-bottom: 0.1rem;
}

.iconified-text .text {
    margin-left: 0.175rem;
    font-style: normal;
}
</style>

<script>
export default {
    name: 'IconifiedText',
    props: {
        icon: {
            type: String,
            required: true,
        }
    }
}
</script>