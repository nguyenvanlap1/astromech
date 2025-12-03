import planck, { World, Body, Vec2, WeldJoint } from "planck-js";

export class Anchor {
  world: World;
  body: Body;
  x: number;
  y: number;
  dir: Vec2;

  constructor(
    world: World,
    body: Body,
    { x, y }: { x: number; y: number },
    dir: Vec2
  ) {
    this.world = world;
    this.body = body;
    this.x = x;
    this.y = y;
    this.dir = dir;
  }

  connect(other: Anchor, type?: string) {
    const worldDirA = this.body.getWorldVector(this.dir);
    const worldDirB = other.body.getWorldVector(other.dir);

    const angA = Math.atan2(worldDirA.y, worldDirA.x);
    const angB = Math.atan2(worldDirB.y, worldDirB.x);

    const target = angB + Math.PI;
    const delta = target - angA;
    this.body.setAngle(this.body.getAngle() + delta);
    this.body.setAngularVelocity(0);

    this.world.createJoint(
      WeldJoint({
        bodyA: this.body,
        bodyB: other.body,
        localAnchorA: Vec2(this.x, this.y),
        localAnchorB: Vec2(other.x, other.y),
        referenceAngle: other.body.getAngle() - this.body.getAngle(),
      })
    );
  }
}
