<!-- A default page with content margins -->
<template>
    <div id="page-body">
        <Navbar />
        <div id="page-content">
            <slot />
        </div>
        <Footer />
    </div>
</template>

<style scoped>
#page-body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

#page-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
}
</style>