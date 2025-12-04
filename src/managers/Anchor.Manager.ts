import planck from "planck-js";
import { Anchor } from "../ShipModules/Anchor";
import { Space } from "../Space";
import { Camera } from "../configs/Camera";

export class AnchorManager {
  private static instance: AnchorManager | null = null;
  camera: Camera;
  Anchors: Anchor[] = [];
  selectedAnchor: Anchor | null = null;

  private constructor() {
    this.camera = Camera.getInstance();
  }

  static getInstance() {
    if (!AnchorManager.instance) {
      AnchorManager.instance = new AnchorManager();
    }
    return AnchorManager.instance;
  }

  add(module: Anchor) {
    this.Anchors.push(module);
  }

  remove(module: Anchor) {
    this.Anchors = this.Anchors.filter((m) => m !== module);
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const m of this.Anchors) {
      m.draw(ctx);
    }
  }

  addMouseDown() {
    const canvas = Space.canvas!;
    canvas.addEventListener("mousedown", (e) => {
      const rect = canvas.getBoundingClientRect();
      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;

      const { x: mouseX, y: mouseY } = this.camera.screenToWorld(
        canvasX,
        canvasY,
        Space.canvas!
      );

      // Bỏ chọn tất cả trước
      for (const obj of this.Anchors) {
        obj.setSelected(false);
      }

      // Chọn object đầu tiên chứa point
      const selected = this.Anchors.find((obj) =>
        obj.containsPoint(mouseX, mouseY)
      );
      if (selected) {
        selected.setSelected(true);
        console.log("Hi");
        this.selectedAnchor = selected;
      } else {
        this.selectedAnchor = null;
      }
    });
  }
}
