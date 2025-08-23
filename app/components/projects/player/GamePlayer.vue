<template>
    <div :class="`player-columns ${game_platform === 'nds' ? 'adjacent' : 'stacked'}`">
        <div class="column details">
            <div v-if="title?.length && body?.length" class="header">
                <MDC v-if="title?.length" :value="title" tag="h2" unwrap="p" />
                <MDC v-if="body?.length" :value="body" tag="p" unwrap="p" />
                <slot />
            </div>
            <div v-if="controls?.length" class="controls">
                <div class="label">Controls</div>
                <div class="grid">
                    <ControlMapping v-for="control of controls" :control="control.key" :mapping="control.bind" />
                </div>
            </div>
        </div>
        <div class="column player">
            <iframe v-if="game_platform === 'nds'" class="frame shadow"
                    :src="`/emulator.html?gameUrl=${urlify(`/emulator-js/roms/${project.slug}`)}&gameName=${urlify(name)}&core=${urlify(game_core)}&coverBg=${urlify(`${ASSETS_URL}/${game_cover_bg}`)}`"
                    width="360px" height="540px" frameBorder="0" scrolling="no"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullscreen allowTransparency>
            </iframe>
            <ItchPlayer v-else-if="game_platform === 'itch'"
                :gameUrl="game_url" :coverBg="game_cover_bg" />
        </div>
    </div>
</template>

<script setup>
import ItchPlayer from './ItchPlayer.vue';

const ASSETS_URL = useRuntimeConfig().public.ASSETS_BASE_URL;
const { title, body, props, project } = defineProps({
    title: { type: String, required: false },
    body: { type: String, required: false },
    props: { type: Object, required: true },
    project: { type: Object, required: true }
});
const { name } = project.metadata;
const { game_platform, game_url, game_core, game_controls, game_cover_bg } = props
const urlify = (a) => encodeURIComponent(a);

const controls = [];
game_controls.split(',').forEach(c => controls.push({
    key: c.split(':')[0],
    bind: c.split(':')[1]
}))
</script>

<style scoped>
.player-columns {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem 0;
    width: 100%;
}

.stacked {
    flex-direction: column-reverse;
}

.adjacent {
    flex-direction: row;
}

@media (max-width: 1080px) {
    .player-columns {
        flex-direction: column-reverse !important;
    }

    .column {
        width: 100% !important;
    }
}

@media (max-width: 800px) {
    .stacked .details {
        flex-direction: column !important;
        gap: unset;
    }
}

.column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 1rem;
}

.stacked .column {
    width: 100%;
}

.stacked .details {
    flex-direction: row;
    gap: 1rem;
}

.adjacent .column {
    width: 45%;
}

.column .header, .column .controls {
    width: 100%;
    margin: 0.5rem 0;
}

.header h2 {
    margin-top: 0;
}

@keyframes hoverGlow {
	0% {
        -webkit-box-shadow: inset 0 0 0.25rem transparent;
        -moz-box-shadow: inset 0 0 0.25rem transparent;
        box-shadow: inset 0 0 0.25rem transparent;
	}
	100% {
        -webkit-box-shadow: inset 0 0 3rem var(--gray);
        -moz-box-shadow: inset 0 0 3rem var(--gray);
        box-shadow: inset 0 0 3rem var(--gray);
	}
}

.details .controls {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 0.125rem solid var(--gray);
    border-radius: 0.5rem;
    padding: 0.4rem 0;
    font-size: 0.9rem;
}

.stacked .details .header {
    align-items: start;
    margin-bottom: auto;
}

.controls .label {
    color: var(--light-gray);
    margin-bottom: 0.5rem;
}

.controls:hover {
    -webkit-box-shadow: inset 0 0 0.25rem transparent;
    -moz-box-shadow: inset 0 0 0.25rem transparent;
    box-shadow: inset 0 0 0.25rem transparent;
    animation: hoverGlow 0.5s ease both;
}

.column .controls .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5rem;
    justify-items: center;
}

.column .frame {
    border-radius: 0.5rem;
    box-shadow: 0 0 4rem var(--gray);
    margin: 0 1rem;
}
</style>