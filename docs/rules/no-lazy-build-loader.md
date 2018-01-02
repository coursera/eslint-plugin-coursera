# Disallow unsafe usage of the LazyBuild loader in production. (no-lazy-build-loader)

This rule helps to mark when developers are using the LazyBuild loader. Since
LazyBuild only works in a development environment, the lint rule forces
developers to be aware of unsafely leaving it in code before submitting to
the production environment.
