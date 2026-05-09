const fs = require('fs');

let t = fs.readFileSync('src/components/diorama/DioramaScene.tsx', 'utf8');

// Island Base
t = t.replace(/<cylinderGeometry args=\{\[50, 46, 4, 32\]\} \/>/g, '<cylinderGeometry args={[26, 24, 4, 12]} />');
t = t.replace(/<cylinderGeometry args=\{\[50, 46, 4, 12\]\} \/>/g, '<cylinderGeometry args={[26, 24, 4, 12]} />');
t = t.replace(/<cylinderGeometry args=\{\[50, 50, 0\.1, 32\]\} \/>/g, '<cylinderGeometry args={[26, 26, 0.1, 12]} />');
t = t.replace(/<cylinderGeometry args=\{\[50, 50, 0\.1, 12\]\} \/>/g, '<cylinderGeometry args={[26, 26, 0.1, 12]} />');

// Dirt paths
t = t.replace(/<planeGeometry args=\{\[90, 6\]\} \/>/g, '<planeGeometry args={[48, 5]} />');

// Grass
t = t.replace(/const r = 48 \* Math\.sqrt\(Math\.random\(\)\);/g, 'const r = 25 * Math.sqrt(Math.random());');
t = t.replace(/if \(Math\.abs\(x\) < 3 \|\| Math\.abs\(z\) < 3\) continue;/g, 'if (Math.abs(x) < 2.5 || Math.abs(z) < 2.5) continue;');
t = t.replace(/const count = 400;/g, 'const count = 150;');

// Zone positions
t = t.replace(/<group position=\{\[34, 0, 0\]\} >/g, '<group position={[17, 0, 0]} >');
t = t.replace(/<group position=\{\[0, 0, 34\]\} >/g, '<group position={[0, 0, 17]} >');
t = t.replace(/<group position=\{\[0, 0, -34\]\} >/g, '<group position={[0, 0, -17]} >');
t = t.replace(/<group position=\{\[-34, 0, 0\]\} >/g, '<group position={[-17, 0, 0]} >');

fs.writeFileSync('src/components/diorama/DioramaScene.tsx', t);
console.log('done');
