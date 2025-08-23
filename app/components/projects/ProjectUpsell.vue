<template>
    <div class="upsell">
        <div class="explainer">
            Since {{ meta.name }} is a premium resource, you'll need to buy it and sign in here with Discord after verifying your purchase in order to access downloads.
        </div>
        <div class="steps">
            <div class="step">
                <div class="icon-container">
                    <Icon class="icon" name="fa6-solid:bag-shopping" />
                    <h3>Buy {{ meta.name }}</h3>
                </div>
                <p>from one of the marketplaces below.</p>
            </div>
            <div class="separator">
                <Icon name="fa6-solid:chevron-right" />
            </div>
            <div class="step">
                <div class="icon-container">
                    <Icon class="icon" name="fa6-solid:check" />
                    <h3>Verify purchase</h3>
                </div>
                <p>on the <a href="https://discord.gg/tVYhJfyDWG" target="_blank" title="Click to join">HuskHelp Discord Server</a>.</p>
            </div>
            <div class="separator">
                <Icon name="fa6-solid:chevron-right" />
            </div>
            <div class="step">
                <div class="icon-container">
                    <Icon class="icon" name="fa6-solid:key" />
                    <h3 v-if="!user">Log in here</h3>
                    <h3 v-else>Log back in here</h3>
                </div>
                <p>to access all your downloads.</p>
            </div>
        </div>
        <div class="platforms">
            <h3>You can buy {{ meta.name }} on:</h3>
            <div class="badges">
                <PlatformBadge v-for="link of platforms" :platform="link.id" :link="link.url" type="platform" />
            </div>
            <div v-if="!user" class="login-prompt">Already bought {{ meta.name }}? <NuxtLink to="/account/login"><IconifiedText icon="fa6-solid:key">{{ $t('link-log-in') }}</IconifiedText></NuxtLink></div>
            <div v-else class="login-prompt">Already bought {{ meta.name }}? <NuxtLink to="/account/login"><IconifiedText icon="fa6-solid:person-running">{{ $t('link-log-in') }}</IconifiedText></NuxtLink> again to refresh your purchases.</div>
        </div>
    </div>
</template>

<script setup>
const { t } = useI18n();
const { user } = await useUser();
const { project } = defineProps({
    project: {
        type: Object,
        required: true
    }
});
const { metadata: meta } = project;
const platforms = meta.links.filter(link => ['spigot', 'polymart', 'builtbybit'].includes(link.id))
</script>

<style scoped>
.platforms, .explainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-items: center;
}

.platforms h3 {
    margin: 0;
    margin-bottom: 0.25rem;
}

.platforms .badges {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    margin: 0.5rem 0;
    gap: 1rem;
}

.platforms .login-prompt {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    color: var(--light-gray);
    margin-bottom: 1rem;
}

.steps {
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    margin: 1.5rem 0;
}

.steps .step {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0.5rem;
    width: 30%;
    background-color: var(--dark-gray);
    border-radius: 0.5rem;
    border: 0.125rem solid var(--gray)
}

.step .icon-container {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.step p a {
    color: var(--light-gray) !important;
    text-decoration: underline;
}

.steps .separator {
    display: flex;
    justify-content: center;
    align-content: center;
    color: var(--gray);
    font-size: 1.5rem;
    margin: auto 0
}

.step h3 {
    margin: 0.75rem 0;
}

.step p {
    margin-top: 0;
    color: var(--light-gray);
}

.step .icon {
    font-size: 2em;
}

@media screen and (max-width: 700px) {
    .upsell {
        overflow-y: auto;
    }

    .steps {
        flex-direction: column;
    }

    .steps .step {
        width: 75%;
        margin: 0.5rem auto;
    }

    .step .icon-container {
        margin-top: 0.2rem;
        flex-direction: row;
        gap: 0.5rem;
    }

    .step .icon {
        font-size: 1.5rem;
    }

    .steps .separator {
        transform: rotate(90deg);
    }
}
</style>

