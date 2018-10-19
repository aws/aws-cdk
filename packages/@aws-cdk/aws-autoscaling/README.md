## The CDK Construct Library for AWS Auto-Scaling
This module is part of the [AWS Cloud Development Kit](https://github.com/awslabs/aws-cdk) project.

### Fleet

### Auto Scaling Group

An `AutoScalingGroup` represents a number of instances on which you run your code. You
pick the size of the fleet, the instance type and the OS image:

```ts
import autoscaling = require('@aws-cdk/aws-autoscaling');
import ec2 = require('@aws-cdk/aws-ec2');

const vpc = new ec2.VpcNetwork(stack, 'VPC', {
    maxAZs: 3
});

new autoscaling.AutoScalingGroup(stack, 'ASG', {
    vpc,
    instanceType: new ec2.InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Micro),
    machineImage: new ec2.AmazonLinuxImage()
});
```

> NOTE: AutoScalingGroup has an property called `allowAllOutbound` (allowing the instances to contact the
> internet) which is set to `true` by default. Be sure to set this to `false`  if you don't want
> your instances to be able to start arbitrary connections.

### AMIs

AMIs control the OS that gets launched when you start your instance.

Depending on the type of AMI, you select it a different way.

The latest version of Windows images are regionally published under labels,
so you can select Windows images like this:

    new ec2.WindowsImage(WindowsVersion.WindowsServer2016EnglishNanoBase)

You can select the latest Amazon Linux image like this:

    new ec2.AmazonLinuxImage()

Other Linux images are unfortunately not currently published this way, so you have
to supply a region-to-AMI map when creating a Linux image:

    machineImage: new ec2.GenericLinuxImage({
        'us-east-1': 'ami-97785bed',
        'eu-west-1': 'ami-12345678',
        // ...
    })

> NOTE: Selecting Linux images will change when the information is published in an automatically
> consumable way.

### Allowing Connections

See the documentation of the aws-ec2 package for more information about allowing
connections between resources backed by instances.
