<template>
    <div class="message-block shadow" v-if="sender = getUser(messages[0].sender)">
        <div class="avatar">
            <div class="reply-line" v-if="messages[0].reply_snippet"></div>
            <NuxtImg class="image" :src="sender.pfp" width="50px" height="50px" />
        </div>
        <div class="content">
            <div class="reply-content" v-if="messages[0].reply_snippet">
                <span class="reply-sender" v-if="replyingTo = getUser(messages[0].reply_snippet.sender)">
                    <NuxtImg class="image" :src="replyingTo.pfp" width="32px" height="32px" />
                    @{{ replyingTo.name }}{{ parseInt(replyingTo.disambiguator) > 0 ? `#${replyingTo.disambiguator}` : "" }}
                </span>
                <span class="reply-text">
                    <MessageText :value="formatReply(messages[0].reply_snippet.message)" :transcript="transcript" />
                </span>
            </div>
            <div class="sender">
                <div class="user">
                    <span class="name">
                        {{ sender.name }}
                    </span>
                </div>
                <div class="timestamp">
                    {{ useTimeFormat(parseInt(messages[0].timestamp), true) }}
                </div>
            </div>
            <div class="message-text" v-for="message in messages">
                <MessageText v-if="message.message" :value="message.message" :transcript="transcript" />
                <div v-if="message.attachments">
                    <MessageAttachment v-for="attachment of message.attachments" :attachment="getAttachment(attachment)" />
                </div>
                <div v-if="message.embeds">
                    <DiscordEmbed v-for="embed in message.embeds" :embed="embed" :transcript="transcript" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.message-block {
    display: flex;
    flex-direction: row;
    margin: 0.5rem 0;
    padding: 0.75rem;
    border-radius: 0.5rem;
    background-color: var(--gray);
}

.reply-line {
    height: 0.7rem;
    width: 2rem;
    margin-left: 1.5rem;
    margin-bottom: 0.5rem;
    margin-top: 0.7rem;
    border-left: 0.15rem solid var(--light-gray);
    border-top: 0.15rem solid var(--light-gray);
    border-radius: 0.5rem 0 0 0;
    white-space: nowrap;
    overflow: hidden;
}

.reply-sender {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 0.5rem;
}

.reply-sender .image {
    width: 1.15rem;
    height: 1.15rem;
    border-radius: 50%;
    margin-right: 0.2rem;
}

.reply-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: var(--light-gray);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.avatar {
    margin-right: 0.75rem;
}

.avatar img {
    max-width: 50px;
    height: auto;
    border-radius: 100%;
}

.sender .disambiguator,
.sender .timestamp {
    color: var(--light-gray);
}

.sender .timestamp {
    font-size: 0.8rem;
}

.content {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.message-block .content .message-text {
    word-wrap: break-word;
    max-width: 90%;
}

.message-block .content .reply-text {
    white-space: nowrap;
    word-wrap: unset;
    overflow: hidden;
}
</style>

<script setup>
const { messages, transcript } = defineProps({
    messages: {
        type: Array,
        required: true
    },
    transcript: {
        type: Object,
        required: true
    }
});

const getUser = (id) => {
    const member = transcript.users.find((member) => member.id === id);
    if (member) {
        return member;
    }
    return {
        id: id,
        username: "Unknown User",
        discriminator: "0000",
        pfp: null
    };
};

const getRole = (id) => {
    const role = transcript.roles.find((role) => role.id === id);
    if (role) {
        return role;
    }
    return {
        id: id,
        name: "Unknown Role",
        color: "#000000"
    };
};

const getChannel = (id) => {
    const channel = transcript.channels.find((channel) => channel.id === id || channel.name === id);
    if (channel) {
        return channel;
    }
    return {
        id: id,
        name: "Unknown Channel"
    };
};

const getEmoji = (id) => {
    const emoji = transcript.emojis.find((emoji) => emoji.id === id);
    if (emoji) {
        return emoji;
    }
    return {
        id: id,
        name: "Unknown Emoji",
        url: null
    };
};

const getAttachment = (id) => {
    const attachment = transcript.attachments.find((attachment) => attachment.id === id);
    if (attachment) {
        return attachment;
    }
    return {
        id: id,
        name: "Unknown Attachment",
        type: "unknown",
        url: null
    };
};

const formatReply = (message) => message.split('\n')[0].replace(/([*_~`])/g, '\\$1');
</script>