/*
 * Our integration tests act as snapshot tests to make sure the rendered template is stable.
 * If any changes to the result are required,
 * you need to perform an actual CloudFormation deployment of this application,
 * and, if it is successful, a new snapshot will be written out.
 *
 * For more information on CDK integ tests,
 * see the main CONTRIBUTING.md file.
 *
 * Notes on how to run this integ test
 * Replace 123456789012 and 234567890123 with your own account numbers
 *
 * 1. Configure Accounts
 *   a. Requestor Account (123456789012) should be bootstrapped for us-east-1
 *   b. Acceptor Account (234567890123) should be bootstrapped for us-east-1
 *      and needs to set trust permissions for requestor account (123456789012)
 *     - `cdk bootstrap --trust 123456789012 --cloudformation-execution-policies 'arn:aws:iam::aws:policy/AdministratorAccess' 'aws://234567890123/us-east-1'`
 *     - assuming this is the default profile for aws credentials
 *
 * 2. Set environment variables
 *   a. `export CDK_INTEG_ACCOUNT=123456789012` //Requestor Account
 *   b. `export CDK_INTEG_CROSS_ACCOUNT=234567890123` //Acceptor Account
 *
 * 3. Run the integ test (from the @aws-cdk/aws-ec2-alpha/test directory)with no clean flag
 *   a. Get temporary console access credentials for Requestor Account
 *     - `yarn integ test/integ.vpcpc.js --no-clean`
 *   b. Fall back if temp credentials do not work (account info may be in snapshot)
 *     - `yarn integ test/integ.vpcpc.js --profiles cross-account`
 * Note: Integration test will fail since vpcId of acceptor stack is a dummy value
 *
 * 4. Modify acceptorVpcId to actual physical Id and rerun the integration test to
 *    test cross account peering
 *    - `yarn integ test/integ.vpcpc.js`
*/

import * as vpc_v2 from '../lib/vpc-v2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RouteTable } from '../lib/route';

const app = new cdk.App();
const account = process.env.CDK_INTEG_ACCOUNT || '123456789012';
const acceptorAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || '234567890123';

class AcceptorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const acceptorVpc = new vpc_v2.VpcV2(this, 'acceptorVpc', {
      primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
    });

    //Same account VPC peering
    const requestorVpc = new vpc_v2.VpcV2(this, 'requestorVpcSameAccount', {
      primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.1.0.0/16'),
    });

    requestorVpc.createPeeringConnection('sameAccountPeering', {
      acceptorVpc: acceptorVpc,
    });

    //For cross-account peering connection
    acceptorVpc.createAcceptorVpcRole(account);
  }
}

class RequestorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Import acceptorVpc into the requestor stack, change vpcId after vpc is created using acceptorStack definition
    const acceptorVpc = vpc_v2.VpcV2.fromVpcV2Attributes(this, 'acceptorVpc', {
      //Replace VPC Id before running integ test again
      vpcId: 'vpc-09b9235d8a3195ba3',
      vpcCidrBlock: '10.0.0.0/16',
      region: 'us-east-1',
      ownerAccountId: acceptorAccount,
    });

    const requestorVpc = new vpc_v2.VpcV2(this, 'requestorVpcCrossAccount', {
      primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.2.0.0/16'),
    });

    const peeringConnection = requestorVpc.createPeeringConnection('acceptorAccountCrossRegionPeering', {
      acceptorVpc: acceptorVpc,
      peerRoleArn: 'arn:aws:iam::916743627080:role/VpcPeeringRole',
    });

    const routeTable = new RouteTable(this, 'RouteTable', {
      vpc: requestorVpc,
    });

    routeTable.addRoute('vpcPeeringRoute', '10.0.0.0/16', { gateway: peeringConnection });
  }
}

const acceptorStack = new AcceptorStack(app, 'acceptor-stack', {
  env: {
    account: acceptorAccount,
    region: 'us-east-1',
  },
});

const requestorStack = new RequestorStack(app, 'requestor-stack', {
  env: {
    account: account,
    region: 'us-east-1',
  },
});

new IntegTest(app, 'VpcpcCrossAccountInteg', {
  testCases: [acceptorStack, requestorStack],
});
