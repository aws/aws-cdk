import * as cdk from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

class ProducerStack extends cdk.Stack {
  constructor(scope:cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1 });

    const loadBalancer = new elbv2.NetworkLoadBalancer(this, 'NLB', { vpc });

    const endpointService = new ec2.VpcEndpointService(this, 'vpcEndpointService', {
      vpcEndpointServiceLoadBalancers: [loadBalancer],
      acceptanceRequired: true,
      contributorInsights: true,
      supportedIpAddressTypes: [ec2.IpAddressType.IPV4],
      allowedRegions: ['us-east-2'],
    });

    // Export the service ID for use in the consumer stack
    new cdk.CfnOutput(this, 'VpcEndpointServiceId', {
      value: endpointService.vpcEndpointServiceId,
      exportName: 'VpcEndpointServiceId',
    });
  }
}

class ConsumerStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Import the VPC endpoint service ID from the provider stack
    const serviceId = cdk.Fn.importValue('VpcEndpointServiceId');

    // Import the VPC endpoint service using fromVpcEndpointServiceId
    const importedEndpointService = ec2.VpcEndpointService.fromVpcEndpointServiceId(
      this,
      'ImportedEndpointService',
      serviceId,
    );

    // Create a VPC for the consumer
    const consumerVpc = new ec2.Vpc(this, 'ConsumerVPC', {
      maxAzs: 2,
    });

    // Use the imported service to create a VPC endpoint
    const vpcEndpoint = new ec2.InterfaceVpcEndpoint(this, 'ConsumerVpcEndpoint', {
      vpc: consumerVpc,
      service: new ec2.InterfaceVpcEndpointService(
        importedEndpointService.vpcEndpointServiceName,
        443,
      ),
    });
    vpcEndpoint.connections.securityGroups.forEach((sg) => {
      const cfnSg = sg.node.defaultChild as cdk.CfnResource;
      cfnSg.addMetadata('guard', {
        SuppressedRules: ['EC2_NO_OPEN_SECURITY_GROUPS'],
      });
    });
  }
}

const producerStack = new ProducerStack(app, 'TestProducerVpcEndpointService');
const consumerStack = new ConsumerStack(app, 'TestConsumerVpcEndpointService');

new integ.IntegTest(app, 'VpcEndpointservice', {
  testCases: [producerStack, consumerStack],
});

app.synth();
