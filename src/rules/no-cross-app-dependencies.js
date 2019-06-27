/**
 * @fileoverview Warns when modules within apps (which are bundles in our current folder structure) 
 * depend on other modules within other apps.
 * @author Chris Liu
 */
"use strict";
const fs = require('fs');
const path = require('path');
const {getAllAppBundleNames, getBundleNameFromFullFilename} = require('../util/bundle_utils');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Discourages imports from one app bundle to another",
      recommended: true
    }
  },

  create: function create(context) {
    const currentFilename = context.getFilename()

    const baseDirMatchingRegexp = new RegExp('(.*?/static/bundles).*')
    // Early return: current file we're inspecting is not in a directory nested under bundles.
    if (!baseDirMatchingRegexp.test(currentFilename)) {
      return {};
    }
    const baseDir = currentFilename.match(baseDirMatchingRegexp)[1];

    const allAppBundleNames = getAllAppBundleNames(baseDir)
    const currentFileBundleName = getBundleNameFromFullFilename(currentFilename);

    // Early return: current file we're inspecting is not in an app bundle.
    if (!allAppBundleNames.includes(currentFileBundleName)) {
      return {};
    }

    return {
      ImportDeclaration: function ImportDeclaration(node) {
        const source = node.source.value;
        const importedFileBundleName = getBundleNameFromFullFilename(source);
        const importedFileIsFromAppBundle = importedFileBundleName && allAppBundleNames.includes(importedFileBundleName);
        if (importedFileIsFromAppBundle && importedFileBundleName !== currentFileBundleName) {
          context.report({
            message:
              `Avoid cross app imports if possible. Importing from ${importedFileBundleName} to ` +
              `${currentFileBundleName} breaks modularity and couples apps together.`,
            node: node
          });
        }
        }
    };
  }
};
