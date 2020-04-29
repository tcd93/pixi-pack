## REQUIREMENT
- If you're using Google Chrome, make sure to **[enable WebGL](https://get.webgl.org/)** (_settings -> advanced -> use hardware acceleration_)
- [Node v12.16.2 LTS](https://nodejs.org/en/)
---
## DEVELOP
`npm install` _(with Administrator rights)_      
`npm run dev`
---
## TYPESCRIPT GOTCHAs
- Mixin does not work with abstract class
    - Typescript team is still working on this
- Mixin is a function, so the constructor execution order goes from inside then out:
    - `mixin(class a, class b)`: `a.constructor() -> b.constructor() -> mixin's constructor()`
- `super` must be called first in the constructor (!?), this may lead to default state being overwritten later
    - Don't initialize states in the constructor, create them `undefined`
    - Prefer immutability
- Typescript is structural (duck-typing), so you don't need to implement an interface to "become" an interface, just it's properties
- There are "tricks" for [nominal typings](https://michalzalecki.com/nominal-typing-in-typescript/)