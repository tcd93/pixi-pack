A sample game template written using Pixi.js (for render), Matter.js (for physics emulation) on Typescript 4

**Features:**
- Hot reload using Webpack
- Declarative...ish

Inspired by Flutter's awesome way of writing apps (cool-looking UI without even touching any css stuff), here's my take on writing declarative UI (sort of) using Typescript

Can you guess what this peace of code does? See it in action [here](https://tcd93.github.io/pingpong/)

```ts
const canvasElement = document.querySelector('#canvas-container') as HTMLCanvasElement

new Container({
  view: canvasElement,
  builder: (app, { topId, bottomId }) => [
    new Background(app),
    new Ball({app: app, name: 'ball',
              onCollision: other => {
                if (other.id === topId) console.log('player win!')
                if (other.id === bottomId) console.log('bot win!')
              }
    }),
    new Paddle({app: app, name: 'paddle-top'}),
    new Paddle({app: app, name: 'paddle-bottom',
      y: defaultLayout.container.height - defaultLayout.paddle.height / 2
    }),
  ]
})
```

### REQUIREMENT
- If you're using Google Chrome, make sure to **[enable WebGL](https://get.webgl.org/)** (_settings -> advanced -> use hardware acceleration_)
- [Node v12.16.2 LTS](https://nodejs.org/en/) onwards
### DEVELOP
```
npm install
npm run dev
```