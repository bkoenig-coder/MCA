const fs = require('fs');

const files = [
  'src/components/Footer.tsx',
  'src/pages/EventDetails.tsx',
  'src/pages/About.tsx',
  'src/pages/News.tsx',
  'src/pages/Contact.tsx',
  'src/pages/Home.tsx',
  'src/pages/NewsDetails.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/<div className="absolute[^>]*opacity-\[0\.[0-9]*\][^>]*>[\s\n]*<UlziiSymbol[^>]*>[\s\n]*<\/div>/g, '');
  
  content = content.replace(/<motion\.div[^>]*>[\s\n]*<UlziiSymbol className="w-\[1200px[^>]*>[\s\n]*<\/motion\.div>/g, '');

  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Modified', file);
  }
});
