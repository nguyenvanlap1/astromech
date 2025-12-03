import planck from "planck-js";
import { SpaceObject } from "../SpaceObject";
import { Space } from "../Space";
import { GameConfig } from "../configs/GameConfig";
import { Camera } from "../configs/Camera";

export class SpaceObjectManager {
  private static instance: SpaceObjectManager | null = null;
  gameConfig: GameConfig;
  camera: Camera;
  world: planck.World;
  spaceObjects: SpaceObject[] = [];
  selectedSpaceObject: SpaceObject | null = null;

  private constructor(world: planck.World) {
    this.world = world;
    this.gameConfig = GameConfig.getInstance();
    this.camera = Camera.getInstance();
  }

  static getInstance(world?: planck.World) {
    if (!SpaceObjectManager.instance) {
      if (!world)
        throw new Error(
          "ModuleManager must be initialized with a world first."
        );
      SpaceObjectManager.instance = new SpaceObjectManager(world);
    }
    return SpaceObjectManager.instance;
  }

  add(module: SpaceObject) {
    this.spaceObjects.push(module);
  }

  remove(module: SpaceObject) {
    this.spaceObjects = this.spaceObjects.filter((m) => m !== module);
    this.world.destroyBody(module.body);
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const m of this.spaceObjects) {
      m.draw(ctx);
    }
  }

  addMouseDown() {
    const canvas = Space.canvas!;
    canvas.addEventListener("mousedown", (e) => {
      const rect = canvas.getBoundingClientRect();
      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;

      const { x: mouseX, y: mouseY } = this.camera.screenToWorld(
        canvasX,
        canvasY
      );

      for (const spaceObject of this.spaceObjects) {
        spaceObject.setSelected(false);
        if (spaceObject.containsPoint(mouseX, mouseY)) {
          spaceObject.setSelected(true);
          this.selectedSpaceObject = spaceObject;
          break;
        }
      }
    });
  }
}
