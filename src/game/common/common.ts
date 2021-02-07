import { Sprite, Graphics } from "pixi.js";

// type DefaultModule = { default: string }

/**
 * Import all files from folder (Webpack)
 */
// export function importAll(r: __WebpackModuleApi.RequireContext) {
//   const modules = r.keys().map(r);
//   return modules.map((m: DefaultModule) => m.default);
// }

/**
 * Draw a rect around shape for debugging
 */
export function debugRect(sprite: Sprite): void {
  const bound = sprite.getBounds();
  sprite.addChild(
    new Graphics()
      .lineStyle(2, 0xFF0000, 0.5)
      .beginFill(0xFF0000, 0)
      .drawRect(0, 0, bound.width, bound.height)
      .endFill()
  );
  // sprite.addChild(graphics);
}