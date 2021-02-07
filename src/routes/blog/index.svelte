<script context="module" lang="ts">
  type headOnlyPost = { slug: string; title: string;};

  export function preload() {
		// `blog.json` is `index.json.js`, which only includes the title & slug
    return this.fetch(`blog.json`)
      .then((r: { json: () => any }) => r.json())
      .then((posts: headOnlyPost[]) => {
        return { posts };
      });
  }
</script>

<script lang="ts">
  export let posts: headOnlyPost[];
</script>

<svelte:head>
  <title>FAQ</title>
</svelte:head>

<div>
  <h1>Questions:</h1>

  <ul>
    {#each posts as post}
      <!-- we're using the non-standard `rel=prefetch` attribute to
					tell Sapper to load the data for the page as soon as
					the user hovers over the link or taps it, instead of
					waiting for the 'click' event -->
      <li><a rel="prefetch" href="blog/{post.slug}">{post.title}</a></li>
    {/each}
  </ul>
</div>

<style>
  ul {
    margin: 0 0 1em 0;
    line-height: 1.5;
  }
</style>
