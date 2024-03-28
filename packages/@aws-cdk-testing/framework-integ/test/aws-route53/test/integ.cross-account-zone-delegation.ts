import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Notes on how to run this integ test
 * (All regions are flexible, my testing used account A with af-south-1 not enabled)
 * Replace 123456789012 and 234567890123 with your own account numbers
 *
 * 1. Configure Accounts
 *   a. Account A (123456789012) should be bootstrapped for us-east-1
 *      and needs to set trust permissions for account B (234567890123)
 *      - `cdk bootstrap --trust 234567890123 --cloudformation-execution-policies 'arn:aws:iam::aws:policy/AdministratorAccess'`
 *      - assuming this is the default profile for aws credentials
 *   b. Account B (234567890123) should be bootstrapped for us-east-1 and af-south-1
 *     - note Account B needs to have af-south-1 enabled as it is an opt-in region
 *     - assuming this account is configured with the profile 'cross-account' for aws credentials
 *
 * 2. Set environment variables
 *   a. `export CDK_INTEG_ACCOUNT=123456789012`
 *   b. `export CDK_INTEG_CROSS_ACCOUNT=234567890123`
 *
 * 3. Run the integ test (from the @aws-cdk-testing/framework-integ/test directory)
 *   a. Get temporary console access credentials for account B
 *     - `yarn integ aws-route53/test/integ.cross-account-zone-delegation.js`
 *   b. Fall back if temp credentials do not work (account info may be in snapshot)
 *     - `yarn integ aws-route53/test/integ.cross-account-zone-delegation.js --profiles cross-account`
*/

const app = new cdk.App();

const account = process.env.CDK_INTEG_ACCOUNT || '123456789012'; // this account should NOT have af-south-1 enabled

// As the integ-runner doesnt provide a default cross account, we make our own.
const crossAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || '234567890123'; // this account MUST have af-south-1 enabled

const delegationRoleName = 'MyUniqueDelegationRole';

const parentZoneName = 'uniqueexample.com';
const subZoneName = 'sub.uniqueexample.com';

class ParentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const parentZone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: parentZoneName,
    });
    const crossAccountRole = new iam.Role(this, 'CrossAccountRole', {
      roleName: delegationRoleName,
      assumedBy: new iam.AccountPrincipal(crossAccount),
    });
    parentZone.grantDelegation(crossAccountRole, route53.DelegationGrantNames.ofEquals(subZoneName));
  }
}

class ChildStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const subZone = new route53.PublicHostedZone(this, 'SubZone', {
      zoneName: subZoneName,
    });

    const delegationRoleArn = cdk.Stack.of(this).formatArn({
      region: '',
      service: 'iam',
      account: account,
      resource: 'role',
      resourceName: delegationRoleName,
    });
    const delegationRole = iam.Role.fromRoleArn(this, 'DelegationRole', delegationRoleArn);

    new route53.CrossAccountZoneDelegationRecord(this, 'delegate', {
      delegatedZone: subZone,
      parentHostedZoneName: parentZoneName,
      delegationRole,
    });
  }
}

const parentStack = new ParentStack(app, 'parent-stack', {
  env: {
    account: account,
    region: 'us-east-1',
  },
});

const childStack = new ChildStack(app, 'child-stack', {
  env: {
    account: crossAccount,
    region: 'us-east-1',
  },
});

const childOptInStack = new ChildStack(app, 'child-opt-in-stack', {
  env: {
    account: crossAccount,
    region: 'af-south-1',
  },
});

childStack.addDependency(parentStack);
childOptInStack.addDependency(parentStack);

new IntegTest(app, 'Route53CrossAccountInteg', {
  testCases: [childStack, childOptInStack, parentStack],
  diffAssets: true,
});