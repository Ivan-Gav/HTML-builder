const path = require('path');
const fsPromises = require('fs/promises');

const srcFolder = path.join(__dirname, 'styles');
const dest = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles(src, dest) {
  // start output file
  await fsPromises.writeFile(dest, '');

  // scan src folder
  const files = await fsPromises.readdir(src, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(src, file.name);
    if ((file.isFile())
      && (path.extname(filePath) === '.css')) {
      const content = await fsPromises.readFile(filePath);
      await fsPromises.appendFile(dest, content);
    }
  }
}

mergeStyles(srcFolder, dest);

module.exports = { mergeStyles };
