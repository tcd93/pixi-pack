import { GameObject } from "../GameObject";
import { Container, AnimatedSprite, Texture, Loader } from "pixi.js";
import { bomberFrames } from "./assets/loader";

export class Bomberman extends GameObject {
  private currentDirection = 'right'; //change this to see HMR in action

  constructor(stage: Container) {
      super({ stage });
  }

  requireAsset(loader: Loader): Loader {
    Object.keys(bomberFrames).forEach(async key => {
      console.log('adding ' + bomberFrames[key]);
      loader.add(bomberFrames[key]);
    });
    return loader;
  }

  onAssetLoaded(): AnimatedSprite {
      const sprite = new AnimatedSprite(bomberFrames[this.currentDirection].map(path => Texture.from(path)));
      sprite.x = 500;
      sprite.y = 500;
      sprite['vx'] = 1;
      sprite.anchor.set(0.5, 0.5);
      sprite.animationSpeed = 0.3;
      return sprite;
  }
}