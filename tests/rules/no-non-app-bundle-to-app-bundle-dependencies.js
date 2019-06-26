"use strict";
const sinon = require('sinon');
const bundleUtils = require('../../src/util/bundle_utils');
sinon.stub(bundleUtils, "getAllAppBundleNames").returns(['phoenix']);

const rule = require("../../src/rules/no-non-app-bundle-to-app-bundle-dependencies");
const RuleTester = require("eslint").RuleTester;


// Helpers
// ----------------------------------------------------------------------------

function addValidCodeTestOptions(code, filename) {
  return {
    code: code,
    parserOptions: { ecmaVersion: 6, sourceType: "module" },
    filename
  };
}

function addInvalidCodeTestOptions(code, filename) {
  return {
    code: code,
    parserOptions: { ecmaVersion: 6, sourceType: "module" },
    filename,
    errors: [
      {
        message: /Avoid depending on modules in an app bundle from modules outside of app bundles/,
      }
    ]
  };
}

// Tests
// ----------------------------------------------------------------------------

const bundleFileName = "~/base/coursera/web/static/bundles/phoenix/MyPhoenixComponent.jsx";
const nonBundleFilename = "~/base/coursera/web/static/js/lib/mylib";
var ruleTester = new RuleTester();
ruleTester.run("no-non-app-bundle-to-app-bundle-dependencies", rule, {
  valid: [
    addValidCodeTestOptions("import 'js/libs/lib2'", nonBundleFilename),
    // The below 2 are valid because the source file is also an app bundle
    addValidCodeTestOptions("import 'bundles/phoenix/components/A'", bundleFileName),
    addValidCodeTestOptions("import 'js/libs/mylib'", bundleFileName),
  ],

  invalid: [
    addInvalidCodeTestOptions("import 'bundles/phoenix/components/A'", nonBundleFilename),
  ]
});
sinon.restore();