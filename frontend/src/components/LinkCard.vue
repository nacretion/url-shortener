<template>
    <div class="link-card">
        <a
            class="link-card__link link-card__link--short"
            :href="short"
            target="_blank"
            rel="noopener noreferrer"
        >
            {{ short }}
        </a>
        <a
            class="link-card__link link-card__link--original"
            :href="info.originalUrl"
            target="_blank"
            rel="noopener noreferrer"
        >
            {{ info.originalUrl }}
        </a>
        <p>Clicks: {{ info.clickCount }}</p>

        <div class="link-card__buttons">
            <button class="link-card__button" @click="emit('delete', alias)">Delete</button>
            <button class="link-card__button" @click="loadAnalytics">Analytics</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getInfo, getAnalytics } from '../api';
import type { LinkInfo, Analytics } from '../types';

const props = defineProps<{
    shortUrl: string;
}>();

const emit = defineEmits<{
    (e: 'delete', alias: string): void;
}>();

const alias = new URL(props.shortUrl).pathname.slice(1);
const short = props.shortUrl;

const info = ref<LinkInfo>({
    originalUrl: '',
    createdAt: '',
    clickCount: 0,
});

onMounted(async () => {
    const res = await getInfo(alias);
    info.value = res.data;
});

const loadAnalytics = async () => {
    const res = await getAnalytics(alias);
    const data: Analytics = res.data;
    alert(
        `Clicks: ${data.clickCount}\nLast IPs:\n` +
        data.lastIps.join('\n'),
    );
}
</script>

<style>
.link-card {
    border: 1px solid #ccc;
    padding: 16px;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    gap: 8px;
}

.link-card__link {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    font-size: 14px;

    transition: color 0.2s ease-in-out;
}

.link-card__link:hover {
    color: #666;
}

.link-card__link--short {
    font-size: 18px;
}

.link-card__button {
    margin-top: 8px;
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;

    color: #333;
    background-color: #f5f5f5;

    transition: background-color 0.2s ease-in-out;
}

.link-card__button:hover {
    background-color: #e1e1e1;
}

.link-card__buttons {
    display: flex;
    gap: 8px;
}
</style>
