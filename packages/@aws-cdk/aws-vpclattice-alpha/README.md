# Alpha Package for aws-vpclattice-alpha
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

Amazon VPC Lattice is an application networking service that consistently connects, monitors, and secures communications between your services, helping to improve productivity so that your developers can focus on building features that matter to your business. You can define policies for network traffic management, access, and monitoring to connect compute services in a simplified and consistent way across instances, containers, and serverless applications.


## Code structure

The code structure is explained through inline comments in the files themselves.
Probably [`lib/servicenetwork.ts`](lib/servicenetwork.ts) is a good place to start reading.

### Tests

The package contains examples of unit tests in the [`test/servicenetwork.test.ts`](test/servicenetwork.test.ts)
file.

It also contains an example integration test in [`test/integ.service-network.ts`](test/integ.service-network.ts).

For more information on CDK integ tests, see the
[main `Contributing.md` file](../../../CONTRIBUTING.md#integration-tests).

## Package structure

The package uses the standard build and test tools available in the CDK repo.
Even though it's not published,
it also uses [JSII](https://github.com/aws/jsii),
the technology that allows CDK logic to be written once,
but used from multiple programming languages.
Its configuration lives the `jsii` key in `package.json`.
It's mainly used as a validation tool in this package,
as JSII places some constraints on the TypeScript code that you can write.

