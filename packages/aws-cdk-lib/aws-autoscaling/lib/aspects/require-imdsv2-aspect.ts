import { IConstruct } from 'constructs';
import * as cdk from '../../../core';
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

    const launchConfig = node.node.tryFindChild('LaunchConfig') as CfnLaunchConfiguration;
    if (cdk.isResolvableObject(launchConfig.metadataOptions)) {
      this.warn(node, 'CfnLaunchConfiguration.MetadataOptions field is a CDK token.');
      return;
    }

    launchConfig.metadataOptions = {
      ...launchConfig.metadataOptions,
      httpTokens: 'required',
    };
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
