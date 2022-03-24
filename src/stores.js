import { writable } from 'svelte/store';

export const page = writable(document.location.hash.slice(1) || 'home');