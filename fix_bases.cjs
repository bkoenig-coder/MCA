const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/components/diorama/vignettes');
const files = ['ImperialZone.tsx', 'NaadamZone.tsx', 'NomadicZone.tsx', 'SpiritZone.tsx'];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/\{\/\*\s*(Imperial )?Base Platform\s*\*\/\}\s*<mesh receiveShadow position=\{\[0, -0\.5, 0\]\}>\s*<cylinderGeometry[^>]+>\s*<meshStandardMaterial[^>]+>\s*<\/mesh>/g, '');

  fs.writeFileSync(filePath, content);
  console.log(`Removed base from ${file}`);
});
