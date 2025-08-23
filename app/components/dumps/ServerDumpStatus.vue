<template>
    <div>
        <div class="status-grid" v-if="status.blocks?.length">
            <table v-for="block in status.blocks" class="block">
                <thead><tr class="label"><th colspan="100%">
                    <IconifiedText class="text" :icon="block.icon">{{ block.label }}</IconifiedText>
                </th></tr></thead>
                <tbody>
                    <tr class="content" v-if="block.type === 'LIST'">
                        <td>
                            <ul class="list" >
                                <li v-for="item in block.status">{{ item }}</li>
                            </ul>
                        </td>
                    </tr>
                    <tr class="map" v-else-if="block.type === 'MAP'" v-for="entry in Object.entries(block.status)">
                        <td>{{ entry[0] }}</td>
                        <td class="value">{{ entry[1] }}</td>
                    </tr>
                    <tr class="table" v-else-if="block.type === 'TABLE'">
                        <td>
                            <table>
                                <tr v-for="(row, i) in block.status">
                                    <td v-for="(cell, i) in row">{{ col }}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr class="chart" v-else-if="block.type === 'CHART'">
                        <td>
                            <div class="container" v-if="block.chartType === 'PIE' && block.values && Object.keys(block.values)?.length">
                                <VChartLight class="renderer" :option="getPieFor(block)" />
                            </div>
                            <div class="container" v-else-if="block.chartType === 'BAR' && block.values && Object.keys(block.values)?.length">
                                <VChartLight class="renderer" :option="getBarFor(block)" />
                            </div>
                            <div v-else-if="!block.values || !Object.keys(block.values)?.length">
                                <div class="no-data">
                                    <IconifiedText icon="fa6-solid:info">{{ $t('dump-status-no-block-data') }}</IconifiedText>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="no-status">
            <IconifiedText icon="fa6-solid:info">{{ $t('dump-no-status-info') }}</IconifiedText>
        </div>
    </div>
</template>

<script setup>
import { provide } from 'vue'
const { t } = useI18n()

const { status } = defineProps({
    status: {
        type: Object,
        required: false
    }
})

// provide init-options
const renderer = ref('svg')
const initOptions = computed(() => ({
  height: 300,
  width: 425,
  renderer: renderer.value,
}))

provide(INIT_OPTIONS_KEY, initOptions)

const getPieFor = (block) => {
    if (!block.values) {
        return null;
    }
    return {
        title: {
            text: `Total: ${Object.values(block.values).reduce((a, b) => a + b)}`,
            left: 'center',
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            bottom: '0',
            itemGap: 20,
            textStyle: {
                color: '#fff'
            }
        },
        series: [
            {
                type: 'pie',
                stillShowZeroSum: false,
                label: {
                    show: false
                },
                radius: '65%',
                top: 0,
                data: Object.entries(block.values).map((a) => {return { 'name': a[0], 'value': a[1] }}),
            }
        ],
        darkMode: true
    }
}

const getBarFor = (block) => {
    if (!block.values) {
        return null;
    }
    return {
        title: {
            text: `Total: ${Object.values(block.values).reduce((a, b) => a + b)}`,
            left: 'center',
            textStyle: {
                color: '#fff'
            }
        },
        series: [
            { 
                type: 'bar',
                data: Object.values(block.values),
                barGap: '20%'
            }
        ],
        xAxis: { 
            data: Object.keys(block.keys)
        },
        yAxis: {},
        darkMode: true
    }
}
</script>

<style scoped>
table {
    margin: 0;
}

.label th .text {
    display: flex;
    justify-content: center;
    text-align: center;
}

.status-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
    container: status-container / inline-size;
    margin-bottom: 1rem;
}

.block:nth-child(odd):last-child {
    grid-column: span 2;
}

.block {
    padding: 1rem;
    width: 100%;
}

.block .content .list {
    max-height: 350px !important;
    overflow-y: auto;
    margin: 0;
    padding: 0 0 0 1.5rem;
}

.block .map td {
    width: 50%;
}

.block .map td.value {
    color: var(--light-gray);
    overflow-wrap: break-word;
    text-wrap: wrap;
    max-width: 50px;
}

.chart .container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.no-status {
    color: var(--light-gray);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 70vh;
}

.no-data {
    color: var(--light-gray);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;
}

/* Less than 850px */
@media screen and (max-width: 1200px) {
    .status-grid {
        display: flex;
        flex-direction: column;
    }
}
</style>