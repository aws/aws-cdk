/* eslint-disable jest/expect-expect */
import { Match, Template } from '@aws-cdk/assertions';
import * as acm from '@aws-cdk/aws-certificatemanager';
import { Metric, Statistic } from '@aws-cdk/aws-cloudwatch';
import { Vpc, EbsDeviceVolumeType, Port, SecurityGroup, SubnetType } from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as route53 from '@aws-cdk/aws-route53';
import { App, Stack, Duration, SecretValue, CfnParameter, Token } from '@aws-cdk/core';
import each from 'jest-each';
import { Domain, EngineVersion } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });

  jest.resetAllMocks();
});

const readActions = ['ESHttpGet', 'ESHttpHead'];
const writeActions = ['ESHttpDelete', 'ESHttpPost', 'ESHttpPut', 'ESHttpPatch'];
const readWriteActions = [
  ...readActions,
  ...writeActions,
];

const testedOpenSearchVersions = [
  EngineVersion.OPENSEARCH_1_0,
  EngineVersion.OPENSEARCH_1_1,
  EngineVersion.OPENSEARCH_1_2,
  EngineVersion.OPENSEARCH_1_3,
  EngineVersion.OPENSEARCH_2_3,
];

each(testedOpenSearchVersions).test('connections throws if domain is not placed inside a vpc', (engineVersion) => {

  expect(() => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
    }).connections;
  }).toThrowError("Connections are only available on VPC enabled domains. Use the 'vpc' property to place a domain inside a VPC");
});

each(testedOpenSearchVersions).test('subnets and security groups can be provided when vpc is used', (engineVersion) => {

  const vpc = new Vpc(stack, 'Vpc');
  const securityGroup = new SecurityGroup(stack, 'CustomSecurityGroup', {
    vpc,
  });
  const domain = new Domain(stack, 'Domain', {
    version: engineVersion,
    vpc,
    vpcSubnets: [{ subnets: [vpc.privateSubnets[0]] }],
    securityGroups: [securityGroup],
  });

  expect(domain.connections.securityGroups[0].securityGroupId).toEqual(securityGroup.securityGroupId);
  Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
    VPCOptions: {
      SecurityGroupIds: [
        {
          'Fn::GetAtt': [
            'CustomSecurityGroupE5E500E5',
            'GroupId',
          ],
        },
      ],
      SubnetIds: [
        {
          Ref: 'VpcPrivateSubnet1Subnet536B997A',
        },
      ],
    },
  });

});

each(testedOpenSearchVersions).test('default subnets and security group when vpc is used', (engineVersion) => {

  const vpc = new Vpc(stack, 'Vpc');
  const domain = new Domain(stack, 'Domain', {
    version: engineVersion,
    vpc,
  });

  expect(stack.resolve(domain.connections.securityGroups[0].securityGroupId)).toEqual({ 'Fn::GetAtt': ['DomainSecurityGroup48AA5FD6', 'GroupId'] });
  Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
    VPCOptions: {
      SecurityGroupIds: [
        {
          'Fn::GetAtt': [
            'DomainSecurityGroup48AA5FD6',
            'GroupId',
          ],
        },
      ],
      SubnetIds: [
        {
          Ref: 'VpcPrivateSubnet1Subnet536B997A',
        },
        {
          Ref: 'VpcPrivateSubnet2Subnet3788AAA1',
        },
        {
          Ref: 'VpcPrivateSubnet3SubnetF258B56E',
        },
      ],
    },
  });

});

each(testedOpenSearchVersions).test('connections has no default port if enforceHttps is false', (engineVersion) => {

  const vpc = new Vpc(stack, 'Vpc');
  const domain = new Domain(stack, 'Domain', {
    version: engineVersion,
    vpc,
    enforceHttps: false,
  });

  expect(domain.connections.defaultPort).toBeUndefined();

});

each(testedOpenSearchVersions).test('connections has default port 443 if enforceHttps is true', (engineVersion) => {

  const vpc = new Vpc(stack, 'Vpc');
  const domain = new Domain(stack, 'Domain', {
    version: engineVersion,
    vpc,
    enforceHttps: true,
  });

  expect(domain.connections.defaultPort).toEqual(Port.tcp(443));

});

each(testedOpenSearchVersions).test('default removalpolicy is retain', (engineVersion) => {
  new Domain(stack, 'Domain', {
    version: engineVersion,
  });

  Template.fromStack(stack).hasResource('AWS::OpenSearchService::Domain', {
    DeletionPolicy: 'Retain',
  });
});

each([testedOpenSearchVersions]).test('grants kms permissions if needed', (engineVersion) => {

  const key = new kms.Key(stack, 'Key');

  new Domain(stack, 'Domain', {
    version: engineVersion,
    encryptionAtRest: {
      kmsKey: key,
    },
    // so that the access policy custom resource will be used.
    useUnsignedBasicAuth: true,
  });

  const expectedPolicy = {
    Statement: [
      {
        Action: [
          'kms:List*',
          'kms:Describe*',
          'kms:CreateGrant',
        ],
        Effect: 'Allow',
        Resource: {
          'Fn::GetAtt': [
            'Key961B73FD',
            'Arn',
          ],
        },
      },
    ],
    Version: '2012-10-17',
  };

  const resources = Template.fromStack(stack).toJSON().Resources;
  expect(resources.AWS679f53fac002430cb0da5b7982bd2287ServiceRoleDefaultPolicyD28E1A5E.Properties.PolicyDocument).toStrictEqual(expectedPolicy);

});

each([
  [EngineVersion.OPENSEARCH_1_0, 'OpenSearch_1.0'],
  [EngineVersion.OPENSEARCH_1_1, 'OpenSearch_1.1'],
  [EngineVersion.OPENSEARCH_1_2, 'OpenSearch_1.2'],
  [EngineVersion.OPENSEARCH_1_3, 'OpenSearch_1.3'],
  [EngineVersion.OPENSEARCH_2_3, 'OpenSearch_2.3'],
]).test('minimal example renders correctly', (engineVersion, expectedCfVersion) => {
  new Domain(stack, 'Domain', { version: engineVersion });

  Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
    EBSOptions: {
      EBSEnabled: true,
      VolumeSize: 10,
      VolumeType: 'gp2',
    },
    ClusterConfig: {
      DedicatedMasterEnabled: false,
      InstanceCount: 1,
      InstanceType: 'r5.large.search',
      ZoneAwarenessEnabled: false,
    },
    EngineVersion: expectedCfVersion,
    EncryptionAtRestOptions: {
      Enabled: false,
    },
    LogPublishingOptions: {
      AUDIT_LOGS: Match.absent(),
      ES_APPLICATION_LOGS: Match.absent(),
      SEARCH_SLOW_LOGS: Match.absent(),
      INDEX_SLOW_LOGS: Match.absent(),
    },
    NodeToNodeEncryptionOptions: {
      Enabled: false,
    },
  });
});

each([testedOpenSearchVersions]).test('can enable version upgrade update policy', (engineVersion) => {
  new Domain(stack, 'Domain', {
    version: engineVersion,
    enableVersionUpgrade: true,
  });

  Template.fromStack(stack).hasResource('AWS::OpenSearchService::Domain', {
    UpdatePolicy: {
      EnableVersionUpgrade: true,
    },
  });
});

