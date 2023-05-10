const path = require('path');
const fs = require('fs');

const { stdin, stdout, exit } = process;

const filePath = path.join(__dirname, 'text.txt');

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

const requestData = async (path) => {
  stdout.write('Why don\'t you enter some data:\n');
  stdin.on('data', data => {
    if (data.toString().trim() !== 'exit') {
      fs.appendFile(path, data.toString(), (err) => {
        if (err) throw err;
      });
      stdout.write('Wanna add something? Type it here (or type \'exit\' to quit):\n');
    } else {
      quit();
    }
  });
};

const quit = () => {
  stdout.write('It was nice seeing ya! Bye!\n');
  exit();
};

startFile(filePath)
  .then(() => requestData(filePath));

process.on('SIGINT', () => {
  quit();
});
