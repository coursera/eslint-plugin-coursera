/**
 * @fileoverview Warns when modules within non-app bundles (e.g anything in js/lib) 
 * depend on modules in an app bundle.
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
      description: "Discourages imports from a non-app bundle or lib to an app bundle",
      recommended: true
    }
  },

  create: function create(context) {
    const currentFilename = context.getFilename()

    const baseDirMatchingRegexp = new RegExp('(.*?/static).*')
    // Early return: we're not in the `static` dir
    if (!baseDirMatchingRegexp.test(currentFilename)) {
      return {};
    }
    const baseDir = currentFilename.match(baseDirMatchingRegexp)[1];

    const allAppBundleNames = getAllAppBundleNames(baseDir)
    const currentFileBundleName = getBundleNameFromFullFilename(currentFilename);

    return {
      ImportDeclaration: function ImportDeclaration(node) {
        const source = node.source.value;
        const importedFileBundleName = getBundleNameFromFullFilename(source);
        const importedFileIsFromAppBundle = importedFileBundleName && allAppBundleNames.includes(importedFileBundleName);
        const currentFileIsFromNonAppBundle = !currentFileBundleName || !allAppBundleNames.includes(currentFileBundleName);
        if (importedFileIsFromAppBundle && currentFileIsFromNonAppBundle) {
          context.report({
            message:
              `Avoid depending on modules in an app bundle from modules outside of app bundles as ` +
              `to avoid shared bundles having implicit dependencies on apps that people do not expect.`,
            node: node
          });
        }
        }
    };
  }
};
