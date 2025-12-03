import planck, { World } from "planck-js";
import { SpaceObject } from "../SpaceObject";

export class ShipModule extends SpaceObject {
  constructor(world: planck.World, { x = 0, y = 0, angleDeg = 0 } = {}) {
    super(world, { x, y, angleDeg });
  }
}
