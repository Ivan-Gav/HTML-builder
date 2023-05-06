const path = require('path');
const fs = require('fs');

const { stdin, stdout } = process;

const filePath = path.join(__dirname, 'text.txt');
const fileWriteStream = fs.createWriteStream(filePath, { encoding: 'utf-8' });


const startFile = async (path) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, '', (err) => {
      if (err) {
        return reject(err);
      }
      stdout.write('Ok we have text.txt now!\n');
      resolve();
    });
  });
};

const requestData = async () => {
  stdout.write('Why don\'t you enter some data:\n');
  stdin.on('data', data => {
    if (data.toString().trim() !== 'exit') {
      fileWriteStream.write(data);
      stdout.write('Wanna add something? Type it here (or type \'exit\' to quit):\n');
    } else {
      quit();
    }

  });
};

const quit = () => {
  stdout.write('It was nice seeing ya! Bye!\n');
  process.exit();
};

startFile(filePath)
  .then(() => requestData());

process.on('SIGINT', () => {
  quit();
});
