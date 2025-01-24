import { App, Stack, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult, Match } from '@aws-cdk/integ-tests-alpha';
import {
  AccountRootPrincipal,
  Grant,
  ManagedPolicy,
  PolicyStatement,
  Role,
  User,
} from 'aws-cdk-lib/aws-iam';
import { TableV2, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';

class ResourceStack extends Stack {
  public readonly table: TableV2;
  public readonly bucket: s3.Bucket;

  constructor(scope: App, id: string) {
    super(scope, id);

    // Create the actual resources we'll import in the test stack
    this.table = new TableV2(this, 'ImportedTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.bucket = new s3.Bucket(this, 'ImportedBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
  }
}

class IamManagedPolicyTestStack extends Stack {
  public readonly user: User;
  public readonly role: Role;
  public readonly defaultPolicy: ManagedPolicy;
  private readonly policies: Map<string, ManagedPolicy>;
  private readonly resourceStack: ResourceStack;

  constructor(scope: App, id: string, resourceStack: ResourceStack) {
    super(scope, id);
    this.resourceStack = resourceStack;
    this.policies = new Map();
    // Initialize core components
    this.user = this.createUser();
    this.role = this.createRole();
    // Setup policies
    this.setupPolicies();
    // Setup permissions
    this.setupPermissions();
    // Setup imported resources
    this.setupImportedResources();
    // Create the policy first
    this.defaultPolicy = new ManagedPolicy(this, 'DefaultManagedPolicy', {
      managedPolicyName: 'DefaultManagedPolicy',
      description: 'My Policy',
      path: '/some/path/',
    });
    this.defaultPolicy.addStatements(
      new PolicyStatement({
        resources: ['*'],
        actions: [
          's3:GetObject',
          's3:PutObject',
          's3:ListBucket',
        ],
      }),
    );
    // Export the policy ARN for cross-stack references
    new CfnOutput(this, 'DefaultPolicyArn', {
      value: this.defaultPolicy.managedPolicyArn,
      exportName: 'DefaultPolicyArnExport',
    });
    new CfnOutput(this, 'UserName', { value: this.user.userName });
    new CfnOutput(this, 'RoleName', { value: this.role.roleName });
  }

  private createUser(): User {
    return new User(this, 'MyUser');
  }

  private createRole(): Role {
    return new Role(this, 'Role', {
      assumedBy: new AccountRootPrincipal(),
    });
  }

  private setupPolicies(): void {
    // Create and configure first policy
    const policy1 = new ManagedPolicy(this, 'OneManagedPolicy', {
      managedPolicyName: 'OneManagedPolicy',
      description: 'My Policy',
      path: '/some/path/',
    });
    policy1.addStatements(
      new PolicyStatement({
        resources: ['*'],
        actions: ['sqs:SendMessage'],
      }),
    );
    this.policies.set('policy1', policy1);
    policy1.attachToUser(this.user);

    // Create and configure second policy
    const policy2 = new ManagedPolicy(this, 'TwoManagedPolicy');
    policy2.addStatements(
      new PolicyStatement({
        resources: ['*'],
        actions: ['lambda:InvokeFunction'],
      }),
    );
    this.policies.set('policy2', policy2);
    this.user.addManagedPolicy(policy2);

    // Import AWS managed policy
    const policy3 = ManagedPolicy.fromAwsManagedPolicyName('SecurityAudit');
    this.user.addManagedPolicy(policy3);
    //this.policies.set('policy3', policy3); //cannot be done. todo

    // Create standard policy for imported resources
    const policyForImport = new ManagedPolicy(this, 'StandardPolicy', {
      managedPolicyName: 'StandardPolicy',
      description: 'Grants team members permissions to perform BAU tasks such as lambda invocation and reading secrets. Copied verbatim as an ode to I32795',
    });
    this.policies.set('policyForImport', policyForImport);
  }

  private setupPermissions(): void {
    // Attach policies to user
    const policy1 = this.policies.get('policy1')!;
    const policy2 = this.policies.get('policy2')!;

    this.user.addManagedPolicy(policy2);

    // Setup role permissions
    this.role.grantAssumeRole(policy1.grantPrincipal);
    Grant.addToPrincipal({
      actions: ['iam:*'],
      resourceArns: [this.role.roleArn],
      grantee: policy2,
    });
    policy1.attachToRole(this.role);

    // Test idempotency with imported roles
    const importedRole = Role.fromRoleArn(
      this,
      'ImportedRole',
      this.role.roleArn,
    );
    policy1.attachToRole(importedRole);
  }

  private setupImportedResources(): void {
    const policyForImport = this.policies.get('policyForImport')!;

    // Setup S3 bucket permissions
    const bucket = s3.Bucket.fromBucketArn(
      this,
      'ImportedBucket',
      this.resourceStack.bucket.bucketArn,
    );
    bucket.grantReadWrite(policyForImport);

    // Setup DynamoDB table permissions
    const table = TableV2.fromTableArn(
      this,
      'ImportedTable',
      this.resourceStack.table.tableArn,
    );
    table.grantReadWriteData(policyForImport);
  }
}

class IamManagedPolicyIntegTest {
  private readonly stack: IamManagedPolicyTestStack;
  private readonly integ: IntegTest;
  private readonly resourceStack: ResourceStack;
  constructor() {
    const app = new App();
    this.resourceStack = new ResourceStack(app, 'ResourceStack');
    this.stack = new IamManagedPolicyTestStack(app, 'aws-cdk-iam-managed-policy', this.resourceStack);

    this.integ = new IntegTest(app, 'ManagedPolicyInteg', {
      testCases: [this.stack],
    });

    // Run all tests
    this.testPolicyCreation();
    this.testUserPolicyAttachment();
    this.testRolePermissions();
    this.testImportedResourcePermissions();
  }

  private testPolicyCreation() {
    const defaultPolicy = this.integ.assertions.awsApiCall('IAM', 'getPolicy', {
      PolicyArn: this.stack.defaultPolicy.managedPolicyArn,
    });

    defaultPolicy.expect(ExpectedResult.objectLike({
      Policy: {
        PolicyName: 'DefaultManagedPolicy',
        Path: '/some/path/',
        Description: 'My Policy',
      },
    }));

    const policyVersion = this.integ.assertions.awsApiCall('IAM', 'getPolicyVersion', {
      PolicyArn: this.stack.defaultPolicy.managedPolicyArn,
      VersionId: 'v1',
    });

    policyVersion.expect(ExpectedResult.objectLike({
      PolicyVersion: {
        VersionId: 'v1',
        IsDefaultVersion: true,
      },
    }));
  }
  private testUserPolicyAttachment() {
    const userPolicies = this.integ.assertions.awsApiCall('IAM', 'listAttachedUserPolicies', {
      UserName: this.stack.user.userName,
    });

    userPolicies.expect(ExpectedResult.objectLike({
      AttachedPolicies: Match.arrayWith([
        Match.objectLike({
          PolicyArn: Match.stringLikeRegexp('.*TwoManagedPolicy.*'),
        }),
        Match.objectLike({
          PolicyArn: Match.stringLikeRegexp('.*SecurityAudit.*'),
        }),
      ]),
    }));
  }

  private testRolePermissions() {
    const role = this.integ.assertions.awsApiCall('IAM', 'getRole', {
      RoleName: this.stack.role.roleName,
    });
    role.expect(ExpectedResult.objectLike({
      Role: {
        RoleName: Match.stringLikeRegexp('aws-cdk-iam-managed-policy-Role.*'),
      },
    }));
  }

  private testImportedResourcePermissions() {
    const bucketPolicy = this.integ.assertions.awsApiCall('S3', 'getBucketPolicy', {
      Bucket: this.resourceStack.bucket.bucketName,
    });

    bucketPolicy.expect(ExpectedResult.objectLike({
      Policy: Match.stringLikeRegexp('.*s3:GetBucket.*s3:PutBucketPolicy.*'),
    }));

    const tablePolicy = this.integ.assertions.awsApiCall('DynamoDB', 'describeTable', {
      TableName: this.resourceStack.table.tableName,
    });

    tablePolicy.expect(ExpectedResult.objectLike({
      Table: {
        TableName: this.resourceStack.table.tableName,
      },
    }));
  }
}

// Initialize and run the integration tests
new IamManagedPolicyIntegTest();
