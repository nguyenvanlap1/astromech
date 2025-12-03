import planck from "planck-js";
import { ShipModule } from "./ShipModule";
import { Anchor } from "./Anchor";

export class FuelTank extends ShipModule {
  anchors: Record<string, Anchor>;
  constructor(
    world: planck.World,
    {
      x = 13.33,
      y = 10,
      width = 2,
      height = 0.66,
      density = 1,
      angleDeg = 0, // thêm góc khởi tạo
    } = {}
  ) {
    super(world, { x, y, angleDeg }); // truyền góc cho ShipModule
    this.width = width;
    this.height = height;

    // Tạo fixture hình chữ nhật
    this.body.setSleepingAllowed(true);
    this.body.createFixture(planck.Box(width / 2, height / 2), {
      density,
      friction: 0.3,
      restitution: 0.5,
    });
    this.body.setBullet(true);

    // Anchor points
    this.anchors = {
      front: new Anchor(
        this.world,
        this.body,
        { x: width / 2, y: 0 },
        planck.Vec2(1, 0) // hướng ra phía trc
      ),
      back: new Anchor(
        this.world,
        this.body,
        { x: -width / 2, y: 0 },
        planck.Vec2(-1, 0) // hướng ra phía sau
      ),
    };
  }

  draw(ctx: CanvasRenderingContext2D) {
    const pos = this.body.getPosition();
    const angle = this.body.getAngle();

    ctx.save();
    ctx.translate(
      pos.x * this.gameConfig.getScale(),
      pos.y * this.gameConfig.getScale()
    );
    ctx.rotate(angle); // xoay quanh tâm body

    // Vẽ thân
    ctx.fillStyle = "lime";
    ctx.fillRect(
      (-this.width / 2) * this.gameConfig.getScale(),
      (-this.height / 2) * this.gameConfig.getScale(),
      this.width * this.gameConfig.getScale(),
      this.height * this.gameConfig.getScale()
    );

    // ✨ Nếu đang được chọn → vẽ viền vàng đậm
    if (this.isSelected) {
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 4;
      ctx.strokeRect(
        (-this.width / 2) * this.gameConfig.getScale(),
        (-this.height / 2) * this.gameConfig.getScale(),
        this.width * this.gameConfig.getScale(),
        this.height * this.gameConfig.getScale()
      );
    }

    // Vẽ anchor points
    ctx.fillStyle = "red";
    for (const a of Object.values(this.anchors)) {
      ctx.beginPath();
      ctx.arc(
        a.x * this.gameConfig.getScale(),
        a.y * this.gameConfig.getScale(),
        4,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  }
}
