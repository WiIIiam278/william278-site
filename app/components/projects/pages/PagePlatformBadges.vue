<template>
    <div class="badges" v-if="meta.links">
        <PlatformBadge class="badge" v-for="link in meta.links.slice(badgeRangeStart, badgeRangeEnd)" 
            :platform="link.id" :link="link.url" type="platform"
        />
    </div>
</template>

<script setup>
const { project, badgeRangeStart, badgeRangeEnd } = defineProps({
    project: {
        type: Object,
        required: true
    },
    badgeRangeStart: {
        type: Number,
        required: false,
        default: 0
    },
    badgeRangeEnd: {
        type: Number,
        required: false,
        default: 5
    }
})
const { metadata: meta } = project;
</script>

<style scoped>
.badges {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin: 2rem 0;
}
</style>