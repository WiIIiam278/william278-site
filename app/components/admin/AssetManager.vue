<template>
    <div class="manager">
        <div v-if="assets.value" class="search-options">
            <b>Displaying {{ assets.value.page.totalElements }} asset(s)</b>
            <form class="search-box" @submit="(e) => { e.preventDefault(); pageNumber = 0; updateAssets(pageNumber.value, itemsPerPage.value); }">
                <input type="text" v-model="searchText" placeholder="Search by file name" />
                <button type="submit">Search</button>
            </form>
        </div>
        <div class="grid" v-if="assets.value">
            <label for="asset-upload" v-if="!uploading">
                <div class="upload-button">
                    <Icon class="icon" name="fa6-solid:file-arrow-up" />
                    <span>{{ $t('upload-files') }}</span>
                </div>
            </label>
            <div v-else class="upload-button">
                <Icon class="icon" name="svg-spinners:180-ring" />
                <span>{{ $t('upload-in-progress') }}</span>
            </div>
            <div class="asset" v-for="item in assets.value.content" :key="item.id">
                <video v-if="item.contentType?.startsWith('video')" @click="pickAsset(item.name)" :class="`image shadow ${pickerMode ? 'cursor' : ''}`"
                    preload="true" :type="item.contentType" autoplay muted loop playsinline>
                    <source :src="`${ASSETS_URL}/${item.name}`" :type="item.contentType">
                </video>
                <NuxtImg v-else :src="`${ASSETS_URL}/${item.name}`" @click="pickAsset(item.name)" :class="`image shadow ${pickerMode ? 'cursor' : ''}`"
                    height="232px" fit="cover" />
                <div class="type">{{ getTypeDisplay(item.contentType) }}</div>
                <button class="red" @click="deleteAsset(item.name)"><Icon name="fa6-solid:trash" /></button>
            </div>
        </div>
        <Pagination v-if="assets.value" :data="assets.value" v-on:update="(page, perPage) => updateAssets(page, perPage)" />
        <form class="upload-form">
            <input type="file" multiple id="asset-upload" @change="(v) => uploadAsset(v.target.files)" />
        </form>
    </div>
</template>

<script setup>
const { t } = useI18n();
const { auth, xsrf } = useAuth();

const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
const ASSETS_URL = useRuntimeConfig().public.ASSETS_BASE_URL;

const { pickerMode, contentTypeFilter } = defineProps({
    pickerMode: {
        type: Boolean,
        default: false,
        required: false
    },
    contentTypeFilter: {
        type: String,
        default: null,
        required: false
    }
})

const pageNumber = ref(1);
const itemsPerPage = ref(30);
const assets = ref(null);
const searchText = ref('');
const uploading = ref(null);
const emit = defineEmits(['select']);

const getTypeDisplay = (type) => {
    if (type.indexOf('/') > -1) {
        return type.split('/')[1];
    }
    return type ?? '???';
}

const updateAssets = (async (page, perPage) => {
    pageNumber.value = Math.max(1, page || pageNumber.value);
    itemsPerPage.value = Math.max(30, perPage || itemsPerPage.value);
    assets.value = await useAllAssets(pageNumber.value - 1, itemsPerPage.value, searchText.value, contentTypeFilter);
});

await updateAssets(pageNumber.value, itemsPerPage.value);

const uploadAsset = async (files) => {
    for (var i = 0; i < files.length; i++) {
        let asset = files[i];
        let fileName = formatAssetName(asset.name);
        if (!fileName) return;
        uploading.value = asset;
        await putAsset(asset, fileName);
        await updateAssets(pageNumber.value, itemsPerPage.value);
        uploading.value = null;
    }
}

const pickAsset = (assetName) => {
    if (pickerMode) {
        emit('select', assetName)
    }
}

const putAsset = async (asset, fileName) => {
    try {
        await $fetch(`${BASE_URL}/v1/assets/${fileName}`, {
            method: 'PUT',
            credentials: auth ? 'include' : 'omit',
            headers: {
                'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
                'X-XSRF-TOKEN': xsrf
            },
            body: getFormData(asset)
        });
    } catch (err) {
        useAlert('Failed to put asset: ' + err, 'Error');
        return;
    }
};

const deleteAsset = async (fileName) => {
    useConfirm(t('delete-asset-confirm', {'name': fileName}), t('delete-asset'), async (confirm) => {
        if (!confirm) return;
        try {
            await $fetch(`${BASE_URL}/v1/assets/${fileName}`, {
                method: 'DELETE',
                credentials: auth ? 'include' : 'omit',
                headers: {
                    'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
                    'X-XSRF-TOKEN': xsrf
                },
            });
        } catch (err) {
            useAlert('Failed to delete asset: ' + err, 'Error');
            return;
        }
        await updateAssets(pageNumber.value, itemsPerPage.value);
    });
};

const getFormData = (file) => {
    let data = new FormData();
    data.append("file", file);
    return data;
}

const formatAssetName = (name) => {
    name = name.toLowerCase().replaceAll(' ', '-').replaceAll('_', '-').trim();
    if (!/[a-z0-9\\+._-]+/.test(name)) {
        useAlert('Asset name contains illegal characters!', 'Invalid asset name!');
        return null;
    }
    return name;
}
</script>

<style scoped>
.manager {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.grid {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.upload-button {
    cursor: pointer;
    color: var(--light-gray);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    width: 275px;
    height: 230px;
    border: 0.175rem dashed var(--gray);
    border-radius: 0.5rem;
}

.upload-button:hover {
    border-color: var(--light-gray);
}

.upload-button .icon {
    font-size: 2rem;
}

.asset .image {
    max-width: 500px;
    min-width: 230px;
    border-radius: 0.5rem;
    image-rendering: pixelated;
}

.asset video {
    max-height: 232px;
}

.asset {
    position: relative;
}

.asset button {
    position: absolute;
    margin: 0.35rem;
    background-color: #2b2b2bc0;
    width: 45px;
    height: 45px;
    z-index: 10;
    top: 0;
    right: 0;
}

.asset .type {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
    color: var(--light-gray);
    margin: 0.35rem;
    background-color: #2b2b2bc0;
    border: 0.125rem solid var(--gray);
    border-radius: 0.5rem;
    min-width: 41.5px;
    height: 41.5px;
    z-index: 10;
    bottom: 5px;
    right: 0;
}

.cursor {
    box-sizing: border-box;
    cursor: pointer;
}

.cursor:hover {
    border: 0.175rem solid var(--accent);
}

.search-options {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    justify-items: center;
    margin-bottom: 1rem;
}

.search-options .search-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
}

.upload-form {
    display: none;
}
</style>