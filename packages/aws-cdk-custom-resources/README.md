## CDK Custom Resources

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

### Example

Sample of a Custom Resource that copies files into an S3 bucket during deployment
(implementation of actual `copy.py` operation elided).

The below example creates a new resource provider.

```ts
interface CopyOperationProps {
    sourceBucket: IBucket;
    targetBucket: IBucket;
}

class CopyResourceProvider extends CustomResource {
    constructor(parent: Construct, name: string) {
        super(parent, name, {
            provider: new LambdaBackedCustomResource({
                lambdaProperties: {
                    code: new LambdaInlineCode(resources['copy.py']),
                    handler: 'index.handler',
                    timeout: 60,
                    runtime: LambdaRuntime.Python3,
                    permissions: [new PolicyStatement().addResource("*").addAction("s3:*")] //this is too broad and only for demo purposes
                }
            })
        });
    }

    /**
     * Overrides the parent resourceInstance method to take a specific type of props
    **/
    public resourceInstance(name: string, props: DemoResourceProps) {
        return super.resourceInstance(name, props);
    }
}
```

Then, you need only call `resourceInstance` to add an instance of your custom resource!

```ts
class MyAmazingStack extends Stack {
    constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        const resource = new CopyResourceProvider(this, 'CopyResource');

        const sourceBucket = ...;
        const destBucket = ...;

        const copyResourceInstance = resource.resourceInstance('CopyInstance1', {
            sourceBucket,
            destBucket
        });

        // Publish the custom resource output
        new Output(this, 'DestPath', {
            description: 'The path as returned by the custom resource instance',
            value: copyResourceInstance.getAtt('DestPath')
        });
    }
}
```

More examples are in the `example` directory, including an example of how to use
the `cfnresponse` module that is provided for you by CloudFormation.

### References

See the following section of the docs on details to write Custom Resources:

* [Introduction](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html)
* [Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref.html)
* [Code Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html)
