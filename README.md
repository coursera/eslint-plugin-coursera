# eslint-plugin-coursera

Rules used by Coursera developers

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


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "coursera/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





