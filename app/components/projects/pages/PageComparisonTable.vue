<template>
    <div class="container">
        <MDC v-if="title?.length" :value="title" tag="h2" unwrap="p" />
        <table>
           <thead>
            <tr v-if="headerImages?.length">
                <th class="blank feature"></th>
                <th class="col header img" v-for="(img, i) in headerImages.split(',')" :style="colBg(i)">
                    <PageAsset v-if="img?.length" :src="img" width="75px" height="75px" />
                </th>
            </tr>
            <tr v-if="headerNames?.length">
                <th class="blank feature"></th>
                <th :class="`col header ${i > 0 ? 'secondary' : ''}`" v-for="(product, i) in headerNames.split(',')" :style="colBg(i)">
                    {{ product }}
                </th>
            </tr>
           </thead> 
           <tbody>
            <tr v-for="(feature, i) in featuresCol.split(',')">
                <td class="feature row">{{ feature }}</td>
                <td class="col value" v-for="(val, j) in rowIcons.split('|')[i].split(',')" :style="colBg(j)">
                    <Icon v-if="val?.length" class="icon" :style="`color: ${colors[val]};`" :name="icons[val]" />
                </td>
            </tr>
           </tbody>
        </table>
        <div class="footnote" v-if="footnote?.length">
            <MDC :value="footnote" tag="p" unwrap="p" />
        </div>
    </div>
</template>

<script setup>
const { title, props } = defineProps({
    title: {
        type: String,
        required: false
    },
    props: {
        type: Object,
        required: true
    }
});

const {
    features_col: featuresCol,
    comparison_cols_headers: headerNames,
    comparison_cols_headers_images: headerImages,
    comparison_cols_rows: rowIcons,
    comparison_cols_shading: colColors,
    icon_map: iconMap,
    footnote
} = props;

const icons = computed(() => {
    let i = {};
    iconMap.split('|').forEach(val => {
        i[val.split(',')[0]] = val.split(',')[1];
    });
    return i;
})
const colors = computed(() => {
    let i = {};
    iconMap.split('|').forEach(val => {
        i[val.split(',')[0]] = val.split(',')[2] ?? '#ffffff';
    });
    return i;
})
const colBg = (i) => (colColors?.length && colColors.split(',').length >= i) ? `background-color: ${colColors.split(',')[i]};` : '';
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 1rem 0;
}

table {
    table-layout: fixed;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    align-items: center;
}

table tr th, table tr td {
    width: 200px;
    text-align: center;
    padding: 0.55rem 0;
}

table th {
    border: none;
    background: none;
}

table td, table th {
    border-left: none;
    border-right: none;
}

table tr .feature {
    text-align: left !important;
    padding-left: 0.55rem;
    color: var(--light-gray);
}

.col.header.img {
    padding: 1rem 0 0 0;
}

.col.header.secondary {
    color: var(--light-gray);
    font-weight: normal;
}

.col.value {
    text-align: center;
    font-size: 1rem;
}

table tr .blank {
    background-color: transparent;
    border: none;
}

.footnote:deep(p) {
    margin: 1rem 0;
    padding: 0;
    color: var(--light-gray);
    text-align: center;
}

.container:deep(h2) {
    border: none !important;
    color: var(--white);
    margin: 0.75rem 0;
    text-align: center;
}

@media screen and (max-width: 1000px) {
    table tr th, table tr td {
        width: 150px;
    }
}

@media screen and (max-width: 700px) {
    table tr th, table tr td {
        width: 100px;
    }
}

@media screen and (max-width: 375px) {
    table tr th, table tr td {
        width: 75px;
    }
}
</style>