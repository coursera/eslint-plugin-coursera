const fs = require('fs');
const path = require('path');

// Look up the list of app bundles at most once for each node process spun up in the hopes
// of making this not expensive for linting many files at once.
let _appBundleNameCache;
const getAllAppBundleNames = (bundlesBaseDir) => {
  if (_appBundleNameCache) return _appBundleNameCache;

  const bundleFolders = fs
    .readdirSync(bundlesBaseDir)
    .filter(f => fs.statSync(path.join(bundlesBaseDir, f)).isDirectory())
    .map(folderName => path.join(bundlesBaseDir, folderName));

  const appBundleNames = bundleFolders.filter(folder => {
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(folder, 'package.json')))
      return packageJson && packageJson.r2 && packageJson.r2.app
    } catch (e) {
      return false;
    }
  }).map(bundleName =>  {
    return bundleName.split('/').reverse()[0];
  })

  _appBundleNameCache = appBundleNames;
  return _appBundleNameCache;
}

const getBundleNameFromFullFilename = (filename) =>  {
  const bundleNameRegexp = new RegExp('bundles/(.*?)/')
  if (bundleNameRegexp.test(filename)) {
    return filename.match(bundleNameRegexp)[1];
  }
}

module.exports = {
  getAllAppBundleNames,
  getBundleNameFromFullFilename
};