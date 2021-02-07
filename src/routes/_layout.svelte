<script lang="ts">
	import { defaultLayout } from 'game_config'
	import { onMount } from 'svelte'

	import Nav from '../components/Nav.svelte'
	import LoadingCircle from '../components/loading-circle.svelte'

	export let segment: string

	let canvas: HTMLCanvasElement
	let debugCanvas: HTMLCanvasElement
	let isLoaded: boolean = false

	onMount(() => {
		import('../game').then(({ startOn }) => {
			isLoaded = true
			startOn(canvas, debugCanvas)
		})
	})
</script>

<style>
	main {
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
		display: grid;
		grid-template-columns: 47.5% 5% 47.5%;
		justify-content: center;
	}

	.game-area {
		justify-self: self-end;
	}
</style>

<Nav {segment}/>

<main>
	<!-- game container -->
	<div class='game-area'>
		{#if !isLoaded}
			<LoadingCircle/>
		{/if}
		<canvas bind:this={canvas} width={defaultLayout.container.width} height={defaultLayout.container.height} hidden={!isLoaded}></canvas>
		<canvas bind:this={debugCanvas} width={defaultLayout.container.width} height={defaultLayout.container.height} hidden={!isLoaded}></canvas>
	</div>

	<!-- sepatator -->
	<div></div>

	<!-- other content slot -->
	<slot></slot>
</main>