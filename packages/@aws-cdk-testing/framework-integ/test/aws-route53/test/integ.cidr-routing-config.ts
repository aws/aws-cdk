import { App, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from 'constructs';
import * as route53 from "aws-cdk-lib/aws-route53";
import { IntegTest } from "@aws-cdk/integ-tests-alpha";

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const zone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: 'cdk.test'
    });

    const cidrCollection = new route53.CfnCidrCollection(this, 'CidrCollection', {
      name: 'test-collection',
      locations: [{
        cidrList: ['192.168.1.0/24'],
        locationName: 'test_location',
      }]
    });

    new route53.ARecord(this, 'CidrRoutingConfig', {
      zone: zone,
      target: route53.RecordTarget.fromIpAddresses('1.2.3.4'),
      setIdentifier: 'test',
      cidrRoutingConfig: route53.CidrRoutingConfig.new({
        collectionId: cidrCollection.attrId,
        locationName: 'test_location'
      }),
    });
  }  
}

const app = new App();
const stack = new TestStack(app, 'CidrRoutingConfig');

new IntegTest(app, 'CidrRoutingConfigInteg', {
  testCases: [stack],
});
app.synth();