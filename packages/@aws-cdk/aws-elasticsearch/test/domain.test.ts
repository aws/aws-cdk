import '@aws-cdk/assert/jest';
import { Metric, Statistic } from '@aws-cdk/aws-cloudwatch';
import { Subnet, Vpc, EbsDeviceVolumeType } from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { App, Stack, Duration } from '@aws-cdk/core';
import { Domain, ElasticsearchVersion } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });

  jest.resetAllMocks();
});

const defaultClusterConfig = {
  masterNodes: 3,
  masterNodeInstanceType: 'i3.large.elasticsearch',
  dataNodes: 3,
  dataNodeInstanceType: 'r3.large.elasticsearch',
};

const readActions = ['ESHttpGet', 'ESHttpHead'];
const writeActions = ['ESHttpDelete', 'ESHttpPost', 'ESHttpPut', 'ESHttpPatch'];
const readWriteActions = [
  ...readActions,
  ...writeActions,
];

test('minimal example renders correctly', () => {
  new Domain(stack, 'Domain', {
    version: ElasticsearchVersion.V7_1,
    clusterConfig: defaultClusterConfig,
  });

  expect(stack).toHaveResource('AWS::Elasticsearch::Domain', {
    CognitoOptions: {
      Enabled: false,
    },
    EBSOptions: {
      EBSEnabled: false,
    },
    ElasticsearchClusterConfig: {
      DedicatedMasterCount: 3,
      DedicatedMasterEnabled: true,
      DedicatedMasterType: 'i3.large.elasticsearch',
      InstanceCount: 3,
      InstanceType: 'r3.large.elasticsearch',
      ZoneAwarenessEnabled: false,
    },
    ElasticsearchVersion: '7.1',
    EncryptionAtRestOptions: {
      Enabled: false,
    },
    LogPublishingOptions: {
      ES_APPLICATION_LOGS: {
        Enabled: false,
      },
      SEARCH_SLOW_LOGS: {
        Enabled: false,
      },
      INDEX_SLOW_LOGS: {
        Enabled: false,
      },
    },
    NodeToNodeEncryptionOptions: {
      Enabled: false,
    },
  });
});

describe('log groups', () => {

  test('slowSearchLogEnabled should create a custom log group', () => {
    new Domain(stack, 'Domain', {
      version: ElasticsearchVersion.V7_4,
      clusterConfig: defaultClusterConfig,
      logging: {
        slowSearchLogEnabled: true,
      },
    });

    expect(stack).toHaveResourceLike('AWS::Elasticsearch::Domain', {
      LogPublishingOptions: {
        ES_APPLICATION_LOGS: {
          Enabled: false,
        },
        SEARCH_SLOW_LOGS: {
          CloudWatchLogsLogGroupArn: {
            'Fn::GetAtt': [
              'SlowSearchLogsE00DC2E7',
              'Arn',
            ],
          },
          Enabled: true,
        },
        INDEX_SLOW_LOGS: {
          Enabled: false,
        },
      },
    });
  });

  test('slowIndexLogEnabled should create a custom log group', () => {
    new Domain(stack, 'Domain', {
      version: ElasticsearchVersion.V7_4,
      clusterConfig: defaultClusterConfig,
      logging: {
        slowIndexLogEnabled: true,
      },
    });

    expect(stack).toHaveResourceLike('AWS::Elasticsearch::Domain', {
      LogPublishingOptions: {
        ES_APPLICATION_LOGS: {
          Enabled: false,
        },
        SEARCH_SLOW_LOGS: {
          Enabled: false,
        },
        INDEX_SLOW_LOGS: {
          CloudWatchLogsLogGroupArn: {
            'Fn::GetAtt': [
              'SlowIndexLogsAD49DED0',
              'Arn',
            ],
          },
          Enabled: true,
        },
      },
    });
  });

  test('appLogEnabled should create a custom log group', () => {
    new Domain(stack, 'Domain', {
      version: ElasticsearchVersion.V7_4,
      clusterConfig: defaultClusterConfig,
      logging: {
        appLogEnabled: true,
      },
    });

    expect(stack).toHaveResourceLike('AWS::Elasticsearch::Domain', {
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
        SEARCH_SLOW_LOGS: {
          Enabled: false,
        },
        INDEX_SLOW_LOGS: {
          Enabled: false,
        },
      },
    });
  });

});

