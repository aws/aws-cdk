## AWS CloudFormation Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


---
<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

### Custom Resources

Custom Resources are CloudFormation resources that are implemented by
arbitrary user code. They can do arbitrary lookups or modifications
during a CloudFormation synthesis run.

You will typically use Lambda to implement a Construct implemented as a
Custom Resource (though SNS topics can be used as well). Your Lambda function
will be sent a `CREATE`, `UPDATE` or `DELETE` message, depending on the
CloudFormation life cycle. It will perform whatever actions it needs to, and
then return any number of output values which will be available as attributes
of your Construct. In turn, those can be used as input to other Constructs in
your model.

In general, consumers of your Construct will not need to care whether
it is implemented in term of other CloudFormation resources or as a
custom resource.

Note: when implementing your Custom Resource using a Lambda, use
a `SingletonLambda` so that even if your custom resource is instantiated
multiple times, the Lambda will only get uploaded once.

#### Example

The following shows an example of a declaring Custom Resource that copies
files into an S3 bucket during deployment (the implementation of the actual
Lambda handler is elided for brevity).

[example of Custom Resource](test/example.customresource.lit.ts)

The [aws-cdk-examples repository](https://github.com/aws-samples/aws-cdk-examples) has
examples for adding custom resources.

#### References

See the following section of the docs on details to write Custom Resources:

* [Introduction](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html)
* [Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref.html)
* [Code Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html)
