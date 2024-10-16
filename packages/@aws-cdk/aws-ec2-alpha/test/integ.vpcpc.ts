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
 *   a. `export CDK_INTEG_ACCOUNT=123456789012`
 *   b. `export CDK_INTEG_CROSS_ACCOUNT=234567890123`
 *
 * 3. Run the integ test (from the @aws-cdk/aws-ec2-alpha/test directory)
 *   a. Get temporary console access credentials for Requestor Account
 *     - `yarn integ test/integ.vpcpc.js`
 *   b. Fall back if temp credentials do not work (account info may be in snapshot)
 *     - `yarn integ test/integ.vpcpc.js --profiles cross-account`
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
    acceptorVpc.createAcceptorVpcRole(acceptorAccount);
  }
}

class RequestorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // TODO: Import acceptorVpc into the requestor stack
    // Once implemented, need to test for cross account
    const acceptorVpc = new vpc_v2.VpcV2(this, 'requestorVpc', {
      primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc_v2.IpAddresses.ipv4('10.3.0.0/16', { cidrBlockName: 'TempBlock' })],
    });

    const requestorVpc = new vpc_v2.VpcV2(this, 'VpcB', {
      primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.2.0.0/16'),
    });

    const peeringConnection = requestorVpc.createPeeringConnection('acceptorAccountCrossRegionPeering', {
      acceptorVpc: acceptorVpc,
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