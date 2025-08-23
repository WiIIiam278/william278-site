<template>
    <div class="dashboard-grid">
        <div class="block fixed-size">
            <VChartLight class="renderer" :option="transactionsOption" @click="(params) => onChartClick(params, transactionsOption)" />
            <div class="options">
                <label for="transactions-period">Period:</label>
                <select id="transactions-period" v-model="transactionQuery" @change="updateTransactions">
                    <option v-for="option of Object.entries(QUERY_OPTIONS)" :value="option[0]">{{ option[0] }}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup>
import { provide } from 'vue'

const QUERY_OPTIONS = {
    'Last 7 days': { days: 7, grouping: 1 },
    'Last 30 days': { days: 30, grouping: 1 },
    'Last 3 months': { days: 120, grouping: 7 },
    'Last 12 months': { days: 365, grouping: 30 },
    'All time': { days: 99999999, grouping: 30 }
}
const transactionQuery = defineModel('transactionQuery')
transactionQuery.value = 'Last 3 months'

const transactionsOption = ref({});
const updateTransactions = async() => {
    const params = QUERY_OPTIONS[transactionQuery.value];
    transactionsOption.value = await useTransactionsChart(params.days, params.grouping, `Transactions - ${transactionQuery.value}`);
}
await updateTransactions();

// provide init-options
const renderer = ref('svg')
const initOptions = computed(() => ({
  height: 500,
  width: 1000,
  renderer: renderer.value,
}));
const onChartClick = (params, option) => {
    if (params.ssrType === 'legend') {
        const key = Object.keys(option.legend.selected)[params.dataIndex]
        option.legend.selected[key] = !option.legend.selected[key];
    }
}

provide(INIT_OPTIONS_KEY, initOptions)
</script>

<style scoped>
object {
  pointer-events: all !important;
}

.fixed-size {
    overflow-x: auto;
}

.dashboard-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
    container: status-container / inline-size;
    margin-bottom: 1rem;
}

.block:nth-child(odd):first-child {
    grid-column: span 2;
}

.block {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding-bottom: 2rem;
    border-bottom: 0.125rem solid var(--gray);
}

.block .options {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
}

.options select {
    width: 150px;
}
</style>