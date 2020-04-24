import { GameObject } from "../GameObject";
import { Container, AnimatedSprite, Texture, Loader, Sprite, utils } from "pixi.js";
import { bomberFrames } from "./assets/loader";

type BombermanAttributes = {
  animationSpeed: AnimatedSprite['animationSpeed'],
  x: AnimatedSprite['x'],
  y: AnimatedSprite['y'],
  currentDirection: keyof {front: string, back: string, left: string, right: string}
}

export class Bomberman extends GameObject {
  private attributes;

  constructor(stage: Container, attributes: BombermanAttributes, loader?: Loader) {
      super({ stage, loader });
      this.attributes = attributes;
  }

  requireAsset(): any[] {
    return Object.values(bomberFrames).flat();
  }

  onAssetLoaded(): AnimatedSprite {
      let sprite = new AnimatedSprite(bomberFrames[this.attributes.currentDirection].map(path => Texture.from(path)));
      sprite.anchor.set(0.5, 0.5);

      [ sprite.animationSpeed, sprite.x, sprite.y ] = 
        [ this.attributes.animationSpeed, this.attributes.x, this.attributes.y ];
      // sprite['vx'] = 1;
      return sprite;
  }
}