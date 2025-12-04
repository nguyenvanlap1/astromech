import planck from "planck-js";
import { ShipModule } from "./ShipModule";
import { Anchor } from "./Anchor";

export class FuelTank extends ShipModule {
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
    ctx.translate(pos.x, pos.y);
    ctx.rotate(angle); // xoay quanh tâm body

    // Vẽ thân
    ctx.fillStyle = "lime";
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // ✨ Nếu đang được chọn → vẽ viền vàng đậm
    if (this.isSelected) {
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 0.1;
      ctx.strokeRect(
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    }

    // Vẽ anchor points
    for (const a of Object.values(this.anchors!)) {
      a.draw(ctx);
    }

    ctx.restore();
  }
}
