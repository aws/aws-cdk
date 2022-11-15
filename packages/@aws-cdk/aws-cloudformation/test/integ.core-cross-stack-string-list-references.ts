import * as ec2 from '@aws-cdk/aws-ec2';
import * as ssm from '@aws-cdk/aws-ssm';
import { App, CfnParameter, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';

// GIVEN
const app = new App({
  treeMetadata: false,
});

class ProducerStack extends Stack {
  public stringListGetAtt: string[];
  public stringListRef: CfnParameter;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'vpc');
    this.stringListGetAtt = new ec2.InterfaceVpcEndpoint(this, 'endpoint', {
      vpc,
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
    }).vpcEndpointDnsEntries;

    this.stringListRef = new CfnParameter(this, 'stringListParam', {
      default: 'BLAT,BLAH',
      type: 'List<String>',
    });
  }
}

export interface consumerDeployProps extends StackProps {
  stringListGetAtt: string[],
  stringListRef: CfnParameter,
}

class ConsumerStack extends Stack {
  constructor(scope: Construct, id: string, props: consumerDeployProps) {
    super(scope, id, props);

    new ssm.StringListParameter(this, 'GetAtt', {
      stringListValue: props.stringListGetAtt,
    });

    new ssm.StringListParameter(this, 'Ref', {
      stringListValue: props.stringListRef.valueAsList,
    });
  }
}

const producer = new ProducerStack(app, 'producer');
const consumer = new ConsumerStack(app, 'consumer', {
  stringListGetAtt: producer.stringListGetAtt,
  stringListRef: producer.stringListRef,
});

// THEN
new IntegTest(app, 'cross-region-references', {
  testCases: [producer, consumer],
  stackUpdateWorkflow: false,
});
