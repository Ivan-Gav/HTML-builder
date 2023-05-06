const path = require('path');
const fs = require('fs');

const { readdir } = require('fs/promises');

const folderPath = path.join(__dirname, 'secret-folder');

async function scanFolder(folderPath) {
  try {
    const files = await readdir(folderPath, { withFileTypes: true });
    for (const file of files) {
      fs.stat(`${folderPath}/${file.name}`, (err, stats) => {
        if (stats.isFile()) {
          console.log(`${path.basename(file.name, path.extname(file.name))} - ${path.extname(file.name).slice(1)} - ${stats.size}b`);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
}

scanFolder(folderPath);