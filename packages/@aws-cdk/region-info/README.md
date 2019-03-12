# AWS Region-Specific Information Directory
## Usage
Some information used in CDK Applications differs from one AWS region to
another, such as service principals used in IAM policies, S3 static website
endpoints, ...

### Direct Access
This library offers a primitive database of such information so that CDK
constructs can easily access regional information. The `FactName` class provides
a list of known fact names, which can then be used with the `RegionInfo` to
retrieve a particular value:

```ts
import { Fact, FactName } from '@aws-cdk/region-info';

const codeDeployPrincipal = Fact.find('us-east-1', FactName.servicePrincipal('codedeploy.amazonaws.com'));
// => codedeploy.us-east-1.amazonaws.com

const staticWebsite = Fact.find('ap-northeast-1', FactName.s3StaticWebsiteEndpoint);
// => s3-website-ap-northeast-1.amazonaws.com
```

### Token Access
Often, CDK constructs are not able to access the name of the region for which a
fact is requested (becase this information will not be available before the
synthesis is underway). To make usage in such scenarios easier, the library
provides a `RegionInfoToken` class:

```ts
import { FactName, RegionInfoToken } from '@aws-cdk/region-info';

const staticWebsite = new RegionInfoToken(FactName.s3StaticWebsiteEndpoint);
```

Tokens initialized in this way will resolve during the systesis phase, according
to the region name that was determined as part of the synthesis process.

In certain cases, it can be desirable to provide a default value for such tokens
(for example, where there is a value that is known to work in most regions):

```ts
// The SNS service principal is almost always "sns.amazonaws.com", so it's a pretty safe default!
const snsServicePrincipal = new RegionInfoToken(FactName.servicePrincipal('sns.amazonaws.com'), 'sns.amazonaws.com');
```

## Supplying new or missing information
As new regions are released, it might happen that a particular fact you need is
missing from the library. In such cases, the `Fact.register` method can be used
to inject FactName into the database:

```ts
Fact.register({
  region: 'bermuda-triangle-1',
  name: FactName.servicePrincipal('s3.amazonaws.com'),
  value: 's3-website.bermuda-triangle-1.nowhere.com',
});
```

## Overriding incorrect information
In the event information provided by the library is incorrect, it can be
overridden using the same `Fact.register` method demonstrated above, simply
adding an extra boolean argument:

```ts
Fact.register({
  region: 'us-east-1',
  name: FactName.servicePrincipal('service.amazonaws.com'),
  value: 'the-correct-principal.amazonaws.com',
}, true /* Allow overriding information */);
```

If you happen to have stumbled upon incorrect data built into this library, it
is always a good idea to report your findings in a [GitHub issue], so we can fix
it for everyone else!

[GitHub issue]: https://github.com/awslabs/aws-cdk/issues

---

This module is part of the [AWS Cloud Development Kit](https://github.com/awslabs/aws-cdk) project.
