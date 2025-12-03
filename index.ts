import { Space } from "./src/Space";
import { FuelTank } from "./src/ShipModules/FuelTank";
import planck from "planck-js";

import { GameConfig } from "./src/configs/GameConfig";
import { Camera } from "./src/configs/Camera";
import { SpaceObjectManager } from "./src/managers/SpaceObjectManager";
// Khởi tạo Space
Space.init();
const gameConfig = GameConfig.getInstance();
const camera = Camera.getInstance();
const spaceObjectManager = SpaceObjectManager.getInstance(Space.world);
// Tạo 2 FuelTank đã nối
const tankA = new FuelTank(Space.world, {
  x: 13.33,
  y: 10,
  width: 2,
  height: 0.66,
  density: 1,
});
const tankB = new FuelTank(Space.world, {
  x: 18.33,
  y: 10,
  width: 2,
  height: 0.66,
  density: 1,
  angleDeg: 0,
});

// Joint nhẹ, không ép mạnh
tankA.anchors.front.connect(tankB.anchors.front);

// Tạo thùng thứ 3 bay về phía 2 thùng
const tankC = new FuelTank(Space.world, {
  x: 30,
  y: 10,
  width: 2,
  height: 0.66,
  density: 1,
});

// Áp lực ban đầu cho tankC bay về phía 2 thùng
tankC.body.applyLinearImpulse(
  planck.Vec2(-50, 0),
  tankC.body.getWorldCenter(),
  true
);

// Tạo thùng thứ 4 bay ngược hướng các thùng hiện tại
const tankD = new FuelTank(Space.world, {
  x: 5, // xuất hiện bên trái của tankA
  y: 10,
  width: 2,
  height: 0.66,
  density: 1,
});

// Áp lực ban đầu cho tankD bay về phía phải (ngược hướng tankC)
tankD.body.applyLinearImpulse(
  planck.Vec2(50, 0), // lực dương trên trục x để bay sang phải
  tankD.body.getWorldCenter(),
  true
);

spaceObjectManager.add(tankA);
spaceObjectManager.add(tankB);
spaceObjectManager.add(tankC);
spaceObjectManager.add(tankD);
// camera.followTarget(tankB.body);
camera.addZoomScale();
camera.addDragControl(Space.canvas);
spaceObjectManager.addMouseDown();
// Loop vật lý + vẽ
function loop() {
  Space.world?.step(1 / 60, 12, 24); // positionIterations cao hơn để tránh ăn nhau
  // camera.update();
  Space.ctx?.clearRect(0, 0, Space.canvas.width, Space.canvas.height);
  Space.ctx?.save(); // Lưu lại state gốc
  Space.ctx?.translate(camera.getOffsetX(), camera.getOffsetY());
  Space.ctx?.scale(camera.getScale(), camera.getScale());
  // Space.ctx?.rotate(-camera.getRotation()); // 👈 xoay ngược hệ trục để camera xoay đúng logic
  spaceObjectManager.draw(Space.ctx);
  Space.ctx?.restore();
  requestAnimationFrame(loop);
}

loop();
