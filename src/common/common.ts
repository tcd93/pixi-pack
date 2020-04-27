import { Sprite, Graphics, Renderer, SCALE_MODES } from "pixi.js";

type DefaultModule = { default: string }

/**
 * Import all files from folder (Webpack)
 */
export function importAll(r: __WebpackModuleApi.RequireContext) {
  const modules = r.keys().map(r);
  return modules.map((m: DefaultModule) => m.default);
}

/**
 * Draw a line around shape for debugging
 */
export function debug(sprite: Sprite, renderer: Renderer): void {
  const graphics = new Graphics();
  graphics.lineStyle(2, 0xFF0000, 0.5);
  graphics.beginFill(0xFF0000, 0);
  graphics.moveTo(sprite.x, sprite.y);
  graphics.drawShape(sprite.getBounds());
  graphics.endFill();
  const texture = renderer.generateTexture(graphics, SCALE_MODES.NEAREST, 2);
  sprite.addChild(new Sprite(texture));
  // sprite.addChild(graphics);
}