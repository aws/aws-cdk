import * as ssm from 'aws-cdk-lib/aws-ssm';
import { App, CfnParameter, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { InterfaceVpcEndpoint, InterfaceVpcEndpointAwsService, Vpc } from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

// GIVEN
const app = new App({
  treeMetadata: false,
});

class ProducerStack extends Stack {
  public stringListGetAtt: string[];
  public stringListRef: CfnParameter;
  public manualExport: string[];

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    const vpc = new Vpc(this, 'vpc');
    this.stringListGetAtt = new InterfaceVpcEndpoint(this, 'endpoint', {
      vpc,
      service: InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
    }).vpcEndpointDnsEntries;

    this.stringListRef = new CfnParameter(this, 'stringListParam', {
      default: 'BLAT,BLAH',
      type: 'List<String>',
    });

    this.manualExport = this.exportStringListValue(['string1', 'string2'], {
      name: 'ManualExport',
    });
  }
}

export interface consumerDeployProps extends StackProps {
  stringListGetAtt: string[];
  stringListRef: CfnParameter;
  manualStringList: string[];
}

class ConsumerStack extends Stack {
  constructor(scope: Construct, id: string, props: consumerDeployProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    new ssm.StringListParameter(this, 'GetAtt', {
      stringListValue: props.stringListGetAtt,
    });

    new ssm.StringListParameter(this, 'Ref', {
      stringListValue: props.stringListRef.valueAsList,
    });

    new ssm.StringListParameter(this, 'Manual', {
      stringListValue: props.manualStringList,
    });
  }
}

const producer = new ProducerStack(app, 'producer');
const consumer = new ConsumerStack(app, 'consumer', {
  stringListGetAtt: producer.stringListGetAtt,
  stringListRef: producer.stringListRef,
  manualStringList: producer.manualExport,
});

// THEN
new IntegTest(app, 'cross-region-references', {
  testCases: [producer, consumer],
  stackUpdateWorkflow: false,
});
