<template>
    <div class="navigation">
        <div v-for="(_, index) in model">
            <input type="text" v-model="model[index].name" placeholder="Section name" />
            <div class="section">
                <div v-for="(_, linkIndex) in model[index].children">
                    <div class="link">
                        <Icon class="icon" :name="model[index].children[linkIndex].icon" />
                        <input type="text" placeholder="Icon" v-model="model[index].children[linkIndex].icon" />
                        <input type="text" placeholder="Title" v-model="model[index].children[linkIndex].title" />
                        <input type="text" placeholder="Page slug / URL" v-model="model[index].children[linkIndex].url" />
                    </div>
                    <div class="section">
                        <div class="link" v-for="(_, subLinkIndex) in model[index].children[linkIndex].children">
                            <Icon class="icon" :name="model[index].children[linkIndex].children[subLinkIndex].icon" />
                            <input type="text" placeholder="Icon" v-model="model[index].children[linkIndex].children[subLinkIndex].icon" />
                            <input type="text" placeholder="Title" v-model="model[index].children[linkIndex].children[subLinkIndex].title" />
                            <input type="text" placeholder="Page slug / URL" v-model="model[index].children[linkIndex].children[subLinkIndex].url" />
                        </div>
                        <div class="button-pair">
                            <button @click="model[index].children[linkIndex].children.push({order: model[index].children[linkIndex].children.length, title: 'New link', url: '', icon: 'fa6-solid:star', children: []})">
                                +
                            </button>
                            <button :disabled="!model[index].children[linkIndex].children.length" class="red" @click="model[index].children[linkIndex].children.pop()">
                                -
                            </button>
                        </div>
                    </div>
                </div>
                <div class="button-pair">
                    <button @click="model[index].children.push({order: model[index].children.length, title: 'New link', url: '/', icon: 'fa6-solid:star', children: []})">
                        +
                    </button>
                    <button class="red" :disabled="!model[index].children.length" @click="model[index].children.pop()">
                        -
                    </button>
                </div>
            </div>
        </div>
        <div>
            <button @click="model.push({order: model.length, name: 'New section', children: []})">Add section</button>
            <button class="red" :disabled="!model.length" @click="model.pop()">Remove section</button>
        </div>
    </div>
</template>

<script setup>
const model = defineModel()
</script>

<style scoped>
.section {
    border-left: 0.2rem solid var(--background);
    margin-left: 0.5rem;
    padding-left: 0.5rem;
}

.button-pair {
    display: flex;
    flex-direction: row;
    margin-bottom: 0.5rem;
}

.link .icon {
    color: var(--light-gray);
    margin: 0 0.2rem;
}

.button-pair button {
    width: 40px;
    font-size: 1.2rem;
    line-height: 1rem;
    aspect-ratio: 1 !important;
}
</style>