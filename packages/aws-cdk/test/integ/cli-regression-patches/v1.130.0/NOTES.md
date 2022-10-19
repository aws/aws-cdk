---------------------------------------

On november 2nd 2021, lambda started deprecating the nodejs10.x runtime. This meant we can no longer create functions with this runtime.
Our integration tests use this runtime for one of its stacks.

This patch brings https://github.com/aws/aws-cdk/pull/17282 into the regression suite.

----------------------------------------

Needs to disable an existing test due to change in bootstrap of integration tests.

This patch brings https://github.com/aws/aws-cdk/pull/17337 into the regression suite.