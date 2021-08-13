import * as cdk from '@aws-cdk/core';
import { CfnLaunchTemplate } from '../ec2.generated';
import { Instance } from '../instance';
import { LaunchTemplate } from '../launch-template';

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
 * Properties for `InstanceImdsAspect`.
 */
export interface InstanceImdsAspectProps extends ImdsAspectProps {
  /**
   * Whether warnings that would be raised when an Instance is associated with an existing Launch Template
   * should be suppressed or not.
   *
   * You can set this to `true` if `LaunchTemplateImdsAspect` is being used alongside this Aspect to
   * suppress false-positive warnings because any Launch Templates associated with Instances will still be covered.
   * @default false
   */
  readonly suppressLaunchTemplateWarning?: boolean;
}

/**
 * Aspect that applies IMDS configuration on EC2 Instance constructs.
 *
 * This aspect configures IMDS on an EC2 instance by creating a Launch Template with the
 * IMDS configuration and associating that Launch Template with the instance. If an Instance
 * is already associated with a Launch Template, a warning will (optionally) be added to the
 * construct node and it will be skipped.
 *
 * To cover Instances already associated with Launch Templates, use `LaunchTemplateImdsAspect`.
 */
export class InstanceImdsAspect extends ImdsAspect {
  private readonly suppressLaunchTemplateWarning: boolean;

  constructor(props: InstanceImdsAspectProps) {
    super(props);
    this.suppressLaunchTemplateWarning = props.suppressLaunchTemplateWarning ?? false;
  }

  visit(node: cdk.IConstruct): void {
    /* istanbul ignore next */
    if (!(node instanceof Instance)) {
      return;
    }
    if (node.instance.launchTemplate !== undefined) {
      this.warn(node, 'Cannot toggle IMDSv1 because this Instance is associated with an existing Launch Template.');
      return;
    }

    const name = `${node.node.id}LaunchTemplate`;
    const launchTemplate = new CfnLaunchTemplate(node, 'LaunchTemplate', {
      launchTemplateData: {
        metadataOptions: {
          httpTokens: this.enableImdsV1 ? 'optional' : 'required',
        },
      },
      launchTemplateName: name,
    });
    node.instance.launchTemplate = {
      launchTemplateName: name,
      version: launchTemplate.getAtt('LatestVersionNumber').toString(),
    };
  }

  protected warn(node: cdk.IConstruct, message: string) {
    if (this.suppressLaunchTemplateWarning !== true) {
      super.warn(node, message);
    }
  }
}

/**
 * Properties for `LaunchTemplateImdsAspect`.
 */
export interface LaunchTemplateImdsAspectProps extends ImdsAspectProps {}

/**
 * Aspect that applies IMDS configuration on EC2 Launch Template constructs.
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-metadataoptions.html
 */
export class LaunchTemplateImdsAspect extends ImdsAspect {
  constructor(props: LaunchTemplateImdsAspectProps) {
    super(props);
  }

  visit(node: cdk.IConstruct): void {
    /* istanbul ignore next */
    if (!(node instanceof LaunchTemplate)) {
      return;
    }

    const launchTemplate = node.node.tryFindChild('Resource') as CfnLaunchTemplate;
    if (launchTemplate === undefined || !(launchTemplate instanceof CfnLaunchTemplate)) {
      this.warn(node, 'CfnLaunchTemplate cannot be found because the LaunchTemplate construct implementation has changed.');
      return;
    }

    const data = launchTemplate.launchTemplateData;
    if (data !== undefined && implementsIResolvable(data)) {
      this.warn(node, 'LaunchTemplateData is a CDK token.');
      return;
    }

    const metadataOptions = (data as CfnLaunchTemplate.LaunchTemplateDataProperty).metadataOptions;
    if (metadataOptions !== undefined && implementsIResolvable(metadataOptions)) {
      this.warn(node, 'LaunchTemplateData.MetadataOptions is a CDK token.');
      return;
    }

    const newData: CfnLaunchTemplate.LaunchTemplateDataProperty = {
      ...data,
      metadataOptions: {
        ...metadataOptions,
        httpTokens: this.enableImdsV1 ? 'optional' : 'required',
      },
    };
    launchTemplate.launchTemplateData = newData;
  }
}

function implementsIResolvable(obj: any): boolean {
  return 'resolve' in obj && typeof(obj.resolve) === 'function' &&
         'creationStack' in obj && Array.isArray(obj.creationStack) &&
         'toString' in obj && typeof(obj.toString) === 'function';
}
