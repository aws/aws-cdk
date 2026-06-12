import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'LaunchTemplateCapacityReservationStack');

// LaunchTemplate with capacity reservation by ID
new ec2.LaunchTemplate(stack, 'LaunchTemplateWithCapacityReservationId', {
  machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  capacityReservation: ec2.CapacityReservation.fromId('cr-1234567890abcdef0'),
  capacityReservationPreference: ec2.CapacityReservationPreference.OPEN,
});

// LaunchTemplate with capacity reservation resource group
new ec2.LaunchTemplate(stack, 'LaunchTemplateWithCapacityReservationGroup', {
  machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  capacityReservation: ec2.CapacityReservation.fromResourceGroupArn('arn:aws:resource-groups:us-west-2:123456789012:group/my-group'),
  capacityReservationPreference: ec2.CapacityReservationPreference.CAPACITY_RESERVATIONS_ONLY,
});

// LaunchTemplate with only preference (no specific reservation)
new ec2.LaunchTemplate(stack, 'LaunchTemplateWithPreferenceOnly', {
  machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  capacityReservationPreference: ec2.CapacityReservationPreference.NONE,
});

new IntegTest(app, 'LaunchTemplateCapacityReservationTest', {
  testCases: [stack],
});

app.synth();
