<template>
    <div>
        <h1>{{ $t('ticket-transcript-header') }}</h1>
        <div class="pills">
            <Pill>
                <IconifiedText icon="fa6-solid:tag">
                    {{ data.ticket.project ? data.ticket.project : 'Unknown' }}
                </IconifiedText>
            </Pill>
            <Pill>
                <IconifiedText icon="fa6-solid:hashtag">ticket-{{ data.ticket.id }}</IconifiedText>
            </Pill>
            <Pill>
                <IconifiedText icon="fa6-solid:ticket">
                    {{ useTimeFormat(parseInt(data.ticket.open_timestamp * 1000), true) }}
                </IconifiedText>
            </Pill>
            <Pill>
                <IconifiedText icon="fa6-solid:lock">
                    {{ useTimeFormat(parseInt(data.ticket.open_timestamp * 1000), true) }}
                </IconifiedText>
            </Pill>
        </div>
        <h2>{{ $t('ticket-transcript-topic') }}</h2>
        <div class="topic">
            {{ data.ticket.topic }}
        </div>
        <h2>{{ $t('ticket-transcript-participants') }}</h2>
        <div class="participants">
            <div v-for="participant of data.ticket.participants">
                <TranscriptParticipant :user="getParticipant(participant)" :creator="participant === data.ticket.creator" />
            </div>
        </div>
        <div class="login-reminder" v-if="!auth">{{ t('log-in-to-view-tickets') }}</div>
        <div class="transcript-buttons">
            <ButtonLink v-if="auth" link="/account#your-support-tickets" icon="fa6-solid:ticket" >{{ t('link-tickets') }}</ButtonLink>
            <ButtonLink v-else link="/account/login" icon="fa6-solid:key" >{{ $t('link-log-in') }}</ButtonLink>
            <ButtonLink :link="url" icon="fa6-solid:download" >{{ $t('ticket-transcript-download') }}</ButtonLink>
        </div>
    </div>
</template>

<script setup>
const { t } = useI18n()
const { auth } = await useAuth();

const { data } = defineProps({
    data: {
        type: Object,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

const getParticipant = (id) => {
    if (data.users) {
        for (const user of data.users) {
            if (user.id && user.id === id) {
                return user;
            }
        }
    }
    return {
        id: id,
        name: 'Unknown',
        disambiguator: '0000',
        pfp: 'https://cdn.discordapp.com/embed/avatars/1.png'
    };
}
</script>

<style scoped>
.pills {
    font-size: 0.9em !important;
    flex-direction: row;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
}

.pills span {
    margin: 0;
}

h1 {
    border: none;
    text-align: center;
    margin: 0.5rem 0;
    font-size: 1.5rem;
}

h2 {
    margin-bottom: 0.75rem;
    font-size: 1.3rem;
}

.topic {
    word-break: break-word;
    white-space: pre-wrap;
    overflow-y: auto;
    max-height: 20rem;
    text-overflow: ellipsis;
}

.login-reminder {
    margin: 1.25rem 0;
}

.transcript-buttons {
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin: 1.25rem 0;
    gap: 0.35rem;
}
</style>