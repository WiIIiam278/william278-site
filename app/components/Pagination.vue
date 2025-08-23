<template>
    <div class="pagination-buttons">
        <div class="button-row">
            <label>Page:</label>
            <button @click="() => {pageNumber--; $emit('update', pageNumber, itemsPerPage)}" :disabled="pageNumber === 1">Previous</button>
            <input class="page-input" v-model="pageNumber" @change="$emit('update', pageNumber, itemsPerPage)" type="number" 
                min="1" :max="data.page.totalPages" />
            <label>/ {{ data.page.totalPages }}</label>
            <button @click="() => {pageNumber++; $emit('update', pageNumber, itemsPerPage)}" :disabled="pageNumber >= data.page.totalPages">Next</button>
        </div>
        <div class="button-row">
            <label>Per page:</label>
            <select class="page-input" v-model="itemsPerPage" @change="$emit('update', pageNumber, itemsPerPage)">
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="50">50</option>
            </select>
        </div>
    </div>
</template>


<script setup>
const { data } = defineProps({
    data: {
        type: Object,
        required: true
    }
});
const pageNumber = ref(1);
const itemsPerPage = ref(15);
const emit = defineEmits(['update']);
</script>

<style scoped>
.pagination-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 1rem;
}

.pagination-buttons .page-input {
    width: 80px;
    margin: 0 0.5rem;
}

.pagination-buttons label {
    margin-right: 0.5rem;
}
</style>