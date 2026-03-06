import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

class VpcEndpointCfnSubnetStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = new ec2.Vpc(this, 'MyVpc', {
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'Public',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
            ]
        });

        const cfnSubnet = new ec2.CfnSubnet(this, 'CfnSubnet', {
            vpcId: vpc.vpcId,
            cidrBlock: '10.0.100.0/24',
            availabilityZone: 'us-east-1a'
        });

        vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
            service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
            subnets: { subnets: [cfnSubnet as unknown as ec2.ISubnet] },
        });
    }
}

const stack = new VpcEndpointCfnSubnetStack(app, 'aws-cdk-ec2-vpc-endpoint-cfn-subnet');

new IntegTest(app, 'VpcEndpointCfnSubnetTest', {
    testCases: [stack],
});
