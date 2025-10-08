const cdk = require('aws-cdk-lib');
const integ = require('@aws-cdk/integ-tests-alpha');
const ec2 = require('aws-cdk-lib/aws-ec2');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ec2-lt-capacity-reservation');

// Test LaunchTemplate with capacity reservation ID (requires CAPACITY_RESERVATIONS_ONLY)
new ec2.LaunchTemplate(stack, 'LTWithCapacityReservation', {
  machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  capacityReservationSpecification: {
    capacityReservationPreference: ec2.CapacityReservationPreference.CAPACITY_RESERVATIONS_ONLY,
    capacityReservationTarget: {
      capacityReservationId: 'cr-1234567890abcdef0',
    },
  },
});

// Test LaunchTemplate with capacity reservation resource group (requires CAPACITY_RESERVATIONS_ONLY)
new ec2.LaunchTemplate(stack, 'LTWithCapacityReservationGroup', {
  machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  capacityReservationSpecification: {
    capacityReservationPreference: ec2.CapacityReservationPreference.CAPACITY_RESERVATIONS_ONLY,
    capacityReservationTarget: {
      capacityReservationResourceGroupArn: 'arn:aws:resource-groups:us-west-2:123456789012:group/my-group',
    },
  },
});

// Test LaunchTemplate with OPEN preference (no target allowed)
new ec2.LaunchTemplate(stack, 'LTWithCapacityReservationOpen', {
  machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  capacityReservationSpecification: {
    capacityReservationPreference: ec2.CapacityReservationPreference.OPEN,
  },
});

// Test LaunchTemplate with NONE preference (no target allowed)
new ec2.LaunchTemplate(stack, 'LTWithCapacityReservationNone', {
  machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  capacityReservationSpecification: {
    capacityReservationPreference: ec2.CapacityReservationPreference.NONE,
  },
});

// Test LaunchTemplate with capacity reservations only preference
new ec2.LaunchTemplate(stack, 'LTWithCapacityReservationsOnly', {
  machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  capacityReservationSpecification: {
    capacityReservationPreference: ec2.CapacityReservationPreference.CAPACITY_RESERVATIONS_ONLY,
    capacityReservationTarget: {
      capacityReservationId: 'cr-0987654321fedcba0',
    },
  },
});

new integ.IntegTest(app, 'LaunchTemplateCapacityReservationTest', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();