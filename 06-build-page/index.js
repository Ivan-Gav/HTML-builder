const path = require('path');
const fsPromises = require('fs/promises');

const stylesSrcFolder = path.join(__dirname, 'styles');
const assetsSrcFolder = path.join(__dirname, 'assets');
const componentsSrcFolder = path.join(__dirname, 'components');

const destFolder = path.join(__dirname, 'project-dist');

async function copyDir(folder, folderCopy) {

  // remove folderCopy if it exists and create it
  try {
    await fsPromises.rm(folderCopy, { recursive: true });
    await fsPromises.mkdir(folderCopy, { recursive: true });
  } catch {
    await fsPromises.mkdir(folderCopy, { recursive: true });
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

async function buildPage(styles, assets, components, dest) {

  // create output folder
  try {
    await fsPromises.rm(dest, { recursive: true });
    await fsPromises.mkdir(dest, { recursive: true });
  } catch {
    await fsPromises.mkdir(dest, { recursive: true });
  }

  // copy assets to output folder
  const assetsDest = path.join(dest, path.relative(__dirname, assets));
  await copyDir(assets, assetsDest);

  // make styles bundle
  const cssBundle = path.join(dest, 'style.css');
  await mergeStyles(styles, cssBundle);

  // create HTML
  const indexHtmlPath = path.join(dest, 'index.html');
  let indexHtml = await fsPromises.readFile(path.join(__dirname, 'template.html'), { encoding: 'utf8' });

  // scan components and add them into index.html
  const files = await fsPromises.readdir(components, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(components, file.name);
    if ((file.isFile())
      && (path.extname(filePath) === '.html')) {
      const componentName = path.basename(filePath, '.html');
      const componentContent = await fsPromises.readFile(filePath, { encoding: 'utf8' });
      indexHtml = indexHtml.replace(`{{${componentName}}}`, componentContent);  
    }
  }
  await fsPromises.writeFile(indexHtmlPath, indexHtml);
}

buildPage(stylesSrcFolder, assetsSrcFolder, componentsSrcFolder, destFolder);
