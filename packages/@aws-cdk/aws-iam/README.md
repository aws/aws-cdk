## AWS IAM Construct Library

Define a role and add permissions to it. This will automatically create and
attach an IAM policy to the role:

[attaching permissions to role](test/example.role.lit.ts)

Define a policy and attach it to groups, users and roles. Note that it is possible to attach
the policy either by calling `xxx.attachInlinePolicy(policy)` or `policy.attachToXxx(xxx)`.

[attaching policies to user and group](test/example.attaching.lit.ts)

Managed policies can be attached using `xxx.attachManagedPolicy(arn)`:

[attaching managed policies](test/example.managedpolicy.lit.ts)

### Features

 * Policy name uniqueness is enforced. If two policies by the same name are attached to the same
   principal, the attachment will fail.
 * Policy names are not required - the CDK logical ID will be used and ensured to be unique.


### Instance Profile

[AWS::IAM::InstanceProfile](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-instanceprofile.html)

```ts
import iam = require('@aws-cdk/aws-iam')

const testRole = new iam.Role(stack, 'TestRole', {
  assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
});

const instanceProfile = new iam.InstanceProfile(stack, 'InstanceProfile', {
    instanceProfileName: "InstanceProfileName",
    roles: [ testRole ],
    path: "/"
});

```