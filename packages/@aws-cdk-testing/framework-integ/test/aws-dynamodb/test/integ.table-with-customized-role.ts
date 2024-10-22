import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

class TestStack extends Stack {
  public constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    Role.customizeRoles(this, {
      usePrecreatedRoles: {
        'cdk-table-with-customized-role/Role': 'my-precreated-role-name',
      },
    });

    const table = new Table(this, 'Table', {
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING,
      },
    });

    // Add GSI will add a new Resource under IAM Policy
    // i.e. `${this.tableArn}/index/*`. Test the Policy
    // Synthesizer generation with concatenated value.
    table.addGlobalSecondaryIndex({
      indexName: 'gsi',
      partitionKey: {
        name: 'gsi-pk',
        type: AttributeType.STRING,
      },
    });
    const role = new Role(this, 'Role', {
      assumedBy: new ServicePrincipal('dynamodb.amazonaws.com'),
    });
    table.grantReadData(role);
  }
}

class TestStack2 extends Stack {
  public constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    Role.customizeRoles(this, {
      usePrecreatedRoles: {
        'cdk-table-with-customized-role2/Role': 'my-precreated-role-name',
      },
    });

    const table = new Table(this, 'Table', {
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING,
      },
    });
    const role = new Role(this, 'Role', {
      assumedBy: new ServicePrincipal('dynamodb.amazonaws.com'),
    });
    table.grantReadData(role);
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-table-with-customized-role', {});
const stack2 = new TestStack2(app, 'cdk-table-with-customized-role2', {});
new IntegTest(app, 'cdk-dynamodb-customized-role-integ', {
  testCases: [stack, stack2],
  diffAssets: true,
});
