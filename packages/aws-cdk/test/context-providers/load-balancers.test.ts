import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as aws from 'aws-sdk';
import * as AWS from 'aws-sdk-mock';
import { LoadBalancerListenerContextProviderPlugin, LoadBalancerContextProviderPlugin, tagsMatch, describeListenersByLoadBalancerArn, describeTags, describeLoadBalancers } from '../../lib/context-providers/load-balancers';
import { MockSdkProvider } from '../util/mock-sdk';

AWS.setSDK(require.resolve('aws-sdk'));

const mockSDK = new MockSdkProvider();

type AwsCallback<T> = (err: Error | null, val: T) => void;

afterEach(done => {
  AWS.restore();
  done();
});

describe('utilities', () => {
  test('describeTags yields tags by chunk', async () => {
    const resourceTags: Record<string, aws.ELBv2.TagDescription> = {};
    for (const resourceArn of [...Array(100)].map((_, i) => `arn:load-balancer-${i}`)) {
      resourceTags[resourceArn] = {
        ResourceArn: resourceArn,
        Tags: [
          { Key: 'name', Value: resourceArn },
        ],
      };
    };

    AWS.mock('ELBv2', 'describeTags', (_params: aws.ELBv2.DescribeTagsInput, cb: AwsCallback<aws.ELBv2.DescribeTagsOutput>) => {
      expect(_params.ResourceArns.length).toBeLessThanOrEqual(20);

      cb(null, {
        TagDescriptions: _params.ResourceArns.map(resourceArn => ({
          ResourceArn: resourceArn,
          Tags: [
            { Key: 'name', Value: resourceArn },
          ],
        })),
      });
    });

    const elbv2 = (await mockSDK.forEnvironment()).sdk.elbv2();

    const resourceTagsOut: Record<string, aws.ELBv2.TagDescription> = {};
    for await (const tagDescription of describeTags(elbv2, Object.keys(resourceTags))) {
      resourceTagsOut[tagDescription.ResourceArn!] = tagDescription;
    }

    expect(resourceTagsOut).toEqual(resourceTags);
  });

  test('describeListenersByLoadBalancerArn traverses pages', async () => {
    // arn:listener-0, arn:listener-1, ..., arn:listener-99
    const listenerArns = [...Array(100)].map((_, i) => `arn:listener-${i}`);
    expect(listenerArns[0]).toEqual('arn:listener-0');

    AWS.mock('ELBv2', 'describeListeners', (_params: aws.ELBv2.DescribeListenersInput, cb: AwsCallback<aws.ELBv2.DescribeListenersOutput>) => {
      const start = parseInt(_params.Marker ?? '0');
      const end = start + 10;
      const slice = listenerArns.slice(start, end);

      cb(null, {
        Listeners: slice.map(arn => ({
          ListenerArn: arn,
        })),
        NextMarker: end < listenerArns.length ? end.toString() : undefined,
      });
    });

    const elbv2 = (await mockSDK.forEnvironment()).sdk.elbv2();

    const listenerArnsFromPages = Array<string>();
    for await (const listener of describeListenersByLoadBalancerArn(elbv2, ['arn:load-balancer'])) {
      listenerArnsFromPages.push(listener.ListenerArn!);
    }

    expect(listenerArnsFromPages).toEqual(listenerArns);
  });

  test('describeLoadBalancers traverses pages', async () => {
    const loadBalancerArns = [...Array(100)].map((_, i) => `arn:load-balancer-${i}`);
    expect(loadBalancerArns[0]).toEqual('arn:load-balancer-0');

    AWS.mock('ELBv2', 'describeLoadBalancers', (_params: aws.ELBv2.DescribeLoadBalancersInput, cb: AwsCallback<aws.ELBv2.DescribeLoadBalancersOutput>) => {
      const start = parseInt(_params.Marker ?? '0');
      const end = start + 10;
      const slice = loadBalancerArns.slice(start, end);

      cb(null, {
        LoadBalancers: slice.map(loadBalancerArn => ({
          LoadBalancerArn: loadBalancerArn,
        })),
        NextMarker: end < loadBalancerArns.length ? end.toString() : undefined,
      });
    });

    const elbv2 = (await mockSDK.forEnvironment()).sdk.elbv2();
    const loadBalancerArnsFromPages = (await describeLoadBalancers(elbv2, {})).map(l => l.LoadBalancerArn!);

    expect(loadBalancerArnsFromPages).toEqual(loadBalancerArns);
  });

  describe('tagsMatch', () => {
    test('all tags match', () => {
      const tagDescription = {
        ResourceArn: 'arn:whatever',
        Tags: [{ Key: 'some', Value: 'tag' }],
      };

      const requiredTags = [
        { key: 'some', value: 'tag' },
      ];

      expect(tagsMatch(tagDescription, requiredTags)).toEqual(true);
    });

    test('extra tags match', () => {
      const tagDescription = {
        ResourceArn: 'arn:whatever',
        Tags: [
          { Key: 'some', Value: 'tag' },
          { Key: 'other', Value: 'tag2' },
        ],
      };

      const requiredTags = [
        { key: 'some', value: 'tag' },
      ];

      expect(tagsMatch(tagDescription, requiredTags)).toEqual(true);
    });

    test('no tags matches no tags', () => {
      const tagDescription = {
        ResourceArn: 'arn:whatever',
        Tags: [],
      };

      expect(tagsMatch(tagDescription, [])).toEqual(true);
    });

    test('one tag matches of several', () => {
      const tagDescription = {
        ResourceArn: 'arn:whatever',
        Tags: [{ Key: 'some', Value: 'tag' }],
      };

      const requiredTags = [
        { key: 'some', value: 'tag' },
        { key: 'other', value: 'value' },
      ];

      expect(tagsMatch(tagDescription, requiredTags)).toEqual(false);
    });

    test('undefined tag does not error', () => {
      const tagDescription = {
        ResourceArn: 'arn:whatever',
        Tags: [{ Key: 'some' }],
      };

      const requiredTags = [
        { key: 'some', value: 'tag' },
        { key: 'other', value: 'value' },
      ];

      expect(tagsMatch(tagDescription, requiredTags)).toEqual(false);
    });
  });
});

