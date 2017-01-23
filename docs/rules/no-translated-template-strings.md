# Don't allow template strings inside _t translated strings. (no-translated-template-strings)

Translation breaks when our _t function is used in template strings. Lint to
not allow the use of template strings in our _t translation function.
