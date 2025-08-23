<template>
    <div class="editor">
        <div class="buttons" v-if="editor">
            <button
                @click="editor.chain().focus().toggleBold().run()"
                :disabled="!editor.can().chain().focus().toggleBold().run()"
                :class="{ 'is-active': editor.isActive('bold') }"
            >
                <Icon name="fa6-solid:bold" />
            </button>
            <button
                @click="editor.chain().focus().toggleItalic().run()"
                :disabled="!editor.can().chain().focus().toggleItalic().run()"
                :class="{ 'is-active': editor.isActive('italic') }"
            >
                <Icon name="fa6-solid:italic" />
            </button>
            <button
                @click="editor.chain().focus().toggleStrike().run()"
                :disabled="!editor.can().chain().focus().toggleStrike().run()"
                :class="{ 'is-active': editor.isActive('strike') }"
            >
                <Icon name="fa6-solid:strikethrough" />
            </button>
            <button
                @click="editor.chain().focus().setParagraph().run()"
                :class="{ 'is-active': editor.isActive('paragraph') }"
            >
                <Icon name="fa6-solid:paragraph" />
            </button>
            <button
                @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
            >
                <Icon name="fa6-solid:heading" />1
            </button>
            <button
                @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
            >
                <Icon name="fa6-solid:heading" />2
            </button>
            <button
                @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
            >
                <Icon name="fa6-solid:heading" />3
            </button>
            <button
                @click="editor.chain().focus().toggleBulletList().run()"
                :class="{ 'is-active': editor.isActive('bulletList') }"
            >
                <Icon name="fa6-solid:list-ul" />
            </button>
            <button
                @click="editor.chain().focus().toggleOrderedList().run()"
                :class="{ 'is-active': editor.isActive('orderedList') }"
            >
                <Icon name="fa6-solid:list-ol" />
            </button>
            <button
                @click="editor.chain().focus().toggleCodeBlock().run()"
                :class="{ 'is-active': editor.isActive('codeBlock') }"
            >
                <Icon name="fa6-solid:code" />
            </button>
            <button
                @click="editor.chain().focus().toggleBlockquote().run()"
                :class="{ 'is-active': editor.isActive('blockquote') }"
            >
                <Icon name="fa6-solid:quote-left" />
            </button>
            <button @click="editor.chain().focus().setHorizontalRule().run()">
                <Icon name="fa6-solid:ruler-horizontal" />
            </button>
            <button @click="editor.chain().focus().setHardBreak().run()">
                <Icon class=carraige-return name="fa6-solid:arrow-turn-down" />
            </button>
            <button
                @click="editor.chain().focus().undo().run()"
                :disabled="!editor.can().chain().focus().undo().run()"
            >
                <Icon name="fa6-solid:rotate-left" />
            </button>
            <button
                @click="editor.chain().focus().redo().run()"
                :disabled="!editor.can().chain().focus().redo().run()"
            >
                <Icon name="fa6-solid:rotate-right" />
            </button>
        </div>
        <TiptapEditorContent class="content" :editor="editor" />
    </div>
</template>

<script setup>
import { Placeholder as TiptapPlaceholder } from '@tiptap/extension-placeholder'
import { Markdown as TiptapMarkdown } from 'tiptap-markdown';

const { modelValue, editable, placeholder } = defineProps({
    modelValue: {
        type: String,
        default: '',
        required: true,
    },
    editable: {
        type: Boolean,
        default: true,
    },
    placeholder: {
        type: String,
        required: false,
        default: 'Enter value (supports Markdown formatting)...'
    }
})
const emit = defineEmits(['update:modelValue'])
const lowlight = createLowlight(allLanguages);
const editor = useEditor({
  content: modelValue,
  editable: editable,
  extensions: [TiptapStarterKit.configure({ codeBlock: false }), TiptapCodeBlockLowlight.configure({ lowlight }), TiptapMarkdown, TiptapPlaceholder.configure({ placeholder: placeholder })],
  onUpdate: () => {
    emit('update:modelValue', editor.value?.storage.markdown.getMarkdown())
  },
});

watch(
  () => modelValue,
  (value) => {
    if (!editor.value?.storage.markdown.getMarkdown() === value) {
        editor.value.commands.setContent(value, false)
    }
  },
)

onBeforeUnmount(() => {
  unref(editor).destroy();
});
</script>

<style scoped>
.editor {
    margin: 0.5rem 0;
}

.buttons {
    display: flex;
    padding: 0.75rem;
    gap: 0.5rem;
    flex-wrap: wrap;
    border: 0.15rem solid var(--gray);
    background-color: var(--dark-gray);
    border-radius: 0.5rem 0.5rem 0 0;
}

.buttons button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    height: 45px;
    min-width: 45px;
}

.content {
    border-radius: 0 0 0.5rem 0.5rem;
    padding: 0.5rem 1.5rem;
    border: 0.15rem solid var(--gray);
    border-top: none;
    background-color: var(--background);
}

.content:deep(p.is-editor-empty:first-child::before) {
    color: var(--light-gray);
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
}

.carraige-return {
    rotate: 90deg;
}
</style>