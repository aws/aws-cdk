import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as cdk from 'aws-cdk-lib';
import { DatabaseCluster, DatabaseClusterEngine, AuroraMysqlEngineVersion, ClusterInstance } from 'aws-cdk-lib/aws-rds';
import { IntegTest, ExpectedResult, Match } from '@aws-cdk/integ-tests-alpha';

/**
 * Integration test for RDS connection string feature.
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                    CONNECTION STRING FLOW DIAGRAM                           │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌──────────────┐
 *   │ RDS Cluster  │
 *   │  (Aurora)    │
 *   └──────┬───────┘
 *          │ generates
 *          ▼
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ Secrets Manager Secret                                       │
 *   │ {                                                            │
 *   │   "username": "admin",                                       │
 *   │   "password": "random-generated-password",                   │
 *   │   "host": "cluster-xyz.region.rds.amazonaws.com",           │
 *   │   "port": 3306                                               │
 *   │ }                                                            │
 *   └──────────────────────┬───────────────────────────────────────┘
 *                          │
 *                          │ connectionStringFromJson()
 *                          │ (synthesis-time transformation)
 *                          ▼
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ CloudFormation Template (Fn::Sub with dynamic references)    │
 *   │                                                              │
 *   │ Fn::Sub:                                                     │
 *   │   - "mysql://${username}:${password}@${host}:${port}"       │
 *   │   - username: "{{resolve:secretsmanager:arn:SecretString:username}}" │
 *   │     password: "{{resolve:secretsmanager:arn:SecretString:password}}" │
 *   │     host: "{{resolve:secretsmanager:arn:SecretString:host}}"         │
 *   │     port: "{{resolve:secretsmanager:arn:SecretString:port}}"         │
 *   └──────────────────────┬───────────────────────────────────────┘
 *                          │
 *                          │ CloudFormation resolves at deployment
 *                          ▼
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ ECS Task Definition Environment Variable                     │
 *   │ DATABASE_URL = "mysql://admin:Abc123XYZ@cluster-xyz....:3306"│
 *   └──────────────────────┬───────────────────────────────────────┘
 *                          │
 *                          │ Container startup
 *                          ▼
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ ECS Container (AWS CLI)                                      │
 *   │                                                              │
 *   │ 1. Read $DATABASE_URL environment variable                   │
 *   │ 2. Write value to SSM Parameter Store                        │
 *   │    aws ssm put-parameter --name /test/connection-string ...  │
 *   │ 3. Sleep to keep container running                           │
 *   └──────────────────────┬───────────────────────────────────────┘
 *                          │
 *                          │ writes to
 *                          ▼
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ SSM Parameter Store                                          │
 *   │ /integ-test/rds-connection-string/validation                 │
 *   │ Value: "mysql://admin:Abc123XYZ@cluster-xyz....:3306"       │
 *   └──────────────────────┬───────────────────────────────────────┘
 *                          │
 *                          │ IntegTest reads and validates
 *                          ▼
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ AwsApiCall Assertions                                        │
 *   │                                                              │
 *   │ 1. Read SSM parameter value                                  │
 *   │ 2. Verify format: mysql://username:password@host:port       │
 *   │ 3. Verify no placeholders ({{...}}) remain                   │
 *   │ 4. Verify actual secret values were resolved                 │
 *   └──────────────────────────────────────────────────────────────┘
 *
 * This test validates that:
 * 1. DatabaseSecret can generate connection strings using connectionStringFromJson()
 * 2. Connection strings are properly transformed to Fn::Sub with dynamic references
 * 3. CloudFormation resolves the dynamic references at deployment time
 * 4. The resolved connection string contains actual values (not placeholders)
 * 5. The connection string can be used in ECS task definitions
 * 6. Runtime validation proves the feature works end-to-end
 */