each([testedOpenSearchVersions]).test('can set a self-referencing custom policy', (engineVersion) => {
  const domain = new Domain(stack, 'Domain', {
    version: engineVersion,
  });

  domain.addAccessPolicies(
    new iam.PolicyStatement({
      actions: ['es:ESHttpPost', 'es:ESHttpPut'],
      effect: iam.Effect.ALLOW,
      principals: [new iam.AccountPrincipal('5678')],
      resources: [domain.domainArn, `${domain.domainArn}/*`],
    }),
  );

  const expectedPolicy = {
    'Fn::Join': [
      '',
      [
        '{"action":"updateDomainConfig","service":"OpenSearch","parameters":{"DomainName":"',
        {
          Ref: 'Domain66AC69E0',
        },
        '","AccessPolicies":"{\\"Statement\\":[{\\"Action\\":[\\"es:ESHttpPost\\",\\"es:ESHttpPut\\"],\\"Effect\\":\\"Allow\\",\\"Principal\\":{\\"AWS\\":\\"arn:',
        {
          Ref: 'AWS::Partition',
        },
        ':iam::5678:root\\"},\\"Resource\\":[\\"',
        {
          'Fn::GetAtt': [
            'Domain66AC69E0',
            'Arn',
          ],
        },
        '\\",\\"',
        {
          'Fn::GetAtt': [
            'Domain66AC69E0',
            'Arn',
          ],
        },
        '/*\\"]}],\\"Version\\":\\"2012-10-17\\"}"},"outputPaths":["DomainConfig.AccessPolicies"],"physicalResourceId":{"id":"',
        {
          Ref: 'Domain66AC69E0',
        },
        'AccessPolicy"}}',
      ],
    ],
  };
  Template.fromStack(stack).hasResourceProperties('Custom::OpenSearchAccessPolicy', {
    ServiceToken: {
      'Fn::GetAtt': [
        'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
        'Arn',
      ],
    },
    Create: expectedPolicy,
    Update: expectedPolicy,
  });
});

each([testedOpenSearchVersions]).describe('UltraWarm instances', (engineVersion) => {

  test('can enable UltraWarm instances', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
      capacity: {
        masterNodes: 2,
        warmNodes: 2,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      ClusterConfig: {
        DedicatedMasterEnabled: true,
        WarmEnabled: true,
        WarmCount: 2,
        WarmType: 'ultrawarm1.medium.search',
      },
    });
  });

  test('can enable UltraWarm instances with specific instance type', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
      capacity: {
        masterNodes: 2,
        warmNodes: 2,
        warmInstanceType: 'ultrawarm1.large.search',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      ClusterConfig: {
        DedicatedMasterEnabled: true,
        WarmEnabled: true,
        WarmCount: 2,
        WarmType: 'ultrawarm1.large.search',
      },
    });
  });

});