describe('load balancer context provider plugin', () => {
  test('errors when no matches are found', async () => {
    // GIVEN
    const provider = new LoadBalancerContextProviderPlugin(mockSDK);

    mockALBLookup({
      loadBalancers: [],
    });

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
        loadBalancerType: cxschema.LoadBalancerType.APPLICATION,
        loadBalancerArn: 'arn:load-balancer1',
      }),
    ).rejects.toThrow(/No load balancers found/i);
  });

  test('errors when multiple load balancers match', async () => {
    // GIVEN
    const provider = new LoadBalancerContextProviderPlugin(mockSDK);

    mockALBLookup({
      loadBalancers: [
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
      describeTagsExpected: { ResourceArns: ['arn:load-balancer1', 'arn:load-balancer2'] },
      tagDescriptions: [
        {
          ResourceArn: 'arn:load-balancer1',
          Tags: [
            { Key: 'some', Value: 'tag' },
          ],
        },
        {
          ResourceArn: 'arn:load-balancer2',
          Tags: [
            { Key: 'some', Value: 'tag' },
          ],
        },
      ],
    });

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
        loadBalancerType: cxschema.LoadBalancerType.APPLICATION,
        loadBalancerTags: [
          { key: 'some', value: 'tag' },
        ],
      }),
    ).rejects.toThrow(/Multiple load balancers found/i);
  });

  test('looks up by arn', async () => {
    // GIVEN
    const provider = new LoadBalancerContextProviderPlugin(mockSDK);

    mockALBLookup({
      describeLoadBalancersExpected: { LoadBalancerArns: ['arn:load-balancer1'] },
      loadBalancers: [
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

    // WHEN
    const result = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerType: cxschema.LoadBalancerType.APPLICATION,
      loadBalancerArn: 'arn:load-balancer1',
    });

    // THEN
    expect(result.ipAddressType).toEqual('ipv4');
    expect(result.loadBalancerArn).toEqual('arn:load-balancer1');
    expect(result.loadBalancerCanonicalHostedZoneId).toEqual('Z1234');
    expect(result.loadBalancerDnsName).toEqual('dns.example.com');
    expect(result.securityGroupIds).toEqual(['sg-1234']);
    expect(result.vpcId).toEqual('vpc-1234');
  });

  test('looks up by tags', async() => {
    // GIVEN
    const provider = new LoadBalancerContextProviderPlugin(mockSDK);

    mockALBLookup({
      loadBalancers: [
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
      describeTagsExpected: { ResourceArns: ['arn:load-balancer1', 'arn:load-balancer2'] },
      tagDescriptions: [
        {
          ResourceArn: 'arn:load-balancer1',
          Tags: [
            { Key: 'some', Value: 'tag' },
          ],
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

    // WHEN
    const result = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerType: cxschema.LoadBalancerType.APPLICATION,
      loadBalancerTags: [
        { key: 'some', value: 'tag' },
        { key: 'second', value: 'tag2' },
      ],
    });

    expect(result.loadBalancerArn).toEqual('arn:load-balancer2');
  });

  test('filters by type', async () => {
    // GIVEN
    const provider = new LoadBalancerContextProviderPlugin(mockSDK);

    mockALBLookup({
      loadBalancers: [
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

      tagDescriptions: [
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

    // WHEN
    const loadBalancer = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerTags: [{ key: 'some', value: 'tag' }],
      loadBalancerType: cxschema.LoadBalancerType.APPLICATION,
    });

    expect(loadBalancer.loadBalancerArn).toEqual('arn:load-balancer2');
  });
});

describe('load balancer listener context provider plugin', () => {
  test('errors when no associated load balancers match', async () => {
    // GIVEN
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    mockALBLookup({
      loadBalancers: [],
    });

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
        loadBalancerType: cxschema.LoadBalancerType.APPLICATION,
        loadBalancerTags: [{ key: 'some', value: 'tag' }],
      }),
    ).rejects.toThrow(/No associated load balancers found/i);
  });

  test('errors when no listeners match', async () => {
    // GIVEN
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    mockALBLookup({
      loadBalancers: [
        {
          LoadBalancerArn: 'arn:load-balancer',
          Type: 'application',
        },
      ],
      listeners: [
        {
          LoadBalancerArn: 'arn:load-balancer',
          ListenerArn: 'arn:listener',
          Port: 80,
          Protocol: 'HTTP',
        },
      ],
    });

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
        loadBalancerType: cxschema.LoadBalancerType.APPLICATION,
        loadBalancerArn: 'arn:load-balancer',
        listenerPort: 443,
        listenerProtocol: cxschema.LoadBalancerListenerProtocol.HTTPS,
      }),
    ).rejects.toThrow(/No load balancer listeners found/i);
  });

  test('errors when multiple listeners match', async () => {
    // GIVEN
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    mockALBLookup({
      loadBalancers: [
        {
          LoadBalancerArn: 'arn:load-balancer',
          Type: 'application',
        },
        {
          LoadBalancerArn: 'arn:load-balancer2',
          Type: 'application',
        },
      ],
      tagDescriptions: [
        {
          ResourceArn: 'arn:load-balancer',
          Tags: [{ Key: 'some', Value: 'tag' }],
        },
        {
          ResourceArn: 'arn:load-balancer2',
          Tags: [{ Key: 'some', Value: 'tag' }],
        },
      ],
      listeners: [
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

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
        loadBalancerType: cxschema.LoadBalancerType.APPLICATION,
        loadBalancerTags: [{ key: 'some', value: 'tag' }],
        listenerPort: 80,
        listenerProtocol: cxschema.LoadBalancerListenerProtocol.HTTP,
      }),
    ).rejects.toThrow(/Multiple load balancer listeners/i);
  });

  test('looks up by listener arn', async () => {
    // GIVEN
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    mockALBLookup({
      describeListenersExpected: { ListenerArns: ['arn:listener-arn'] },
      listeners: [
        {
          ListenerArn: 'arn:listener-arn',
          LoadBalancerArn: 'arn:load-balancer-arn',
          Port: 999,
        },
      ],
      describeLoadBalancersExpected: { LoadBalancerArns: ['arn:load-balancer-arn'] },
      loadBalancers: [
        {
          LoadBalancerArn: 'arn:load-balancer-arn',
          SecurityGroups: ['sg-1234', 'sg-2345'],
          Type: 'application',
        },
      ],
    });

    // WHEN
    const listener = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerType: cxschema.LoadBalancerType.APPLICATION,
      listenerArn: 'arn:listener-arn',
    });

    // THEN
    expect(listener.listenerArn).toEqual('arn:listener-arn');
    expect(listener.listenerPort).toEqual(999);
    expect(listener.securityGroupIds).toEqual(['sg-1234', 'sg-2345']);
  });

  test('looks up by associated load balancer arn', async () => {
    // GIVEN
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    mockALBLookup({
      describeLoadBalancersExpected: { LoadBalancerArns: ['arn:load-balancer-arn1'] },
      loadBalancers: [
        {
          LoadBalancerArn: 'arn:load-balancer-arn1',
          SecurityGroups: ['sg-1234'],
          Type: 'application',
        },
      ],

      describeListenersExpected: { LoadBalancerArn: 'arn:load-balancer-arn1' },
      listeners: [
        {
          // This one
          ListenerArn: 'arn:listener-arn1',
          LoadBalancerArn: 'arn:load-balancer-arn1',
          Port: 80,
        },
      ],
    });

    // WHEN
    const listener = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerType: cxschema.LoadBalancerType.APPLICATION,
      loadBalancerArn: 'arn:load-balancer-arn1',
    });

    // THEN
    expect(listener.listenerArn).toEqual('arn:listener-arn1');
    expect(listener.listenerPort).toEqual(80);
    expect(listener.securityGroupIds).toEqual(['sg-1234']);
  });

  test('looks up by associated load balancer tags', async () => {
    // GIVEN
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    mockALBLookup({
      describeLoadBalancersExpected: { LoadBalancerArns: undefined },
      loadBalancers: [
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

      describeTagsExpected: { ResourceArns: ['arn:load-balancer-arn1', 'arn:load-balancer-arn2'] },
      tagDescriptions: [
        {
          ResourceArn: 'arn:load-balancer-arn1',
          Tags: [],
        },
        {
          // Expecting this one
          ResourceArn: 'arn:load-balancer-arn2',
          Tags: [
            { Key: 'some', Value: 'tag' },
          ],
        },
      ],

      describeListenersExpected: { LoadBalancerArn: 'arn:load-balancer-arn2' },
      listeners: [
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
    });

    // WHEN
    const listener = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerType: cxschema.LoadBalancerType.APPLICATION,
      loadBalancerTags: [
        { key: 'some', value: 'tag' },
      ],
      listenerPort: 999,
    });

    // THEN
    expect(listener.listenerArn).toEqual('arn:listener-arn2');
    expect(listener.listenerPort).toEqual(999);
    expect(listener.securityGroupIds).toEqual(['sg-3456', 'sg-4567']);
  });

  test('looks up by listener port and proto', async () => {
    // GIVEN
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    AWS.mock('ELBv2', 'describeLoadBalancers', (_params: aws.ELBv2.DescribeLoadBalancersInput, cb: AwsCallback<aws.ELBv2.DescribeLoadBalancersOutput>) => {
      expect(_params).toEqual({});
      cb(null, {
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
      });
    });

    AWS.mock('ELBv2', 'describeTags', (_params: aws.ELBv2.DescribeTagsInput, cb: AwsCallback<aws.ELBv2.DescribeTagsOutput>) => {
      cb(null, {
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
    });

    AWS.mock('ELBv2', 'describeListeners', (params: aws.ELBv2.DescribeListenersInput, cb: AwsCallback<aws.ELBv2.DescribeListenersOutput>) => {
      if (params.LoadBalancerArn === 'arn:load-balancer1') {
        cb(null, {
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
        });
      } else if (params.LoadBalancerArn === 'arn:load-balancer2') {
        cb(null, {
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
      } else {
        cb(new Error(`Unexpected request: ${JSON.stringify(params)}'`), {});
      }
    });

    // WHEN
    const listener = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerType: cxschema.LoadBalancerType.APPLICATION,
      loadBalancerTags: [{ key: 'some', value: 'tag' }],
      listenerProtocol: cxschema.LoadBalancerListenerProtocol.TCP,
      listenerPort: 443,
    });

    // THEN
    expect(listener.listenerArn).toEqual('arn:listener-arn6');
    expect(listener.listenerPort).toEqual(443);
    expect(listener.securityGroupIds).toEqual(['sg-2345']);
  });

  test('filters by associated load balancer type', async () => {
    // GIVEN
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    mockALBLookup({
      describeLoadBalancersExpected: { LoadBalancerArns: undefined },
      loadBalancers: [
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

      tagDescriptions: [
        {
          ResourceArn: 'arn:load-balancer-arn1',
          Tags: [{ Key: 'some', Value: 'tag' }],
        },
        {
          ResourceArn: 'arn:load-balancer-arn2',
          Tags: [{ Key: 'some', Value: 'tag' }],
        },
      ],

      describeListenersExpected: { LoadBalancerArn: 'arn:load-balancer-arn2' },
      listeners: [
        {
          ListenerArn: 'arn:listener-arn2',
          LoadBalancerArn: 'arn:load-balancer-arn2',
          Port: 443,
        },
      ],
    });

    // WHEN
    const listener = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      loadBalancerType: cxschema.LoadBalancerType.NETWORK,
      loadBalancerTags: [{ key: 'some', value: 'tag' }],
      listenerPort: 443,
    });

    // THEN
    expect(listener.listenerArn).toEqual('arn:listener-arn2');
    expect(listener.listenerPort).toEqual(443);
  });

  test('errors when associated load balancer is wrong type', async () => {
    // GIVEN
    const provider = new LoadBalancerListenerContextProviderPlugin(mockSDK);

    mockALBLookup({
      describeListenersExpected: { ListenerArns: ['arn:listener-arn1'] },
      listeners: [
        {
          ListenerArn: 'arn:listener-arn1',
          LoadBalancerArn: 'arn:load-balancer-arn1',
          Port: 443,
        },
      ],

      describeLoadBalancersExpected: { LoadBalancerArns: ['arn:load-balancer-arn1'] },
      loadBalancers: [
        {
          // This one has wrong type => no match
          LoadBalancerArn: 'arn:load-balancer-arn1',
          SecurityGroups: [],
          Type: 'application',
        },
      ],
    });

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
        loadBalancerType: cxschema.LoadBalancerType.NETWORK,
        listenerArn: 'arn:listener-arn1',
      }),
    ).rejects.toThrow(/no associated load balancer found/i);
  });
});

