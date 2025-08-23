<template>
    <div>
        <div class="picker">
            <div class="picker-panel">
                <label for="project-select">Select Project:</label>
                <select id="project-select" v-model="editing" @change="updatePage(editing, true)" :disabled="!projects?.length">
                    <option v-for="project in projects" :key="project.slug" :value="project" >
                        {{ project.slug }}
                    </option>
                </select>
            </div>
            <div class="button-panel">
                <NuxtLink v-if="editing && page" :to="`/project/${editing?.slug}#about`">
                    <IconifiedText icon="fa6-solid:arrow-up-right-from-square">View Page</IconifiedText>
                </NuxtLink>
                <button :disabled="!editing" class="red" @click="deletePage">Delete</button>
                <button :disabled="!editing" @click="savePage">Save</button>
                <Icon v-if="saved" class="saved-check" name="fa6-solid:check" />
            </div>
        </div>
        <div v-if="!editing" class="centred-text">
            <IconifiedText icon="fa6-solid:question">No projects have been created yet.</IconifiedText>
        </div>
        <div v-else-if="!page" class="centred-text">
            <IconifiedText icon="fa6-solid:question">This project doesn't have a page yet! Create one?</IconifiedText>
            <button @click="createDefaultPage()">Create Page</button>
        </div>
        <div v-else>
            <div v-if="!page.contents.sections?.length" class="centred-text">
                <IconifiedText icon="fa6-solid:exclamation">This page has no sections.</IconifiedText>
            </div>
            <div v-else class="section" v-for="(section, index) of page.contents.sections.sort((s1, s2) => s2.order - s1.order)">
                <BreadcrumbsBar>
                    <h3>{{ useCapitalized(section.type.replaceAll("_", " ")) }}</h3>
                    <div class="options">
                        <input @change="savePage()" type="number" v-model="page.contents.sections[index].order" />
                        <button class="red" @click="deleteSection(index)"><Icon name="fa6-solid:trash" /></button>
                        <button class="expand-contract" @click="expanded.indexOf(index) > -1 ? expanded.splice(expanded.indexOf(index), 1) : expanded.push(index)"><Icon :name="`fa6-solid:${expanded.indexOf(index) ? 'up-right-and-down-left-from-center' : 'down-left-and-up-right-to-center'}`" /></button>
                    </div>
                </BreadcrumbsBar>
                <div v-if="expanded.indexOf(index) > -1">
                    <input v-if="page.contents.sections[index].title?.length" placeholder="Title" v-model="page.contents.sections[index].title" />
                    <TiptapEditor class="tiptap body" v-if="page.contents.sections[index].body?.length" placeholder="Body" v-model="page.contents.sections[index].body" />
                    <div class="properties" v-if="page.contents.sections[index].properties && Object.entries(page.contents.sections[index].properties).length" v-for="pair of Object.entries(page.contents.sections[index].properties)">
                        <label>{{ useCapitalized(pair[0].replaceAll("_", " ")) }}</label>
                        <div class="property-input paired-input" v-if="pair[0].indexOf('color') > -1">
                            <span>Choose color: </span>
                            <input type="color" v-model="page.contents.sections[index].properties[pair[0]]">
                        </div>
                        <div class="property-input" v-if="pair[0].indexOf('image_url') > -1 || pair[0].indexOf('game_cover_bg') > -1">
                            <NuxtImg class="icon" v-if="page.contents.sections[index].properties[pair[0]]" :src="`${ASSETS_URL}/${page.contents.sections[index].properties[pair[0]]}`" />
                            <span class="property-with-button">
                                <input disabled v-model="page.contents.sections[index].properties[pair[0]]" type="text" placeholder="(None)" />
                                <button @click="useAssetInput(`Select an image for the page.`, `Select image...`, (_, chosen) => { page.contents.sections[index].properties[pair[0]] = chosen; })">Select</button>
                            </span>
                        </div>
                        <TiptapEditor class="tiptap property-input" v-else-if="pair[0].indexOf('body') > -1" v-model="page.contents.sections[index].properties[pair[0]]" />
                        <input v-else class="property-input" v-model="page.contents.sections[index].properties[pair[0]]">
                    </div>
                </div>
                <hr/>
            </div>
            <div class="centred-text">
                <select v-model="sectionAdder">
                    <option v-for="type of Object.keys(SECTION_PRESETS)" :value="type">{{ useCapitalized(type.replaceAll("_", " ")) }}</option>
                </select>
                <button :disabled="!sectionAdder" @click="addSection()">Add section</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
