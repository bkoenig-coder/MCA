const fs = require('fs');
const content = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

const getSection = (startMarker, endMarker) => {
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker, startIndex);
  if (startIndex === -1 || endIndex === -1) throw new Error('Missing marker: ' + startMarker + ' or ' + endMarker);
  // Include the startMarker, stop before endMarker
  return content.substring(startIndex, endIndex);
};

// Define markers
const mPillars = '{/* Pillars Section - Redesigned for Prestige & Impact */}';
const mEvents = '{/* Featured Events Preview - Dynamic List */}';
const mNews = '{/* Featured News Carousel */}';
const mImpact = '{/* Impact CTA - Immersive & Urgent */}';

const beforePillars = content.substring(0, content.indexOf(mPillars));
const pillarsStr = getSection(mPillars, mEvents);
const eventsStr = getSection(mEvents, mNews);
const newsGalleryStr = getSection(mNews, mImpact);
const impactAndAfter = content.substring(content.indexOf(mImpact));

const newContent = beforePillars + newsGalleryStr + eventsStr + pillarsStr + impactAndAfter;

fs.writeFileSync('src/pages/Home.tsx', newContent);
console.log("Reordered sections successfully.");
