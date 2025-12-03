import planck, { World } from "planck-js";

export class SpaceObject {
  world: World;
  isSelected: boolean;
  isDraggable: boolean;
  width: number;
  height: number;
  body: planck.Body;
  /**
   * Lớp cơ bản cho mọi module của tàu
   * @param {planck.World} world
   * @param {object} options
   *   x, y: vị trí ban đầu (m)
   *   angleDeg: góc nghiêng ban đầu (°)
   */
  constructor(world: planck.World, { x = 0, y = 0, angleDeg = 0 } = {}) {
    this.world = world;
    this.isSelected = false;
    this.isDraggable = true; // Cho phép kéo thả khi ở chế độ chế tạo tàu
    // Hitbox mặc định: hình chữ nhật 1x1m (override trong subclasses)
    this.width = 1;
    this.height = 1;

    // Chuyển độ sang radian
    const angleRad = (angleDeg * Math.PI) / 180;

    // Tạo body động
    this.body = world.createBody({
      type: "dynamic",
      position: planck.Vec2(x, y),
      angle: angleRad,
    });
  }

  // 🔥 Kiểm tra xem click trúng module không
  containsPoint(mouseX: number, mouseY: number) {
    const pos = this.body.getPosition();
    const angle = this.body.getAngle();

    // Chuyển chuột sang tọa độ local-space của module
    const dx = mouseX - pos.x;
    const dy = mouseY - pos.y;

    const localX = dx * Math.cos(-angle) - dy * Math.sin(-angle);
    const localY = dx * Math.sin(-angle) + dy * Math.cos(-angle);

    return (
      localX >= -this.width / 2 &&
      localX <= this.width / 2 &&
      localY >= -this.height / 2 &&
      localY <= this.height / 2
    );
  }

  // 🟦 Highlight nếu được chọn
  setSelected(isSelected: boolean) {
    this.isSelected = isSelected;
  }

  getPosition() {
    const pos = this.body.getPosition();
    return { x: pos.x, y: pos.y };
  }

  getAngle() {
    return this.body.getAngle();
  }

  applyForce(fx: number, fy: number) {
    this.body.applyForceToCenter(planck.Vec2(fx, fy));
  }

  applyTorque(torque: number) {
    this.body.applyTorque(torque);
  }

  /**
   * Module con sẽ override để vẽ
   */
  getAnchorPosition(name: string) {}
  draw(ctx: CanvasRenderingContext2D) {
    // Module con tự quyết định cách vẽ, xoay quanh tâm body
  }
}
