import { ShipModule } from "./ShipModule.js";

export class Hull extends ShipModule {
  draw(ctx) {
    this.begin(ctx);

    // ------- Mũi tàu -------
    ctx.beginPath();
    ctx.moveTo(25, 0);
    ctx.quadraticCurveTo(-10, 20, -20, 14);
    ctx.lineTo(-20, -14);
    ctx.quadraticCurveTo(-10, -20, 25, 0);
    ctx.closePath();

    ctx.fillStyle = "#e6e6e6";
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    // ------- Thân dưới -------
    ctx.beginPath();
    ctx.moveTo(-20, 14);
    ctx.lineTo(-50, 14);
    ctx.lineTo(-50, -14);
    ctx.lineTo(-20, -14);
    ctx.closePath();
    ctx.fillStyle = "#dcdcdc";
    ctx.strokeStyle = "#1a1a1a";
    ctx.fill();
    ctx.stroke();

    this.end(ctx);
  }
}
