/**
 * @fileoverview disallow allow template strings inside _t translation functions
 * @author dwinegar@coursera.org
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description:
        "disallow allow template strings inside _t translation functions",
      recommended: false
    }
  },

  create: function(context) {
    return {
      CallExpression: function(node) {
        const callee = node.callee;
        const args = node.arguments;

        if (callee.name === "_t") {
          // _t function has a template literal, with expressions inside.
          if (
            args.length > 0 &&
            args[0].type === "TemplateLiteral" &&
            args[0].expressions.length > 0
          ) {
            context.report({
              message: "Unexpected translated template string",
              node: node
            });
          }
        }
      }
    };
  }
};
