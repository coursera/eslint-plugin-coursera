# Deprecate an entire module by specifying the path to the module relative to the project root. (deprecate-require)

We need to deprecate entire modules sometimes but also point developers at their replacements.
This rule provides a way to do that via linter configuration.

### Options

- deprecationList: specify the module name that is deprecated and a message that should pop up within eslint.

#### Example rule configuration

```
coursera/deprecate-require:
  - 2
  - deprecationList:
    -
      moduleName: 'bundles/phoenix/template/models/userIdentity'
      message: 'Use ApplicationStore.getUserData() instead.'
```
