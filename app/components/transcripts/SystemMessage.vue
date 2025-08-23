<template>
    <div class="system-message">
        <Icon class="icon" :name="icon" />
        <span><slot /></span>
    </div>
</template>

<style scoped>
.system-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: var(--light-gray);
    margin: 0.5rem 0;
}

.icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
}
</style>

<script>
export default {
    props: {
        icon: {
            type: String,
            required: false,
            default: 'fa6-solid:ticket',
        }
    }
}
</script>