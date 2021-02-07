<script lang="ts">
	import { onMount } from 'svelte';

	import LoadingCircle from '../components/loading-circle.svelte'
	import ScoreBoard from '../components/ScoreBoard.svelte';

	let successkid
	onMount(async () => {
		successkid = (await import('images/successkid.jpg')).default
	})
</script>

<style>
	figure {
		text-align: center;
		margin: 0 auto;
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}
</style>

<svelte:head>
	<title>PIXI with SSR</title>
</svelte:head>

<div>
	<ScoreBoard/>
	<div style='height: 25px'/>
	{#if successkid}
		<figure>
			<img alt='Success Kid' src='{successkid}'>
			<figcaption>Have fun!</figcaption>
		</figure>
	{:else}
		<LoadingCircle/>
	{/if}
</div>
