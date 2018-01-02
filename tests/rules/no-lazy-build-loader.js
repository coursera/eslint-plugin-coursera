/**
 * @fileoverview Disallow usage of LazyBuild in production.
 * @author Sumit Gogia
 */
"use strict";

var rule = require("../../src/rules/no-lazy-build-loader"),
  RuleTester = require("eslint").RuleTester;

// Helpers
// ----------------------------------------------------------------------------

function addValidCodeTestOptions(code) {
  return {
    code: code,
    parserOptions: { ecmaVersion: 6, sourceType: "module" }
  };
}

function addInvalidCodeTestOptions(code, errorNodeType) {
  return {
    code: code,
    parserOptions: { ecmaVersion: 6, sourceType: "module" },
    errors: [
      {
        message: "The `lazy-build-loader` cannot be used in production. Please switch back to `lazy`.",
        type: errorNodeType
      }
    ]
  };
}

// Tests
// ----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-lazy-build-loader", rule, {
  valid: [
    addValidCodeTestOptions("import 'lazy!bundles/phoenix/components/NotFound'"),
    addValidCodeTestOptions("import 'lazy!random'"),
    addValidCodeTestOptions("require('lazy!bundles/phoenix/components/NotFound')"),
    addValidCodeTestOptions("import module from 'lazy!random'"),
    addValidCodeTestOptions("const module = require('lazy!bundles/phoenix/components/NotFound')")
  ],

  invalid: [
    addInvalidCodeTestOptions("import 'lazy-build-loader!bundles/phoenix/components/NotFound'", "ImportDeclaration"),
    addInvalidCodeTestOptions("require('lazy-build-loader!bundles/phoenix/components/NotFound')", "CallExpression")
  ]
});
