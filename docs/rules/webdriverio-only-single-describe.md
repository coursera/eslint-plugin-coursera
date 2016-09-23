# Encourage Better Parallelization (webdriverio-only-single-describe)

Since WebdriverIO parallelization works on a file per file basis, encourage developers to not have multiple describe blocks in the same file. Instead create a new file (webdriverio-only-single-describe)

## When Not To Use It

When you don't care to optimize for parallelization (IE, running all tests on a single node).

## Further Reading

https://wiki.saucelabs.com/display/DOCS/Best+Practices+for+Running+Tests#BestPracticesforRunningTests-UseSmall,Atomic,AutonomousTests
