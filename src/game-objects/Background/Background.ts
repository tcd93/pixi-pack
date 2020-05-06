import { GameObject } from '../../app/GameObject';
import { Application, Graphics } from 'pixi.js';

export class Background extends GameObject
{
  constructor(app: Application) 
  {
    super(app);

    const line = new Graphics()
      .lineStyle(1, 0xffffff)
      .moveTo(0, app.view.height / 2);
    drawDashedLine.call(line, app.view.width, app.view.height / 2, 12, 4);

    app.stage.addChild(line);
  }
}

/**
 * @this Graphics graphics instance
 */
function drawDashedLine(toX: number, toY: number, dash = 16, gap = 8) {
  const lastPosition = this.currentPath.points;

  const currentPosition = {
    x: lastPosition[lastPosition.length - 2] || 0,
    y: lastPosition[lastPosition.length - 1] || 0
  };

  const absValues = {
    toX: Math.abs(toX),
    toY: Math.abs(toY)
  };

  for (
    ;
    Math.abs(currentPosition.x) < absValues.toX ||
    Math.abs(currentPosition.y) < absValues.toY;
  ) {
    currentPosition.x =
      Math.abs(currentPosition.x + dash) < absValues.toX
        ? currentPosition.x + dash
        : toX;
    currentPosition.y =
      Math.abs(currentPosition.y + dash) < absValues.toY
        ? currentPosition.y + dash
        : toY;

    this.lineTo(currentPosition.x, currentPosition.y);

    currentPosition.x =
      Math.abs(currentPosition.x + gap) < absValues.toX
        ? currentPosition.x + gap
        : toX;
    currentPosition.y =
      Math.abs(currentPosition.y + gap) < absValues.toY
        ? currentPosition.y + gap
        : toY;

    this.moveTo(currentPosition.x, currentPosition.y);
  }
}