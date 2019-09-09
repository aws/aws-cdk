## CDK Custom Resources
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

#### AWS Custom Resource
Sometimes a single API call can fill the gap in the CloudFormation coverage. In
this case you can use the `AwsCustomResource` construct. This construct creates
a custom resource that can be customized to make specific API calls for the
`CREATE`, `UPDATE` and `DELETE` events. Additionally, data returned by the API
call can be extracted and used in other constructs/resources (creating a real
CloudFormation dependency using `Fn::GetAtt` under the hood).

The physical id of the custom resource can be specified or derived from the data
returned by the API call.

The `AwsCustomResource` uses the AWS SDK for JavaScript. Services, actions and
parameters can be found in the [API documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html).

Path to data must be specified using a dot notation, e.g. to get the string value
of the `Title` attribute for the first item returned by `dynamodb.query` it should
be `Items.0.Title.S`.

##### Examples
Verify a domain with SES:

```ts
const verifyDomainIdentity = new AwsCustomResource(this, 'VerifyDomainIdentity', {
  onCreate: {
    service: 'SES',
    action: 'verifyDomainIdentity',
    parameters: {
      Domain: 'example.com'
    },
    physicalResourceIdPath: 'VerificationToken' // Use the token returned by the call as physical id
  }
});

new route53.TxtRecord(zone, 'SESVerificationRecord', {
  recordName: `_amazonses.example.com`,
  recordValue: verifyDomainIdentity.getData('VerificationToken')
});
```

Get the latest version of a secure SSM parameter:

```ts
const getParameter = new AwsCustomResource(this, 'GetParameter', {
  onUpdate: { // will also be called for a CREATE event
    service: 'SSM',
    action: 'getParameter',
    parameters: {
      Name: 'my-parameter',
      WithDecryption: true
    },
    physicalResourceId: Date.now().toString() // Update physical id to always fetch the latest version
  }
});

// Use the value in another construct with
getParameter.getData('Parameter.Value')
```

IAM policy statements required to make the API calls are derived from the calls
and allow by default the actions to be made on all resources (`*`). You can
restrict the permissions by specifying your own list of statements with the
`policyStatements` prop.

Chained API calls can be achieved by creating dependencies:
```ts
const awsCustom1 = new AwsCustomResource(this, 'API1', {
  onCreate: {
    service: '...',
    action: '...',
    physicalResourceId: '...'
  }
});

const awsCustom2 = new AwsCustomResource(this, 'API2', {
  onCreate: {
    service: '...',
    action: '...'
    parameters: {
      text: awsCustom1.getData('Items.0.text')
    },
    physicalResourceId: '...'
  }
})
```

##### Booleans conversion
Since custom resource properties are always stringified by CloudFormation, `true`/`false` values will automatically be converted back to booleans. If the strings `'true'`/`'false'` are required in the SDK call, use `'true!'`/`'false!'`.