each([testedOpenSearchVersions]).test('can use tokens in capacity configuration', (engineVersion) => {
  new Domain(stack, 'Domain', {
    version: engineVersion,
    capacity: {
      dataNodeInstanceType: Token.asString({ Ref: 'dataNodeInstanceType' }),
      dataNodes: Token.asNumber({ Ref: 'dataNodes' }),
      masterNodeInstanceType: Token.asString({ Ref: 'masterNodeInstanceType' }),
      masterNodes: Token.asNumber({ Ref: 'masterNodes' }),
      warmInstanceType: Token.asString({ Ref: 'warmInstanceType' }),
      warmNodes: Token.asNumber({ Ref: 'warmNodes' }),
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
    ClusterConfig: {
      InstanceCount: {
        Ref: 'dataNodes',
      },
      InstanceType: {
        Ref: 'dataNodeInstanceType',
      },
      DedicatedMasterEnabled: true,
      DedicatedMasterCount: {
        Ref: 'masterNodes',
      },
      DedicatedMasterType: {
        Ref: 'masterNodeInstanceType',
      },
      WarmEnabled: true,
      WarmCount: {
        Ref: 'warmNodes',
      },
      WarmType: {
        Ref: 'warmInstanceType',
      },
    },
  });
});

each([testedOpenSearchVersions]).describe('log groups', (engineVersion) => {

  test('slowSearchLogEnabled should create a custom log group', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
      logging: {
        slowSearchLogEnabled: true,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      LogPublishingOptions: {
        SEARCH_SLOW_LOGS: {
          CloudWatchLogsLogGroupArn: {
            'Fn::GetAtt': [
              'DomainSlowSearchLogs5B35A97A',
              'Arn',
            ],
          },
          Enabled: true,
        },
        AUDIT_LOGS: Match.absent(),
        ES_APPLICATION_LOGS: Match.absent(),
        INDEX_SLOW_LOGS: Match.absent(),
      },
    });
  });

  test('slowIndexLogEnabled should create a custom log group', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
      logging: {
        slowIndexLogEnabled: true,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      LogPublishingOptions: {
        INDEX_SLOW_LOGS: {
          CloudWatchLogsLogGroupArn: {
            'Fn::GetAtt': [
              'DomainSlowIndexLogsFE2F1061',
              'Arn',
            ],
          },
          Enabled: true,
        },
        AUDIT_LOGS: Match.absent(),
        ES_APPLICATION_LOGS: Match.absent(),
        SEARCH_SLOW_LOGS: Match.absent(),
      },
    });
  });

  test('appLogEnabled should create a custom log group', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
      logging: {
        appLogEnabled: true,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      LogPublishingOptions: {
        ES_APPLICATION_LOGS: {
          CloudWatchLogsLogGroupArn: {
            'Fn::GetAtt': [
              'DomainAppLogs21698C1B',
              'Arn',
            ],
          },
          Enabled: true,
        },
        AUDIT_LOGS: Match.absent(),
        SEARCH_SLOW_LOGS: Match.absent(),
        INDEX_SLOW_LOGS: Match.absent(),
      },
    });
  });

  test('auditLogEnabled should create a custom log group', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
      logging: {
        auditLogEnabled: true,
      },
      fineGrainedAccessControl: {
        masterUserName: 'username',
      },
      nodeToNodeEncryption: true,
      encryptionAtRest: {
        enabled: true,
      },
      enforceHttps: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      LogPublishingOptions: {
        AUDIT_LOGS: {
          CloudWatchLogsLogGroupArn: {
            'Fn::GetAtt': [
              'DomainAuditLogs608E0FA6',
              'Arn',
            ],
          },
          Enabled: true,
        },
        ES_APPLICATION_LOGS: Match.absent(),
        SEARCH_SLOW_LOGS: Match.absent(),
        INDEX_SLOW_LOGS: Match.absent(),
      },
    });
  });

  test('two domains with logging enabled can be created in same stack', () => {
    new Domain(stack, 'Domain1', {
      version: engineVersion,
      logging: {
        appLogEnabled: true,
        slowSearchLogEnabled: true,
        slowIndexLogEnabled: true,
      },
    });
    new Domain(stack, 'Domain2', {
      version: engineVersion,
      logging: {
        appLogEnabled: true,
        slowSearchLogEnabled: true,
        slowIndexLogEnabled: true,
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      LogPublishingOptions: {
        ES_APPLICATION_LOGS: {
          CloudWatchLogsLogGroupArn: {
            'Fn::GetAtt': [
              'Domain1AppLogs6E8D1D67',
              'Arn',
            ],
          },
          Enabled: true,
        },
        SEARCH_SLOW_LOGS: {
          CloudWatchLogsLogGroupArn: {
            'Fn::GetAtt': [
              'Domain1SlowSearchLogs8F3B0506',
              'Arn',
            ],
          },
          Enabled: true,
        },
        INDEX_SLOW_LOGS: {
          CloudWatchLogsLogGroupArn: {
            'Fn::GetAtt': [
              'Domain1SlowIndexLogs9354D098',
              'Arn',
            ],
          },
          Enabled: true,
        },
        AUDIT_LOGS: Match.absent(),
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      LogPublishingOptions: {
        ES_APPLICATION_LOGS: {
          CloudWatchLogsLogGroupArn: {
            'Fn::GetAtt': [
              'Domain2AppLogs810876E2',
              'Arn',
            ],
          },
          Enabled: true,
        },
        SEARCH_SLOW_LOGS: {
          CloudWatchLogsLogGroupArn: {
            'Fn::GetAtt': [
              'Domain2SlowSearchLogs0C75F64B',
              'Arn',
            ],
          },
          Enabled: true,
        },
        INDEX_SLOW_LOGS: {
          CloudWatchLogsLogGroupArn: {
            'Fn::GetAtt': [
              'Domain2SlowIndexLogs0CB900D0',
              'Arn',
            ],
          },
          Enabled: true,
        },
        AUDIT_LOGS: Match.absent(),
      },
    });
  });

  test('log group policy is uniquely named for each domain', () => {
    new Domain(stack, 'Domain1', {
      version: engineVersion,
      logging: {
        appLogEnabled: true,
      },
    });
    new Domain(stack, 'Domain2', {
      version: engineVersion,
      logging: {
        appLogEnabled: true,
      },
    });

    // Domain1
    Template.fromStack(stack).hasResourceProperties('Custom::CloudwatchLogResourcePolicy', {
      Create: {
        'Fn::Join': [
          '',
          [
            '{"service":"CloudWatchLogs","action":"putResourcePolicy","parameters":{"policyName":"ESLogPolicyc836fd92f07ec41eb70c2f6f08dc4b43cfb7c25391","policyDocument":"{\\"Statement\\":[{\\"Action\\":[\\"logs:PutLogEvents\\",\\"logs:CreateLogStream\\"],\\"Effect\\":\\"Allow\\",\\"Principal\\":{\\"Service\\":\\"es.amazonaws.com\\"},\\"Resource\\":\\"',
            {
              'Fn::GetAtt': [
                'Domain1AppLogs6E8D1D67',
                'Arn',
              ],
            },
            '\\"}],\\"Version\\":\\"2012-10-17\\"}"},"physicalResourceId":{"id":"ESLogGroupPolicyc836fd92f07ec41eb70c2f6f08dc4b43cfb7c25391"}}',
          ],
        ],
      },
    });
    // Domain2
    Template.fromStack(stack).hasResourceProperties('Custom::CloudwatchLogResourcePolicy', {
      Create: {
        'Fn::Join': [
          '',
          [
            '{"service":"CloudWatchLogs","action":"putResourcePolicy","parameters":{"policyName":"ESLogPolicyc8f05f015be3baf6ec1ee06cd1ee5cc8706ebbe5b2","policyDocument":"{\\"Statement\\":[{\\"Action\\":[\\"logs:PutLogEvents\\",\\"logs:CreateLogStream\\"],\\"Effect\\":\\"Allow\\",\\"Principal\\":{\\"Service\\":\\"es.amazonaws.com\\"},\\"Resource\\":\\"',
            {
              'Fn::GetAtt': [
                'Domain2AppLogs810876E2',
                'Arn',
              ],
            },
            '\\"}],\\"Version\\":\\"2012-10-17\\"}"},"physicalResourceId":{"id":"ESLogGroupPolicyc8f05f015be3baf6ec1ee06cd1ee5cc8706ebbe5b2"}}',
          ],
        ],
      },
    });
  });

  test('enabling audit logs throws without fine grained access control enabled', () => {
    expect(() => new Domain(stack, 'Domain', {
      version: engineVersion,
      logging: {
        auditLogEnabled: true,
      },
    })).toThrow(/Fine-grained access control is required when audit logs publishing is enabled\./);
  });

  test('slowSearchLogGroup should use a custom log group', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
      logging: {
        slowSearchLogEnabled: true,
        slowSearchLogGroup: new logs.LogGroup(stack, 'SlowSearchLogs', {
          retention: logs.RetentionDays.THREE_MONTHS,
        }),
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      LogPublishingOptions: {
        SEARCH_SLOW_LOGS: {
          CloudWatchLogsLogGroupArn: {
            'Fn::GetAtt': [
              'SlowSearchLogsE00DC2E7',
              'Arn',
            ],
          },
          Enabled: true,
        },
        AUDIT_LOGS: Match.absent(),
        ES_APPLICATION_LOGS: Match.absent(),
        INDEX_SLOW_LOGS: Match.absent(),
      },
    });
  });

  test('slowIndexLogEnabled should use a custom log group', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
      logging: {
        slowIndexLogEnabled: true,
        slowIndexLogGroup: new logs.LogGroup(stack, 'SlowIndexLogs', {
          retention: logs.RetentionDays.THREE_MONTHS,
        }),
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      LogPublishingOptions: {
        INDEX_SLOW_LOGS: {
          CloudWatchLogsLogGroupArn: {
            'Fn::GetAtt': [
              'SlowIndexLogsAD49DED0',
              'Arn',
            ],
          },
          Enabled: true,
        },
        AUDIT_LOGS: Match.absent(),
        ES_APPLICATION_LOGS: Match.absent(),
        SEARCH_SLOW_LOGS: Match.absent(),
      },
    });
  });

  test('appLogGroup should use a custom log group', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
      logging: {
        appLogEnabled: true,
        appLogGroup: new logs.LogGroup(stack, 'AppLogs', {
          retention: logs.RetentionDays.THREE_MONTHS,
        }),
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      LogPublishingOptions: {
        ES_APPLICATION_LOGS: {
          CloudWatchLogsLogGroupArn: {
            'Fn::GetAtt': [
              'AppLogsC5DF83A6',
              'Arn',
            ],
          },
          Enabled: true,
        },
        AUDIT_LOGS: Match.absent(),
        SEARCH_SLOW_LOGS: Match.absent(),
        INDEX_SLOW_LOGS: Match.absent(),
      },
    });
  });

  test('auditLOgGroup should use a custom log group', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
      fineGrainedAccessControl: {
        masterUserName: 'username',
      },
      nodeToNodeEncryption: true,
      encryptionAtRest: {
        enabled: true,
      },
      enforceHttps: true,
      logging: {
        auditLogEnabled: true,
        auditLogGroup: new logs.LogGroup(stack, 'AuditLogs', {
          retention: logs.RetentionDays.THREE_MONTHS,
        }),
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      LogPublishingOptions: {
        AUDIT_LOGS: {
          CloudWatchLogsLogGroupArn: {
            'Fn::GetAtt': [
              'AuditLogsB945E340',
              'Arn',
            ],
          },
          Enabled: true,
        },
        ES_APPLICATION_LOGS: Match.absent(),
        SEARCH_SLOW_LOGS: Match.absent(),
        INDEX_SLOW_LOGS: Match.absent(),
      },
    });
  });

});

