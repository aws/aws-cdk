import * as cdk from '@aws-cdk/core';
import { AutoScalingGroup } from '../auto-scaling-group';
import { CfnLaunchConfiguration } from '../autoscaling.generated';

/**
 * Properties for `ImdsAspect`.
 */
interface ImdsAspectProps {
  /**
   * Whether IMDSv1 should be enabled or not.
   */
  readonly enableImdsV1: boolean;
}

/**
 * Base class for IMDS configuration Aspect.
 */
abstract class ImdsAspect implements cdk.IAspect {
  protected readonly enableImdsV1: boolean;

  constructor(props: ImdsAspectProps) {
    this.enableImdsV1 = props.enableImdsV1;
  }

  abstract visit(node: cdk.IConstruct): void;

  /**
   * Adds a warning annotation to a node.
   *
   * @param node The scope to add the warning to.
   * @param message The warning message.
   */
  protected warn(node: cdk.IConstruct, message: string) {
    cdk.Annotations.of(node).addWarning(`${ImdsAspect.name} failed on node ${node.node.id}: ${message}`);
  }
}

/**
 * Properties for `AutoScalingGroupImdsAspect`.
 */
export interface AutoScalingGroupImdsAspectProps extends ImdsAspectProps {}

/**
 * Aspect that applies IMDS configuration to AutoScalingGroups.
 */
export class AutoScalingGroupImdsAspect extends ImdsAspect {
  constructor(props: AutoScalingGroupImdsAspectProps) {
    super(props);
  }

  visit(node: cdk.IConstruct): void {
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
      httpTokens: this.enableImdsV1 ? 'optional' : 'required',
    };
  }
}
