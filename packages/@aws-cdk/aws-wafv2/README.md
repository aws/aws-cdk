## AWS::WAFv2 Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

---
<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

```ts
import * as wafv2 from '@aws-cdk/aws-wafv2';
```

### IpSet

Use an `IpSet` to identify web requests that originate from specific IP addresses or ranges of IP addresses. For example, if you're receiving a lot of requests from a ranges of IP addresses, you can configure AWS WAF to block them using an IP set that lists those IP addresses.

Example:

```ts
import waf = require('@aws-cdk/aws-wafv2');

new waf.IpSet(this, 'MyIpSet', {
    addresses: [
        '192.168.1.1/32'
    ],
    name: 'MyIPSet'
})
```