class ConnectionStringTestStack extends cdk.Stack {
  public readonly taskDefinitionArn: string;
  public readonly validationParameterName: string;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC for RDS cluster
    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
      restrictDefaultSecurityGroup: false,
    });

    // Create Aurora MySQL cluster with generated secret
    const cluster = new DatabaseCluster(this, 'Database', {
      engine: DatabaseClusterEngine.auroraMysql({
        version: AuroraMysqlEngineVersion.VER_3_08_0,
      }),
      writer: ClusterInstance.provisioned('Instance1', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
      }),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });

    // Get the secret from the cluster
    const secret = cluster.secret!;

    // Generate connection string using MySQL template (without dbname since cluster secret doesn't include it)
    const mysqlConnectionString = secret.connectionStringFromJson(
      'mysql://${username}:${password}@${host}:${port}',
    );

    // Generate connection string with custom template (with query parameters, no dbname)
    const customConnectionString = secret.connectionStringFromJson(
      'mysql://${username}:${password}@${host}:${port}?ssl-mode=REQUIRED&connect_timeout=10',
    );

    // Create SSM parameter for runtime validation
    // The ECS container will write the resolved connection string here
    const validationParameter = new ssm.StringParameter(this, 'ValidationParameter', {
      parameterName: '/integ-test/rds-connection-string/validation',
      stringValue: 'placeholder', // Will be overwritten by container
      description: 'Runtime validation parameter for connection string test',
    });
    this.validationParameterName = validationParameter.parameterName;

    // Create task definition that uses the connection string
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      memoryLimitMiB: 512,
      cpu: 256,
    });

    // Add container that uses the connection string as environment variable
    // The container will write the DATABASE_URL to SSM for validation
    taskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/aws-cli/aws-cli:latest'),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'connection-string-test' }),
      environment: {
        // Use the connection string in environment variable
        DATABASE_URL: mysqlConnectionString.unsafeUnwrap(),
        DATABASE_URL_CUSTOM: customConnectionString.unsafeUnwrap(),
        VALIDATION_PARAMETER_NAME: validationParameter.parameterName,
        AWS_DEFAULT_REGION: cdk.Stack.of(this).region,
      },
      command: [
        'sh',
        '-c',
        // Write the DATABASE_URL to SSM Parameter Store for validation
        // This proves the connection string was properly resolved at deployment time
        'echo "Writing connection string to SSM for validation..." && ' +
        'aws ssm put-parameter ' +
        '  --name "$VALIDATION_PARAMETER_NAME" ' +
        '  --value "$DATABASE_URL" ' +
        '  --type String ' +
        '  --overwrite && ' +
        'echo "Connection string written successfully" && ' +
        'echo "DATABASE_URL: $DATABASE_URL" && ' +
        'echo "DATABASE_URL_CUSTOM: $DATABASE_URL_CUSTOM" && ' +
        'sleep 3600',
      ],
    });

    // Grant the task read access to the secret
    secret.grantRead(taskDefinition.taskRole);

    // Grant the task write access to the SSM parameter
    validationParameter.grantWrite(taskDefinition.taskRole);

    // Store task definition ARN for validation
    this.taskDefinitionArn = taskDefinition.taskDefinitionArn;

    // Output the connection string (will show Fn::Sub structure)
    new cdk.CfnOutput(this, 'ConnectionStringOutput', {
      value: mysqlConnectionString.unsafeUnwrap(),
      description: 'MySQL connection string using Fn::Sub with dynamic references',
    });

    new cdk.CfnOutput(this, 'CustomConnectionStringOutput', {
      value: customConnectionString.unsafeUnwrap(),
      description: 'Custom MySQL connection string with query parameters',
    });

    new cdk.CfnOutput(this, 'ClusterEndpoint', {
      value: cluster.clusterEndpoint.hostname,
      description: 'RDS cluster endpoint',
    });
  }
}

const app = new cdk.App();
const stack = new ConnectionStringTestStack(app, 'aws-cdk-rds-connection-string-integ');

