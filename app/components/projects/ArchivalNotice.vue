<template>
    <div class="archived">
        <Icon class="icon" name="fa6-solid:box-archive" />
        <span class="text">
            {{ $t('project-archived-header', {'project': name}) }}
            <span class=grayed>{{$t('project-archived-details')}}</span>
        </span>
    </div>
</template>

<script setup>
const { t } = useI18n()
const { name } = defineProps({
    name: {
        required: true,
        type: String
    }
})
</script>

<style scoped>
.archived {
    display: flex;
    align-items: center;
    padding: 1rem;
    color: var(--light-gray);
    border: 0.2rem solid var(--light-gray);
    border-radius: 0.5rem;
    margin-bottom: 1rem;
}

.archived .icon {
    font-size: 2rem;
    margin-right: 1rem;
}
</style>