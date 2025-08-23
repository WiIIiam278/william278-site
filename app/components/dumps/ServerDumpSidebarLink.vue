<template>
    <div class="link">
        <div @click="$emit('select')" :class="`link-section ${selected ? 'selected' : ''}`">
            <div class="name-link">
                <div class="page-name">
                    <Icon class="icon" :name="icon" />
                    <span class="title">{{ title }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { selected, title, icon } = defineProps({
    selected: {
        required: false,
        type: Boolean,
        default: false
    },
    title: {
        required: false,
        type: String,
        default: false
    },
    icon: {
        required: false,
        type: String,
        default: false
    }
});
const emit = defineEmits(['select'])
</script>

<style scoped>
.link {
    border-top: 0.125rem solid var(--gray);
    color: var(--accent);
    cursor: pointer;
}

.link .title {
    padding: 0.25rem 0;
}

.link-section {
    padding: 0 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.link-section:hover {
    filter: brightness(100%);
    background-color: var(--gray);
    transition: ease-in-out 0.1s;
}

.link-section .name-link {
    width: 100%
}

.page-name {
    padding: 0.7rem 0;
}

.page-name:hover {
    text-decoration: underline;
}

.selected {
    background-color: var(--gray);
    color: var(--white);
}

.page-name .icon {
    margin-right: 0.75rem;
    font-size: 1.2rem;
}
</style>