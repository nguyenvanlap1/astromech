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
camera.setFollowingBody(tankD.body);
camera.addZoomScale();
camera.addDragControl(Space.canvas!);
spaceObjectManager.addMouseDown();
// Loop vật lý + vẽ
function loop() {
  Space.world?.step(1 / 60, 12, 24);
  camera.updateFollowing();

  Space.ctx?.clearRect(0, 0, Space.canvas!.width, Space.canvas!.height);
  Space.ctx?.save(); // Lưu state gốc

  const cx = Space.canvas!.width / 2;
  const cy = Space.canvas!.height / 2;

  // 1️⃣ Dịch tâm canvas về giữa màn hình
  Space.ctx?.translate(cx, cy);

  // 2️⃣ Scale + rotate camera
  Space.ctx?.scale(camera.scale, camera.scale);
  Space.ctx?.rotate(-camera.rotation);

  // 3️⃣ Dịch toàn bộ thế giới để (camera.x, camera.y) trùng tâm
  Space.ctx?.translate(-camera.x, -camera.y);

  // 4️⃣ Vẽ tất cả object bình thường theo tọa độ world
  spaceObjectManager.draw(Space.ctx!);

  Space.ctx?.restore(); // Trả lại state gốc
  requestAnimationFrame(loop);
}

loop();
