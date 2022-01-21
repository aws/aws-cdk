import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { IConstruct } from 'constructs';
import { CfnLaunchTemplate } from '../ec2.generated';
import { Instance } from '../instance';
import { LaunchTemplate } from '../launch-template';

/**
 * Properties for `RequireImdsv2Aspect`.
 */
interface RequireImdsv2AspectProps {
  /**
   * Whether warning annotations from this Aspect should be suppressed or not.
   *
   * @default - false
   */
  readonly suppressWarnings?: boolean;
}

/**
 * Base class for Aspect that makes IMDSv2 required.
 */
abstract class RequireImdsv2Aspect implements cdk.IAspect {
  protected readonly suppressWarnings: boolean;

  constructor(props?: RequireImdsv2AspectProps) {
    this.suppressWarnings = props?.suppressWarnings ?? false;
  }

  abstract visit(node: IConstruct): void;

  /**
   * Adds a warning annotation to a node, unless `suppressWarnings` is true.
   *
   * @param node The scope to add the warning to.
   * @param message The warning message.
   */
  protected warn(node: IConstruct, message: string) {
    if (this.suppressWarnings !== true) {
      cdk.Annotations.of(node).addWarning(`${RequireImdsv2Aspect.name} failed on node ${node.node.id}: ${message}`);
    }
  }
}

/**
 * Properties for `InstanceRequireImdsv2Aspect`.
 */
export interface InstanceRequireImdsv2AspectProps extends RequireImdsv2AspectProps {
  /**
   * Whether warnings that would be raised when an Instance is associated with an existing Launch Template
   * should be suppressed or not.
   *
   * You can set this to `true` if `LaunchTemplateImdsAspect` is being used alongside this Aspect to
   * suppress false-positive warnings because any Launch Templates associated with Instances will still be covered.
   *
   * @default - false
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
export class InstanceRequireImdsv2Aspect extends RequireImdsv2Aspect {
  private readonly suppressLaunchTemplateWarning: boolean;

  constructor(props?: InstanceRequireImdsv2AspectProps) {
    super(props);
    this.suppressLaunchTemplateWarning = props?.suppressLaunchTemplateWarning ?? false;
  }

  visit(node: IConstruct): void {
    if (!(node instanceof Instance)) {
      return;
    }
    if (node.instance.launchTemplate !== undefined) {
      this.warn(node, 'Cannot toggle IMDSv1 because this Instance is associated with an existing Launch Template.');
      return;
    }

    const launchTemplate = new CfnLaunchTemplate(node, 'LaunchTemplate', {
      launchTemplateData: {
        metadataOptions: {
          httpTokens: 'required',
        },
      },
    });
    if (cdk.FeatureFlags.of(node).isEnabled(cxapi.EC2_UNIQUE_IMDSV2_LAUNCH_TEMPLATE_NAME)) {
      launchTemplate.launchTemplateName = cdk.Names.uniqueId(launchTemplate);
    } else {
      launchTemplate.launchTemplateName = `${node.node.id}LaunchTemplate`;
    }
    node.instance.launchTemplate = {
      launchTemplateName: launchTemplate.launchTemplateName,
      version: launchTemplate.getAtt('LatestVersionNumber').toString(),
    };
  }

  protected warn(node: IConstruct, message: string) {
    if (this.suppressLaunchTemplateWarning !== true) {
      super.warn(node, message);
    }
  }
}

/**
 * Properties for `LaunchTemplateRequireImdsv2Aspect`.
 */
export interface LaunchTemplateRequireImdsv2AspectProps extends RequireImdsv2AspectProps {}

/**
 * Aspect that applies IMDS configuration on EC2 Launch Template constructs.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-metadataoptions.html
 */
export class LaunchTemplateRequireImdsv2Aspect extends RequireImdsv2Aspect {
  constructor(props?: LaunchTemplateRequireImdsv2AspectProps) {
    super(props);
  }

  visit(node: IConstruct): void {
    if (!(node instanceof LaunchTemplate)) {
      return;
    }

    const launchTemplate = node.node.tryFindChild('Resource') as CfnLaunchTemplate;
    const data = launchTemplate.launchTemplateData;
    if (cdk.isResolvableObject(data)) {
      this.warn(node, 'LaunchTemplateData is a CDK token.');
      return;
    }

    const metadataOptions = (data as CfnLaunchTemplate.LaunchTemplateDataProperty).metadataOptions;
    if (cdk.isResolvableObject(metadataOptions)) {
      this.warn(node, 'LaunchTemplateData.MetadataOptions is a CDK token.');
      return;
    }

    const newData: CfnLaunchTemplate.LaunchTemplateDataProperty = {
      ...data,
      metadataOptions: {
        ...metadataOptions,
        httpTokens: 'required',
      },
    };
    launchTemplate.launchTemplateData = newData;
  }
}
