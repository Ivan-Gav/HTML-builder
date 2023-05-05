const path = require('path');
const fs = require('fs');


const { stdout } = process;
const fileStream = fs.createReadStream(path.join(__dirname, 'text.txt'), {encoding: 'utf-8'});

fileStream.on('data', (chunk) => {
  stdout.write(chunk);
})

fileStream.on('close', () => {
  process.exit();
})

