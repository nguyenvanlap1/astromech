import { ShipModule } from "./ShipModule.js";

export class Engine extends ShipModule {
  constructor(world, shipBody, options = {}) {
    super(world, shipBody, options);
    this.active = false; // động cơ tắt mặc định
  }

  draw(ctx) {
    this.begin(ctx);

    // ------- ỐNG ĐỘNG CƠ -------
    ctx.beginPath();
    ctx.moveTo(-25, 10);
    ctx.lineTo(-40, 8);
    ctx.lineTo(-40, -8);
    ctx.lineTo(-25, -10);
    ctx.closePath();
    ctx.fillStyle = "#4c4c4c";
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    // Miệng ống
    ctx.beginPath();
    ctx.ellipse(-40, 0, 3.5, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#111";
    ctx.fill();

    // Ngọn lửa chỉ hiện khi active
    if (this.active) {
      const flameGradient = ctx.createLinearGradient(-40, 0, -90, 0);
      flameGradient.addColorStop(0, "rgba(0,180,255,0.95)");
      flameGradient.addColorStop(1, "rgba(0,60,120,0)");
      ctx.beginPath();
      ctx.moveTo(-40, 0);
      ctx.quadraticCurveTo(-75, 20, -90, 0);
      ctx.quadraticCurveTo(-75, -20, -40, 0);
      ctx.closePath();
      ctx.fillStyle = flameGradient;
      ctx.fill();
    }

    this.end(ctx);
  }

  // Hàm bật/tắt động cơ
  toggle() {
    this.active = !this.active;
  }

  // Hàm sinh lực đẩy nếu active
  thrust(force = 50) {
    if (!this.active) return;
    const localPoint = planck.Vec2(-40 / 30, 0);
    const worldPoint = this.shipBody.getWorldPoint(localPoint);
    const dir = this.shipBody.getWorldVector(planck.Vec2(-1, 0));
    this.shipBody.applyForce(
      planck.Vec2(dir.x * force, dir.y * force),
      worldPoint
    );
  }
}
