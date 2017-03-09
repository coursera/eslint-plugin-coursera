/**
 * @fileoverview disallow allow template strings inside _t translation functions
 * @author dwinegar@coursera.org
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../src/rules/no-translated-template-strings"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

function addOptions(code) {
  return {
    code: code,
    parserOptions: { ecmaVersion: 6 }
  };
}

var ruleTester = new RuleTester();
ruleTester.run("no-translated-template-strings", rule, {
  valid: [
    addOptions("_t(``)"),
    addOptions("_t(`testy test`)"),
    addOptions("_t('${a}')"),
    addOptions("_t(`This {is} a {formattedMessage} interpolated string`)")
  ],

  invalid: [
    {
      code: "_t(`${a}`)",
      parserOptions: { ecmaVersion: 6 },
      errors: [
        {
          message: "Unexpected translated template string",
          type: "CallExpression"
        }
      ]
    }
  ]
});
