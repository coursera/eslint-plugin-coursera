/**
* @fileoverview Since WebdriverIO parallelization works on a file per file basis, encourage developers to not have multiple describe blocks in the same file. Instead create a new file
* @author Lewis Chung
*/
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Since WebdriverIO parallelization works on a file per file basis, encourage developers to not have multiple describe blocks in the same file. Instead create a new file",
      category: "webdriverio",
      recommended: false
    },
    fixable: null, // or "code" or "whitespace"
    schema: []
  },

  create: function(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function getDescribeExpressions(nodeArray) {
      return nodeArray
        .filter(node => node.type === "ExpressionStatement")
        .filter(node => node.expression.type === "CallExpression")
        .filter(node => node.expression.callee.type === "Identifier")
        .filter(node => node.expression.callee.name === "describe");
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      Program(node) {
        const describeExpressions = getDescribeExpressions(node.body);

        if (describeExpressions.length > 1) {
          const notFirstDescribeExpressions = describeExpressions.slice(1);
          notFirstDescribeExpressions.forEach(expression => {
            context.report(
              expression,
              "WebdriverIO parallelization works by splitting up work by files, not by describe blocks. " +
                "It is recommended that you put this describe block in a separate file."
            );
          });
        }
      }
    };
  }
};
