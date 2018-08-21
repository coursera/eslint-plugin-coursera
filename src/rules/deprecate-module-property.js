/**
 * @fileoverview Deprecate the usage of a module property.
 * @author Lewis Chung
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Deprecate the usage of a module property.",
      category: "Javascript deprecations",
      recommended: false
    },
    fixable: null, // or "code" or "whitespace"
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
                deprecatedProperties: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      property: {
                        type: "string"
                      },
                      message: {
                        type: "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    ]
  },

  create: function(context) {
    const config = context.options[0]
      ? Object.assign({}, context.options[0])
      : {};
    const deprecationList = config.deprecationList || [];

    const deprecatedModules = deprecationList.reduce((memo, object) => {
      const newObj = {};
      newObj[object.moduleName] = object.deprecatedProperties;
      return Object.assign(newObj, memo);
    }, {});

    // Use this to track identifiers that represent required modules.
    // this will be used to track all singular imports (not ObjectPattern)
    const requirePathToIdentifier = {};
    const requireIdentifierToPath = {};

    // Keep a mapping of the left hand side of MemberExpressions mapped to
    // right hand side keys and where they happen.
    const memberObjects = {};

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Check if a node is a VariableDeclarator that is initialized to a named module.
     * @param {ASTNode} node
     */
    function isRequireVariableDeclarator(node) {
      if (node.object && node.object.type !== "Identifier") {
        return;
      }

      return (
        node.init &&
        node.init.type === "CallExpression" &&
        node.init.callee.name === "require"
      );
    }

    /**
     * Destructured imports are represented as an ObjectPattern
     * in the babel-eslint ast.
     * @param {ASTNode} node
     * @param {string} deprecatedPath
     */
    function checkObjectPatternRequires(node, deprecatedPath) {
      const deprecatedProperties = deprecatedModules[deprecatedPath].map(
        d => d.property
      );

      node.id.properties.forEach(property => {
        if (deprecatedProperties.indexOf(property.value.name) > -1) {
          context.report(
            property.value,
            `Property '${
              property.value.name
            }' on ${deprecatedPath} is deprecated. ` +
              `${getMessage(deprecatedPath, property.value.name)}`
          );
        }
      });
    }

    /**
     * @param {string} moduleName The module name is whatever is passed to a require statement.
     * @param {string} moduleProperty Any name of an exported property of the module.
     */
    function getMessage(moduleName, moduleProperty) {
      return deprecatedModules[moduleName].find(
        d => d.property === moduleProperty
      ).message;
    }

    /**
     * Run after all traversals collect information about nodes we need.
     */
    function checkAfterCollection() {
      Object.keys(memberObjects)
        .filter(memberObjectKey => !!requireIdentifierToPath[memberObjectKey])
        .map(memberObjectKey => {
          const moduleName = requireIdentifierToPath[memberObjectKey];
          const memberObjectInstances = memberObjects[memberObjectKey];
          const deprecatedProperties = deprecatedModules[moduleName].map(
            d => d.property
          );

          return memberObjectInstances.map(instance => ({
            moduleName,
            instance,
            isDeprecated: deprecatedProperties.indexOf(instance.property) > -1
          }));
        })
        // Flatten
        .reduce((memo, a) => [].concat(memo).concat(a), [])
        .filter(data => data.isDeprecated)
        .forEach(({ moduleName, instance }) => {
          const node = context
            .getSourceCode()
            .getNodeByRangeIndex(instance.index);
          context.report(
            node,
            `Property '${instance.property}' on ${moduleName} is deprecated. ` +
              `${getMessage(moduleName, instance.property)}`
          );
        });
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      VariableDeclarator(node) {
        // Analyze require statements
        // If the require statement uses the ObjectPattern we can immediately
        // report known problems.
        //
        // If the require statement is just a regular variable declaration, just
        // add it to the list of things of which to keep track.
        if (isRequireVariableDeclarator(node)) {
          Object.keys(deprecatedModules).forEach(deprecatedPath => {
            if (node.id.type === "ObjectPattern") {
              checkObjectPatternRequires(node, deprecatedPath);
            }

            if (node.id.type === "Identifier") {
              // Singular import
              requirePathToIdentifier[deprecatedPath] = node.id.name;
              requireIdentifierToPath[node.id.name] = deprecatedPath;
            }
          });
        }
      },
      MemberExpression(node) {
        // Build a map of all the member expressions and where they are.
        // We will use that in addition to the require map and deprecated modules
        // configuration later to report errors.
        const name = node.object.name;
        const propertyName = node.property.name;

        memberObjects[name] = (memberObjects[name] || []).concat({
          property: node.property.name,
          index: node.property.start
        });
      },
      "Program:exit"(path, node) {
        checkAfterCollection();
      }
    };
  }
};
