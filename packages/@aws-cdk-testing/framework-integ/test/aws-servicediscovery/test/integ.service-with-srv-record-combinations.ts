import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as servicediscovery from 'aws-cdk-lib/aws-servicediscovery';

/**
 * This integration test verifies that AWS Cloud Map accepts the DNS record type
 * combinations that include SRV, and creates one DNS record per constituent type.
 */
class SrvRecordCombinationsStack extends cdk.Stack {
  public readonly aSrvService: servicediscovery.Service;
  public readonly aaaaSrvService: servicediscovery.Service;
  public readonly aAaaaSrvService: servicediscovery.Service;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The namespace only needs a VPC to be associated with, nothing in this stack
    // sends traffic, so skip the NAT gateways.
    const vpc = new ec2.Vpc(this, 'Vpc', {
      restrictDefaultSecurityGroup: false,
      maxAzs: 2,
      natGateways: 0,
    });

    const namespace = new servicediscovery.PrivateDnsNamespace(this, 'Namespace', {
      name: 'srv-combinations.local',
      vpc,
    });

    this.aSrvService = namespace.createService('ASrvService', {
      name: 'a-srv',
      dnsRecordType: servicediscovery.DnsRecordType.A_SRV,
      dnsTtl: cdk.Duration.seconds(30),
    });

    this.aaaaSrvService = namespace.createService('AaaaSrvService', {
      name: 'aaaa-srv',
      dnsRecordType: servicediscovery.DnsRecordType.AAAA_SRV,
      dnsTtl: cdk.Duration.seconds(30),
    });

    this.aAaaaSrvService = namespace.createService('AAaaaSrvService', {
      name: 'a-aaaa-srv',
      dnsRecordType: servicediscovery.DnsRecordType.A_AAAA_SRV,
      dnsTtl: cdk.Duration.seconds(30),
    });
  }
}

const app = new cdk.App({
  analyticsReporting: false,
});
const stack = new SrvRecordCombinationsStack(app, 'aws-servicediscovery-srv-record-combinations');

const test = new integ.IntegTest(app, 'ServiceWithSrvRecordCombinations', {
  testCases: [stack],
});

function expectDnsRecords(serviceId: string, recordTypes: string[]) {
  const call = test.assertions.awsApiCall('ServiceDiscovery', 'getService', { Id: serviceId });
  call.provider.addToRolePolicy({
    Effect: 'Allow',
    Action: ['servicediscovery:GetService'],
    Resource: ['*'],
  });
  call.expect(integ.ExpectedResult.objectLike({
    Service: integ.Match.objectLike({
      DnsConfig: integ.Match.objectLike({
        DnsRecords: recordTypes.map(type => integ.Match.objectLike({ Type: type, TTL: 30 })),
      }),
    }),
  }));
}

expectDnsRecords(stack.aSrvService.serviceId, ['A', 'SRV']);
expectDnsRecords(stack.aaaaSrvService.serviceId, ['AAAA', 'SRV']);
expectDnsRecords(stack.aAaaaSrvService.serviceId, ['A', 'AAAA', 'SRV']);
