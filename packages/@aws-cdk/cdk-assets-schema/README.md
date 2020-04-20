# cdk-assets-schema
<!--BEGIN STABILITY BANNER-->
---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---
<!--END STABILITY BANNER-->

This module contains the schema definitions for the Asset Manifest.

We expose them via JSII so that they are checked for backwards compatibility
by the `jsii-diff` tool; routines exist in `validate.ts` which will return
them, so that the structs can only be strengthened (i.e., existing fields
may not be removed or made optional).
