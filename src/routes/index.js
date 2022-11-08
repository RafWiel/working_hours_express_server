const path = require('path');
const sortDir = require('../misc/sortDir');
const app = require('../app');

const basename  = path.basename(module.filename);
const filePaths = sortDir(__dirname, basename);

filePaths.forEach((filePath) => {
  require(filePath)(app);
});

