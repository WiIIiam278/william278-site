<template>
    <div class="messages">
        <SystemMessage>
            {{ $t('ticket-transcript-opened', {'timestamp': useTimeFormat(parseInt(data.ticket.open_timestamp) * 1000)}) }}
        </SystemMessage>
        <DiscordMessage v-for="messages in getMessageBlocks(data.messages)" :transcript="data" :messages="messages" />
        <SystemMessage icon="fa6-solid:lock">
            {{ $t('ticket-transcript-closed', {'timestamp': useTimeFormat(parseInt(data.ticket.close_timestamp) * 1000)}) }}
        </SystemMessage>
    </div>
</template>

<script setup>
const { locale, t } = useI18n()
const localePath = useLocalePath()

const { data } = defineProps({
    data: {
        type: Object,
        required: true
    }
});

const getMessageBlocks = (messages) => {
    const blocks = [];
    let lastSender = null;
    let lastTimestamp = null;
    let currentBlock = [];
    for (const message of messages) {
        if (message.sender !== lastSender || message.timestamp - lastTimestamp > 300000 || message.reply_snippet) {
            if (currentBlock.length > 0) {
                blocks.push(currentBlock);
            }
            currentBlock = [];
        }
        lastTimestamp = message.timestamp;
        lastSender = message.sender;
        if (message.message || message.embeds || message.attachments) {
            currentBlock.push(message);
        }
    }
    if (currentBlock.length > 0) {
        blocks.push(currentBlock);
    }
    return blocks;
};
</script>

<style scoped>
.messages {
    width: 100%;
    max-width: 95vw;
    display: flex;
    flex-direction: column;
}
</style>