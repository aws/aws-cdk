import { LoadBalancerListenerProtocol, LoadBalancerType } from '@aws-cdk/cloud-assembly-schema';
import {
  DescribeListenersCommand,
  DescribeLoadBalancersCommand,
  DescribeTagsCommand,
} from '@aws-sdk/client-elastic-load-balancing-v2';
import { SDK, SdkForEnvironment } from '../../lib';
import {
  LoadBalancerListenerContextProviderPlugin,
  LoadBalancerContextProviderPlugin,
} from '../../lib/context-providers/load-balancers';
import {
  FAKE_CREDENTIAL_CHAIN,
  MockSdkProvider,
  mockElasticLoadBalancingV2Client,
  restoreSdkMocksToDefault,
} from '../util/mock-sdk';

const mockSDK = new (class extends MockSdkProvider {
  public forEnvironment(): Promise<SdkForEnvironment> {
    return Promise.resolve({ sdk: new SDK(FAKE_CREDENTIAL_CHAIN, mockSDK.defaultRegion, {}), didAssumeRole: false });
  }
})();

beforeEach(() => {
  restoreSdkMocksToDefault();
});

describe('load balancer context provider plugin', () => {
  test('errors when no matches are found', async () => {
    // GIVEN
    const provider = new LoadBalancerContextProviderPlugin(mockSDK);

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
        loadBalancerType: LoadBalancerType.APPLICATION,
        loadBalancerArn: 'arn:load-balancer1',
      }),
    ).rejects.toThrow(
      'No load balancers found matching {"account":"1234","region":"us-east-1","loadBalancerType":"application","loadBalancerArn":"arn:load-balancer1"}',
    );
  });

  test('errors when multiple load balancers match', async () => {
    // GIVEN
    mockElasticLoadBalancingV2Client
      .on(DescribeLoadBalancersCommand)
      .resolves({
        LoadBalancers: [
          {
            IpAddressType: 'ipv4',
            LoadBalancerArn: 'arn:load-balancer1',
            DNSName: 'dns1.example.com',
            CanonicalHostedZoneId: 'Z1234',
            SecurityGroups: ['sg-1234'],
            VpcId: 'vpc-1234',
            Type: 'application',
          },
          {
            IpAddressType: 'ipv4',
            LoadBalancerArn: 'arn:load-balancer2',
            DNSName: 'dns2.example.com',
            CanonicalHostedZoneId: 'Z1234',
            SecurityGroups: ['sg-1234'],
            VpcId: 'vpc-1234',
            Type: 'application',
          },
        ],
      })
      .on(DescribeTagsCommand)
      .resolves({
        TagDescriptions: [
          {
            ResourceArn: 'arn:load-balancer1',
            Tags: [{ Key: 'some', Value: 'tag' }],
          },
          {
            ResourceArn: 'arn:load-balancer2',
            Tags: [{ Key: 'some', Value: 'tag' }],
          },
        ],
      });
    const provider = new LoadBalancerContextProviderPlugin(mockSDK);

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
        loadBalancerType: LoadBalancerType.APPLICATION,
        loadBalancerTags: [{ key: 'some', value: 'tag' }],
      }),
    ).rejects.toThrow(
      'Multiple load balancers found matching {"account":"1234","region":"us-east-1","loadBalancerType":"application","loadBalancerTags":[{"key":"some","value":"tag"}]} - please provide more specific criteria',
    );
    expect(mockElasticLoadBalancingV2Client).toHaveReceivedCommandWith(DescribeTagsCommand, {
      ResourceArns: ['arn:load-balancer1', 'arn:load-balancer2'],
    });
  });

  test('looks up by arn', async () => {
    // GIVEN
    mockElasticLoadBalancingV2Client.on(DescribeLoadBalancersCommand).resolves({
      LoadBalancers: [
        {
          IpAddressType: 'ipv4',
          LoadBalancerArn: 'arn:load-balancer1',
          DNSName: 'dns.example.com',
          CanonicalHostedZoneId: 'Z1234',
          SecurityGroups: ['sg-1234'],
          VpcId: 'vpc-1234',
          Type: 'application',
        },
      ],
    });
    const provider = new LoadBalancerContextProviderPlugin(mockSDK);

    // WHEN
    const result = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerType: LoadBalancerType.APPLICATION,
      loadBalancerArn: 'arn:load-balancer1',
    });

    // THEN
    expect(result.ipAddressType).toEqual('ipv4');
    expect(result.loadBalancerArn).toEqual('arn:load-balancer1');
    expect(result.loadBalancerCanonicalHostedZoneId).toEqual('Z1234');
    expect(result.loadBalancerDnsName).toEqual('dns.example.com');
    expect(result.securityGroupIds).toEqual(['sg-1234']);
    expect(result.vpcId).toEqual('vpc-1234');
    expect(mockElasticLoadBalancingV2Client).toHaveReceivedCommandWith(DescribeLoadBalancersCommand, {
      LoadBalancerArns: ['arn:load-balancer1'],
    });
  });

  test('looks up by tags', async () => {
    // GIVEN
    mockElasticLoadBalancingV2Client
      .on(DescribeLoadBalancersCommand)
      .resolves({
        LoadBalancers: [
          {
            IpAddressType: 'ipv4',
            LoadBalancerArn: 'arn:load-balancer1',
            DNSName: 'dns1.example.com',
            CanonicalHostedZoneId: 'Z1234',
            SecurityGroups: ['sg-1234'],
            VpcId: 'vpc-1234',
            Type: 'application',
          },
          {
            IpAddressType: 'ipv4',
            LoadBalancerArn: 'arn:load-balancer2',
            DNSName: 'dns2.example.com',
            CanonicalHostedZoneId: 'Z1234',
            SecurityGroups: ['sg-1234'],
            VpcId: 'vpc-1234',
            Type: 'application',
          },
        ],
      })
      .on(DescribeTagsCommand)
      .resolves({
        TagDescriptions: [
          {
            ResourceArn: 'arn:load-balancer1',
            Tags: [{ Key: 'some', Value: 'tag' }],
          },
          {
            ResourceArn: 'arn:load-balancer2',
            Tags: [
              { Key: 'some', Value: 'tag' },
              { Key: 'second', Value: 'tag2' },
            ],
          },
        ],
      });
    const provider = new LoadBalancerContextProviderPlugin(mockSDK);

    // WHEN
    const result = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerType: LoadBalancerType.APPLICATION,
      loadBalancerTags: [
        { key: 'some', value: 'tag' },
        { key: 'second', value: 'tag2' },
      ],
    });

    expect(result.loadBalancerArn).toEqual('arn:load-balancer2');
    expect(mockElasticLoadBalancingV2Client).toHaveReceivedCommandWith(DescribeTagsCommand, {
      ResourceArns: ['arn:load-balancer1', 'arn:load-balancer2'],
    });
  });

  test('looks up by tags - query by subset', async () => {
    // GIVEN
    mockElasticLoadBalancingV2Client
      .on(DescribeLoadBalancersCommand)
      .resolves({
        LoadBalancers: [
          {
            IpAddressType: 'ipv4',
            LoadBalancerArn: 'arn:load-balancer2',
            DNSName: 'dns2.example.com',
            CanonicalHostedZoneId: 'Z1234',
            SecurityGroups: ['sg-1234'],
            VpcId: 'vpc-1234',
            Type: 'application',
          },
        ],
      })
      .on(DescribeTagsCommand)
      .resolves({
        TagDescriptions: [
          {
            ResourceArn: 'arn:load-balancer2',
            Tags: [
              // Load balancer has two tags...
              { Key: 'some', Value: 'tag' },
              { Key: 'second', Value: 'tag2' },
            ],
          },
        ],
      });
    const provider = new LoadBalancerContextProviderPlugin(mockSDK);

    // WHEN
    const result = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerType: LoadBalancerType.APPLICATION,
      loadBalancerTags: [
        // ...but we are querying for only one of them
        { key: 'second', value: 'tag2' },
      ],
    });

    expect(result.loadBalancerArn).toEqual('arn:load-balancer2');
  });

  test('filters by type', async () => {
    // GIVEN
    mockElasticLoadBalancingV2Client
      .on(DescribeLoadBalancersCommand)
      .resolves({
        LoadBalancers: [
          {
            IpAddressType: 'ipv4',
            Type: 'network',
            LoadBalancerArn: 'arn:load-balancer1',
            DNSName: 'dns1.example.com',
            CanonicalHostedZoneId: 'Z1234',
            SecurityGroups: ['sg-1234'],
            VpcId: 'vpc-1234',
          },
          {
            IpAddressType: 'ipv4',
            Type: 'application',
            LoadBalancerArn: 'arn:load-balancer2',
            DNSName: 'dns2.example.com',
            CanonicalHostedZoneId: 'Z1234',
            SecurityGroups: ['sg-1234'],
            VpcId: 'vpc-1234',
          },
        ],
      })
      .on(DescribeTagsCommand)
      .resolves({
        TagDescriptions: [
          {
            ResourceArn: 'arn:load-balancer1',
            Tags: [{ Key: 'some', Value: 'tag' }],
          },
          {
            ResourceArn: 'arn:load-balancer2',
            Tags: [{ Key: 'some', Value: 'tag' }],
          },
        ],
      });
    const provider = new LoadBalancerContextProviderPlugin(mockSDK);

    // WHEN
    const loadBalancer = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerTags: [{ key: 'some', value: 'tag' }],
      loadBalancerType: LoadBalancerType.APPLICATION,
    });

    expect(loadBalancer.loadBalancerArn).toEqual('arn:load-balancer2');
  });
});