interface ALBLookupOptions {
  describeLoadBalancersExpected?: any;
  loadBalancers?: aws.ELBv2.LoadBalancers;
  describeTagsExpected?: any;
  tagDescriptions?: aws.ELBv2.TagDescriptions;
  describeListenersExpected?: any;
  listeners?: aws.ELBv2.Listeners;
}

function mockALBLookup(options: ALBLookupOptions) {
  AWS.mock('ELBv2', 'describeLoadBalancers', (_params: aws.ELBv2.DescribeLoadBalancersInput, cb: AwsCallback<aws.ELBv2.DescribeLoadBalancersOutput>) => {
    if (options.describeLoadBalancersExpected !== undefined) {
      expect(_params).toEqual(options.describeLoadBalancersExpected);
    }
    cb(null, { LoadBalancers: options.loadBalancers });
  });

  AWS.mock('ELBv2', 'describeTags', (_params: aws.ELBv2.DescribeTagsInput, cb: AwsCallback<aws.ELBv2.DescribeTagsOutput>) => {
    if (options.describeTagsExpected !== undefined) {
      expect(_params).toEqual(options.describeTagsExpected);
    }
    cb(null, { TagDescriptions: options.tagDescriptions });
  });

  AWS.mock('ELBv2', 'describeListeners', (_params: aws.ELBv2.DescribeListenersInput, cb: AwsCallback<aws.ELBv2.DescribeListenersOutput>) => {
    if (options.describeListenersExpected !== undefined) {
      expect(_params).toEqual(options.describeListenersExpected);
    }
    cb(null, { Listeners: options.listeners });
  });
}