const ASSETS_URL = useRuntimeConfig().public.ASSETS_BASE_URL;
const SECTION_PRESETS = {
    "hero": {
        "title": "Project Title",
        "body": "Project tagline, brief description",
        "properties": {
            "color1": "#142B42",
            "color2": "#08111B",
            "button1_label": "",
            "button1_icon": "",
            "button1_url": "",
            "button2_label": "",
            "button2_icon": "",
            "button2_url": ""
        }
    },
    "features": {
        "properties": {
            "icon_background_color1": "#142B42",
            "icon_background_color2": "#08111B",
            "feature1_title": "Feature 1 name",
            "feature1_body": "This is a star",
            "feature1_icon": "fa6-solid:star",
            "feature2_title": "Feature 2 name",
            "feature2_body": "This is a star",
            "feature2_icon": "fa6-solid:star",
            "feature3_title": "Feature 3 name",
            "feature3_body": "This is a star",
            "feature3_icon": "fa6-solid:star"
        }
    },
    "platform_badges": {
        "properties": {
            "badge_range_start": "0",
            "badge_range_end": "5"
        }
    },
    "compatibility_badges": {
        "properties": {
            "badge_range_start": "0",
            "badge_range_end": "5"
        }
    },
    "image_with_text": {
        "title": "Title",
        "body": "Body text body text body text body text body text",
        "properties": {
            "image_url": "/images/timetobattle/altenberg-castle.png",
            "image_position": "left",
            "button1_label": "Button 1",
            "button1_icon": "fa6-solid:star",
            "button1_url": "https://example.com/",
            "button2_label": "",
            "button2_icon": "",
            "button2_url": ""
        }
    },
    "header_with_text": {
        "title": "Title",
        "body": "Body text body text body text body text body text",
        "properties": {
            "button1_label": "Button 1",
            "button1_icon": "fa6-solid:star",
            "button1_url": "https://example.com/",
            "button2_label": "Button 2",
            "button2_icon": "fa6-solid:star",
            "button2_url": "/test"
        }
    },
    "button_pair": {
        "properties": {
            "button1_label": "Button 1",
            "button1_icon": "fa6-solid:star",
            "button1_url": "https://example.com/",
            "button2_label": "Button 2",
            "button2_icon": "fa6-solid:star",
            "button2_url": "/test"
        }
    },
    "paragraph": {
        "body": "Body text body text body text body text body text"
    },
    "heading": {
        "title": "Title title title"
    },
    "latest_posts": {
        "title": "What's new?",
        "properties": {
            "number_of_posts": "3"
        }
    },
    "youtube": {
        "properties": {
            "video_id": "HiiZxOU934E"
        }
    },
    "centred_image": {
        "properties": {
            "image": "/breaking-bad-ds-emulator-cover.png",
            "alt": "Breaking Bad DS emulator cover",
            "shadow": "true"
        }
    },
    "comparison_table": {
        "title": "Comparison Table",
        "properties": {
            "features_col": "One,Two,Three,Four,Five",
            "comparison_cols_headers": "Product 1,Product2",
            "comparison_cols_headers_images": "husksync.png,",
            "comparison_cols_shading": "#191919,",
            "comparison_cols_rows": "y,y|y,y|y,n|y,n|y,n",
            "icon_map": "y,fa6-solid:check,lime|n,pepicons-pop:no-entry,red",
            "footnote": "Footnote footnote footnote"
        }
    },
    "image_row": {
        "properties": {
            "images": "/breaking-bad-ds-emulator-cover.png,/breaking-bad-ds-emulator-cover.png,/breaking-bad-ds-emulator-cover.png"
        }
    },
    "game_player": {
        "title": "Controls",
        "body": "How to play",
        "properties": {
            "game_platform": "nds",
            "game_url": "https://github.com/WiIIiam278/breaking-bad-ds/releases/download/1.0.6/breaking-bad-ds.nds",
            "game_core": "desmume2015",
            "game_controls": "A:Z,B:X,X:A,Y:S,L:Q,R:E,Start:ENTER,Select:V,DPAD:Arrow Keys,Touch:Mouse",
            "game_cover_bg": "breaking-bad-ds-emulator-cover.png"
        }
    },
    "horizontal_rule": {
    }
}

