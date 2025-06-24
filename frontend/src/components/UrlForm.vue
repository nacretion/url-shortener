<template>
    <form class="url-form" @submit.prevent="submit">
        <input class="url-form__input" v-model="url" placeholder="Original URL" required />
        <input class="url-form__input" v-model="alias" placeholder="Custom alias (optional)" />
        <input class="url-form__input" type="date" v-model="expiresAt" />
        <button class="url-form__button" type="submit">Shorten</button>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createLink } from '../api';

const url = ref('');
const alias = ref('');
const expiresAt = ref('');

const emit = defineEmits<{
    (e: 'created', value: string): void;
}>();

const submit = async () => {
    try {
        const res = await createLink({
            originalUrl: url.value,
            alias: alias.value || undefined,
            expiresAt: expiresAt.value || undefined,
        });
        emit('created', res.data.shortUrl);
        url.value = alias.value = expiresAt.value = '';
    } catch (err: any) {
        alert(err.response?.data?.message || 'Error');
    }
}
</script>

<style>
.url-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.url-form__input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;

    outline: none;

    transition: border-color 0.2s ease-in-out;
}

.url-form__input::placeholder {
    color: #999;
}

.url-form__input[type='date'], .url-form__input[type='date']::-webkit-calendar-picker-indicator {
    cursor: pointer;
}

.url-form__input:focus {
    border-color: #666;
}

.url-form__button {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;

    color: #333;
    background-color: #f5f5f5;

    transition: background-color 0.2s ease-in-out;
}

.url-form__button:hover {
    background-color: #e1e1e1;
}
</style>
