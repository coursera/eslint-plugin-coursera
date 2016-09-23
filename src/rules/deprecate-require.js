/**
 * @fileoverview Deprecate an entire module by specifying the path to the module relative to the project root.
 * @author Lewis Chung
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Deprecate an entire module by specifying the path to the module relative to the project root.",
            category: "Javascript deprecations",
            recommended: false
        },
        schema: [
            {
                type: "object",
                properties: {
                    deprecationList: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            moduleName: {
                              type: "string"
                            },
                            alternative: {
                              type: "string"
                            }
                          }
                        }
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create: function(context) {

        const config = context.options[0] ? Object.assign({}, context.options[0]) : {};
        const deprecationList = config.deprecationList || [];

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Get module name from the require path.
         * @param {ASTNode} node CallExpression
         * @returns {string} moduleName
         */
        function getModuleNameFromRequirePath(node) {
          if (node.callee.name === 'require') {
            return node.arguments[0].value;
          } else {
            return null;
          }
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            CallExpression(node) {
                if (node.callee.name === 'require') {
                    const name = getModuleNameFromRequirePath(node);
                    deprecationList
                        .forEach((depConfig) => {
                            if (depConfig.moduleName === name) {
                                context.report(node, depConfig.message);
                            }
                        });
                }
            }
        };
    }
};
