# Deprecate the usage of a module property. (deprecate-module-property)

This rule is meant to help with feature deprecation. Via configuration, it allows the
specification of properties on modules (indicated by module name) that are deprecated and a custom
message to provide developers with an alternative.

### Options

- deprecationList: specify the module name and a list of properties that are deprecated on that module.

Example rule configuration:

```
coursera/deprecate-module-property:
  - 2
  - deprecationList:
    -
      moduleName: 'pages/open-course/common/constants'
      deprecatedProperties:
        -
          property: 'courseId'
          message: 'Use CourseStore.getCourseId() instead.'
        -
          property: 'courseSlug'
          message: 'Use CourseStore.getCourseSlug() instead.'
```
