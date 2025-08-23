<template>
    <nav :class="`shadow ${hamburgerOpen ? 'mobile lock-scrolling' : 'desktop'}`">
        <div id="menu">
            <h1 id="logo">
                <NuxtLink to="/">{{ $t('site-name') }}</NuxtLink>
            </h1>
            <div id="hamburger" @click="hamburgerOpen = !hamburgerOpen">
                <Icon v-if="!hamburgerOpen" name="fa6-solid:bars" />
                <Icon v-else name="fa6-solid:xmark" />
            </div>
        </div>
        <div id="navigation">
            <NavbarLinks />
        </div>
    </nav>
</template>

<script setup>
const { t } = useI18n()
const hamburgerOpen = ref(false);
</script>

<style scoped>
nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: var(--gray);
    font-size: 1.2rem;
    font-weight: 500;
    padding: 0 2rem;
    height: 4rem;
}

nav #menu {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

nav #logo {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent);
    display: flex;
    margin: auto 0;
}

nav #navigation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 2rem;
}

nav #hamburger {
    display: none;
}

/* Tablet Navbar */
@media screen and (max-width: 860px) {
    nav {
        flex-direction: column;
        height: 6rem;
        justify-content: center;
        align-items: center;
    }

    nav #logo {
        margin-bottom: 0.2rem;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
}


/* Mobile Hamburger Navbar */
@media screen and (max-width: 500px) {
    nav {
        height: 4rem;
        padding-left: 2.25rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    nav #navigation {
        display: none;
    }

    nav #hamburger {
        display: flex;
        font-size: x-large;
    }

    nav #hamburger:hover {
        filter: brightness(85%);
        cursor: pointer;
    }

    nav #logo {
        justify-content: start;
        margin: 0;
    }

    nav.mobile {
        position: fixed;
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 86.3vw;
        z-index: 100;
    }

    nav.mobile #menu {
        height: 4rem;
    }

    nav.mobile #navigation {
        display: flex;
        justify-self: start;
        align-self: start;
        margin-bottom: auto;
    }

}
</style>