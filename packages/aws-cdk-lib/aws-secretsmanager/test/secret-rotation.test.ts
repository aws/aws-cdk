import { Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as cdk from '../../core';
import * as secretsmanager from '../lib';

let stack: cdk.Stack;
let vpc: ec2.IVpc;
let secret: secretsmanager.ISecret;
let securityGroup: ec2.SecurityGroup;
let target: ec2.Connections;
beforeEach(() => {
  stack = new cdk.Stack();
  vpc = new ec2.Vpc(stack, 'VPC');
  secret = new secretsmanager.Secret(stack, 'Secret');
  securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
  target = new ec2.Connections({
    defaultPort: ec2.Port.tcp(3306),
    securityGroups: [securityGroup],
  });
});

test('secret rotation single user', () => {
  // GIVEN
  const excludeCharacters = ' ;+%{}' + '@\'"`/\\#'; // DMS and BASH problem chars

  // WHEN
  new secretsmanager.SecretRotation(stack, 'SecretRotation', {
    application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
    secret,
    target,
    vpc,
    excludeCharacters: excludeCharacters,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
    IpProtocol: 'tcp',
    Description: 'from SecretRotationSecurityGroupAEC520AB:3306',
    FromPort: 3306,
    GroupId: {
      'Fn::GetAtt': [
        'SecurityGroupDD263621',
        'GroupId',
      ],
    },
    SourceSecurityGroupId: {
      'Fn::GetAtt': [
        'SecretRotationSecurityGroup9985012B',
        'GroupId',
      ],
    },
    ToPort: 3306,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
    SecretId: {
      Ref: 'SecretA720EF05',
    },
    RotationLambdaARN: {
      'Fn::GetAtt': [
        'SecretRotationA9FFCFA9',
        'Outputs.RotationLambdaARN',
      ],
    },
    RotationRules: {
      ScheduleExpression: 'rate(30 days)',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
    GroupDescription: 'Default/SecretRotation/SecurityGroup',
  });

  Template.fromStack(stack).hasResource('AWS::Serverless::Application', {
    Properties: {
      Location: {
        ApplicationId: {
          'Fn::FindInMap': ['SecretRotationSARMappingC10A2F5D', { Ref: 'AWS::Partition' }, 'applicationId'],
        },
        SemanticVersion: {
          'Fn::FindInMap': ['SecretRotationSARMappingC10A2F5D', { Ref: 'AWS::Partition' }, 'semanticVersion'],
        },
      },
      Parameters: {
        endpoint: {
          'Fn::Join': [
            '',
            [
              'https://secretsmanager.',
              {
                Ref: 'AWS::Region',
              },
              '.',
              {
                Ref: 'AWS::URLSuffix',
              },
            ],
          ],
        },
        functionName: 'SecretRotation',
        excludeCharacters: excludeCharacters,
        vpcSecurityGroupIds: {
          'Fn::GetAtt': [
            'SecretRotationSecurityGroup9985012B',
            'GroupId',
          ],
        },
        vpcSubnetIds: {
          'Fn::Join': [
            '',
            [
              {
                Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
              },
              ',',
              {
                Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
              },
            ],
          ],
        },
      },
    },
    DeletionPolicy: 'Delete',
    UpdateReplacePolicy: 'Delete',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::ResourcePolicy', {
    ResourcePolicy: {
      Statement: [
        {
          Action: 'secretsmanager:DeleteSecret',
          Effect: 'Deny',
          Principal: {
            AWS: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':root',
                ],
              ],
            },
          },
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
    SecretId: {
      Ref: 'SecretA720EF05',
    },
  });
});

test('secret rotation multi user', () => {
  // GIVEN
  const masterSecret = new secretsmanager.Secret(stack, 'MasterSecret');

  // WHEN
  new secretsmanager.SecretRotation(stack, 'SecretRotation', {
    application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
    secret,
    masterSecret,
    target,
    vpc,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
    Parameters: {
      endpoint: {
        'Fn::Join': [
          '',
          [
            'https://secretsmanager.',
            {
              Ref: 'AWS::Region',
            },
            '.',
            {
              Ref: 'AWS::URLSuffix',
            },
          ],
        ],
      },
      functionName: 'SecretRotation',
      vpcSecurityGroupIds: {
        'Fn::GetAtt': [
          'SecretRotationSecurityGroup9985012B',
          'GroupId',
        ],
      },
      vpcSubnetIds: {
        'Fn::Join': [
          '',
          [
            {
              Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
            },
            ',',
            {
              Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
            },
          ],
        ],
      },
      masterSecretArn: {
        Ref: 'MasterSecretA11BF785',
      },
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::ResourcePolicy', {
    ResourcePolicy: {
      Statement: [
        {
          Action: 'secretsmanager:DeleteSecret',
          Effect: 'Deny',
          Principal: {
            AWS: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':root',
                ],
              ],
            },
          },
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
    SecretId: {
      Ref: 'MasterSecretA11BF785',
    },
  });
});

test('secret rotation allows passing an empty string for excludeCharacters', () => {
  // WHEN
  new secretsmanager.SecretRotation(stack, 'SecretRotation', {
    application: secretsmanager.SecretRotationApplication.MARIADB_ROTATION_SINGLE_USER,
    secret,
    target,
    vpc,
    excludeCharacters: '',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
    Parameters: {
      excludeCharacters: '',
    },
  });
});

test('secret rotation without immediate rotation', () => {
  // WHEN
  new secretsmanager.SecretRotation(stack, 'SecretRotation', {
    application: secretsmanager.SecretRotationApplication.MARIADB_ROTATION_SINGLE_USER,
    secret,
    target,
    vpc,
    rotateImmediatelyOnUpdate: false,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
    RotateImmediatelyOnUpdate: false,
  });
});

test('throws when connections object has no default port range', () => {
  // WHEN
  const targetWithoutDefaultPort = new ec2.Connections({
    securityGroups: [securityGroup],
  });

  // THEN
  expect(() => new secretsmanager.SecretRotation(stack, 'Rotation', {
    secret,
    application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
    vpc,
    target: targetWithoutDefaultPort,
  })).toThrow(/`target`.+default port range/);
});

test('throws when master secret is missing for a multi user application', () => {
  // THEN
  expect(() => new secretsmanager.SecretRotation(stack, 'Rotation', {
    secret,
    application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
    vpc,
    target,
  })).toThrow(/The `masterSecret` must be specified for application using the multi user scheme/);
});

test('rotation function name does not exceed 64 chars', () => {
  // WHEN
  const id = 'SecretRotation'.repeat(5);
  new secretsmanager.SecretRotation(stack, id, {
    application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
    secret,
    target,
    vpc,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
    Parameters: {
      endpoint: {
        'Fn::Join': [
          '',
          [
            'https://secretsmanager.',
            {
              Ref: 'AWS::Region',
            },
            '.',
            {
              Ref: 'AWS::URLSuffix',
            },
          ],
        ],
      },
      functionName: 'RotationSecretRotationSecretRotationSecretRotationSecretRotation',
      vpcSecurityGroupIds: {
        'Fn::GetAtt': [
          'SecretRotationSecretRotationSecretRotationSecretRotationSecretRotationSecurityGroupBFCB171A',
          'GroupId',
        ],
      },
      vpcSubnetIds: {
        'Fn::Join': [
          '',
          [
            {
              Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
            },
            ',',
            {
              Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
            },
          ],
        ],
      },
    },
  });
});

test('with interface vpc endpoint', () => {
  // GIVEN
  const endpoint = new ec2.InterfaceVpcEndpoint(stack, 'SecretsManagerEndpoint', {
    service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
    vpc,
  });

  // WHEN
  new secretsmanager.SecretRotation(stack, 'SecretRotation', {
    application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
    secret,
    target,
    vpc,
    endpoint,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
    Parameters: {
      endpoint: {
        'Fn::Join': ['', [
          'https://',
          { Ref: 'SecretsManagerEndpoint5E83C66B' },
          '.secretsmanager.',
          { Ref: 'AWS::Region' },
          '.',
          { Ref: 'AWS::URLSuffix' },
        ]],
      },
    },
  });
});

const expectedVersions = {
  'aws': '1.1.618',
  'aws-cn': '1.1.237',
  'aws-us-gov': '1.1.319',
};

const expectedPartitionDetails = {
  'aws': 'arn:aws:serverlessrepo:us-east-1:297356227824',
  'aws-cn': 'arn:aws-cn:serverlessrepo:cn-north-1:193023089310',
  'aws-us-gov': 'arn:aws-us-gov:serverlessrepo:us-gov-west-1:023102451235',
};

describe('SecretRotationApplication partition version', () => {
  test('returns correct version for aws partition', () => {
    // WHEN
    const version = secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER.semanticVersionForPartition('aws');

    // THEN
    expect(version).toBe(expectedVersions.aws);
  });

  test('returns correct version for aws-cn partition', () => {
    // WHEN
    const version = secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER.semanticVersionForPartition('aws-cn');

    // THEN
    expect(version).toBe(expectedVersions['aws-cn']);
  });

  test('returns correct version for aws-us-gov partition', () => {
    // WHEN
    const version = secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER.semanticVersionForPartition('aws-us-gov');

    // THEN
    expect(version).toBe(expectedVersions['aws-us-gov']);
  });

  test('throws for unsupported partition', () => {
    // WHEN/THEN
    expect(() => secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER.semanticVersionForPartition('aws-iso'))
      .toThrow(/unsupported partition: aws-iso/);
  });

  test('returns correct ARN for aws-us-gov partition', () => {
    // WHEN
    const arn = secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER.applicationArnForPartition('aws-us-gov');

    // THEN
    expect(arn).toBe('arn:aws-us-gov:serverlessrepo:us-gov-west-1:023102451235:applications/SecretsManagerRDSMySQLRotationSingleUser');
  });
});

describe('CloudFormation mapping for all partitions', () => {
  test('includes correct versions for all cloud types', () => {
    // WHEN
    new secretsmanager.SecretRotation(stack, 'Rotation', {
      application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
      secret,
      target,
      vpc,
    });

    // THEN
    // Verify the SAR mapping includes the correct version for all partitions
    const template = Template.fromStack(stack);
    const cfnTemplate = template.toJSON();

    // Find the SAR mapping (it will have a hash suffix)
    const mappingKey = Object.keys(cfnTemplate.Mappings).find(key => key.startsWith('RotationSARMapping'));
    expect(mappingKey).toBeDefined();

    const mapping = cfnTemplate.Mappings[mappingKey!];

    // Verify all partition versions
    expect(mapping.aws.semanticVersion).toBe(expectedVersions.aws);
    expect(mapping['aws-cn'].semanticVersion).toBe(expectedVersions['aws-cn']);
    expect(mapping['aws-us-gov'].semanticVersion).toBe(expectedVersions['aws-us-gov']);

    // Verify application ARNs for all partitions
    expect(mapping.aws.applicationId).toBe('arn:aws:serverlessrepo:us-east-1:297356227824:applications/SecretsManagerRDSMySQLRotationSingleUser');
    expect(mapping['aws-cn'].applicationId).toBe('arn:aws-cn:serverlessrepo:cn-north-1:193023089310:applications/SecretsManagerRDSMySQLRotationSingleUser');
    expect(mapping['aws-us-gov'].applicationId).toBe('arn:aws-us-gov:serverlessrepo:us-gov-west-1:023102451235:applications/SecretsManagerRDSMySQLRotationSingleUser');
  });

  test('includes correct mapping for all rotation applications', () => {
    // Test a few different rotation applications to ensure mapping works universally
    const applications = [
      {
        app: secretsmanager.SecretRotationApplication.MARIADB_ROTATION_SINGLE_USER,
        name: 'SecretsManagerRDSMariaDBRotationSingleUser',
        id: 'MariaDB',
      },
      {
        app: secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_SINGLE_USER,
        name: 'SecretsManagerRDSPostgreSQLRotationSingleUser',
        id: 'Postgres',
      },
      {
        app: secretsmanager.SecretRotationApplication.ORACLE_ROTATION_SINGLE_USER,
        name: 'SecretsManagerRDSOracleRotationSingleUser',
        id: 'Oracle',
      },
    ];

    applications.forEach(({ app, name, id }) => {
      const testStack = new cdk.Stack();
      const testVpc = new ec2.Vpc(testStack, 'VPC');
      const testSecret = new secretsmanager.Secret(testStack, 'Secret');
      const testSecurityGroup = new ec2.SecurityGroup(testStack, 'SecurityGroup', { vpc: testVpc });
      const testTarget = new ec2.Connections({
        defaultPort: ec2.Port.tcp(3306),
        securityGroups: [testSecurityGroup],
      });

      new secretsmanager.SecretRotation(testStack, `${id}Rotation`, {
        application: app,
        secret: testSecret,
        target: testTarget,
        vpc: testVpc,
      });

      const template = Template.fromStack(testStack);
      const cfnTemplate = template.toJSON();

      // Find the SAR mapping
      const mappingKey = Object.keys(cfnTemplate.Mappings).find(key => key.includes('SARMapping'));
      expect(mappingKey).toBeDefined();

      const mapping = cfnTemplate.Mappings[mappingKey!];

      // Verify all partitions exist in the mapping
      expect(mapping.aws).toBeDefined();
      expect(mapping['aws-cn']).toBeDefined();
      expect(mapping['aws-us-gov']).toBeDefined();

      // Verify versions for all partitions
      expect(mapping.aws.semanticVersion).toBe(expectedVersions.aws);
      expect(mapping['aws-cn'].semanticVersion).toBe(expectedVersions['aws-cn']);
      expect(mapping['aws-us-gov'].semanticVersion).toBe(expectedVersions['aws-us-gov']);

      // Verify application ARNs contain the correct application name
      expect(mapping.aws.applicationId).toContain(name);
      expect(mapping['aws-cn'].applicationId).toContain(name);
      expect(mapping['aws-us-gov'].applicationId).toContain(name);

      // Verify partition-specific details
      expect(mapping.aws.applicationId).toContain(expectedPartitionDetails.aws);
      expect(mapping['aws-cn'].applicationId).toContain(expectedPartitionDetails['aws-cn']);
      expect(mapping['aws-us-gov'].applicationId).toContain(expectedPartitionDetails['aws-us-gov']);
    });
  });
});
