<template>
    <div>
        <h1>{{ $t('dump-viewer-title') }}</h1>
        <div class="plugin">
            <div class="section-header" v-if="meta">{{ $t('dump-header-plugin') }}</div>
            <div class="avatar" v-if="meta">
                <ProjectIcon class="icon" :project="project" size="64px" />
                <div class="info">
                    <IconifiedText icon="fa6-solid:tag"><NuxtLink :to="`/project/${project.slug}`">{{ meta.name }}</NuxtLink></IconifiedText>
                    <IconifiedText icon="fa6-solid:code-branch"><span class="value">v{{ data.project.version }}</span></IconifiedText>
                </div>
            </div>
            <div class="info">
                <IconifiedText icon="garden:platform-26" v-if="data.server.serverJarType">
                    <span class="label">{{ $t('dump-server-type') }}</span><span class="value">{{ data.server.serverJarType }}</span>
                </IconifiedText>
                <IconifiedText icon="fa6-solid:code-branch" v-if="data.server.serverJarVersion">
                    <span class="label">{{ $t('dump-server-jar-version') }}</span><span class="value">{{ data.server.serverJarVersion }}</span>
                </IconifiedText>
                <IconifiedText icon="fa6-solid:cube" v-if="data.server.minecraftVersion">
                    <span class="label">{{ $t('dump-server-mc-version') }}</span><span class="value">{{ formatMcVersion(data.server.minecraftVersion) }}</span>
                </IconifiedText>
                <IconifiedText icon="octicon:globe-16" v-if="data.server.onlineMode !== undefined">
                    <span class="label">{{ $t('dump-server-online-mode') }}</span><span class="value"><Icon :name="`fa6-solid:${data.server.onlineMode ? 'check' : 'x'}`" />&nbsp;{{ data.server.onlineMode }}</span>
                </IconifiedText>
                <IconifiedText icon="mdi:proxy" v-if="data.server.proxyState">
                    <span class="label">{{ $t('dump-server-proxy-state') }}</span><span class="value">{{ useCapitalized(data.server.proxyState) }}</span>
                </IconifiedText>
                <IconifiedText icon="fa6-brands:java" v-if="data.environment.javaVersion">
                    <span class="label">{{ $t('dump-server-java-version') }}</span><span class="value">{{ data.environment.javaVersion }}</span>
                </IconifiedText>
                <IconifiedText icon="lucide:server" v-if="data.environment.osName">
                    <span class="label">{{ $t('dump-server-os') }}</span><span class="value">{{ data.environment.osName }}</span>
                </IconifiedText>
                <IconifiedText icon="ic:baseline-history" v-if="data.environment.uptime">
                    <span class="label">{{ $t('dump-server-uptime') }}</span><span class="value">{{ formatUptime(data.environment.uptime) }}</span>
                </IconifiedText>
                <IconifiedText icon="ri:ram-fill" v-if="data.environment.freeMemory && data.environment.allocatedMemory">
                    <span class="label">{{ $t('dump-server-memory') }}</span><span class="value">
                        {{ f(data.environment.freeMemory / 1048576) }} / {{ f(data.environment.allocatedMemory / 1048576) }} MB
                    </span>
                </IconifiedText>
            </div>
        </div>
        <div class="navigator">
            <div class="section-header noborder">{{ $t('dump-header-navigator') }}</div>
            <div class="links">
                <ServerDumpSidebarLink @select="$emit('select', 'overview')"
                    :selected="selected === 'overview'" :title="t('dump-overview')" icon="fa6-solid:circle-info" />
                <ServerDumpSidebarLink v-if="data.plugins" @select="$emit('select', 'plugins')"
                    :selected="selected === 'plugins'" :title="t('dump-server-plugins')" icon="fa6-solid:plug" />
                <ServerDumpSidebarLink v-for="file in data.files" @select="$emit('select', file.fileName)"
                    :selected="selected === file.fileName" :title="file.fileLabel" :icon="getFileIcon(file)" />
                <ServerDumpSidebarLink v-if="data.latestLog" @select="$emit('select', 'latest.log')"
                    :selected="selected === 'latest.log'" :title="t('dump-server-log')" icon="mdi:file-text" />
            </div>
        </div>
        <div class="meta" v-if="data.meta">
            <div class="section-header">{{ $t('dump-header-metadata') }}</div>
            <div class="avatar">
                <NuxtImg v-if="data.meta.creator" width="64px" height="64px" :alt="data.meta.creator.username"
                    :src="`https://crafthead.net/helm/${data.meta.creator.uuid}/64`" placeholder="/images/placeholder-mc-avatar.png" />
                <div class="info">
                    <IconifiedText v-if="data.meta.creator" icon="octicon:command-palette-16"><span class="value">{{ data.meta.creator.username }}</span></IconifiedText>
                    <IconifiedText icon="fa6-solid:clock"><span class="value">{{ useTimeFormat(data.meta.timestamp, true) }}</span></IconifiedText>
                </div>
            </div>
        </div>
        <div class="buttons">
            <ButtonLink target="_blank" link="https://discord.gg/tVYhJfyDWG" icon="fa6-brands:discord" >{{ t('link-support') }}</ButtonLink>
            <ButtonLink target="_blank" :link="`${DUMPS_URL}/${id}`" icon="tabler:json" >{{ $t('dump-view-raw') }}</ButtonLink>
        </div>
    </div>
</template>

<script setup>
const DUMPS_URL = useRuntimeConfig().public.DUMPS_BYTEBIN_URL;
const { t } = useI18n()

const { data, project, id, selected } = defineProps({
    data: {
        type: Object,
        required: true
    },
    project: {
        type: Object,
        required: false
    },
    id: {
        type: String,
        required: true
    },
    selected: {
        type: String,
        required: false
    }
});
const { metadata: meta } = project;
const emit = defineEmits(['select'])

const f = (num) => num.toFixed(0);
const formatUptime = (millis) => {
    if (!millis || millis < 1000) {
        return '0s';
    }
    let secs = f(millis / 1000) % 60;
    let mins = f(millis / 1000 / 60) % 60;
    let hours = f(millis / 1000 / 60 / 60) % 24;
    let days = f(millis / 1000 / 60 / 60 / 24);
    return [
        days > 0 ? `${days}d` : null, 
        hours > 0 ? `${hours}h` : null, 
        mins > 0 ? `${mins}m` : null, 
        `${secs}s`
    ].filter(a => a).join(' ');
}
const formatMcVersion = (mc) => mc.indexOf('-') > -1 ? mc.split('-')[0] : mc.trim();
const getFileIcon = (file) => {
    if (file?.fileIcon) {
        return file.fileIcon;
    }
    if (file?.type === 'DATABASE_FILE') {
        return 'mdi:file-table';
    }
    return 'mdi:file-code';
}
</script>

<style scoped>
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

.section-header {
    color: var(--light-gray);
    padding: 0.5rem 0;
    margin: 1rem 0;
    border-bottom: 0.125rem solid var(--gray);
}

.navigator {
    border-bottom: 0.125rem solid var(--gray);
}

.section-header.noborder {
    border-bottom: none;
    margin-bottom: 0;
}

.avatar {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.avatar img, .avatar object {
    width: 64px;
    height: 64px;
    aspect-ratio: 1;
    border-radius: 0.5rem;
}

.info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.info .label {
    margin-right: 0.5rem;
}

.info .value {
    color: var(--light-gray)
}

.buttons {
    margin: 2rem 0 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}
</style>