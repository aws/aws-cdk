import * as cdk from '../../core';
import * as ec2 from '../lib';

class LaunchTemplateCapacityReservationStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /// !show
    // LaunchTemplate with capacity reservation specification
    new ec2.LaunchTemplate(this, 'LaunchTemplateWithCapacityReservation', {
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      capacityReservationSpecification: {
        capacityReservationPreference: ec2.CapacityReservationPreference.OPEN,
        capacityReservationTarget: {
          capacityReservationId: 'cr-1234567890abcdef0',
        },
      },
    });

    // LaunchTemplate with capacity reservation resource group
    new ec2.LaunchTemplate(this, 'LaunchTemplateWithResourceGroup', {
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      capacityReservationSpecification: {
        capacityReservationPreference: ec2.CapacityReservationPreference.NONE,
        capacityReservationTarget: {
          capacityReservationResourceGroupArn: 'arn:aws:resource-groups:us-west-2:123456789012:group/my-group',
        },
      },
    });

    // LaunchTemplate with capacity reservations only preference
    new ec2.LaunchTemplate(this, 'LaunchTemplateCapacityReservationsOnly', {
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      capacityReservationSpecification: {
        capacityReservationPreference: ec2.CapacityReservationPreference.CAPACITY_RESERVATIONS_ONLY,
        capacityReservationTarget: {
          capacityReservationId: 'cr-0987654321fedcba0',
        },
      },
    });
    /// !hide
  }
}

const app = new cdk.App();
new LaunchTemplateCapacityReservationStack(app, 'aws-cdk-launch-template-capacity-reservation', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  },
});
app.synth();