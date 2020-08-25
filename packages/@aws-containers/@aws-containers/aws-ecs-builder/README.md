# CDK Construct library for building ECS services
<!--BEGIN STABILITY BANNER-->
---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

This library provides a higher level, extendable Amazon ECS pattern for constructing services.

You can use it to build your service out of a collection of underlying extensions that provide specific features. You can
even develop your own extensions and use them to customize your service's underlying resources as you see fit.
