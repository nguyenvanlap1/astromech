const fs = require("fs");
const path = require("path");

const newName = process.argv.slice(2).join(" ");

if (!newName) {
  console.error("❌ Vui lòng nhập tên mới! Ví dụ: npm run rename MyGame");
  process.exit(1);
}

const pkgPath = path.resolve("package.json");
const indexPath = path.resolve("index.html");

// ⭐ Cập nhật package.json
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.name = newName.toLowerCase().replace(/\s+/g, "-");
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), "utf8");

// ⭐ Cập nhật title trong index.html
let indexContent = fs.readFileSync(indexPath, "utf8");
indexContent = indexContent.replace(
  /<title>.*<\/title>/,
  `<title>${newName}</title>`
);
fs.writeFileSync(indexPath, indexContent, "utf8");

console.log(`🚀 Đã đổi tên dự án thành: ${newName}`);
