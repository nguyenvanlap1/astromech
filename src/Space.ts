import planck from "planck-js";

export class Space {
  static canvas = document.getElementById("space") as HTMLCanvasElement | null;
  static ctx: CanvasRenderingContext2D | null = null;
  static world: planck.World | null = null;

  static init() {
    if (!this.canvas) {
      console.error("Canvas #space not found!");
      return;
    }

    this.ctx = this.canvas.getContext("2d");
    this.resize();

    this.world = new planck.World({ gravity: planck.Vec2(0, 0) });

    window.addEventListener("resize", () => this.resize());
  }

  static resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}