const { auth, xsrf } = useAuth();
const projects = await useAllProjects();
const saved = ref(false);
const expanded = ref([]);

// Models
const editing = defineModel('editing');
editing.value = projects.value.length ? projects.value[0] : null;
const page = defineModel('page');
page.value = await useProjectPage(editing.value.slug).value;

// Section adder
const sectionAdder = defineModel('section-adder');
sectionAdder.value = Object.keys(SECTION_PRESETS)[0];

const getDefaultPage = ((slug) => `
{
  "contents": {
    "sections": []
  }
}
`);

const addSection = async () => {
    let sect = structuredClone(SECTION_PRESETS[sectionAdder.value]);
    sect.type = sectionAdder.value;
    sect.order = -page.value.contents.sections.length
    page.value.contents.sections.push(sect);
    await savePage();
}

const deleteSection = async (index) => {
    page.value.contents.sections.splice(index, 1);
    await savePage();
}

const updatePage = async (editing, refresh = false) => {
    if (refresh) {
        page.value = null;
    }
    if (!editing) {
        page.value = null;
        return;
    }
    page.value = await $fetch(`${BASE_URL}/v1/projects/${editing.slug}/page`);
}

const createDefaultPage = async () => {
    if (!editing.value) {
        useAlert('Please select a project first.', 'Cannot save project page');
        return;
    }
    if (page.value) {
        useAlert('Please delete the existing page first.', 'Cannot create new project page');
        return;
    }
    expanded.value = [];
    page.value = JSON.parse(getDefaultPage(editing.value.slug));
    await savePage();
};

const savePage = async () => {
    if (!editing.value) {
        useAlert('Please select a project first.', 'Cannot save project page');
        return;
    }
    if (!page.value) {
        useAlert('Please create a page first.', 'Cannot save project page');
        return;
    }
    try {
        await $fetch(`${BASE_URL}/v1/projects/${editing.value.slug}/page`, 
        {
            method: 'PUT',
            credentials: auth ? 'include' : 'omit',
            headers: {
                'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
                'X-XSRF-TOKEN': xsrf
            },
            body: JSON.stringify(page.value)
        });
        saved.value = true;
        await updatePage(editing.value);
        setTimeout(() => saved.value = false, 3000);
    } catch (err) {
        useAlert('Failed to save project page: ' + err, 'Error');
        return;
    }
}

const deletePage = async () => {
    if (!editing.value) {
        useAlert('Please select a project first.', 'Cannot delete project page');
        return;
    }
    if (confirm('Are you sure you want to delete this project\'s page?')) {
        try {
            await $fetch(`${BASE_URL}/v1/projects/${editing.value.slug}`, 
            {
                method: 'DELETE',
                credentials: auth ? 'include' : 'omit',
                headers: {
                    'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
                    'X-XSRF-TOKEN': xsrf
                }
            });
        } catch (err) {
            useAlert('Failed to delete project: ' + err, 'Error');
            return;
        }
        projects.value = projects.value.filter(proj => proj.slug !== editing.value.slug);
        editing.value = projects.value.length ? projects.value[0] : null;
    }
}
</script>

<style scoped>
.picker {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
}

@media screen and (max-width: 725px) {
    .picker {
        flex-direction: column;
        gap: 0.5rem;
    }
    .picker .picker-panel {
        justify-content: center;
    }
}

.picker .picker-panel {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    font-weight: 700;
}

.picker .button-panel {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
}

.button-panel .saved-check {
    color: var(--accent);
}

.centred-text {
    margin: 4rem 0;
    color: var(--light-gray);
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
}

.section {
    width: 100%;
}

.section .options {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    width: 12rem;
}

.section input, .section .tiptap {
    width: 100%;
    margin: 0.5rem 0;
}

.tiptap.body {
    margin-bottom: 1rem;
}

.properties {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    background-color: var(--gray);
    border-radius: 0.5rem;
    margin: 0.5rem 0;
}

.properties label {
    padding: 0.5rem;
    margin: 0.5rem;
    width: 20%;
}

.properties .property-input {
    padding: 0.5rem;
    margin: 0.5rem;
    background-color: var(-background);
    width: 100% !important;
}

.property-input img {
    max-height: 250px;
    align-self: center;
}

.property-input .property-with-button {
    display: flex;
    flex-direction: row;
}

.paired-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
}
</style>