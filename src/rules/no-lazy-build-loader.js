/**
 * @fileoverview Disallow usage of LazyBuild in production.
 * @author Sumit Gogia
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
	meta: {
		docs: {
			description: "Disallow usage of LazyBuild in production.",
			recommended: false
		},
	},

	create: function create(context) {
		return {
			'CallExpression': function CallExpression(node) {
				var callee = node.callee;
				var args = node.arguments;

				if (callee.name === 'require' && args[0].value.startsWith("lazy-build-loader!")) {
					context.report({
						message: "The `lazy-build-loader` cannot be used in production. Please switch back to `lazy`.",
						node: node
					});
				}
			},
			'ImportDeclaration': function ImportDeclaration(node) {
				var source = node.source.value;
				if (source.startsWith("lazy-build-loader!")) {
					context.report({
						message: "The `lazy-build-loader` cannot be used in production. Please switch back to `lazy`.",
						node: node
					});
				}
			}
		};
	}
};
