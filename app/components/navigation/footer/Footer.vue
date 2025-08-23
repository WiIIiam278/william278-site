<template>
    <div class="footer-container">
        <footer>
            <div id="copyright">{{ $t('footer-copyright', { 'year': new Date().getFullYear() }) }}</div>
            <div id="navigation">
                <ul>
                    <li>
                        <NuxtLink to="/terms">{{ $t('link-terms') }}</NuxtLink>
                    </li>
                    <li>
                        <a href="https://status.william278.net/" target="_blank">{{ $t('footer-status') }}</a>
                    </li>
                    <li>
                        <a href="https://buymeacoff.ee/william278" target="_blank">{{ $t('footer-buymeacoffee') }}</a>
                    </li>
                    <li>
                        <a href="https://x.com/William27528" target="_blank">{{ $t('footer-twitter-x') }}</a>
                    </li>
                    <li>
                        <a href="https://youtube.com/@william278" target="_blank">{{ $t('footer-youtube') }}</a>
                    </li>
                    <li>
                        <a href="https://github.com/WiIIiam278" target="_blank">{{ $t('footer-github') }}</a>
                    </li>
                </ul>
            </div>
            <div id="version">
                <a :href="gitUrl" target="_blank">
                    <IconifiedText icon="fa6-solid:code-branch">{{ gitHead }}@{{ gitBranch }}</IconifiedText>
                </a>
            </div>
        </footer>
    </div>
</template>

<script setup>
const { t } = useI18n()
const config = useRuntimeConfig()
const gitUrl = config.public.GIT_URL;
const gitHead = config.public.GIT_HASH;
const gitBranch = config.public.GIT_BRANCH;
</script>

<style scoped>
#version {
    margin-right: 2rem;
}

#version a {
    color: var(--light-gray) !important;
}

#copyright {
    margin-left: 2rem;
}

#navigation ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
}

#navigation li::after {
    content: "－";
    margin: 0 0.25rem;
}

#navigation li:last-child:after {
    content: none
}

.footer-container {
    container: footer-container / inline-size;
    margin-top: auto;
}

footer {
    width: 100vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
    color: var(--light-gray);
    background: linear-gradient(180deg, var(--background) 0%, var(--dark-gray) 100%);
}

/* Smaller than 875px */
@container footer-container (max-width: 875px) {
    #version {
        display: none;
    }

    #copyright {
        margin-left: 0;
    }

    #navigation li::after {
        content: none;
    }

    footer {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
    }

    #navigation ul {
        width: 100%;
        display: block;
        text-align: center;
        columns: 3 !important;
        -webkit-columns: 3 !important;
        -moz-columns: 3 !important;
    }
}
</style>