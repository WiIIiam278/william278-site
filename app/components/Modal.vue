<template>
    <div class="background lock-scrolling" @click="() => modal.escapable ? close(false) : {}">
        <div :class="`container ${modal.type}-modal`" @click="(e) => e.stopPropagation()">
            <div class="title">
                <h2 v-if="modal.title">{{ modal.title }}</h2>
                <Icon v-if="modal.escapable" class="close-button" @click="close(false)" name="fa6-solid:xmark" />
            </div>
            <div v-if="modal.type === 'download'" class="downloads">
                <a class="download-button shadow" v-for="download in modal.data.downloads"
                    :href="useDownloadUrl(modal.data.project, modal.data.channel, modal.data.release, download.distribution)">
                    <NuxtImg class="icon" :src="`/images/platforms/${download.distribution.groupName}.png`"
                        width="32px" height="32px" onerror="this.style.display='none'" />
                    <div class="details">
                        <div class="name">{{ download.distribution.description }}</div>
                        <div class="file">
                            <span class="file">{{ download.name }}</span>
                            <span class="size-hash">
                                {{ $t('download-file-size', { 'size': useFormattedFileSize(download.fileSize) }) }}
                            </span>
                        </div>
                    </div>
                </a>
            </div>
            <ProjectUpsell v-else-if="modal.type === 'upsell'" :project="modal.project" />
            <div v-else class="content">
                <p v-if="!modal.markdown">{{ modal.message }}</p>
                <MDC v-else :value="modal.message" tag="article" />
            </div>
            <div v-if="modal.type === 'asset'" >
                <AssetManager pickerMode :contentTypeFilter="modal.contentTypeFilter" @select="(chosen) => close(true, chosen?.length ? chosen : null)" />
            </div>
            <div v-else-if="modal.type === 'input'" :class="`input ${modal.inputError ? 'error' : ''}`" >
                <input @click="modal.inputError = false" type="text" v-model="modal.inputText" :placeholder="modal.title" />
            </div>
            <div class="buttons">
                <button @click="close(false)">{{ $t(`button-${modal.type === 'alert' ? 'close' : 'cancel'}`) }}</button>
                <button :class="modal.type === 'confirm' ? 'red' : ''" @click="close(true, modal.inputText ?? null)"
                    v-if="modal.type === 'confirm' || modal.type === 'input' || modal.type === 'asset'">{{ $t('button-confirm') }}</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const modal = useState('modal');

const close = (confirm, inputText = null) => {
    // Validate before close
    if (modal.value.type === 'input' && confirm && !modal.value.inputValidator(inputText)) {
        modal.value.inputError = true;
        return;
    }
    modal.value.inputError = false;

    // Confirm-close
    if (modal.value.type === 'confirm') {
        modal.value.confirm = confirm;
    }

    if (modal.value.onClose) {
        modal.value.onClose(confirm, inputText);
    }
    if (modal.value.type === 'upsell') {
        navigateTo(`/project/${modal.value.project.slug}`);
    }
    modal.value.show = false;
}
</script>

<style scoped>
.background {
    display: flex;
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
}

.background .container {
    margin: auto;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    background-color: var(--background);
    border-radius: 0.5rem;
    max-width: 100vw;
    max-height: 100vh;
    width: 650px;
    z-index: 110;
}

.container.asset-modal {
    width: 1080px;
    height: 720px;
    overflow-y: auto;
}

.container .content,
.container .downloads {
    max-height: 65vh;
    overflow: auto;
    margin-bottom: 1rem;
}

.input {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
    width: 100%;
}

.input input {
    width: 60%;
}

.input.error input {
    color: var(--red) !important;
    border-color: var(--red) !important;
}

.container .title {
    margin-top: -0.2rem;
    display: flex;
    flex-direction: row;
}

.title .close-button {
    cursor: pointer;
    margin-left: auto;
    padding: 0.5rem;
    color: var(--light-gray)
}

.title h2 {
    margin-top: 0.5rem;
}

@keyframes downloadGlow {
    0% {
        background-position: 100% 100%;
    }
    100% {
        background-position: 15% 15%;
    }
}

.downloads .download-button {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    border: 0.15rem solid var(--gray);
    border-radius: 0.5rem;
    background-color: var(--gray);
    margin: 1rem auto;
    max-width: 420px;
    color: var(--accent);
    cursor: pointer;
}

.downloads .download-button:hover, .version .download-button:hover {
    text-decoration: none;
    background-color: var(--dark-gray);
    background: linear-gradient(transparent, #00fb9b1e);
    background-size: 200% 200%;
    animation: downloadGlow 0.5s normal forwards;
}


.downloads .download-button .icon {
    width: 2rem;
    max-height: 4rem;
}

.downloads .download-button .details {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.downloads .details .name {
    font-size: 1.1rem;
    font-weight: 700;
}

.downloads .details .file {
    color: var(--light-gray);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    display: flex;
    flex-direction: column;
}

.close-button:hover {
    color: white;
}

.buttons {
    margin: 1rem auto 0 auto;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
}


/* Mobile user container */
@media screen and (max-width: 950px) {
    .background .container {
        max-width: 75vw;
    }

    .input input {
        width: 100%;
    }
}

@media screen and (max-width: 600px) {
    .background {
        max-width: 100vw;
        max-height: 100vh;
        width: 100%;
        height: 100%;
        overflow: auto;
        padding: 0;
        margin: 0;
        background-color: var(--background);
        backdrop-filter: none;
    }

    .background .container {
        max-height: unset;
        max-width: unset;
        background-color: unset !important;
    }

    .container .content,
    .container .downloads {
        max-height: 100%;
    }
}
</style>