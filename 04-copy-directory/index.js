const path = require('path');
const fsProm = require('fs/promises');

const filesFolder = path.join(__dirname, 'files');
const filesFolderCopy = path.join(__dirname, 'files-copy');

async function copyDir(folder, folderCopy) {

  try {
    await fsProm.access(folderCopy);
  } catch {
    await fsProm.mkdir(folderCopy);
  }

  const dirents = await fsProm.readdir(folder, { withFileTypes: true });
  for (const dirent of dirents) {
    const src = path.join(folder, dirent.name);
    const dest = path.join(folderCopy, dirent.name);
    if (dirent.isFile()) {
      try {
        fsProm.copyFile(src, dest);
      } catch (err) {
        console.error(err);
      }
    } else if (dirent.isDirectory()) {
      const relPath = path.relative(folder, src);
      const recursiveDest = path.join(folderCopy, relPath);
      copyDir(src, recursiveDest);
    }
  }
}

copyDir(filesFolder, filesFolderCopy);