describe('grants', () => {

  test('"grantRead" allows read actions associated with this domain resource', () => {
    testGrant(readActions, (p, d) => d.grantRead(p));
  });

  test('"grantWrite" allows write actions associated with this domain resource', () => {
    testGrant(writeActions, (p, d) => d.grantWrite(p));
  });

  test('"grantReadWrite" allows read and write actions associated with this domain resource', () => {
    testGrant(readWriteActions, (p, d) => d.grantReadWrite(p));
  });

  test('"grantIndexRead" allows read actions associated with an index in this domain resource', () => {
    testGrant(
      readActions,
      (p, d) => d.grantIndexRead('my-index', p),
      false,
      ['/my-index', '/my-index/*'],
    );
  });

  test('"grantIndexWrite" allows write actions associated with an index in this domain resource', () => {
    testGrant(
      writeActions,
      (p, d) => d.grantIndexWrite('my-index', p),
      false,
      ['/my-index', '/my-index/*'],
    );
  });

  test('"grantIndexReadWrite" allows read and write actions associated with an index in this domain resource', () => {
    testGrant(
      readWriteActions,
      (p, d) => d.grantIndexReadWrite('my-index', p),
      false,
      ['/my-index', '/my-index/*'],
    );
  });

  test('"grantPathRead" allows read actions associated with a given path in this domain resource', () => {
    testGrant(
      readActions,
      (p, d) => d.grantPathRead('my-index/my-path', p),
      false,
      ['/my-index/my-path'],
    );
  });

  test('"grantPathWrite" allows write actions associated with a given path in this domain resource', () => {
    testGrant(
      writeActions,
      (p, d) => d.grantPathWrite('my-index/my-path', p),
      false,
      ['/my-index/my-path'],
    );
  });

  test('"grantPathReadWrite" allows read and write actions associated with a given path in this domain resource', () => {
    testGrant(
      readWriteActions,
      (p, d) => d.grantPathReadWrite('my-index/my-path', p),
      false,
      ['/my-index/my-path'],
    );
  });

  test('"grant" for an imported domain', () => {
    const domainEndpoint = 'https://test-domain-2w2x2u3tifly-jcjotrt6f7otem4sqcwbch3c4u.testregion.es.amazonaws.com';
    const domain = Domain.fromDomainEndpoint(stack, 'Domain', domainEndpoint);
    const user = new iam.User(stack, 'user');

    domain.grantReadWrite(user);

    expect(stack).toHaveResource('AWS::IAM::Policy', {
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

describe('metrics', () => {

  test('Can use metricClusterStatusRed on an Elasticsearch Domain', () => {
    testMetric(
      (domain) => domain.metricClusterStatusRed(),
      'ClusterStatus.red',
      Statistic.MAXIMUM,
    );
  });

  test('Can use metricClusterStatusYellow on an Elasticsearch Domain', () => {
    testMetric(
      (domain) => domain.metricClusterStatusYellow(),
      'ClusterStatus.yellow',
      Statistic.MAXIMUM,
    );
  });

  test('Can use metricFreeStorageSpace on an Elasticsearch Domain', () => {
    testMetric(
      (domain) => domain.metricFreeStorageSpace(),
      'FreeStorageSpace',
      Statistic.MINIMUM,
    );
  });

  test('Can use metricClusterIndexWriteBlocked on an Elasticsearch Domain', () => {
    testMetric(
      (domain) => domain.metricClusterIndexWriteBlocked(),
      'ClusterIndexWriteBlocked',
      Statistic.MAXIMUM,
      Duration.minutes(1),
    );
  });

  test('Can use metricNodes on an Elasticsearch Domain', () => {
    testMetric(
      (domain) => domain.metricNodes(),
      'Nodes',
      Statistic.MINIMUM,
      Duration.hours(1),
    );
  });

  test('Can use metricAutomatedSnapshotFailure on an Elasticsearch Domain', () => {
    testMetric(
      (domain) => domain.metricAutomatedSnapshotFailure(),
      'AutomatedSnapshotFailure',
      Statistic.MAXIMUM,
    );
  });

  test('Can use metricCPUUtilization on an Elasticsearch Domain', () => {
    testMetric(
      (domain) => domain.metricCPUUtilization(),
      'CPUUtilization',
      Statistic.MAXIMUM,
    );
  });

  test('Can use metricJVMMemoryPressure on an Elasticsearch Domain', () => {
    testMetric(
      (domain) => domain.metricJVMMemoryPressure(),
      'JVMMemoryPressure',
      Statistic.MAXIMUM,
    );
  });

  test('Can use metricMasterCPUUtilization on an Elasticsearch Domain', () => {
    testMetric(
      (domain) => domain.metricMasterCPUUtilization(),
      'MasterCPUUtilization',
      Statistic.MAXIMUM,
    );
  });

  test('Can use metricMasterJVMMemoryPressure on an Elasticsearch Domain', () => {
    testMetric(
      (domain) => domain.metricMasterJVMMemoryPressure(),
      'MasterJVMMemoryPressure',
      Statistic.MAXIMUM,
    );
  });

  test('Can use metricKMSKeyError on an Elasticsearch Domain', () => {
    testMetric(
      (domain) => domain.metricKMSKeyError(),
      'KMSKeyError',
      Statistic.MAXIMUM,
    );
  });

  test('Can use metricKMSKeyInaccessible on an Elasticsearch Domain', () => {
    testMetric(
      (domain) => domain.metricKMSKeyInaccessible(),
      'KMSKeyInaccessible',
      Statistic.MAXIMUM,
    );
  });

  test('Can use metricSearchableDocuments on an Elasticsearch Domain', () => {
    testMetric(
      (domain) => domain.metricSearchableDocuments(),
      'SearchableDocuments',
      Statistic.MAXIMUM,
    );
  });

  test('Can use metricSearchLatency on an Elasticsearch Domain', () => {
    testMetric(
      (domain) => domain.metricSearchLatency(),
      'SearchLatencyP99',
      'p99',
    );
  });

  test('Can use metricIndexingLatency on an Elasticsearch Domain', () => {
    testMetric(
      (domain) => domain.metricIndexingLatency(),
      'IndexingLatencyP99',
      'p99',
    );
  });

});

describe('import', () => {

  test('static fromDomainEndpoint(endpoint) allows importing an external/existing domain', () => {
    const domainName = 'test-domain-2w2x2u3tifly';
    const domainEndpoint = `https://${domainName}-jcjotrt6f7otem4sqcwbch3c4u.testregion.es.amazonaws.com`;
    const imported = Domain.fromDomainEndpoint(stack, 'Domain', domainEndpoint);

    expect(imported.domainName).toEqual(domainName);
    expect(imported.domainArn).toMatch(RegExp(`es:testregion:1234:domain/${domainName}$`));

    expect(stack).not.toHaveResource('AWS::Elasticsearch::Domain');
  });

});

describe('custom error responses', () => {

  test('error when availabilityZoneCount does not match vpcOptions.subnets length', () => {
    const vpc = new Vpc(stack, 'Vpc');

    expect(() => new Domain(stack, 'Domain', {
      version: ElasticsearchVersion.V7_4,
      clusterConfig: {
        ...defaultClusterConfig,
        availabilityZoneCount: 2,
      },
      vpcOptions: {
        subnets: [
          new Subnet(stack, 'Subnet', {
            availabilityZone: 'testaz',
            cidrBlock: vpc.vpcCidrBlock,
            vpcId: vpc.vpcId,
          }),
        ],
        securityGroups: [],
      },
    })).toThrow(/you need to provide a subnet for each AZ you are using/);
  });

  test('error when master or data node instance types do not end with .elasticsearch', () => {
    const error = /instance types must end with ".elasticsearch"/;
    expect(() => new Domain(stack, 'Domain1', {
      version: ElasticsearchVersion.V7_4,
      clusterConfig: {
        ...defaultClusterConfig,
        masterNodeInstanceType: 'c5.large',
      },
    })).toThrow(error);
    expect(() => new Domain(stack, 'Domain2', {
      version: ElasticsearchVersion.V7_4,
      clusterConfig: {
        ...defaultClusterConfig,
        dataNodeInstanceType: 'c5.2xlarge',
      },
    })).toThrow(error);
  });

  test('error when elasticsearchVersion is unsupported/unknown', () => {
    expect(() => new Domain(stack, 'Domain1', {
      clusterConfig: defaultClusterConfig,
      version: ElasticsearchVersion.of('5.4'),
    })).toThrow(/Unknown Elasticsearch version: 5\.4/);
  });

  test('error when log publishing is enabled for elasticsearch version < 5.1', () => {
    const error = /logs publishing requires Elasticsearch version 5.1 or later/;
    expect(() => new Domain(stack, 'Domain1', {
      version: ElasticsearchVersion.V2_3,
      clusterConfig: defaultClusterConfig,
      logging: {
        appLogEnabled: true,
      },
    })).toThrow(error);
    expect(() => new Domain(stack, 'Domain2', {
      version: ElasticsearchVersion.V1_5,
      clusterConfig: defaultClusterConfig,
      logging: {
        slowSearchLogEnabled: true,
      },
    })).toThrow(error);
    expect(() => new Domain(stack, 'Domain3', {
      version: ElasticsearchVersion.V1_5,
      clusterConfig: defaultClusterConfig,
      logging: {
        slowIndexLogEnabled: true,
      },
    })).toThrow(error);
  });

  test('error when encryption at rest is enabled for elasticsearch version < 5.1', () => {
    expect(() => new Domain(stack, 'Domain1', {
      version: ElasticsearchVersion.V2_3,
      clusterConfig: defaultClusterConfig,
      encryptionAtRest: {
        enabled: true,
      },
    })).toThrow(/Encryption of data at rest requires Elasticsearch version 5.1 or later/);
  });

  test('error when cognito for kibana is enabled for elasticsearch version < 5.1', () => {
    const user = new iam.User(stack, 'user');
    expect(() => new Domain(stack, 'Domain1', {
      version: ElasticsearchVersion.V2_3,
      clusterConfig: defaultClusterConfig,
      cognitoKibanaAuth: {
        identityPoolId: 'test-identity-pool-id',
        role: new iam.Role(stack, 'Role', { assumedBy: user }),
        userPoolId: 'test-user-pool-id',
      },
    })).toThrow(/Cognito authentication for Kibana requires Elasticsearch version 5.1 or later/);
  });

  test('error when C5, I3, M5, or R5 instance types are specified for elasticsearch version < 5.1', () => {
    const error = /C5, I3, M5, and R5 instance types require Elasticsearch version 5.1 or later/;
    expect(() => new Domain(stack, 'Domain1', {
      version: ElasticsearchVersion.V2_3,
      clusterConfig: {
        ...defaultClusterConfig,
        masterNodeInstanceType: 'c5.medium.elasticsearch',
      },
    })).toThrow(error);
    expect(() => new Domain(stack, 'Domain2', {
      version: ElasticsearchVersion.V1_5,
      clusterConfig: {
        ...defaultClusterConfig,
        dataNodeInstanceType: 'i3.2xlarge.elasticsearch',
      },
    })).toThrow(error);
    expect(() => new Domain(stack, 'Domain3', {
      version: ElasticsearchVersion.V1_5,
      clusterConfig: {
        ...defaultClusterConfig,
        dataNodeInstanceType: 'm5.2xlarge.elasticsearch',
      },
    })).toThrow(error);
    expect(() => new Domain(stack, 'Domain4', {
      version: ElasticsearchVersion.V1_5,
      clusterConfig: {
        ...defaultClusterConfig,
        masterNodeInstanceType: 'r5.2xlarge.elasticsearch',
      },
    })).toThrow(error);
  });

  test('error when node to node encryption is enabled for elasticsearch version < 6.0', () => {
    expect(() => new Domain(stack, 'Domain1', {
      version: ElasticsearchVersion.V5_6,
      clusterConfig: defaultClusterConfig,
      nodeToNodeEncryption: true,
    })).toThrow(/Node-to-node encryption requires Elasticsearch version 6.0 or later/);
  });

  test('error when i3 instance types are specified with EBS enabled', () => {
    expect(() => new Domain(stack, 'Domain1', {
      version: ElasticsearchVersion.V7_4,
      clusterConfig: {
        ...defaultClusterConfig,
        masterNodeInstanceType: 'i3.2xlarge.elasticsearch',
      },
      ebs: {
        volumeSize: 100,
        volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
      },
    })).toThrow(/I3 instance types do not support EBS storage volumes/);
  });

  test('error when m3, r3, or t2 instance types are specified with encryption at rest enabled', () => {
    const error = /M3, R3, and T2 instance types do not support encryption of data at rest/;
    expect(() => new Domain(stack, 'Domain1', {
      version: ElasticsearchVersion.V7_4,
      clusterConfig: {
        ...defaultClusterConfig,
        masterNodeInstanceType: 'm3.2xlarge.elasticsearch',
      },
      encryptionAtRest: {
        enabled: true,
      },
    })).toThrow(error);
    expect(() => new Domain(stack, 'Domain2', {
      version: ElasticsearchVersion.V7_4,
      clusterConfig: {
        ...defaultClusterConfig,
        dataNodeInstanceType: 'r3.2xlarge.elasticsearch',
      },
      encryptionAtRest: {
        enabled: true,
      },
    })).toThrow(error);
    expect(() => new Domain(stack, 'Domain3', {
      version: ElasticsearchVersion.V7_4,
      clusterConfig: {
        ...defaultClusterConfig,
        masterNodeInstanceType: 't2.2xlarge.elasticsearch',
      },
      encryptionAtRest: {
        enabled: true,
      },
    })).toThrow(error);
  });

  test('error when t2.micro is specified with elasticsearch version > 2.3', () => {
    expect(() => new Domain(stack, 'Domain1', {
      version: ElasticsearchVersion.V6_7,
      clusterConfig: {
        ...defaultClusterConfig,
        masterNodeInstanceType: 't2.micro.elasticsearch',
      },
    })).toThrow(/t2.micro.elasticsearch instance type supports only Elasticsearch 1.5 and 2.3/);
  });

  test('error when any instance type other than R3 and I3 are specified without EBS enabled', () => {
    expect(() => new Domain(stack, 'Domain1', {
      version: ElasticsearchVersion.V7_4,
      clusterConfig: {
        ...defaultClusterConfig,
        masterNodeInstanceType: 'm5.large.elasticsearch',
      },
    })).toThrow(/EBS volumes are required for all instance types except R3 and I3/);
  });

});

test('can specify future version', () => {
  new Domain(stack, 'Domain', {
    version: ElasticsearchVersion.of('8.2'),
    clusterConfig: defaultClusterConfig,
  });

  expect(stack).toHaveResourceLike('AWS::Elasticsearch::Domain', {
    ElasticsearchVersion: '8.2',
  });
});


function testGrant(
  expectedActions: string[],
  invocation: (user: iam.IPrincipal, domain: Domain) => void,
  appliesToDomainRoot: Boolean = true,
  paths: string[] = ['/*'],
) {
  const domain = new Domain(stack, 'Domain', {
    version: ElasticsearchVersion.V7_4,
    clusterConfig: defaultClusterConfig,
  });
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

  expect(stack).toHaveResource('AWS::IAM::Policy', {
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
  statistic: string = Statistic.SUM,
  period: Duration = Duration.minutes(5),
) {
  const domain = new Domain(stack, 'Domain', {
    version: ElasticsearchVersion.V7_4,
    clusterConfig: defaultClusterConfig,
  });

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
