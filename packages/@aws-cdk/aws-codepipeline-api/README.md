## AWS CodePipeline Actions API

This package contains the abstract API of Pipeline Actions.
It's used by the `aws-codepipeline` module,
and the AWS service modules that integrate with AWS CodePipeline.

You should never need to depend on it directly -
instead, depend on `aws-codepipeline`,
and the module you need the concrete Actions from
(like `aws-codecommit`, `aws-codebuild`, etc.).
