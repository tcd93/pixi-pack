## REQUIREMENT
- If you're using Google Chrome, make sure to **[enable WebGL](https://get.webgl.org/)** (_settings -> advanced -> use hardware acceleration_)
- [Node v12.16.2 LTS](https://nodejs.org/en/)
---
## DEVELOP
`npm install` _(with Administrator rights)_      
`npm run dev`
---
### Workarounds
- __`regeneratorRuntime is not defined`__  
  Parcel can't work with Async/Await by default! see issue [#1762](https://github.com/parcel-bundler/parcel/issues/1762)  
  Add this to `package.json`:
  ```
    "browserslist": [
      "last 2 Chrome versions"
    ],
  ```