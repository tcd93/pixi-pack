// Ordinarily, you'd generate this data from markdown files in your
// repo, or fetch them from a database of some kind. But in order to
// avoid unnecessary dependencies in the starter template, and in the
// service of obviousness, we're just going to leave it here.

// This file is called `_posts.js` rather than `posts.js`, because
// we don't want to create an `/blog/posts` route — the leading
// underscore tells Sapper not to do that.

const posts = [
	{
		title: 'What is this?',
		slug: 'what-is-this',
		html: `
			<p>This is just a template project to get you quickly started with PIXI.js</p>

			<p>Out of the box, you get:</p>

			<ul>
				<li>A (very bad) Pong game that somehow implements a <a href='https://brm.io/matter-js/'>physics engine</a></li>
				<li>An OOP(-ish?) style of writing game objects</li>
				<li>Typescript</li>
				<li>Code-splitting, dynamic imports and live reloading, powered by Rollup</li>
				<li>Server-side rendering (SSR) with client-side hydration, Service worker for offline support using <a href='https://sapper.svelte.dev/'>Sapper</a></li>
				<li><b>No</b> support for IE</li>
			</ul>
		`
	},

	{
		title: 'Basic structure',
		slug: 'basic-structure',
		html: `
			<p>Two main parts:</p>
			<ul>
				<li>The <b>game</b> part (PIXI & Matter)</li>
				<li>The <b>other stuff</b> part (Sapper)</li>
			</ul>

			<p>The game includes: <code>game.ts</code>,<code>game_config.ts</code> & the bunch of <i>game objects</i> inside <code>/src/game</code> folder</p>
			<ul>
				<li>
					<details>
						<summary><code>game.ts</code> specifies the basic layout: a canvas container & the <i>game objects</i></summary>
						<pre><code>
new Container({
	view: canvas, // the canvas element to draw the game on
	builder: (app, { topId, bottomId }) => [
		new Background(app),
		new Ball({ app: app, name: 'ball', onCollisionCallback: (otherBody) => ... }),
		new Paddle({ app: app, name: 'paddle-top' }),
		new Paddle({ app: app, name: 'paddle-bottom' })
	]
})
						</code></pre>
					</details>
				</li>

				<li>
					<code>game_config.ts</code> contains defaults for canvas width, height & physics stuff such as friction, inertia...
				</li>

				<li>
					<details>
						<summary><i>Game objects</i> should extends <code>src/game/app/GameObject.ts</code> parent class & be included in <code>game.ts</code></summary>
						<pre><code>
class Ball extends GameObject // basic
class Ball extends Materialized(GameObject) // "materialize" it and include in physics world, trigger onCollisionCallback
class Ball extends Interactive(Materialized(GameObject)) // subscribe to key press events
						</code></pre>
					</details>
				</li>

				<li>
					There are two game loops (exposed as <code>update(_delta: time)</code> & <code>fixedUpdate(_delta: time)</code>)
						<ul>
							<li>
								<code>update()</code> does not have FPS cap, there more refresh rate your monitor have, the lower <code>_delta</code> goes
							</li>
							<li>
								<code>fixedUpdate()</code> have FPS cap of <i>60FPS</i>, <code>_delta</code> will stay closely to 1.0 as it can; you should put logics & physics-related codes inside this loop (this is to prevents
								having objects on 144Hz monitor move more quickly than a 60Hz one)
							</li>
						</ul>
				</li>

				<li>
					<details>
						<summary>Some already-made interfaces that a <i>Game object</i> can implements to simplify codes</summary>
						<pre><code>
// A game object can implement "Shapeable" interface & "requiredGraphics" method,
// it requires a PIXI Graphics instance to draw onto the canvas stage
class Ball extends GameObject implements Shapeable {
  requireGraphics(): Graphics {
    const [x, y, radius] = [100, 100, 6]
    //draw a circle
    return new Graphics().beginFill(0xFFFFFF).drawCircle(x, y, radius).endFill()
  }
}
						</code></pre>
					</details>
				</li>
			</ul>

			<p>The other stuffs (such as this block of texts) are handled by Svelte</p>

			<p>To bridge events generated from canvas to Svelte components, we can use <code>EventEmitter</code></p>
		`
	},
];

posts.forEach(post => {
	post.html = post.html.replace(/^\t{3}/gm, '');
});

export default posts;
