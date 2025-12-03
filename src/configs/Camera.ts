export class Camera {
  private static instance: Camera | null = null;

  x: number = 0; // tọa độ world
  y: number = 0;
  rotation: number = 0; // radian
  scale: number = 30;
  minScale: number = 0.1;
  maxScale: number = 200;
  zoomStep: number = 1.1;

  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;

  private constructor() {}

  static getInstance(): Camera {
    if (!this.instance) {
      this.instance = new Camera();
    }
    return this.instance;
  }

  setScale(newScale: number) {
    this.scale = Math.min(this.maxScale, Math.max(this.minScale, newScale));
  }

  zoom(deltaY: number) {
    if (deltaY < 0) this.scale *= this.zoomStep;
    else this.scale /= this.zoomStep;
    this.scale = Math.min(this.maxScale, Math.max(this.minScale, this.scale));
  }

  // Chuyển đổi screen -> world
  screenToWorld(screenX: number, screenY: number, canvas: HTMLCanvasElement) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Dịch sang origin, xoay ngược lại camera, chia scale
    const dx = screenX - cx;
    const dy = screenY - cy;

    const cosR = Math.cos(-this.rotation);
    const sinR = Math.sin(-this.rotation);

    const worldX = (dx * cosR - dy * sinR) / this.scale + this.x;
    const worldY = (dx * sinR + dy * cosR) / this.scale + this.y;
    return { x: worldX, y: worldY };
  }

  // Chuyển đổi world -> screen
  worldToScreen(worldX: number, worldY: number, canvas: HTMLCanvasElement) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const dx = (worldX - this.x) * this.scale;
    const dy = (worldY - this.y) * this.scale;

    const cosR = Math.cos(this.rotation);
    const sinR = Math.sin(this.rotation);

    const screenX = dx * cosR - dy * sinR + cx;
    const screenY = dx * sinR + dy * cosR + cy;

    return { x: screenX, y: screenY };
  }

  // Thêm pan (rê chuột)
  addDragControl(canvas: HTMLCanvasElement) {
    canvas.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;

      const dx = (e.clientX - this.dragStartX) / this.scale;
      const dy = (e.clientY - this.dragStartY) / this.scale;

      const cosR = Math.cos(-this.rotation);
      const sinR = Math.sin(-this.rotation);

      // Chuyển dx, dy theo hướng camera
      this.x -= dx * cosR - dy * sinR;
      this.y -= dx * sinR + dy * cosR;

      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });
  }

  addZoomScale() {
    window.addEventListener("wheel", (e) => this.zoom(e.deltaY));
  }
}
