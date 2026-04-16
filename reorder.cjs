const fs = require('fs');
const file = './src/pages/Home.tsx';
let content = fs.readFileSync(file, 'utf8');

const legacyStart = content.indexOf('{/* Legacy Section - Immersive Heritage */}');
const eventsStart = content.indexOf('{/* Featured Events Preview - Dynamic List */}');
const impactStart = content.indexOf('{/* Impact CTA - Immersive & Urgent */}');
const impactEnd = content.indexOf('</section>\n    </div>\n  );\n}');

if (legacyStart === -1 || eventsStart === -1 || impactStart === -1 || impactEnd === -1) {
    console.error('Could not find sections');
    process.exit(1);
}

const legacySection = content.substring(legacyStart, eventsStart);
const eventsSection = content.substring(eventsStart, impactStart);
const impactSection = content.substring(impactStart, impactEnd + 11);

const newContent = content.substring(0, legacyStart) + eventsSection + impactSection + legacySection + content.substring(impactEnd + 11);

fs.writeFileSync(file, newContent);
console.log('Done');