describe('load balancer listener context provider plugin', () => {
  test('errors when no associated load balancers match', async () => {
    // GIVEN
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
        loadBalancerType: LoadBalancerType.APPLICATION,
        loadBalancerTags: [{ key: 'some', value: 'tag' }],
      }),
    ).rejects.toThrow(
      'No associated load balancers found for load balancer listener query {"account":"1234","region":"us-east-1","loadBalancerType":"application","loadBalancerTags":[{"key":"some","value":"tag"}]}',
    );
  });

  test('errors when no listeners match', async () => {
    // GIVEN
    mockElasticLoadBalancingV2Client
      .on(DescribeLoadBalancersCommand)
      .resolves({
        LoadBalancers: [
          {
            LoadBalancerArn: 'arn:load-balancer',
            Type: 'application',
          },
        ],
      })
      .on(DescribeListenersCommand)
      .resolves({
        Listeners: [
          {
            LoadBalancerArn: 'arn:load-balancer',
            ListenerArn: 'arn:listener',
            Port: 80,
            Protocol: 'HTTP',
          },
        ],
      });
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
        loadBalancerType: LoadBalancerType.APPLICATION,
        loadBalancerArn: 'arn:load-balancer',
        listenerPort: 443,
        listenerProtocol: LoadBalancerListenerProtocol.HTTPS,
      }),
    ).rejects.toThrow(
      'No load balancer listeners found matching {"account":"1234","region":"us-east-1","loadBalancerType":"application","loadBalancerArn":"arn:load-balancer","listenerPort":443,"listenerProtocol":"HTTPS"}',
    );
  });

  test('errors when multiple listeners match', async () => {
    // GIVEN
    mockElasticLoadBalancingV2Client
      .on(DescribeLoadBalancersCommand)
      .resolves({
        LoadBalancers: [
          {
            LoadBalancerArn: 'arn:load-balancer',
            Type: 'application',
          },
          {
            LoadBalancerArn: 'arn:load-balancer2',
            Type: 'application',
          },
        ],
      })
      .on(DescribeTagsCommand)
      .resolves({
        TagDescriptions: [
          {
            ResourceArn: 'arn:load-balancer',
            Tags: [{ Key: 'some', Value: 'tag' }],
          },
          {
            ResourceArn: 'arn:load-balancer2',
            Tags: [{ Key: 'some', Value: 'tag' }],
          },
        ],
      })
      .on(DescribeListenersCommand)
      .resolves({
        Listeners: [
          {
            LoadBalancerArn: 'arn:load-balancer',
            ListenerArn: 'arn:listener',
            Port: 80,
            Protocol: 'HTTP',
          },
          {
            LoadBalancerArn: 'arn:load-balancer2',
            ListenerArn: 'arn:listener2',
            Port: 80,
            Protocol: 'HTTP',
          },
        ],
      });
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
        loadBalancerType: LoadBalancerType.APPLICATION,
        loadBalancerTags: [{ key: 'some', value: 'tag' }],
        listenerPort: 80,
        listenerProtocol: LoadBalancerListenerProtocol.HTTP,
      }),
    ).rejects.toThrow(
      'Multiple load balancer listeners found matching {"account":"1234","region":"us-east-1","loadBalancerType":"application","loadBalancerTags":[{"key":"some","value":"tag"}],"listenerPort":80,"listenerProtocol":"HTTP"} - please provide more specific criteria',
    );
  });

  test('looks up by listener arn', async () => {
    // GIVEN
    mockElasticLoadBalancingV2Client
      .on(DescribeLoadBalancersCommand)
      .resolves({
        LoadBalancers: [
          {
            LoadBalancerArn: 'arn:load-balancer-arn',
            SecurityGroups: ['sg-1234', 'sg-2345'],
            Type: 'application',
          },
        ],
      })
      .on(DescribeListenersCommand)
      .resolves({
        Listeners: [
          {
            ListenerArn: 'arn:listener-arn',
            LoadBalancerArn: 'arn:load-balancer-arn',
            Port: 999,
          },
        ],
      });
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    // WHEN
    const listener = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerType: LoadBalancerType.APPLICATION,
      listenerArn: 'arn:listener-arn',
    });

    // THEN
    expect(listener.listenerArn).toEqual('arn:listener-arn');
    expect(listener.listenerPort).toEqual(999);
    expect(listener.securityGroupIds).toEqual(['sg-1234', 'sg-2345']);
    expect(mockElasticLoadBalancingV2Client).toHaveReceivedCommandWith(DescribeLoadBalancersCommand, {
      LoadBalancerArns: ['arn:load-balancer-arn'],
    });
    expect(mockElasticLoadBalancingV2Client).toHaveReceivedCommandWith(DescribeListenersCommand, {
      ListenerArns: ['arn:listener-arn'],
    });
  });

  test('looks up by associated load balancer arn', async () => {
    // GIVEN
    mockElasticLoadBalancingV2Client
      .on(DescribeLoadBalancersCommand)
      .resolves({
        LoadBalancers: [
          {
            LoadBalancerArn: 'arn:load-balancer-arn1',
            SecurityGroups: ['sg-1234'],
            Type: 'application',
          },
        ],
      })
      .on(DescribeListenersCommand)
      .resolves({
        Listeners: [
          {
            // This one
            ListenerArn: 'arn:listener-arn1',
            LoadBalancerArn: 'arn:load-balancer-arn1',
            Port: 80,
          },
        ],
      });
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    // WHEN
    const listener = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerType: LoadBalancerType.APPLICATION,
      loadBalancerArn: 'arn:load-balancer-arn1',
    });

    // THEN
    expect(listener.listenerArn).toEqual('arn:listener-arn1');
    expect(listener.listenerPort).toEqual(80);
    expect(listener.securityGroupIds).toEqual(['sg-1234']);
    expect(mockElasticLoadBalancingV2Client).toHaveReceivedCommandWith(DescribeLoadBalancersCommand, {
      LoadBalancerArns: ['arn:load-balancer-arn1'],
    });
    expect(mockElasticLoadBalancingV2Client).toHaveReceivedCommandWith(DescribeListenersCommand, {
      LoadBalancerArn: 'arn:load-balancer-arn1',
    });
  });

  test('looks up by associated load balancer tags', async () => {
    // GIVEN
    mockElasticLoadBalancingV2Client
      .on(DescribeLoadBalancersCommand)
      .resolves({
        LoadBalancers: [
          {
            // This one should have the wrong tags
            LoadBalancerArn: 'arn:load-balancer-arn1',
            SecurityGroups: ['sg-1234', 'sg-2345'],
            Type: 'application',
          },
          {
            // Expecting this one
            LoadBalancerArn: 'arn:load-balancer-arn2',
            SecurityGroups: ['sg-3456', 'sg-4567'],
            Type: 'application',
          },
        ],
      })
      .on(DescribeListenersCommand)
      .resolves({
        Listeners: [
          {
            // This one
            ListenerArn: 'arn:listener-arn1',
            LoadBalancerArn: 'arn:load-balancer-arn2',
            Port: 80,
          },
          {
            ListenerArn: 'arn:listener-arn2',
            LoadBalancerArn: 'arn:load-balancer-arn2',
            Port: 999,
          },
        ],
      })
      .on(DescribeTagsCommand)
      .resolves({
        TagDescriptions: [
          {
            ResourceArn: 'arn:load-balancer-arn1',
            Tags: [],
          },
          {
            // Expecting this one
            ResourceArn: 'arn:load-balancer-arn2',
            Tags: [{ Key: 'some', Value: 'tag' }],
          },
        ],
      });
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    // WHEN
    const listener = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerType: LoadBalancerType.APPLICATION,
      loadBalancerTags: [{ key: 'some', value: 'tag' }],
      listenerPort: 999,
    });

    // THEN
    expect(listener.listenerArn).toEqual('arn:listener-arn2');
    expect(listener.listenerPort).toEqual(999);
    expect(listener.securityGroupIds).toEqual(['sg-3456', 'sg-4567']);
    expect(mockElasticLoadBalancingV2Client).toHaveReceivedCommandWith(DescribeLoadBalancersCommand, {
      LoadBalancerArns: undefined,
    });
    expect(mockElasticLoadBalancingV2Client).toHaveReceivedCommandWith(DescribeListenersCommand, {
      LoadBalancerArn: 'arn:load-balancer-arn2',
    });
    expect(mockElasticLoadBalancingV2Client).toHaveReceivedCommandWith(DescribeTagsCommand, {
      ResourceArns: ['arn:load-balancer-arn1', 'arn:load-balancer-arn2'],
    });
  });

  test('looks up by listener port and protocol', async () => {
    // GIVEN
    mockElasticLoadBalancingV2Client
      .on(DescribeLoadBalancersCommand)
      .resolves({
        LoadBalancers: [
          {
            // Shouldn't have any matching listeners
            IpAddressType: 'ipv4',
            LoadBalancerArn: 'arn:load-balancer1',
            DNSName: 'dns1.example.com',
            CanonicalHostedZoneId: 'Z1234',
            SecurityGroups: ['sg-1234'],
            VpcId: 'vpc-1234',
            Type: 'application',
          },
          {
            // Should have a matching listener
            IpAddressType: 'ipv4',
            LoadBalancerArn: 'arn:load-balancer2',
            DNSName: 'dns2.example.com',
            CanonicalHostedZoneId: 'Z1234',
            SecurityGroups: ['sg-2345'],
            VpcId: 'vpc-1234',
            Type: 'application',
          },
        ],
      })
      .on(DescribeTagsCommand)
      .resolves({
        TagDescriptions: [
          {
            ResourceArn: 'arn:load-balancer1',
            Tags: [{ Key: 'some', Value: 'tag' }],
          },
          {
            ResourceArn: 'arn:load-balancer2',
            Tags: [{ Key: 'some', Value: 'tag' }],
          },
        ],
      })
      .on(DescribeListenersCommand)
      .resolvesOnce({
        Listeners: [
          {
            // Wrong port, wrong protocol => no match
            ListenerArn: 'arn:listener-arn1',
            LoadBalancerArn: 'arn:load-balancer1',
            Protocol: 'HTTP',
            Port: 80,
          },
          {
            // Wrong protocol, right port => no match
            ListenerArn: 'arn:listener-arn3',
            LoadBalancerArn: 'arn:load-balancer1',
            Protocol: 'HTTPS',
            Port: 443,
          },
          {
            // Wrong port, right protocol => no match
            ListenerArn: 'arn:listener-arn4',
            LoadBalancerArn: 'arn:load-balancer1',
            Protocol: 'TCP',
            Port: 999,
          },
        ],
      })
      .resolvesOnce({
        Listeners: [
          {
            // Wrong port, wrong protocol => no match
            ListenerArn: 'arn:listener-arn5',
            LoadBalancerArn: 'arn:load-balancer2',
            Protocol: 'HTTP',
            Port: 80,
          },
          {
            // Right port, right protocol => match
            ListenerArn: 'arn:listener-arn6',
            LoadBalancerArn: 'arn:load-balancer2',
            Port: 443,
            Protocol: 'TCP',
          },
        ],
      });
    mockElasticLoadBalancingV2Client.on(DescribeTagsCommand).resolves({
      TagDescriptions: [
        {
          ResourceArn: 'arn:load-balancer1',
          Tags: [{ Key: 'some', Value: 'tag' }],
        },
        {
          ResourceArn: 'arn:load-balancer2',
          Tags: [{ Key: 'some', Value: 'tag' }],
        },
      ],
    });
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    // WHEN
    const listener = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerType: LoadBalancerType.APPLICATION,
      loadBalancerTags: [{ key: 'some', value: 'tag' }],
      listenerProtocol: LoadBalancerListenerProtocol.TCP,
      listenerPort: 443,
    });

    // THEN
    expect(listener.listenerArn).toEqual('arn:listener-arn6');
    expect(listener.listenerPort).toEqual(443);
    expect(listener.securityGroupIds).toEqual(['sg-2345']);
  });

  test('filters by associated load balancer type', async () => {
    // GIVEN
    mockElasticLoadBalancingV2Client
      .on(DescribeLoadBalancersCommand)
      .resolves({
        LoadBalancers: [
          {
            // This one has wrong type => no match
            LoadBalancerArn: 'arn:load-balancer-arn1',
            SecurityGroups: [],
            Type: 'application',
          },
          {
            // Right type => match
            LoadBalancerArn: 'arn:load-balancer-arn2',
            SecurityGroups: [],
            Type: 'network',
          },
        ],
      })
      .on(DescribeListenersCommand)
      .resolves({
        Listeners: [
          {
            ListenerArn: 'arn:listener-arn2',
            LoadBalancerArn: 'arn:load-balancer-arn2',
            Port: 443,
          },
        ],
      })
      .on(DescribeTagsCommand)
      .resolves({
        TagDescriptions: [
          {
            ResourceArn: 'arn:load-balancer-arn1',
            Tags: [{ Key: 'some', Value: 'tag' }],
          },
          {
            ResourceArn: 'arn:load-balancer-arn2',
            Tags: [{ Key: 'some', Value: 'tag' }],
          },
        ],
      });
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    // WHEN
    const listener = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerType: LoadBalancerType.NETWORK,
      loadBalancerTags: [{ key: 'some', value: 'tag' }],
      listenerPort: 443,
    });

    // THEN
    expect(listener.listenerArn).toEqual('arn:listener-arn2');
    expect(listener.listenerPort).toEqual(443);
    expect(mockElasticLoadBalancingV2Client).toHaveReceivedCommandWith(DescribeLoadBalancersCommand, {
      LoadBalancerArns: undefined,
    });
    expect(mockElasticLoadBalancingV2Client).toHaveReceivedCommandWith(DescribeListenersCommand, {
      LoadBalancerArn: 'arn:load-balancer-arn2',
    });
  });

  test('errors when associated load balancer is wrong type', async () => {
    // GIVEN
    mockElasticLoadBalancingV2Client
      .on(DescribeLoadBalancersCommand)
      .resolves({
        LoadBalancers: [
          {
            // This one has wrong type => no match
            LoadBalancerArn: 'arn:load-balancer-arn1',
            SecurityGroups: [],
            Type: 'application',
          },
        ],
      })
      .on(DescribeListenersCommand)
      .resolves({
        Listeners: [
          {
            ListenerArn: 'arn:listener-arn1',
            LoadBalancerArn: 'arn:load-balancer-arn1',
            Port: 443,
          },
        ],
      });
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
        loadBalancerType: LoadBalancerType.NETWORK,
        listenerArn: 'arn:listener-arn1',
      }),
    ).rejects.toThrow('No associated load balancer found for listener arn arn:listener-arn1');
    expect(mockElasticLoadBalancingV2Client).toHaveReceivedCommandWith(DescribeLoadBalancersCommand, {
      LoadBalancerArns: ['arn:load-balancer-arn1'],
    });
    expect(mockElasticLoadBalancingV2Client).toHaveReceivedCommandWith(DescribeListenersCommand, {
      ListenerArns: ['arn:listener-arn1'],
    });
  });
});
