<template>
    <div class="breadcrumbs-bar">
        <slot />
    </div>
</template>

<style scoped>
.breadcrumbs-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
</style>