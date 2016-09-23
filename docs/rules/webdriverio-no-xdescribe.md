# Encourage configuration based ignoring over programmatic ignoring (webdriverio-no-xdescribe)

xdescribe does not work in webdriverio to blacklist files because webdriverio does not prescan files for tests. when using xdescribe, selenium will still boot up a node in order to try to serve that file which is a waste. (webdriverio-no-xdescribe)

## Rule Details

This rule aims to...

The following patterns are considered warnings:

```js

xdescribe('login page', () => {
  it('renders login form', () => {
    ...
  });
});

```

The following patterns are not warnings:

```js

describe('login page', () => {
  it('renders login form', () => {
    ...
  });
});

```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
