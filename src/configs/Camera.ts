export class Camera {
  private static instance: Camera | null = null;

  private scale: number = 30;
  private minScale: number = 0.1;
  private maxScale: number = 200;
  private zoomStep: number = 1.1;

  // Camera offset
  private offsetX: number = 0;
  private offsetY: number = 0;

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

  /* =====================
          SCALE (ZOOM)
     ===================== */
  setScale(newScale: number): void {
    this.scale = Math.min(this.maxScale, Math.max(this.minScale, newScale));
  }

  getScale(): number {
    return this.scale;
  }

  zoom(deltaY: number): void {
    if (deltaY < 0) this.scale *= this.zoomStep;
    else this.scale /= this.zoomStep;

    this.scale = Math.min(this.maxScale, Math.max(this.minScale, this.scale));
  }

  addZoomScale(): void {
    window.addEventListener("wheel", (e) => {
      this.zoom(e.deltaY);
    });
  }

  /* =====================
        CAMERA OFFSET
     ===================== */
  getOffsetX() {
    return this.offsetX;
  }

  getOffsetY() {
    return this.offsetY;
  }

  addDragControl(canvas: HTMLCanvasElement): void {
    canvas.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.dragStartX = e.clientX - this.offsetX;
      this.dragStartY = e.clientY - this.offsetY;
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      this.offsetX = e.clientX - this.dragStartX;
      this.offsetY = e.clientY - this.dragStartY;
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });
  }

  // screenX, screenY: tọa độ trong canvas (pixels), ví dụ e.clientX - rect.left
  screenToWorld(screenX: number, screenY: number) {
    const scale = this.getScale();
    const worldX = (screenX - this.getOffsetX()) / scale;
    const worldY = (screenY - this.getOffsetY()) / scale;
    return { x: worldX, y: worldY };
  }
}
