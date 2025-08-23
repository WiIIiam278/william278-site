<template>
    <div class="container">
        <MonacoEditor class="editor" v-model="contents" :options="{ readOnly: true, theme: 'william278' }" :lang="lang" />
    </div>
</template>

<script setup>
useMonacoWithLongLang();

const { lang } = defineProps({
    lang: {
        type: String,
        required: false,
        default: 'yaml'
    }
})
const contents = defineModel('contents');
</script>

<style scoped>
.editor {
    height: 75vh;
}
</style>