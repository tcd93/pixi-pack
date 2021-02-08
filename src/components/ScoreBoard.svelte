<style>
  header {
    text-align: center;
  }
  .scoreboard {
    display: flex;
    justify-content: space-around;
  }
  #bot {
    text-align: right;
  }
</style>

<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { playerScore, botScore } from './stores.js';

  /*onMount is called everytime route changes, so implement a "onDestroy" here to prevent memory leak*/
  onMount(async () => {
    const { bridge } = await import('../bridge')
    bridge.on('game:add-score:player', () => {
      playerScore.update((s) => s + 1)
    })
    bridge.on('game:add-score:bot', () => {
      botScore.update((s) => s + 1)
    })
  })

  onDestroy(async () => {
    const { bridge } = await import('../bridge')
    bridge.removeListener('game:add-score:player')
    bridge.removeListener('game:add-score:bot')
  })
</script>

<div>
  <header>
    <h1 class="text-center">Scoreboard</h1>
  </header>
  <div class='scoreboard'>
    <div>
      <h2>Player</h2>
      <div id="player">{$playerScore}</div>
    </div>
    <div>
      <h2>Bot</h2>
      <div id="bot">{$botScore}</div>
    </div>
  </div>
</div>