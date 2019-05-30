## CDK Constructs for AWS CloudFormation

This module is part of the [AWS Cloud Development Kit](https://github.com/awslabs/aws-cdk) project.

### Custom Resources

Custom Resources are CloudFormation resources that are implemented by
arbitrary user code. They can do arbitrary lookups or modifications
during a CloudFormation synthesis run.

You will typically use Lambda to implement a Construct implemented as a
Custom Resource (though SNS topics can be used as well). Your Lambda function
will be sent a `CREATE`, `UPDATE` or `DELETE` message, depending on the
CloudFormation life cycle, and can return any number of output values which
will be available as attributes of your Construct. In turn, those can
be used as input to other Constructs in your model.

In general, consumers of your Construct will not need to care whether
it is implemented in term of other CloudFormation resources or as a
custom resource.

Note: when implementing your Custom Resource using a Lambda, use
a `SingletonLambda` so that even if your custom resource is instantiated
multiple times, the Lambda will only get uploaded once.

#### Example

Sample of a Custom Resource that copies files into an S3 bucket during deployment
(implementation of actual `copy.py` operation elided).

```ts
interface CopyOperationProps {
  sourceBucket: IBucket;
  targetBucket: IBucket;
}

class CopyOperation extends Construct {
  constructor(parent: Construct, name: string, props: DemoResourceProps) {
    super(parent, name);

    const lambdaProvider = new SingletonLambda(this, 'Provider', {
      uuid: 'f7d4f730-4ee1-11e8-9c2d-fa7ae01bbebc',
      code: new LambdaInlineCode(resources['copy.py']),
      handler: 'index.handler',
      timeout: 60,
      runtime: LambdaRuntime.Python3,
    });

    new CustomResource(this, 'Resource', {
      provider: CustomResourceProvider.lambda(provider),
      properties: {
        sourceBucketArn: props.sourceBucket.bucketArn,
        targetBucketArn: props.targetBucket.bucketArn,
      }
    });
  }
}
```

More examples are in the `example` directory, including an example of how to use
the `cfnresponse` module that is provided for you by CloudFormation.

#### References

See the following section of the docs on details to write Custom Resources:

* [Introduction](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html)
* [Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref.html)
* [Code Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html)

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