each(testedOpenSearchVersions).describe('grants', (engineVersion) => {

  test('"grantRead" allows read actions associated with this domain resource', () => {
    testGrant(readActions, (p, d) => d.grantRead(p), engineVersion);
  });

  test('"grantWrite" allows write actions associated with this domain resource', () => {
    testGrant(writeActions, (p, d) => d.grantWrite(p), engineVersion);
  });

  test('"grantReadWrite" allows read and write actions associated with this domain resource', () => {
    testGrant(readWriteActions, (p, d) => d.grantReadWrite(p), engineVersion);
  });

  test('"grantIndexRead" allows read actions associated with an index in this domain resource', () => {
    testGrant(
      readActions,
      (p, d) => d.grantIndexRead('my-index', p),
      engineVersion,
      false,
      ['/my-index', '/my-index/*'],
    );
  });

  test('"grantIndexWrite" allows write actions associated with an index in this domain resource', () => {
    testGrant(
      writeActions,
      (p, d) => d.grantIndexWrite('my-index', p),
      engineVersion,
      false,
      ['/my-index', '/my-index/*'],
    );
  });

  test('"grantIndexReadWrite" allows read and write actions associated with an index in this domain resource', () => {
    testGrant(
      readWriteActions,
      (p, d) => d.grantIndexReadWrite('my-index', p),
      engineVersion,
      false,
      ['/my-index', '/my-index/*'],
    );
  });

  test('"grantPathRead" allows read actions associated with a given path in this domain resource', () => {
    testGrant(
      readActions,
      (p, d) => d.grantPathRead('my-index/my-path', p),
      engineVersion,
      false,
      ['/my-index/my-path'],
    );
  });

  test('"grantPathWrite" allows write actions associated with a given path in this domain resource', () => {
    testGrant(
      writeActions,
      (p, d) => d.grantPathWrite('my-index/my-path', p),
      engineVersion,
      false,
      ['/my-index/my-path'],
    );
  });

  test('"grantPathReadWrite" allows read and write actions associated with a given path in this domain resource', () => {
    testGrant(
      readWriteActions,
      (p, d) => d.grantPathReadWrite('my-index/my-path', p),
      engineVersion,
      false,
      ['/my-index/my-path'],
    );
  });

  test('"grant" for an imported domain', () => {
    const domainEndpoint = 'https://test-domain-2w2x2u3tifly-jcjotrt6f7otem4sqcwbch3c4u.testregion.es.amazonaws.com';
    const domain = Domain.fromDomainEndpoint(stack, 'Domain', domainEndpoint);
    const user = new iam.User(stack, 'user');

    domain.grantReadWrite(user);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'es:ESHttpGet',
              'es:ESHttpHead',
              'es:ESHttpDelete',
              'es:ESHttpPost',
              'es:ESHttpPut',
              'es:ESHttpPatch',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':es:testregion:1234:domain/test-domain-2w2x2u3tifly',
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':es:testregion:1234:domain/test-domain-2w2x2u3tifly/*',
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'userDefaultPolicy083DF682',
      Users: [
        {
          Ref: 'user2C2B57AE',
        },
      ],
    });
  });

});

each(testedOpenSearchVersions).describe('metrics', (engineVersion) => {

  test('metricClusterStatusRed', () => {
    testMetric(
      (domain) => domain.metricClusterStatusRed(),
      'ClusterStatus.red',
      engineVersion,
      Statistic.MAXIMUM,
    );
  });

  test('metricClusterStatusYellow', () => {
    testMetric(
      (domain) => domain.metricClusterStatusYellow(),
      'ClusterStatus.yellow',
      engineVersion,
      Statistic.MAXIMUM,
    );
  });

  test('metricFreeStorageSpace', () => {
    testMetric(
      (domain) => domain.metricFreeStorageSpace(),
      'FreeStorageSpace',
      engineVersion,
      Statistic.MINIMUM,
    );
  });

  test('metricClusterIndexWriteBlocked', () => {
    testMetric(
      (domain) => domain.metricClusterIndexWritesBlocked(),
      'ClusterIndexWritesBlocked',
      engineVersion,
      Statistic.MAXIMUM,
      Duration.minutes(1),
    );
  });

  test('metricNodes', () => {
    testMetric(
      (domain) => domain.metricNodes(),
      'Nodes',
      engineVersion,
      Statistic.MINIMUM,
      Duration.hours(1),
    );
  });

  test('metricAutomatedSnapshotFailure', () => {
    testMetric(
      (domain) => domain.metricAutomatedSnapshotFailure(),
      'AutomatedSnapshotFailure',
      engineVersion,
      Statistic.MAXIMUM,
    );
  });

  test('metricCPUUtilization', () => {
    testMetric(
      (domain) => domain.metricCPUUtilization(),
      'CPUUtilization',
      engineVersion,
      Statistic.MAXIMUM,
    );
  });

  test('metricJVMMemoryPressure', () => {
    testMetric(
      (domain) => domain.metricJVMMemoryPressure(),
      'JVMMemoryPressure',
      engineVersion,
      Statistic.MAXIMUM,
    );
  });

  test('metricMasterCPUUtilization', () => {
    testMetric(
      (domain) => domain.metricMasterCPUUtilization(),
      'MasterCPUUtilization',
      engineVersion,
      Statistic.MAXIMUM,
    );
  });

  test('metricMasterJVMMemoryPressure', () => {
    testMetric(
      (domain) => domain.metricMasterJVMMemoryPressure(),
      'MasterJVMMemoryPressure',
      engineVersion,
      Statistic.MAXIMUM,
    );
  });

  test('metricKMSKeyError', () => {
    testMetric(
      (domain) => domain.metricKMSKeyError(),
      'KMSKeyError',
      engineVersion,
      Statistic.MAXIMUM,
    );
  });

  test('metricKMSKeyInaccessible', () => {
    testMetric(
      (domain) => domain.metricKMSKeyInaccessible(),
      'KMSKeyInaccessible',
      engineVersion,
      Statistic.MAXIMUM,
    );
  });

  test('metricSearchableDocuments', () => {
    testMetric(
      (domain) => domain.metricSearchableDocuments(),
      'SearchableDocuments',
      engineVersion,
      Statistic.MAXIMUM,
    );
  });

  test('metricSearchLatency', () => {
    testMetric(
      (domain) => domain.metricSearchLatency(),
      'SearchLatency',
      engineVersion,
      'p99',
    );
  });

  test('metricIndexingLatency', () => {
    testMetric(
      (domain) => domain.metricIndexingLatency(),
      'IndexingLatency',
      engineVersion,
      'p99',
    );
  });

});

