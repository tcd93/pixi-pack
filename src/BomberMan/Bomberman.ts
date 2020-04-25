import { GameObject } from "../GameObject";
import { Container, AnimatedSprite, Texture, Loader } from "pixi.js";
import { importAll } from "../common/common";

const bomberFrames = {
  front: importAll(require.context('./assets/images/front', false, /\.png$/)),
  back: importAll(require.context('./assets/images/back', false, /\.png$/)),
  left: importAll(require.context('./assets/images/left', false, /\.png$/)),
  right: importAll(require.context('./assets/images/right', false, /\.png$/))
}

type BombermanAttributes = {
  animationSpeed: AnimatedSprite['animationSpeed'],
  x: AnimatedSprite['x'],
  y: AnimatedSprite['y'],
  currentDirection: keyof {front: string, back: string, left: string, right: string}
}

export class Bomberman extends GameObject {
  private attributes: BombermanAttributes;

  constructor(stage: Container, attributes: BombermanAttributes, loader?: Loader) {
      super({ stage, loader });
      this.attributes = attributes;
  }

  requireAsset(): Object {
    return bomberFrames;
  }

  onAssetLoaded(): AnimatedSprite {
      let sprite = new AnimatedSprite(bomberFrames[this.attributes.currentDirection].map((path) => Texture.from(path)));
      sprite.anchor.set(0.5, 0.5);

      [ sprite.animationSpeed, sprite.x, sprite.y ] = 
        [ this.attributes.animationSpeed, this.attributes.x, this.attributes.y ];
      // sprite['vx'] = 1;
      return sprite;
  }
}