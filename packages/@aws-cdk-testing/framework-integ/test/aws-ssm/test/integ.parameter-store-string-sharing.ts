import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import {
  aws_ssm as ssm,
  aws_ram as ram,
  StackProps,
} from 'aws-cdk-lib';

/**
 * This integration test requires two accounts with an AWS SSM Parameter created from the producing account,
 * sharing with the consuming account, which would accept the sharing invitation and consume the shared parameter
 * in its consuming stack.
 *
 * To test it locally:
 *
 * $ export CDK_INTEG_ACCOUNT=<AWS_ACCOUNT_PRODUCING>
 * $ export CDK_INTEG_CROSS_ACCOUNT=<AWS_ACCOUNT_CONSUMING>
 *
 * And run:
 *
 * $ yarn integ test/aws-ssm/test/integ.parameter-store-string-sharing.js --update-on-failed
 *
 * The `producing` stack would be created from the sharing account in `us-east-1` followed by the `accepting` and `consuming` stacks
 * being created from the comsuming account in the same region.
 *
 * `stackUpdateWorkflow` has to be disabled as the accepting stack can not re-accept the sharing invite.
 *
 */

export interface ProducingStackProps extends StackProps {
  readonly sharingToAccount: string;
  readonly parameterName: string;
}

class ProducingStack extends cdk.Stack {
  readonly resourceShareArn: string;
  readonly parameterArn: string;
  constructor(scope: cdk.App, id: string, props: ProducingStackProps) {
    super(scope, id, props);

    const publicParameter = new ssm.StringParameter(this, 'String', {
      parameterName,
      stringValue: 'Abc123',
      tier: ssm.ParameterTier.ADVANCED,
    });

    this.parameterArn = publicParameter.parameterArn;

    // create resource share
    const share = new ram.CfnResourceShare(this, 'ParamShare', {
      name: 'ParamShare',
      allowExternalPrincipals: true,
      principals: [props.sharingToAccount],
      resourceArns: [this.parameterArn],
      permissionArns: [
        'arn:aws:ram::aws:permission/AWSRAMDefaultPermissionSSMParameterReadOnly',
      ],
    });

    this.resourceShareArn = share.attrArn;
    new cdk.CfnOutput(this, 'ResourceShareArn', { value: this.resourceShareArn });
    new cdk.CfnOutput(this, 'ParameterArn', { value: this.parameterArn });

    share.node.addDependency(publicParameter);
  }
}
class AcceptingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: StackProps) {
    super(scope, id, props);

    const apicallResource = new integ.AwsApiCall(this, 'GetResourceShareInvitations', {
      service: 'RAM',
      api: 'getResourceShareInvitations',
      outputPaths: ['resourceShareInvitations.0'],
    });

    const resourceShareInvitationArn = apicallResource.getAttString('resourceShareInvitations.0.resourceShareInvitationArn');
    new cdk.CfnOutput(this, 'resourceShareInvitationArnOutput', {
      value: resourceShareInvitationArn,
    });

    // accept the invitation
    new integ.AwsApiCall(this, 'AcceptResourceShareInvitation', {
      service: 'RAM',
      api: 'acceptResourceShareInvitation',
      parameters: {
        resourceShareInvitationArn,
      },
    });
  }
}

export interface ConsumingStackProps extends StackProps {
  readonly parameterArn: string;
}

class ConsumingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: ConsumingStackProps) {
    super(scope, id, props);

    // now we should be allowed to get the remote parameter
    const remoteParam = ssm.StringParameter.fromStringParameterArn(this, 'RemoteParam', props.parameterArn);

    // should Output `Abc123`
    new cdk.CfnOutput(this, 'RemoteParameterValueOutput', { value: remoteParam.stringValue });
  }
}

const app = new cdk.App();

const account = process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT || '123456789012'; // The account sharing the parameter.
const crossAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || '234567890123'; // The account that comsumes the parameter.
const parameterName = '/My/Public/Parameter';

const producing = new ProducingStack(app, 'integ-ssmps-sharing-producing', {
  env: { account: account, region: 'us-east-1' },
  sharingToAccount: crossAccount,
  parameterName,
});

const accepting = new AcceptingStack(app, 'integ-ssmps-sharing-accepting', {
  env: { account: crossAccount, region: 'us-east-1' },
});

const consuming = new ConsumingStack(app, 'integ-ssmps-sharing-consuming', {
  env: { account: crossAccount, region: 'us-east-1' },
  parameterArn: `arn:aws:ssm:us-east-1:${account}:parameter${parameterName}`,
});

accepting.addDependency(producing);
consuming.addDependency(accepting);

new integ.IntegTest(app, 'SSMParameterStoreSharingTest', {
  // this would first deploy `producing` then `accepting` and finally `consuming`
  testCases: [consuming],
  // skip the update workflow to avoid re-accepting the invitation error
  stackUpdateWorkflow: false,
});
