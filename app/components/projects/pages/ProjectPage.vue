<template>
    <article v-if="page" class="page">
        <SectionRenderer v-for="section of page.contents.sections.sort((s1, s2) => s2.order - s1.order)" 
            :project="project" :section="section" 
        />
    </article>
    <MDC v-else :value="readme" tag="article" />
</template>

<script setup>
const { project } = defineProps({
    project: {
        type: Object,
        required: true
    }
});
const { metadata: meta } = project;
const page = await useProjectPage(project.slug);

const readme = computed(() => {
    let body = meta.readmeBody;
    if (!body) return body;

    // Replace relative links and images with GitHub links
    const rawGithub = meta.github.replace('github.com', 'raw.githubusercontent.com');
    body = body.replace(/\]\((?!http)([^)]+)\)/g, `](${meta.github}/master/$1)`);
    body = body.replace(/!\[(.*?)\]\((?!http)([^)]+)\)/g, `![$1](${rawGithub}/master/$2)`);
    body = body.replace(/<img([^>]+)src="(?!http)([^"]+)"([^>]*)>/g, `<img$1src="${rawGithub}/master/$2"$3>`);
    return body;
})
</script>

<style scoped>
.page {
    margin-top: 1rem;
}
</style>