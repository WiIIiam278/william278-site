<template>
    <form class="version-creator" @submit="(e) => { e.preventDefault(); uploadVersion(); }">
        <div class="manager">
            <div class="project-picker">
                <label for="project-select">Upload Version for:</label>
                <select id="project-select" v-model="project" :disabled="!selectable?.length">
                    <option v-for="project in selectable" :key="project.slug" :value="project" >
                        {{ project.slug }}
                    </option>
                </select>
            </div>
            <div class="buttons">
                <button @click="(e) => {e.preventDefault(); reset()}" class="red">Clear</button>
                <button type="submit">Upload Version&hellip;</button>
            </div>
        </div>
        <div class="uploader">
            <div class="input-row version-timestamp">
                <div class="channel-input">
                    <label for="channel-name">Channel:</label>
                    <input id="channel-name" type="text" v-model="channel" />
                </div>
                <div class="version-input">
                    <label for="version">Version:</label>
                    <input id="version" type="text" v-model="version.name" />
                </div>
                <div class="timestamp-input">
                    <label for="timestamp">Released:</label>
                    <input id="timestamp" type="datetime-local" v-model="timestamp" />
                </div>
            </div>
            <div class="input-row changelog">
                <label for="changelog">Changelog:</label>
                <TiptapEditor rows="6" id="changelog" v-model="version.changelog" />
            </div>
            <label for="download-dist-name">Files:</label>
            <div class="input-row downloads">
                <div class="download-grid">
                    <div class="download" v-for="(download, i) in version.downloads">
                        <div class="download-input">
                            <label for="download-dist-name">Name:</label>
                            <input id="download-dist-name" type="text" v-model="version.downloads[i].distribution.name" />
                        </div>
                        <div class="download-input">
                            <label for="download-dist-group">Group:</label>
                            <input id="download-dist-group" type="text" v-model="version.downloads[i].distribution.groupName" />
                        </div>
                        <div class="download-input">
                            <label for="download-dist-description">Description:</label>
                            <input id="download-dist-description" type="text" v-model="version.downloads[i].distribution.description" />
                        </div>
                        <div class="download-file">
                            <input :id="`download-file-${i}`" type="file" @change="(v) => chooseFile(i, v.target.files[0])" />
                        </div>
                    </div>
                </div>
                <div class="buttons">
                    <button @click="(e) => {e.preventDefault(); addDownload()}">Add Download</button>
                    <button class="red" @click="(e) => {e.preventDefault(); removeDownload()}">Remove Download</button>
                </div>
            </div>
        </div>
    </form>
</template>

<script setup>
const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
const { auth, xsrf } = useAuth();
const getNewDownload = () => ({
    distribution: {
        name: 'paper',
        groupName: 'paper',
        description: 'Paper',
        archived: false
    },
    name: '',
    md5: '',
    fileSize: 0
});

const project = ref(null);
const channel = ref('release');
const timestamp = defineModel('timestamp');
const version = ref({
    name: '1.0',
    changelog: 'Initial release v1.0',
    timestamp: null,
    downloads: [getNewDownload()],
    downloadCount: 0
});
const files = ref([]);

const allProjects = await useAllProjects();
const selectable = computed(() => allProjects.value.filter(p => p.metadata?.github && p.metadata?.listDownloads));
project.value = allProjects.value.filter(p => p.metadata?.github && p.metadata?.listDownloads)[0] || null;

const chooseFile = (index, value) => {
    files.value[index] = value;
    version.value.downloads[index].name = value.name;
};

const addDownload = () => {
    version.value.downloads.push(getNewDownload());
    files.value.push(null);
};

const removeDownload = () => {
    version.value.downloads.pop();
    files.value.pop();
};

const getFormData = () => {
    const form = new FormData();
    form.append('version', new Blob([JSON.stringify(version.value)], { type: 'application/json' }));
    files.value.forEach((file) => {
        form.append('files', file);
    });
    return form;
}

const uploadVersion = async () => {
    version.value.timestamp = new Date(timestamp.value)
    try {
        await $fetch(`${BASE_URL}/v1/projects/${project.value.slug}/channels/${channel.value}/versions`, {
            method: 'POST',
            credentials: auth ? 'include' : 'omit',
            headers: {
                'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
                'X-XSRF-TOKEN': xsrf
            },
            body: getFormData()
        });
        useAlert('Version uploaded successfully!', 'Success');
    } catch (err) {
        useAlert('Failed to upload version: ' + err, 'Error');
        return;
    }
    reset();
};

const reset = () => {
    version.value = {
        name: '1.0',
        changelog: 'Changelog',
        timestamp: null,
        downloads: [getNewDownload()],
        downloadCount: 0
    };
    files.value = [];
    timestamp.value = null;
}
reset();
</script>

<style scoped>
.manager {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.manager .project-picker {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
}

.uploader {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: var(--gray);
    padding: 1rem;
    border-radius: 0.5rem;
}

.version-creator {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.input-row {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
}

.input-row.project-channel {
    justify-content: space-between;
}

.input-row.version-timestamp {
    justify-content: space-between;
}

.input-row label {
    padding-right: 0.5rem;
}

.changelog {
    display: flex;
    flex-direction: column;
}

.downloads {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: var(--background);
    padding: 1rem;
    border-radius: 0.5rem;
}

.downloads .download-grid {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.downloads .download {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border: 0.175rem solid var(--gray);
    border-radius: 0.5rem;
    padding: 1rem;
}

.buttons {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    justify-content: center;
}

.download-file {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.download-file input {
    display: flex;
    flex-direction: row;
    height: 100%;
}
</style>