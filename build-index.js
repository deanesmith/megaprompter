const fs = require('fs');
const path = require('path');

const songsDir = path.join(__dirname, 'songs');

// Rename files to strip "MUSIC" prefix
fs.readdirSync(songsDir)
  .filter(f => f.toLowerCase().endsWith('.docx'))
  .forEach(f => {
    const cleaned = f.replace(/^MUSIC\s*/i, '');
    if (cleaned !== f) {
      fs.renameSync(path.join(songsDir, f), path.join(songsDir, cleaned));
      console.log(`Renamed: ${f} -> ${cleaned}`);
    }
  });

// Build the index from the (now cleaned) filenames
const files = fs.readdirSync(songsDir)
  .filter(f => f.toLowerCase().endsWith('.docx'))
  .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

fs.writeFileSync(
  path.join(__dirname, 'songs.json'),
  JSON.stringify(files, null, 2) + '\n'
);

console.log(`songs.json updated with ${files.length} song(s).`);
