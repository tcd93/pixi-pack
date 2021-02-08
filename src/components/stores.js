import { writable } from 'svelte/store';

export const playerScore = writable(0);
export const botScore = writable(0);