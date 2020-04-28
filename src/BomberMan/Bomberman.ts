import { AnimatedSprite, Texture, Loader, Application } from "pixi.js";
import { GameObject } from "../app/GameObject";
import { importAll, debugRect } from "../common/common";
import { IAnimatableAsset } from "../app/IAnimatableAsset";
import { Materialized } from "../physics/Materialized";

const bomberFrames = {
  front: importAll(require.context('./assets/images/front', false, /\.png$/)),
  back: importAll(require.context('./assets/images/back', false, /\.png$/)),
  left: importAll(require.context('./assets/images/left', false, /\.png$/)),
  right: importAll(require.context('./assets/images/right', false, /\.png$/))
}

type BombermanAttributes = {
  /** unique identifier for objects */
  name: string,
  animationSpeed: AnimatedSprite['animationSpeed'],
  x: AnimatedSprite['x'],
  y: AnimatedSprite['y'],
  currentDirection: keyof {front: string, back: string, left: string, right: string}
}

export class Bomberman extends Materialized(GameObject) implements IAnimatableAsset {
  constructor(app: Application, public attributes: BombermanAttributes, loader?: Loader) {
      super(app, { loader, name: attributes.name, hitBoxShape: 'rect' });
  }

  requireAsset(): Object {
    return bomberFrames;
  }

  onAssetLoaded(): AnimatedSprite {
    let sprite = new AnimatedSprite(bomberFrames[this.attributes.currentDirection].map((path) => Texture.from(path)));
    [ sprite.animationSpeed, sprite.x, sprite.y ] 
    = 
    [ this.attributes.animationSpeed, this.attributes.x, this.attributes.y ];

    //DEBUG
    debugRect(sprite);

    return sprite;
  }
}