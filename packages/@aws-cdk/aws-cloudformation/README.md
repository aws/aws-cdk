## CDK Constructs for AWS CloudFormation

This module is part of the [AWS Cloud Development Kit](https://github.com/awslabs/aws-cdk) project.

### CodePipeline Actions for CloudFormation

This module contains Actions that allows you to deploy to CloudFormation from AWS CodePipeline.

For example, the following code fragment defines a pipeline that automatically deploys a CloudFormation template
directly from a CodeCommit repository, with a manual approval step in between to confirm the changes:

[example Pipeline to deploy CloudFormation](../aws-codepipeline/test/integ.cfn-template-from-repo.lit.ts)

See [the AWS documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline.html)
for more details about using CloudFormation in CodePipeline.

#### Actions defined by this package

This package defines the following actions:

* **PipelineCreateUpdateStackAction** - Deploy a CloudFormation template directly from the pipeline. The indicated stack is created,
  or updated if it already exists. If the stack is in a failure state, deployment will fail (unless `replaceOnFailure`
  is set to `true`, in which case it will be destroyed and recreated).
* **PipelineDeleteStackAction** - Delete the stack with the given name.
* **PipelineCreateReplaceChangeSetAction** - Prepare a change set to be applied later. You will typically use change sets if you want
  to manually verify the changes that are being staged, or if you want to separate the people (or system) preparing the
  changes from the people (or system) applying the changes.
* **PipelineExecuteChangeSetAction** - Execute a change set prepared previously.

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
            lambdaProvider,
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
