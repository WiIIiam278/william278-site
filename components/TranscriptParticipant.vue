<template>
    <div class="transcript-participant">
        <div class="avatar">
            <img :src="user.pfp" />
        </div>
        <div class="profile">
            <div class="name">
                {{ user.name }}<span class="disambiguator">#{{ user.disambiguator }}</span>
            </div>
            <div v-if="creator" class="creator">
                <Pill color="dark-gray">
                    <IconifiedText icon="fa6-solid:crown">Creator</IconifiedText>
                </Pill>
            </div>
        </div>
    </div>
</template>

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
    font-size: 0.9rem;
    margin-top: 0.1rem;
    align-self: flex-start;
}

.creator span {
    margin: 0;
}

.profile .disambiguator {
    color: var(--light-gray);
}
</style>

<script>
export default {
    props: {
        user: {
            type: Object,
            required: true
        },
        creator: {
            type: Boolean,
            required: false,
            default: false
        }
    }
}
</script>