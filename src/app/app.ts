import { bomberFrames } from '../assets/loader';
import * as PIXI from 'pixi.js';

interface BomberFrames {
    front: string[];
    back: string[];
    right: string[];
    left:  string[];
}

const playerFrames: BomberFrames = bomberFrames;
const currentFrame: keyof BomberFrames = 'right'; //change this to see HMR in action

export class GameApp {

    private app: PIXI.Application;

    constructor() {
        this.app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight, backgroundColor : 0x000000});
        document.body.appendChild(this.app.view)
        let loader = new PIXI.Loader();

        Object.keys(playerFrames).forEach(key => {
            loader.add(playerFrames[key]);
        });
        loader.load(this.onAssetsLoaded.bind(this));
    }

    private onAssetsLoaded() {
        const playerIdle: PIXI.AnimatedSprite = new PIXI.AnimatedSprite(playerFrames[currentFrame].map(path => PIXI.Texture.from(path)));

        playerIdle.x = 500;
        playerIdle.y = 500;
        playerIdle['vx'] = 1;
        playerIdle.anchor.set(0, 1);
        playerIdle.animationSpeed = 0.3;
        playerIdle.play();

        this.app.stage.addChild(playerIdle);
    }

}
