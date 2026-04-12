/**
 * Image optimization script.
 * Converts all PNG assets to WebP with appropriate dimensions.
 * Run: node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "../public/assets");

const JOBS = [
  // Backgrounds: full-screen, max container 640px, 1.4× retina → 900px wide
  { dir: "backgrounds", maxWidth: 900, quality: 82 },
  // Characters: displayed at 140px, 2× retina = 280px → 400px wide (safe margin)
  { dir: "characters", maxWidth: 400, quality: 85 },
  // Artifacts: displayed at 180px, 2× retina = 360px → 400px wide
  { dir: "artifacts", maxWidth: 400, quality: 85 },
];

let totalOriginal = 0;
let totalOptimized = 0;

for (const { dir, maxWidth, quality } of JOBS) {
  const dirPath = path.join(ASSETS, dir);
  const files = fs.readdirSync(dirPath).filter((f) => /\.(png|jpg|jpeg)$/i.test(f));

  for (const file of files) {
    const src = path.join(dirPath, file);
    const dest = path.join(dirPath, file.replace(/\.(png|jpg|jpeg)$/i, ".webp"));

    const meta = await sharp(src).metadata();
    const originalSize = fs.statSync(src).size;

    await sharp(src)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(dest);

    const newSize = fs.statSync(dest).size;
    const savings = Math.round((1 - newSize / originalSize) * 100);

    console.log(
      `${dir}/${file.replace(/\.(png|jpg|jpeg)$/i, ".webp")}` +
      `  ${meta.width}×${meta.height} → max${maxWidth}px` +
      `  ${Math.round(originalSize / 1024)}KB → ${Math.round(newSize / 1024)}KB  (-${savings}%)`
    );

    totalOriginal += originalSize;
    totalOptimized += newSize;
  }
}

const totalSavings = Math.round((1 - totalOptimized / totalOriginal) * 100);
console.log(`\nTotal: ${Math.round(totalOriginal / 1024 / 1024)}MB → ${Math.round(totalOptimized / 1024)}KB  (-${totalSavings}%)`);
