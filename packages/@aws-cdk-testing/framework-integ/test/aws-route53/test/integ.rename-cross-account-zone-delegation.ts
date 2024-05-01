import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

interface ChildStacksProps extends cdk.StackProps {
  subZoneName: string;
}

const app = new cdk.App();

const account = process.env.CDK_INTEG_ACCOUNT || '123456789012'; // this account should NOT have af-south-1 enabled

// As the integ-runner doesnt provide a default cross account, we make our own.
const crossAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || '234567890123'; // this account MUST have af-south-1 enabled

const delegationRoleName = 'MyUniqueDelegationRole';

const parentZoneName = 'uniqueexample.com';

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
    parentZone.grantDelegation(crossAccountRole);
  }
}

class ChildStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ChildStacksProps) {
    super(scope, id, props);
    const delegationRoleArn = cdk.Stack.of(this).formatArn({
      region: '',
      service: 'iam',
      account: account,
      resource: 'role',
      resourceName: delegationRoleName,
    });
    const delegationRole = iam.Role.fromRoleArn(this, 'DelegationRole', delegationRoleArn);

    const subZone = new route53.PublicHostedZone(this, 'NewSubZone', {
      zoneName: props.subZoneName,
    });

    new route53.CrossAccountZoneDelegationRecord(this, 'delegate', {
      delegatedZone: subZone,
      parentHostedZoneName: parentZoneName,
      delegationRole,
    });
  }
}

const oldApp = new cdk.App();

const oldParentStack = new ParentStack(oldApp, 'parent-stack', {
  env: {
    account: account,
    region: 'us-east-1',
  },
});

const oldChildStack = new ChildStack(oldApp, 'child-stack', {
  env: {
    account: crossAccount,
    region: 'us-east-1',
  },
  subZoneName: 'old.uniqueexample.com',
});

oldChildStack.addDependency(oldParentStack);

const newApp = new cdk.App();

const newParentStack = new ParentStack(newApp, 'parent-stack', {
  env: {
    account: account,
    region: 'us-east-1',
  },
});

const newChildStack = new ChildStack(newApp, 'child-stack', {
  env: {
    account: crossAccount,
    region: 'us-east-1',
  },
  subZoneName: 'new.uniqueexample.com',
});

newChildStack.addDependency(newParentStack);

new IntegTest(app, 'Route53RenameCrossAccountInteg', {
  testCases: [oldChildStack, newChildStack],
  diffAssets: true,
});
