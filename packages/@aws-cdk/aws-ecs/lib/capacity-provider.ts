import * as cdk from '@aws-cdk/core';
// import { CfnTaskDefinition } from './ecs.generated';
import { IAutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import * as cr from '@aws-cdk/custom-resources';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';

export interface ICapacityProvider {
  readonly capacityProviderName: string;
}

export interface CapacityProviderProps {
  readonly autoscalingGroup: IAutoScalingGroup;
  readonly name?: string;
}


export class CapacityProvider extends cdk.Resource implements ICapacityProvider {
  public readonly capacityProviderName: string;
  constructor(scope: cdk.Construct, id: string, props: CapacityProviderProps) {
    super(scope, id)
    
  const onEvent = new lambda.Function(this, 'InstanceProtectionHandler',  {
    runtime: lambda.Runtime.PYTHON_3_7,
    handler: 'index.on_event',
    timeout: cdk.Duration.seconds(60),
    environment: {
      autoscaling_group_name: props.autoscalingGroup.autoScalingGroupName,
    },
    code:lambda.Code.fromAsset(path.join(__dirname, './instance-protection-handler'))
  })
  
  onEvent.addToRolePolicy(new iam.PolicyStatement({
    actions: [ 
      'autoscaling:UpdateAutoScalingGroup',
      'autoscaling:SetInstanceProtection',
      ],
    resources: [ props.autoscalingGroup.autoScalingGroupArn ]
  }))
  
  onEvent.addToRolePolicy(new iam.PolicyStatement({
    actions: [ 
      'autoscaling:DescribeAutoScalingGroups',
      ],
    resources: [ '*' ]
  }))
  
  
  const instanceProtectionProvider = new cr.Provider(this, 'InstanceProtectionProvider', {
    onEventHandler: onEvent,
  })
  
  const instanceProtection= new cdk.CustomResource(this, 'EnforcedInstanceProtection', { serviceToken: instanceProtectionProvider.serviceToken });
  
  const asgUuidArn = instanceProtection.getAtt('AutoScalingGroupARN').toString();

  const resource = new cdk.CfnResource(this, 'Resource', {
    type: 'AWS::ECS::CapacityProvider',
    properties: {
      AutoScalingGroupProvider: {
        AutoScalingGroupArn : asgUuidArn,
        ManagedScaling: {
          MaximumScalingStepSize : 1,
          MinimumScalingStepSize : 1,
          Status : 'ENABLED',
          TargetCapacity : 2,
        },
        ManagedTerminationProtection: 'ENABLED',
      },
      Name: props.name
    }
  })
  resource.node.addDependency(instanceProtection)
  this.capacityProviderName = resource.ref
  
  }
}
