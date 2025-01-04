# AWS CDK CLI Library

<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

## Overview

As any piece of software that interacts with an AWS account, the CDK CLI needs
AWS credentials for authentication and authorization. When it comes to choose
which sources to get credentials from, it has
the [same behavior as the AWS CLI][cli-auth]. But this basic behavior may result
in some failure scenarios:

- The initial set of credentials to work with cannot be obtained.
- The account to which the initial credentials belong to cannot be obtained.
- The account associated to the credentials is different from the account on
  which the CLI is trying to operate on.

Since these failures may happen for valid use case reasons, the CDK CLI offers
an alternative mechanism for users to provide AWS credentials: credential
provider plugins.

This package defines the types and the contract between the CLI and the plugins,
which plugin authors are expected to adhere to.

The entrypoint is communicated to the CLI via the `--plugin` command line
argument. The value of this argument should be a JavaScript file that, when
`require`'d, will return an instance of the `Plugin` interface.

Once the CLI gets an instance of a plugin, it first initializes plugin by
calling the `Plugin.init()` method, if one is defined. The CLI uses this method
to pass an instance of `IPluginHost` to the plugin. The
plugin, in turn, can use the repository to register one or more instances of
`CredentialProviderSource`, which is where the actual logic for providing
credentials is located.

If, in the authentication process, the CLI decides to use plugins, it will try
each credential provider source in the order in which they were registered. For
each source, the first thing the CLI will check is whether the source is ready
to interact at all, by calling the `isAvailable()`
method. If it is available, the next check is whether it can provide credentials
for the specific account the CLI is targeting at that moment. This is the
`canProvideCredentials()` method.

If both checks pass, the CLI asks the source for credentials by calling
`getProvider()`. In addition to the account ID, this method also receives the
`Mode` of operation, which can be `ForReading` or `ForWriting`. This information
may be useful to tailor the credentials for the use case. For example, if the
CLI needs the credentials only for reading, the plugin may return credentials
with more restricted permissions.

[cli-auth]: (https://docs.aws.amazon.com/cli/v1/userguide/cli-chap-authentication.html)
