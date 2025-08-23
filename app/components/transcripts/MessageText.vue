<template>
    <article class="text" v-html="formatted" />
</template>

<script setup>
const { value, transcript, embed } = defineProps({
    value: {
        type: String,
        required: true
    },
    transcript: {
        type: Object,
        required: true
    },
    embed: {
        type: Boolean,
        required: false,
        default: false
    }
});

// Format message text to use discord formatting
const formatDiscord = (text, transcript) => {
    let tags = ['user', 'emote', 'role', 'channel'];
    for (const tag of tags) {
        const matches = text.matchAll(new RegExp(`<!${tag}:(.+)>`, 'g'));
        for (const match of matches) {
            let value = match[1];
            if (value) {
                switch (tag) {
                    case 'user':
                        text = text.replaceAll(match[0], `<@${value}>`);
                        break;
                    case 'emote':
                        let name = transcript.emotes.find((emote) => emote.id === value).name;
                        text = text.replaceAll(match[0], `<:${name}:${value}>`);
                        break;
                    case 'role':
                        text = text.replaceAll(match[0], `<@&${value}>`);
                        break;
                    case 'channel':
                        let id = transcript.channels.find((channel) => channel.name === value).id;
                        text = text.replaceAll(match[0], `<#${id}>`);
                        break;
                }
            }
        }
    }
    return text;
};

const formatted = useDiscordMarkdown(formatDiscord(value, transcript), transcript.roles, transcript.channels, transcript.users, embed);
</script>

<style scoped>
.title {
    font-size: 1.2em;
    font-weight: bold;
}

.text {
    margin: 0.25rem 0;
}
</style>

<style>
.d-mention {
    background-color: var(--dark-gray);
    border-radius: 0.25rem;
    padding: 0.1rem;
}

.d-emoji {
    width: 1.5rem;
    height: 1.5rem;
    vertical-align: middle;
}

.d-user,
.d-role,
.d-channel {
    color: var(--accent);
}
</style>