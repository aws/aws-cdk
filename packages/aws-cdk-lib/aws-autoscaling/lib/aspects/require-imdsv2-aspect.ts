import { IConstruct } from 'constructs';
import { CfnLaunchTemplate, LaunchTemplate } from '../../../aws-ec2';
import * as cdk from '../../../core';
import { AUTOSCALING_GENERATE_LAUNCH_TEMPLATE } from '../../../cx-api';
import { AutoScalingGroup } from '../auto-scaling-group';
import { CfnLaunchConfiguration } from '../autoscaling.generated';

/**
 * Aspect that makes IMDSv2 required on instances deployed by AutoScalingGroups.
 */
export class AutoScalingGroupRequireImdsv2Aspect implements cdk.IAspect {
  constructor() {
  }

  public visit(node: IConstruct): void {
    if (!(node instanceof AutoScalingGroup)) {
      return;
    }

    if (!cdk.FeatureFlags.of(node).isEnabled(AUTOSCALING_GENERATE_LAUNCH_TEMPLATE)) {
      const launchConfig = node.node.tryFindChild('LaunchConfig') as CfnLaunchConfiguration;
      if (cdk.isResolvableObject(launchConfig.metadataOptions)) {
        this.warn(node, 'CfnLaunchConfiguration.MetadataOptions field is a CDK token.');
        return;
      }

      launchConfig.metadataOptions = {
        ...launchConfig.metadataOptions,
        httpTokens: 'required',
      };
    } else {
      const launchTemplate = node.node.tryFindChild('LaunchTemplate') as LaunchTemplate;
      const cfnLaunchTemplate = launchTemplate.node.tryFindChild('Resource') as CfnLaunchTemplate;
      const data = cfnLaunchTemplate.launchTemplateData;
      if (cdk.isResolvableObject(data)) {
        this.warn(node, 'CfnLaunchTemplate.LaunchTemplateData field is a CDK token.');
        return;
      }

      const metadataOptions = (data as CfnLaunchTemplate.LaunchTemplateDataProperty).metadataOptions;
      if (cdk.isResolvableObject(metadataOptions)) {
        this.warn(node, 'CfnLaunchTemplate.LaunchTemplateData.MetadataOptions field is a CDK token.');
        return;
      }

      const newData: CfnLaunchTemplate.LaunchTemplateDataProperty = {
        ...data,
        metadataOptions: {
          ...metadataOptions,
          httpTokens: 'required',
        },
      };
      cfnLaunchTemplate.launchTemplateData = newData;
    }
  }

  /**
   * Adds a warning annotation to a node.
   *
   * @param node The scope to add the warning to.
   * @param message The warning message.
   */
  protected warn(node: IConstruct, message: string) {
    cdk.Annotations.of(node).addWarningV2(`@aws-cdk/aws-autoscaling:imdsv2${AutoScalingGroupRequireImdsv2Aspect.name}`, `${AutoScalingGroupRequireImdsv2Aspect.name} failed on node ${node.node.id}: ${message}`);
  }
}
