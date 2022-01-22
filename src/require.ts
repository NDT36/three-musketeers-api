import fs from 'fs';

function requireController(directoryName: string) {
  fs.readdirSync(__dirname + `/${directoryName}`, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() || dirent.name.endsWith('.js'))
    .forEach((dirent) => {
      if (dirent.isDirectory()) {
        requireController(`/${directoryName}/${dirent.name}`);
      }
      if (!dirent.isDirectory()) {
        module.exports = require(`./${directoryName}/${dirent.name}`);
      }
    });
}

/**
 * Get all modules from controllers folder
 */
requireController('controllers');
