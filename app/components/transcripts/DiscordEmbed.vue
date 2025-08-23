<template>
    <div class="discord-embed">
        <div class="highlight"></div>
        <div class="content">
            <div class="body-section" v-if="embed.title || embed.description || (embed.fields && embed.fields.length >= 1)">
                <div v-if="embed.title">
                    <div v-if="embed.url" class="name">
                        <a :href="embed.url">
                            <MessageText :value="embed.title" :transcript="transcript" embed />
                        </a>
                    </div>
                    <div v-else class="name">
                        <MessageText :value="embed.title" :transcript="transcript" embed />
                    </div>
                </div>
                <div v-if="embed.description" class="description">
                    <MessageText v-for="line in embed.description.split('\n')" :value="line" :transcript="transcript" embed />
                </div>
                <div v-for="field of embed.fields" :class="'field display-' + (field.inline ? 'inline' : 'block')">
                    <div v-if="field.name" class="name">
                        <MessageText :value="field.name" :transcript="transcript" embed />
                    </div>
                    <div v-if="field.value" class="value">
                        <MessageText :value="field.value" :transcript="transcript" embed />
                    </div>
                </div>
                <div v-if="embed.image" class="image">
                    <NuxtImg width="550px" height="225px" :src="embed.image.url" placeholder='/images/placeholder-image.png' />
                </div>
                <div v-if="embed.footer" class="footer">
                    <NuxtImg v-if="embed.footer.icon_url" :src="embed.footer.icon_url" placeholder='/images/placeholder-image.png'
                        width="32px" height="32px" class="icon" />
                    <div v-if="embed.footer.text" class="text">
                        <MessageText :value="embed.footer.text" :transcript="transcript" embed />
                    </div>
                </div>
            </div>
            <div class="thumbnail-section" v-if="embed.thumbnail">
                <NuxtImg v-if="embed.title || embed.description || (embed.fields && embed.fields.length > 0) || embed.image"
                    :src="embed.thumbnail.url" placeholder='/images/placeholder-image.png' class="thumbnail"
                    width="100px" height="100px" />
                <NuxtImg v-else :src="embed.thumbnail.url" placeholder='/images/placeholder-image.png' class="image"
                    width="100px" height="100px" />
            </div>
        </div>
    </div>
</template>

<script setup>
const { embed, transcript } = defineProps({
    embed: {
        type: Object,
        required: true
    },
    transcript: {
        type: Object,
        required: true
    }
})
</script>

<style scoped>
.discord-embed {
    display: flex;
    flex-direction: row;
    border-radius: 0.5rem;
    width: fit-content;
    background-color: var(--background);
    max-width: 92.5%;
    margin: 0.25rem 0;
}

.discord-embed .highlight {
    width: 0.3rem;
    min-width: 0.3rem;
    border-radius: 0.5rem 0 0 0.5rem;
    background-color: var(--accent);
}

.discord-embed .content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 0.75rem;
}

.discord-embed .name {
    font-weight: bold;
}

.content .body-section {
    width: 100%;
}

.body-section .display-inline {
    width: 45%;
    display: inline-block;
}

.content .thumbnail-section > .thumbnail {
    width: min-content;
}

.content .thumbnail-section > .image {
    width: fit-content;
    max-height: 15rem;
}

.discord-embed .thumbnail {
    float: right;
    width: 6rem;
    height: 6rem;
    margin-left: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
}

.discord-embed .image {
    display: flex;
    width: 100%;
    margin: 0.5rem 0;
    border-radius: 0.5rem;
}

.image img {
    max-height: 225px;
    max-width: 550px;
}
</style>