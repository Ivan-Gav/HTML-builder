const path = require('path');
const fsPromises = require('fs/promises');

const filesFolder = path.join(__dirname, 'files');
const filesFolderCopy = path.join(__dirname, 'files-copy');

async function copyDir(folder, folderCopy) {

  // check if folderCopy exists and create it if necessary
  try {
    await fsPromises.access(folderCopy);
  } catch {
    await fsPromises.mkdir(folderCopy);
  }

  // scan source directory for files
  const dirents = await fsPromises.readdir(folder, { withFileTypes: true });
  for (const dirent of dirents) {
    const src = path.join(folder, dirent.name);
    const dest = path.join(folderCopy, dirent.name);
    if (dirent.isFile()) {
      // copy files
      try {
        fsPromises.copyFile(src, dest);
      } catch (err) {
        console.error(err);
      }
      // if there are sub-directories run function recursively on them
    } else if (dirent.isDirectory()) {
      const relPath = path.relative(folder, src);
      const recursiveDest = path.join(folderCopy, relPath);
      copyDir(src, recursiveDest);
    }
  }
}

copyDir(filesFolder, filesFolderCopy);
