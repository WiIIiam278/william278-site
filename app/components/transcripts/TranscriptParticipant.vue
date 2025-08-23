<template>
    <div class="transcript-participant">
        <div class="avatar" v-if="user.pfp">
            <NuxtImg :src="user.pfp" width="32px" height="32px" />
        </div>
        <div class="profile">
            <div class="name">
                {{ user.name }}
            </div>
            <Pill v-if="creator" class="creator">{{ $t('ticket-transcript-creator') }}</Pill>
        </div>
    </div>
</template>

<script setup>
const { locale, t } = useI18n()
const localePath = useLocalePath()

const { user, creator } = defineProps({
    user: {
        type: Object,
        required: true
    },
    creator: {
        type: Boolean,
        required: false,
        default: false
    }
});
</script>

<style scoped>
.transcript-participant {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
}

.transcript-participant .avatar {
    display: flex;
    align-items: center;
}

.avatar img {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
}

.profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.profile .creator {
    font-size: 0.85rem;
    margin-top: 0.1rem;
    margin-left: 0;
    align-self: flex-start;
}

.creator span {
    margin: 0;
}

.profile .disambiguator {
    color: var(--light-gray);
}
</style>