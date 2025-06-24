<template>
    <main class="app">
        <h1>Shorten your URL</h1>
        <UrlForm @created="addLink" />
        <LinkCard
            v-for="url in urls"
            :key="url"
            :shortUrl="url"
            @delete="removeLink"
        />
    </main>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import UrlForm from './components/UrlForm.vue';
import LinkCard from './components/LinkCard.vue';
import {deleteLink, getLinks} from './api';

const urls = ref<string[]>([]);

const addLink = (url: string) => {
    urls.value.unshift(url);
}

onMounted(async () => {
    urls.value = await getLinks();
});

const removeLink = async (alias: string) => {
    await deleteLink(alias);
    urls.value = urls.value.filter(
        (url) => !url.endsWith('/' + alias),
    );
}
</script>

<style>
.app {
    display: flex;
    flex-direction: column;
    gap: 16px;

    max-width: 600px;
    width: 100%;

    padding: 16px 32px;
}

@media (max-width: 400px) {
    .app {
        padding: 16px;
    }
}
</style>