const integTest = new IntegTest(app, 'rds-connection-string-test', {
  testCases: [stack],
  diffAssets: true,
});

// ============================================================================
// RUNTIME VALIDATION: Read the connection string written by the ECS container
// ============================================================================
// This is the key validation that proves the connection string feature works:
// 1. The container receives the resolved connection string (not placeholders)
// 2. The container writes it to SSM Parameter Store
// 3. We read it back and verify it has the correct format with actual values

const getConnectionString = integTest.assertions.awsApiCall('SSM', 'getParameter', {
  Name: stack.validationParameterName,
});

// Verify the connection string has the correct MySQL format
getConnectionString.expect(ExpectedResult.objectLike({
  Parameter: {
    Name: stack.validationParameterName,
    Type: 'String',
    // The value should be a fully resolved MySQL connection string
    // Format: mysql://username:password@host:port
    Value: Match.stringLikeRegexp('^mysql://[^:]+:[^@]+@[^:]+:\\d+$'),
  },
}));

// Additional validation: ensure no CloudFormation placeholders remain
// If dynamic references weren't resolved, we'd see {{resolve:secretsmanager:...}}
getConnectionString.assertAtPath('Parameter.Value', ExpectedResult.stringLikeRegexp('^(?!.*\\{\\{).*$'));

// Verify the connection string contains the actual RDS endpoint
// This proves the host was properly resolved from the secret
getConnectionString.assertAtPath('Parameter.Value', ExpectedResult.stringLikeRegexp('.*\\.rds\\.amazonaws\\.com.*'));

// ============================================================================
// CLOUDFORMATION OUTPUT VALIDATION
// ============================================================================
// Validate that the CloudFormation outputs contain the expected Fn::Sub structure
// This ensures the connection string is properly resolved at deployment time
integTest.assertions.awsApiCall('CloudFormation', 'describeStacks', {
  StackName: stack.stackName,
}).expect(ExpectedResult.objectLike({
  Stacks: [{
    Outputs: Match.arrayWith([
      Match.objectLike({
        OutputKey: 'ConnectionStringOutput',
        Description: 'MySQL connection string using Fn::Sub with dynamic references',
        // The output value should contain a resolved connection string with mysql:// prefix
        OutputValue: Match.stringLikeRegexp('^mysql://.*'),
      }),
      Match.objectLike({
        OutputKey: 'CustomConnectionStringOutput',
        Description: 'Custom MySQL connection string with query parameters',
        // The output value should contain query parameters
        OutputValue: Match.stringLikeRegexp('\\?ssl-mode=REQUIRED&connect_timeout=10'),
      }),
      Match.objectLike({
        OutputKey: 'ClusterEndpoint',
        Description: 'RDS cluster endpoint',
        // The endpoint should be a valid hostname
        OutputValue: Match.stringLikeRegexp('.*\\.rds\\.amazonaws\\.com'),
      }),
    ]),
  }],
}));

// ============================================================================
// ECS TASK DEFINITION VALIDATION
// ============================================================================
// Validate that the ECS task definition has the environment variables set
// This verifies the connection string is properly injected into the container
integTest.assertions.awsApiCall('ECS', 'describeTaskDefinition', {
  taskDefinition: stack.taskDefinitionArn,
}).expect(ExpectedResult.objectLike({
  taskDefinition: {
    containerDefinitions: Match.arrayWith([
      Match.objectLike({
        name: 'app',
        environment: Match.arrayWith([
          Match.objectLike({
            name: 'DATABASE_URL',
            // Value should be a string containing the mysql:// connection string
            value: Match.stringLikeRegexp('^mysql://.*'),
          }),
          Match.objectLike({
            name: 'DATABASE_URL_CUSTOM',
            // Value should contain query parameters
            value: Match.stringLikeRegexp('\\?ssl-mode=REQUIRED&connect_timeout=10'),
          }),
        ]),
      }),
    ]),
  },
}));

app.synth();
