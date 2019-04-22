
----

### Pull Request Checklist

* [ ] Testing
  - Unit test added (prefer not to modify an existing test, otherwise, it's probably a breaking change)
  - __CLI change?:__ coordinate update of integration tests with team
  - __cdk-init template change?:__ coordinated update of integration tests with team
* [ ] Docs
  - __jsdocs__: All public APIs documented
  - __README__: README and/or documentation topic updated
  - __Design__: For significant features, design document added to `design` folder
* [ ] Title and Description
  - __Change type__: title prefixed with **fix**, **feat** and package name in parens, which will appear in changelog
  - __Title__: use lower-case and doesn't end with a period
  - __Breaking?__: last paragraph: "BREAKING CHANGE: <describe what changed + link for details>"
  - __Issues__: Indicate issues fixed via: "**Fixes #xxx**" or "**Closes #xxx**"
* [ ] Sensitive Modules (requires 2 PR approvers)
  - IAM Policy Document (in @aws-cdk/aws-iam)
  - EC2 Security Groups and ACLs (in @aws-cdk/aws-ec2)
  - Grant APIs (only if not based on official documentation with a reference)

----

By submitting this pull request, I confirm that my contribution is made under the terms of the Apache-2.0 license.
