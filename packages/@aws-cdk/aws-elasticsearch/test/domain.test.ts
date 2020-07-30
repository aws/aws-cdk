import '@aws-cdk/assert/jest';
import { Metric, Statistic } from '@aws-cdk/aws-cloudwatch';
import { Subnet, Vpc } from '@aws-cdk/aws-ec2';
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
  masterNodeInstanceType: 'c5.large.elasticsearch',
  dataNodes: 3,
  dataNodeInstanceType: 'r5.large.elasticsearch',
};

const readActions = ['ESHttpGet', 'ESHttpHead'];
const writeActions = ['ESHttpDelete', 'ESHttpPost', 'ESHttpPut', 'ESHttpPatch'];
const readWriteActions = [
  ...readActions,
  ...writeActions,
];

test('minimal example renders correctly', () => {
  new Domain(stack, 'Domain', {
    elasticsearchVersion: ElasticsearchVersion.ES_VERSION_7_1,
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
      DedicatedMasterType: 'c5.large.elasticsearch',
      InstanceCount: 3,
      InstanceType: 'r5.large.elasticsearch',
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
      clusterConfig: defaultClusterConfig,
      logPublishingOptions: {
        slowSearchLogEnabed: true,
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
      clusterConfig: defaultClusterConfig,
      logPublishingOptions: {
        slowIndexLogEnabed: true,
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
      clusterConfig: defaultClusterConfig,
      logPublishingOptions: {
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
    testGrant(readActions, (p, t) => t.grantRead(p));
  });

  test('"grantWrite" allows write actions associated with this domain resource', () => {
    testGrant(writeActions, (p, t) => t.grantWrite(p));
  });

  test('"grantReadWrite" allows read and write actions associated with this domain resource', () => {
    testGrant(readWriteActions, (p, t) => t.grantReadWrite(p));
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
      Statistic.MAXIMUM,
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

});

function testGrant(
  expectedActions: string[],
  invocation: (user: iam.IPrincipal, domain: Domain) => void,
  appliesToDomainRoot: Boolean = true,
  paths: string[] = ['/*'],
) {
  const domain = new Domain(stack, 'Domain', {
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
