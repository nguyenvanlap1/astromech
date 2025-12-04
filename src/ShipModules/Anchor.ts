import planck, { World, Body, Vec2, WeldJoint } from "planck-js";

export class Anchor {
  world: World;
  body: Body;
  x: number;
  y: number;
  dir: Vec2;
  isSelected: boolean;

  // Lưu joint hiện tại
  partner: Anchor | null = null;
  currentJoint: planck.Joint | null = null;

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
    this.isSelected = false;
  }

  // Kiểm tra anchor có đang dùng joint không
  isConnected() {
    return this.currentJoint !== null;
  }

  connect(other: Anchor) {
    // ❗ Không cho nối nếu cùng body
    if (this.body === other.body) {
      console.warn("Can't connect anchors on the same body.");
      return;
    }
    // ❗ Không cho nối nếu một trong hai đã kết nối
    if (this.isConnected() || other.isConnected()) {
      console.warn("One of the anchors already connected.");
      return;
    }

    // Căn góc
    const worldDirA = this.body.getWorldVector(this.dir);
    const worldDirB = other.body.getWorldVector(other.dir);

    const angA = Math.atan2(worldDirA.y, worldDirA.x);
    const angB = Math.atan2(worldDirB.y, worldDirB.x);

    const delta = angB + Math.PI - angA;
    this.body.setAngle(this.body.getAngle() + delta);
    this.body.setAngularVelocity(0);

    // check if these two bodies already connected
    for (let j = this.world.getJointList(); j; j = j.getNext()) {
      const joint = j;
      if (
        (joint.getBodyA() === this.body && joint.getBodyB() === other.body) ||
        (joint.getBodyB() === this.body && joint.getBodyA() === other.body)
      ) {
        console.warn("two body are already connected.");
        return; // đã có joint → không nối nữa
      }
    }

    // Tạo weld joint
    const joint = WeldJoint({
      bodyA: this.body,
      bodyB: other.body,
      localAnchorA: Vec2(this.x, this.y),
      localAnchorB: Vec2(other.x, other.y),
    });

    // Lưu joint vào world
    const createdJoint = this.world.createJoint(joint);

    // ❗ Gán joint cho cả hai anchor
    this.currentJoint = createdJoint;
    other.currentJoint = createdJoint;

    this.partner = other;
    other.partner = this;
  }

  // Hủy kết nối
  disconnect() {
    if (this.currentJoint) {
      this.world.destroyJoint(this.currentJoint);

      // reset cả hai anchor
      if (this.partner) {
        this.partner.currentJoint = null;
        this.partner.partner = null;
      }

      this.currentJoint = null;
      this.partner = null;
    }
  }

  // giúp tôi sửa từ đây xuống nếu được chọn thì chuyển màu khác, giúp tôi sửa hàm consrapoins kiểm tra xem có click chúng ko
  draw(ctx: CanvasRenderingContext2D) {
    // Màu ưu tiên: selected > connected > normal
    if (this.isSelected) ctx.fillStyle = "yellow";
    else if (this.isConnected()) ctx.fillStyle = "orange";
    else ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // === Kiểm tra click vào anchor ===
  containsPoint(mouseX: number, mouseY: number) {
    // Anchor radius trong thế giới
    const R = 0.5;

    // Vị trí anchor trong thế giới
    const worldPos = this.body.getWorldPoint(Vec2(this.x, this.y));

    const dx = mouseX - worldPos.x;
    const dy = mouseY - worldPos.y;

    return dx * dx + dy * dy <= R * R;
  }

  setSelected(arg0: boolean) {
    // Tạo weld joint
    this.isSelected = arg0;
  }
}
