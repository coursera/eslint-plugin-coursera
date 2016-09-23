# eslint-plugin-coursera

Rules used by Coursera developers that don't (yet) exist elsewhere. Feel free to open an issue
if you consume this package and run into issues.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-coursera`:

```
$ npm install eslint-plugin-coursera --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-coursera` globally.

## Usage

Add `coursera` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "coursera"
    ]
}
```

## Supported Rules

* [coursera/webdriverio-no-xdescribe](docs/rules/webdriverio-no-xdescribe): Disallow xdescribe in webdriverio. Instead prefer ignoring tests via the ignore configuration in webdriverio configuration.
* [coursera/webdriverio-only-single-describe](docs/rules/webdriverio-only-single-describe): Only allow a single describe per spec. Good if your tests are run in a parallelized fashion.
* [coursera/deprecate-require](docs/rules/deprecate-require): Warn against requiring certain modules
* [coursera/deprecate-module-property](docs/rules/deprecate-module-property): Warn against using certain properties on certain modules





