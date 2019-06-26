"use strict";
const sinon = require('sinon');
const bundleUtils = require('../../src/util/bundle_utils');
sinon.stub(bundleUtils, "getAllAppBundleNames").returns(['phoenix', 'another-bundle']);

const rule = require("../../src/rules/no-cross-app-dependencies");
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
        message: /Avoid cross app imports if possible/,
      }
    ]
  };
}

// Tests
// ----------------------------------------------------------------------------

const bundleFileName = "~/base/coursera/web/static/bundles/phoenix/MyPhoenixComponent.jsx";
const nonBundleFilename = "~/base/coursera/web/static/js/lib/mylib";
var ruleTester = new RuleTester();
ruleTester.run("no-cross-app-dependencies", rule, {
  valid: [
    addValidCodeTestOptions("import 'bundles/phoenix/components/AnotherComponent'", bundleFileName),
    addValidCodeTestOptions("import 'js/libs/mylib'", bundleFileName),
    addValidCodeTestOptions("import 'bundles/another-bundle/components/A'", nonBundleFilename),
  ],

  invalid: [
    addInvalidCodeTestOptions("import 'bundles/another-bundle/components/A'", bundleFileName),
  ]
});
sinon.restore();