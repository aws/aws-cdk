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

  /**
   * Whether warning annotations from this Aspect should be suppressed or not.
   * @default false
   */
  readonly suppressWarnings?: boolean;
}

/**
 * Base class for IMDS configuration Aspect.
 */
abstract class ImdsAspect implements cdk.IAspect {
  protected readonly enableImdsV1: boolean;
  protected readonly suppressWarnings: boolean;

  constructor(props: ImdsAspectProps) {
    this.enableImdsV1 = props.enableImdsV1;
    this.suppressWarnings = props.suppressWarnings ?? false;
  }

  abstract visit(node: cdk.IConstruct): void;

  /**
   * Adds a warning annotation to a node, unless `suppressWarnings` is true.
   * @param node The scope to add the warning to.
   * @param message The warning message.
   */
  protected warn(node: cdk.IConstruct, message: string) {
    if (this.suppressWarnings !== true) {
      cdk.Annotations.of(node).addWarning(`${ImdsAspect.name} failed on node ${node.node.id}: ${message}`);
    }
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
    /* istanbul ignore next */
    if (node === undefined || !(node instanceof AutoScalingGroup)) {
      return;
    }

    const launchConfig = node.node.tryFindChild('LaunchConfig') as CfnLaunchConfiguration;
    if (launchConfig.metadataOptions !== undefined && implementsIResolvable(launchConfig.metadataOptions)) {
      this.warn(node, 'CfnLaunchConfiguration.MetadataOptions field is a CDK token.');
      return;
    }

    launchConfig.metadataOptions = {
      ...launchConfig.metadataOptions,
      httpTokens: this.enableImdsV1 ? 'optional' : 'required',
    };
  }
}

function implementsIResolvable(obj: any): boolean {
  return 'resolve' in obj && typeof(obj.resolve) === 'function' &&
         'creationStack' in obj && Array.isArray(obj.creationStack) &&
         'toString' in obj && typeof(obj.toString) === 'function';
}
