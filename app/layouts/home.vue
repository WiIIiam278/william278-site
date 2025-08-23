<!-- A basic page template with no default content margins -->
<template>
    <div id="page-body">
        <Navbar />
        <slot />
        <Footer />
    </div>
</template>

<style scoped>
#page-body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
</style>