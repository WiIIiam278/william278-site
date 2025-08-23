<!-- A page for projects -->
<template>
    <div id="page-body">
        <Navbar />
        <div id="project-page">
            <div id="project-readme">
                <slot />
            </div>
            <div id="project-sidebar">
                <slot name="sidebar" />
            </div>
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

#project-page {
    display: flex;
    margin: 1rem auto;
    max-width: 1400px;
    gap: 1rem;
}

#project-readme {
    flex: 1;
    max-width: 65vw;
    width: 95vw;
}

#project-sidebar {
    flex: 1;
    padding: 0 1rem;
    max-width: 325px;
}

/* Less than 650px */
@media screen and (max-width: 900px) {
    #project-page {
        flex-direction: column;
        max-width: 85vw;
    }

    #project-readme {
        max-width: 100%;
        width: 100%;
        padding: 0;
    }

    #project-sidebar {
        max-width: 100%;
        width: 100%;
        padding: 0;
    }
}
</style>