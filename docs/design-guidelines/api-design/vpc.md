## VPC

Compute resources such as AWS Lambda functions, Amazon ECS clusters, AWS
CodeBuild projects normally allow users to specify the VPC configuration in
which they will be placed. The underlying CFN resources would normally have a
property or a set of properties that accept the set of subnets in which to place
the resources.

In most cases, the preferred default behavior is to place the resource in all
private subnets available within the VPC.

Props of such constructs should include the following properties
_[awslint:vpc-props]_:

```ts
/**
 * The VPC in which to run your CodeBuild project.
 */
vpc: ec2.IVpc; // usually this is required

/**
 * Which VPC subnets to use for your CodeBuild project.
 *
 * @default - uses all private subnets in your VPC
 */
vpcSubnetSelection?: ec2.SubnetSelection;
```