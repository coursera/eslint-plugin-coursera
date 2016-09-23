/* eslint-disable */
/**
 * @fileoverview xdescribe does not work in webdriverio to blacklist files because webdriverio does not prescan files for tests. when using xdescribe, selenium will still boot up a node in order to try to serve that file which is a waste.
 * @author Lewis Chung
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "xdescribe does not work in webdriverio to blacklist files because webdriverio does not prescan files for tests. when using xdescribe, selenium will still boot up a node in order to try to serve that file which is a waste.",
      category: "webdriverio",
      recommended: false
    },
    fixable: null,  // or "code" or "whitespace"
    schema: []
  },

  create: function(context) {

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Find xdescribes that are top level only by
     * @param {ASTNode} programNode Top level Program node
     */
    function findTopLevelXDescribeExpressions(programNode) {
      const topLevelNodes = programNode.body;
      return topLevelNodes
        .filter(node => node.type === 'ExpressionStatement')
        .filter(node => node.expression.type === 'CallExpression')
        .map(node => node.expression)
        .filter(node => node.callee.name === 'xdescribe');
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    return {
      Program(node) {
        findTopLevelXDescribeExpressions(node)
          .forEach(topLevelXDescribeExpression => {
            context.report(
              topLevelXDescribeExpression,
              'Do not use xdescribe to blacklist tests. Instead, change the filename suffix to `.ignore.js`'
            );
          });
      }
    };
  }
};
