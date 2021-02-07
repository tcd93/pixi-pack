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
  import { onMount } from 'svelte';

  let playerScore = 0
  let botScore = 0
  onMount(async () => {
    const { bridge } = await import('../bridge')
    bridge.on('game:add-score:player', () => {
      playerScore++
    })
    bridge.on('game:add-score:bot', () => {
      botScore++
    })
  })
</script>

<div>
  <header>
    <h1 class="text-center">Scoreboard</h1>
  </header>
  <div class='scoreboard'>
    <div>
      <h2>Player</h2>
      <div id="player">{playerScore}</div>
    </div>
    <div>
      <h2>Bot</h2>
      <div id="bot">{botScore}</div>
    </div>
  </div>
</div>