describe('import', () => {

  test('static fromDomainEndpoint(endpoint) allows importing an external/existing domain', () => {
    const domainName = 'test-domain-2w2x2u3tifly';
    const domainEndpointWithoutHttps = `${domainName}-jcjotrt6f7otem4sqcwbch3c4u.testregion.es.amazonaws.com`;
    const domainEndpoint = `https://${domainEndpointWithoutHttps}`;
    const imported = Domain.fromDomainEndpoint(stack, 'Domain', domainEndpoint);

    expect(imported.domainName).toEqual(domainName);
    expect(imported.domainArn).toMatch(RegExp(`es:testregion:1234:domain/${domainName}$`));
    expect(imported.domainEndpoint).toEqual(domainEndpointWithoutHttps);

    Template.fromStack(stack).resourceCountIs('AWS::OpenSearchService::Domain', 0);
  });

  test('static fromDomainAttributes(attributes) allows importing an external/existing domain', () => {
    const domainName = 'test-domain-2w2x2u3tifly';
    const domainArn = `arn:aws:es:testregion:1234:domain/${domainName}`;
    const domainEndpointWithoutHttps = `${domainName}-jcjotrt6f7otem4sqcwbch3c4u.testregion.es.amazonaws.com`;
    const domainEndpoint = `https://${domainEndpointWithoutHttps}`;
    const imported = Domain.fromDomainAttributes(stack, 'Domain', {
      domainArn,
      domainEndpoint,
    });

    expect(imported.domainName).toEqual(domainName);
    expect(imported.domainArn).toEqual(domainArn);
    expect(imported.domainEndpoint).toEqual(domainEndpointWithoutHttps);

    Template.fromStack(stack).resourceCountIs('AWS::OpenSearchService::Domain', 0);
  });

  test('static fromDomainAttributes(attributes) allows importing with token arn and endpoint', () => {
    const domainArn = new CfnParameter(stack, 'domainArn', { type: 'String' }).valueAsString;
    const domainEndpoint = new CfnParameter(stack, 'domainEndpoint', { type: 'String' }).valueAsString;
    const imported = Domain.fromDomainAttributes(stack, 'Domain', {
      domainArn,
      domainEndpoint,
    });
    const expectedDomainName = {
      'Fn::Select': [
        1,
        {
          'Fn::Split': [
            '/',
            {
              'Fn::Select': [
                5,
                {
                  'Fn::Split': [
                    ':',
                    {
                      Ref: 'domainArn',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    expect(stack.resolve(imported.domainName)).toEqual(expectedDomainName);
    expect(imported.domainArn).toEqual(domainArn);
    expect(imported.domainEndpoint).toEqual(domainEndpoint);

    Template.fromStack(stack).resourceCountIs('AWS::OpenSearchService::Domain', 0);
  });
});

each(testedOpenSearchVersions).describe('advanced security options', (engineVersion) => {
  const masterUserArn = 'arn:aws:iam::123456789012:user/JohnDoe';
  const masterUserName = 'JohnDoe';
  const password = 'password';
  const masterUserPassword = SecretValue.unsafePlainText(password);

  test('enable fine-grained access control with a master user ARN', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
      fineGrainedAccessControl: {
        masterUserArn,
      },
      encryptionAtRest: {
        enabled: true,
      },
      nodeToNodeEncryption: true,
      enforceHttps: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      AdvancedSecurityOptions: {
        Enabled: true,
        InternalUserDatabaseEnabled: false,
        MasterUserOptions: {
          MasterUserARN: masterUserArn,
        },
      },
      EncryptionAtRestOptions: {
        Enabled: true,
      },
      NodeToNodeEncryptionOptions: {
        Enabled: true,
      },
      DomainEndpointOptions: {
        EnforceHTTPS: true,
      },
    });
  });

  test('enable fine-grained access control with a master user name and password', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
      fineGrainedAccessControl: {
        masterUserName,
        masterUserPassword,
      },
      encryptionAtRest: {
        enabled: true,
      },
      nodeToNodeEncryption: true,
      enforceHttps: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      AdvancedSecurityOptions: {
        Enabled: true,
        InternalUserDatabaseEnabled: true,
        MasterUserOptions: {
          MasterUserName: masterUserName,
          MasterUserPassword: password,
        },
      },
      EncryptionAtRestOptions: {
        Enabled: true,
      },
      NodeToNodeEncryptionOptions: {
        Enabled: true,
      },
      DomainEndpointOptions: {
        EnforceHTTPS: true,
      },
    });
  });

  test('enable fine-grained access control with a master user name and dynamically generated password', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
      fineGrainedAccessControl: {
        masterUserName,
      },
      encryptionAtRest: {
        enabled: true,
      },
      nodeToNodeEncryption: true,
      enforceHttps: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      AdvancedSecurityOptions: {
        Enabled: true,
        InternalUserDatabaseEnabled: true,
        MasterUserOptions: {
          MasterUserName: masterUserName,
          MasterUserPassword: {
            'Fn::Join': [
              '',
              [
                '{{resolve:secretsmanager:',
                {
                  Ref: 'DomainMasterUserBFAFA7D9',
                },
                ':SecretString:password::}}',
              ],
            ],
          },
        },
      },
      EncryptionAtRestOptions: {
        Enabled: true,
      },
      NodeToNodeEncryptionOptions: {
        Enabled: true,
      },
      DomainEndpointOptions: {
        EnforceHTTPS: true,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      GenerateSecretString: {
        GenerateStringKey: 'password',
      },
    });
  });

  test('enabling fine-grained access control throws with Elasticsearch version < 6.7', () => {
    expect(() => new Domain(stack, 'Domain', {
      version: EngineVersion.ELASTICSEARCH_6_5,
      fineGrainedAccessControl: {
        masterUserArn,
      },
      encryptionAtRest: {
        enabled: true,
      },
      nodeToNodeEncryption: true,
      enforceHttps: true,
    })).toThrow(/Fine-grained access control requires Elasticsearch version 6\.7 or later or OpenSearch version 1\.0 or later/);
  });

  test('enabling fine-grained access control throws without node-to-node encryption enabled', () => {
    expect(() => new Domain(stack, 'Domain', {
      version: engineVersion,
      fineGrainedAccessControl: {
        masterUserArn,
      },
      encryptionAtRest: {
        enabled: true,
      },
      nodeToNodeEncryption: false,
      enforceHttps: true,
    })).toThrow(/Node-to-node encryption is required when fine-grained access control is enabled/);
  });

  test('enabling fine-grained access control throws without encryption-at-rest enabled', () => {
    expect(() => new Domain(stack, 'Domain', {
      version: engineVersion,
      fineGrainedAccessControl: {
        masterUserArn,
      },
      encryptionAtRest: {
        enabled: false,
      },
      nodeToNodeEncryption: true,
      enforceHttps: true,
    })).toThrow(/Encryption-at-rest is required when fine-grained access control is enabled/);
  });

  test('enabling fine-grained access control throws without enforceHttps enabled', () => {
    expect(() => new Domain(stack, 'Domain', {
      version: engineVersion,
      fineGrainedAccessControl: {
        masterUserArn,
      },
      encryptionAtRest: {
        enabled: true,
      },
      nodeToNodeEncryption: true,
      enforceHttps: false,
    })).toThrow(/Enforce HTTPS is required when fine-grained access control is enabled/);
  });
});

each(testedOpenSearchVersions).describe('custom endpoints', (engineVersion) => {
  const customDomainName = 'search.example.com';

  test('custom domain without hosted zone and default cert', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
      nodeToNodeEncryption: true,
      enforceHttps: true,
      customEndpoint: {
        domainName: customDomainName,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      DomainEndpointOptions: {
        EnforceHTTPS: true,
        CustomEndpointEnabled: true,
        CustomEndpoint: customDomainName,
        CustomEndpointCertificateArn: {
          Ref: 'DomainCustomEndpointCertificateD080A69E', // Auto-generated certificate
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: customDomainName,
      ValidationMethod: 'EMAIL',
    });
  });

  test('custom domain with hosted zone and default cert', () => {
    const zone = new route53.HostedZone(stack, 'DummyZone', { zoneName: 'example.com' });
    new Domain(stack, 'Domain', {
      version: engineVersion,
      nodeToNodeEncryption: true,
      enforceHttps: true,
      customEndpoint: {
        domainName: customDomainName,
        hostedZone: zone,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      DomainEndpointOptions: {
        EnforceHTTPS: true,
        CustomEndpointEnabled: true,
        CustomEndpoint: customDomainName,
        CustomEndpointCertificateArn: {
          Ref: 'DomainCustomEndpointCertificateD080A69E', // Auto-generated certificate
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: customDomainName,
      DomainValidationOptions: [
        {
          DomainName: customDomainName,
          HostedZoneId: {
            Ref: 'DummyZone03E0FE81',
          },
        },
      ],
      ValidationMethod: 'DNS',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'search.example.com.',
      Type: 'CNAME',
      HostedZoneId: {
        Ref: 'DummyZone03E0FE81',
      },
      ResourceRecords: [
        {
          'Fn::GetAtt': [
            'Domain66AC69E0',
            'DomainEndpoint',
          ],
        },
      ],
    });
  });

  test('custom domain with hosted zone and given cert', () => {
    const zone = new route53.HostedZone(stack, 'DummyZone', {
      zoneName: 'example.com',
    });
    const certificate = new acm.Certificate(stack, 'DummyCert', {
      domainName: customDomainName,
    });

    new Domain(stack, 'Domain', {
      version: engineVersion,
      nodeToNodeEncryption: true,
      enforceHttps: true,
      customEndpoint: {
        domainName: customDomainName,
        hostedZone: zone,
        certificate,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      DomainEndpointOptions: {
        EnforceHTTPS: true,
        CustomEndpointEnabled: true,
        CustomEndpoint: customDomainName,
        CustomEndpointCertificateArn: {
          Ref: 'DummyCertFA37670B',
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'search.example.com.',
      Type: 'CNAME',
      HostedZoneId: {
        Ref: 'DummyZone03E0FE81',
      },
      ResourceRecords: [
        {
          'Fn::GetAtt': [
            'Domain66AC69E0',
            'DomainEndpoint',
          ],
        },
      ],
    });
  });

});

each(testedOpenSearchVersions).describe('custom error responses', (engineVersion) => {

  test('error when availabilityZoneCount does not match vpcOptions.subnets length', () => {
    const vpc = new Vpc(stack, 'Vpc', {
      maxAzs: 1,
    });

    expect(() => new Domain(stack, 'Domain', {
      version: engineVersion,
      zoneAwareness: {
        enabled: true,
        availabilityZoneCount: 2,
      },
      vpc,
    })).toThrow(/you need to provide a subnet for each AZ you are using/);
  });

  test('Imported VPC with subnets that are still pending lookup won\'t throw Az count mismatch', () => {
    const vpc = Vpc.fromLookup(stack, 'ExampleVpc', {
      vpcId: 'vpc-123',
    });
    let subnets = vpc.selectSubnets({
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
    });

    new Domain(stack, 'Domain1', {
      version: engineVersion,
      vpc,
      vpcSubnets: [subnets],
      zoneAwareness: {
        enabled: true,
        availabilityZoneCount: 3,
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::OpenSearchService::Domain', 1);
  });

  test('error when master, data or Ultra Warm instance types do not end with .search', () => {
    const error = /instance types must end with ".search"/;
    expect(() => new Domain(stack, 'Domain1', {
      version: engineVersion,
      capacity: {
        masterNodeInstanceType: 'c5.large',
      },
    })).toThrow(error);
    expect(() => new Domain(stack, 'Domain2', {
      version: engineVersion,
      capacity: {
        dataNodeInstanceType: 'c5.2xlarge',
      },
    })).toThrow(error);
    expect(() => new Domain(stack, 'Domain3', {
      version: engineVersion,
      capacity: {
        warmInstanceType: 'ultrawarm1.medium',
      },
    })).toThrow(error);
  });

  test('error when Ultra Warm instance types do not start with ultrawarm', () => {
    const error = /UltraWarm node instance type must start with "ultrawarm"./;
    expect(() => new Domain(stack, 'Domain1', {
      version: engineVersion,
      capacity: {
        warmInstanceType: 't3.small.search',
      },
    })).toThrow(error);
  });

  test('error when Elasticsearch version is unsupported/unknown', () => {
    expect(() => new Domain(stack, 'Domain1', {
      version: EngineVersion.elasticsearch('5.4'),
    })).toThrow('Unknown Elasticsearch version: 5.4');
  });

  test('error when invalid domain name is given', () => {
    expect(() => new Domain(stack, 'Domain1', {
      version: EngineVersion.OPENSEARCH_1_0,
      domainName: 'InvalidName',
    })).toThrow(/Valid characters are a-z/);
    expect(() => new Domain(stack, 'Domain2', {
      version: EngineVersion.OPENSEARCH_1_0,
      domainName: 'a'.repeat(29),
    })).toThrow(/It must be between 3 and 28 characters/);
    expect(() => new Domain(stack, 'Domain3', {
      version: EngineVersion.OPENSEARCH_1_0,
      domainName: '123domain',
    })).toThrow(/It must start with a lowercase letter/);
  });

  test('error when error log publishing is enabled for Elasticsearch version < 5.1', () => {
    const error = /Error logs publishing requires Elasticsearch version 5.1 or later or OpenSearch version 1.0 or later/;
    expect(() => new Domain(stack, 'Domain1', {
      version: EngineVersion.ELASTICSEARCH_2_3,
      logging: {
        appLogEnabled: true,
      },
    })).toThrow(error);
  });

  test('error when encryption at rest is enabled for Elasticsearch version < 5.1', () => {
    expect(() => new Domain(stack, 'Domain1', {
      version: EngineVersion.ELASTICSEARCH_2_3,
      encryptionAtRest: {
        enabled: true,
      },
    })).toThrow(/Encryption of data at rest requires Elasticsearch version 5.1 or later or OpenSearch version 1.0 or later/);
  });

  test('error when cognito for OpenSearch Dashboards is enabled for elasticsearch version < 5.1', () => {
    const user = new iam.User(stack, 'user');
    expect(() => new Domain(stack, 'Domain1', {
      version: EngineVersion.ELASTICSEARCH_2_3,
      cognitoDashboardsAuth: {
        identityPoolId: 'test-identity-pool-id',
        role: new iam.Role(stack, 'Role', { assumedBy: user }),
        userPoolId: 'test-user-pool-id',
      },
    })).toThrow(/Cognito authentication for OpenSearch Dashboards requires Elasticsearch version 5.1 or later or OpenSearch version 1.0 or later/);
  });

  test('error when C5, I3, M5, or R5 instance types are specified for Elasticsearch version < 5.1', () => {
    const error = /C5, I3, M5, and R5 instance types require Elasticsearch version 5.1 or later or OpenSearch version 1.0 or later/;
    expect(() => new Domain(stack, 'Domain1', {
      version: EngineVersion.ELASTICSEARCH_2_3,
      capacity: {
        masterNodeInstanceType: 'c5.medium.search',
      },
    })).toThrow(error);
    expect(() => new Domain(stack, 'Domain2', {
      version: EngineVersion.ELASTICSEARCH_1_5,
      capacity: {
        dataNodeInstanceType: 'i3.2xlarge.search',
      },
    })).toThrow(error);
    expect(() => new Domain(stack, 'Domain3', {
      version: EngineVersion.ELASTICSEARCH_1_5,
      capacity: {
        dataNodeInstanceType: 'm5.2xlarge.search',
      },
    })).toThrow(error);
    expect(() => new Domain(stack, 'Domain4', {
      version: EngineVersion.ELASTICSEARCH_1_5,
      capacity: {
        masterNodeInstanceType: 'r5.2xlarge.search',
      },
    })).toThrow(error);
  });

  test('error when node to node encryption is enabled for Elasticsearch version < 6.0', () => {
    expect(() => new Domain(stack, 'Domain1', {
      version: EngineVersion.ELASTICSEARCH_5_6,
      nodeToNodeEncryption: true,
    })).toThrow(/Node-to-node encryption requires Elasticsearch version 6.0 or later or OpenSearch version 1.0 or later/);
  });

  test('error when i3 or r6g instance types are specified with EBS enabled', () => {
    expect(() => new Domain(stack, 'Domain1', {
      version: engineVersion,
      capacity: {
        dataNodeInstanceType: 'i3.2xlarge.search',
      },
      ebs: {
        volumeSize: 100,
        volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
      },
    })).toThrow(/I3 and R6GD instance types do not support EBS storage volumes/);
    expect(() => new Domain(stack, 'Domain2', {
      version: engineVersion,
      capacity: {
        dataNodeInstanceType: 'r6gd.large.search',
      },
      ebs: {
        volumeSize: 100,
        volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
      },
    })).toThrow(/I3 and R6GD instance types do not support EBS storage volumes/);
  });

  test('error when m3, r3, or t2 instance types are specified with encryption at rest enabled', () => {
    const error = /M3, R3, and T2 instance types do not support encryption of data at rest/;
    expect(() => new Domain(stack, 'Domain1', {
      version: engineVersion,
      capacity: {
        masterNodeInstanceType: 'm3.2xlarge.search',
      },
      encryptionAtRest: {
        enabled: true,
      },
    })).toThrow(error);
    expect(() => new Domain(stack, 'Domain2', {
      version: engineVersion,
      capacity: {
        dataNodeInstanceType: 'r3.2xlarge.search',
      },
      encryptionAtRest: {
        enabled: true,
      },
    })).toThrow(error);
    expect(() => new Domain(stack, 'Domain3', {
      version: engineVersion,
      capacity: {
        masterNodeInstanceType: 't2.2xlarge.search',
      },
      encryptionAtRest: {
        enabled: true,
      },
    })).toThrow(error);
  });

  test('error when t2.micro is specified with Elasticsearch version > 2.3', () => {
    expect(() => new Domain(stack, 'Domain1', {
      version: engineVersion,
      capacity: {
        masterNodeInstanceType: 't2.micro.search',
      },
    })).toThrow(/t2.micro.search instance type supports only Elasticsearch versions 1.5 and 2.3/);
  });

  test('error when any instance type other than R3, I3 and R6GD are specified without EBS enabled', () => {
    expect(() => new Domain(stack, 'Domain1', {
      version: engineVersion,
      ebs: {
        enabled: false,
      },
      capacity: {
        masterNodeInstanceType: 'm5.large.search',
      },
    })).toThrow(/EBS volumes are required when using instance types other than r3, i3 or r6gd/);
    expect(() => new Domain(stack, 'Domain2', {
      version: engineVersion,
      ebs: {
        enabled: false,
      },
      capacity: {
        dataNodeInstanceType: 'm5.large.search',
      },
    })).toThrow(/EBS volumes are required when using instance types other than r3, i3 or r6gd/);
  });

  test('can use compatible master instance types that does not have local storage when data node type is i3 or r6gd', () => {
    new Domain(stack, 'Domain1', {
      version: engineVersion,
      ebs: {
        enabled: false,
      },
      capacity: {
        masterNodeInstanceType: 'c5.2xlarge.search',
        dataNodeInstanceType: 'i3.2xlarge.search',
      },
    });
    new Domain(stack, 'Domain2', {
      version: engineVersion,
      ebs: {
        enabled: false,
      },
      capacity: {
        masterNodes: 3,
        masterNodeInstanceType: 'c6g.large.search',
        dataNodeInstanceType: 'r6gd.large.search',
      },
    });
    // both configurations pass synth-time validation
    Template.fromStack(stack).resourceCountIs('AWS::OpenSearchService::Domain', 2);
  });

  test('error when availabilityZoneCount is not 2 or 3', () => {
    const vpc = new Vpc(stack, 'Vpc');

    expect(() => new Domain(stack, 'Domain1', {
      version: engineVersion,
      vpc,
      zoneAwareness: {
        availabilityZoneCount: 4,
      },
    })).toThrow(/Invalid zone awareness configuration; availabilityZoneCount must be 2 or 3/);
  });

  test('error when UltraWarm instance is used with Elasticsearch version < 6.8', () => {
    expect(() => new Domain(stack, 'Domain1', {
      version: EngineVersion.ELASTICSEARCH_6_7,
      capacity: {
        masterNodes: 1,
        warmNodes: 1,
      },
    })).toThrow(/UltraWarm requires Elasticsearch version 6\.8 or later or OpenSearch version 1.0 or later/);
  });

  test('error when t2 or t3 instance types are specified with UltramWarm enabled', () => {
    const error = /T2 and T3 instance types do not support UltraWarm storage/;
    expect(() => new Domain(stack, 'Domain1', {
      version: engineVersion,
      capacity: {
        masterNodeInstanceType: 't2.2xlarge.search',
        warmNodes: 1,
      },
    })).toThrow(error);
    expect(() => new Domain(stack, 'Domain2', {
      version: engineVersion,
      capacity: {
        masterNodeInstanceType: 't3.2xlarge.search',
        warmNodes: 1,
      },
    })).toThrow(error);
  });

  test('error when UltraWarm instance is used and no dedicated master instance specified', () => {
    expect(() => new Domain(stack, 'Domain1', {
      version: engineVersion,
      capacity: {
        warmNodes: 1,
        masterNodes: 0,
      },
    })).toThrow(/Dedicated master node is required when UltraWarm storage is enabled/);
  });

});

test('can specify future version', () => {
  new Domain(stack, 'Domain', { version: EngineVersion.elasticsearch('8.2') });

  Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
    EngineVersion: 'Elasticsearch_8.2',
  });
});

each(testedOpenSearchVersions).describe('unsigned basic auth', (engineVersion) => {
  test('can create a domain with unsigned basic auth', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
      useUnsignedBasicAuth: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      AdvancedSecurityOptions: {
        Enabled: true,
        InternalUserDatabaseEnabled: true,
        MasterUserOptions: {
          MasterUserName: 'admin',
        },
      },
      EncryptionAtRestOptions: {
        Enabled: true,
      },
      NodeToNodeEncryptionOptions: {
        Enabled: true,
      },
      DomainEndpointOptions: {
        EnforceHTTPS: true,
      },
    });
  });

  test('does not overwrite master user ARN configuration', () => {
    const masterUserArn = 'arn:aws:iam::123456789012:user/JohnDoe';

    new Domain(stack, 'Domain', {
      version: engineVersion,
      fineGrainedAccessControl: {
        masterUserArn,
      },
      useUnsignedBasicAuth: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      AdvancedSecurityOptions: {
        Enabled: true,
        InternalUserDatabaseEnabled: false,
        MasterUserOptions: {
          MasterUserARN: masterUserArn,
        },
      },
      EncryptionAtRestOptions: {
        Enabled: true,
      },
      NodeToNodeEncryptionOptions: {
        Enabled: true,
      },
      DomainEndpointOptions: {
        EnforceHTTPS: true,
      },
    });
  });

  test('does not overwrite master user name and password', () => {
    const masterUserName = 'JohnDoe';
    const password = 'password';
    const masterUserPassword = SecretValue.unsafePlainText(password);

    new Domain(stack, 'Domain', {
      version: engineVersion,
      fineGrainedAccessControl: {
        masterUserName,
        masterUserPassword,
      },
      useUnsignedBasicAuth: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      AdvancedSecurityOptions: {
        Enabled: true,
        InternalUserDatabaseEnabled: true,
        MasterUserOptions: {
          MasterUserName: masterUserName,
          MasterUserPassword: password,
        },
      },
      EncryptionAtRestOptions: {
        Enabled: true,
      },
      NodeToNodeEncryptionOptions: {
        Enabled: true,
      },
      DomainEndpointOptions: {
        EnforceHTTPS: true,
      },
    });
  });

  test('fails to create a domain with unsigned basic auth when enforce HTTPS is disabled', () => {
    expect(() => new Domain(stack, 'Domain', {
      version: engineVersion,
      useUnsignedBasicAuth: true,
      enforceHttps: false,
    })).toThrow(/You cannot disable HTTPS and use unsigned basic auth/);
  });

  test('fails to create a domain with unsigned basic auth when node to node encryption is disabled', () => {
    expect(() => new Domain(stack, 'Domain', {
      version: engineVersion,
      useUnsignedBasicAuth: true,
      nodeToNodeEncryption: false,
    })).toThrow(/You cannot disable node to node encryption and use unsigned basic auth/);
  });

  test('fails to create a domain with unsigned basic auth when encryption at rest is disabled', () => {
    expect(() => new Domain(stack, 'Domain', {
      version: engineVersion,
      useUnsignedBasicAuth: true,
      encryptionAtRest: { enabled: false },
    })).toThrow(/You cannot disable encryption at rest and use unsigned basic auth/);
  });

  test('using unsigned basic auth throws with Elasticsearch < 6.7', () => {
    expect(() => new Domain(stack, 'Domain', {
      version: EngineVersion.ELASTICSEARCH_6_5,
      useUnsignedBasicAuth: true,
    })).toThrow(/Using unsigned basic auth requires Elasticsearch version 6\.7 or later or OpenSearch version 1.0 or later/);
  });
});

each(testedOpenSearchVersions).describe('advanced options', (engineVersion) => {
  test('use advanced options', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
      advancedOptions: {
        'rest.action.multi.allow_explicit_index': 'true',
        'indices.fielddata.cache.size': '50',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      AdvancedOptions: {
        'rest.action.multi.allow_explicit_index': 'true',
        'indices.fielddata.cache.size': '50',
      },
    });
  });

  test('advanced options absent by default', () => {
    new Domain(stack, 'Domain', {
      version: engineVersion,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      AdvancedOptions: Match.absent(),
    });
  });
});

each(testedOpenSearchVersions).describe('cognito dashboards auth', (engineVersion) => {
  test('cognito dashboards auth is not configured by default', () => {
    new Domain(stack, 'Domain', { version: engineVersion });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      CognitoOptions: Match.absent(),
    });
  });

  test('cognito dashboards auth can be configured', () => {
    const identityPoolId = 'test-identity-pool-id';
    const userPoolId = 'test-user-pool-id';
    const user = new iam.User(stack, 'testuser');
    const role = new iam.Role(stack, 'testrole', { assumedBy: user });

    new Domain(stack, 'Domain', {
      version: engineVersion,
      cognitoDashboardsAuth: {
        role,
        identityPoolId,
        userPoolId,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      CognitoOptions: {
        Enabled: true,
        IdentityPoolId: identityPoolId,
        RoleArn: {
          'Fn::GetAtt': [
            'testroleFAA56B58',
            'Arn',
          ],
        },
        UserPoolId: userPoolId,
      },
    });
  });
});

function testGrant(
  expectedActions: string[],
  invocation: (user: iam.IPrincipal, domain: Domain) => void,
  engineVersion: EngineVersion,
  appliesToDomainRoot: Boolean = true,
  paths: string[] = ['/*'],
) {
  const domain = new Domain(stack, 'Domain', { version: engineVersion });
  const user = new iam.User(stack, 'user');

  invocation(user, domain);

  const action = expectedActions.length > 1 ? expectedActions.map(a => `es:${a}`) : `es:${expectedActions[0]}`;
  const domainArn = {
    'Fn::GetAtt': [
      'Domain66AC69E0',
      'Arn',
    ],
  };
  const resolvedPaths = paths.map(path => {
    return {
      'Fn::Join': [
        '',
        [
          domainArn,
          path,
        ],
      ],
    };
  });
  const resource = appliesToDomainRoot
    ? [domainArn, ...resolvedPaths]
    : resolvedPaths.length > 1
      ? resolvedPaths
      : resolvedPaths[0];

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: action,
          Effect: 'Allow',
          Resource: resource,
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'userDefaultPolicy083DF682',
    Users: [
      {
        Ref: 'user2C2B57AE',
      },
    ],
  });
}

function testMetric(
  invocation: (domain: Domain) => Metric,
  metricName: string,
  engineVersion: EngineVersion,
  statistic: string = Statistic.SUM,
  period: Duration = Duration.minutes(5),
) {
  const domain = new Domain(stack, 'Domain', { version: engineVersion });

  const metric = invocation(domain);

  expect(metric).toMatchObject({
    metricName,
    namespace: 'AWS/ES',
    period,
    statistic,
    dimensions: {
      ClientId: '1234',
    },
  });
  expect(metric.dimensions).toHaveProperty('DomainName');
}
