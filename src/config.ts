import { IBodyDefinition } from "matter-js"

export const defaultLayout = {
  container: {
    width: 330,
    height: 600
  },
  paddle: {
    height: 20,
    width: 80
  }
}

export const ballBody: IBodyDefinition = {
  friction: 0,
  frictionAir: 0,
  frictionStatic: 0,
  inertia: Infinity,
  inverseInertia: 0,
  restitution: 1,
  slop: 0,
  mass: 1,
  inverseMass: 0
}

export const paddleBody: IBodyDefinition = {
  friction: 0,
  frictionStatic: 2.0,
  frictionAir: 0.04,
  inertia: Infinity, // paddle can not rotate
  inverseInertia: 0,
  slop: 0,
}