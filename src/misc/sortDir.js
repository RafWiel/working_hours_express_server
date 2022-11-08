const fs = require('fs');
const path = require('path');

module.exports = (directory, basename) => {
  const filePaths = [];
  const folders = [];
  const checkFile = filePath => (fs.statSync(filePath).isFile());

  const sortPath = (dir) => {
    fs
      .readdirSync(dir)
      .filter(file => file !== basename)
      .forEach((res) => {
        const filePath = path.join(dir, res);
        if (checkFile(filePath)) {
          filePaths.push(filePath);
        } else {
          folders.push(filePath);
        }
      });
  };

  folders.push(directory);

  let i = 0;
  do {
    sortPath(folders[i]);
    i += 1;
  } while (i < folders.length);

  return filePaths;
};
