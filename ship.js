export class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.modules = [];
  }

  addModule(m) {
    this.modules.push(m);
  }

  draw(ctx) {
    ctx.save();

    // Áp dụng vị trí và góc của tàu
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    for (const m of this.modules) {
      m.draw(ctx);
    }

    ctx.restore();
  }
}
