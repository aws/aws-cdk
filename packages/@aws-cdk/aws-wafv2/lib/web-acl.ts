import { Resource, Names } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { DefaultAction } from './default-action';
import { CfnWebACL } from './wafv2.generated';

/**
 * Specifies whether this is for an Amazon CloudFront distribution or for a regional application.
 * A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API,
 * or an AWS AppSync GraphQL API.
 */
export enum Scope {
  /**
   * For regional application
   */
  REGIONAL = 'REGIONAL',

  /**
   * For Amazon CloudFront distribution
   */
  CLOUDFRONT = 'CLOUDFRONT',
}

/**
 * Defines and enables Amazon CloudWatch metrics and web request sample collection.
 */
export interface VisibilityConfig {
  /**
   * A boolean indicating whether the associated resource sends metrics to Amazon CloudWatch.
   */
  readonly cloudWatchMetricsEnabled: boolean;

  /**
   * The descriptive name of the Amazon CloudWatch metric. The name can contain only alphanumeric characters
   * (A-Z, a-z, 0-9), with length from one to 128 characters. It can't contain whitespace or metric names reserved
   * for AWS WAF, for example "All" and "Default_Action." You can't change a MetricName after you create a VisibilityConfig.
   */
  readonly metricName: string;

  /**
   * A boolean indicating whether AWS WAF should store a sampling of the web requests that match the rules.
   * You can view the sampled requests through the AWS WAF console.
   */
  readonly sampledRequestsEnabled: boolean;
}

/**
 * Properties for defining an AWS WAF web ACL
 */
export interface WebAclProps {
  /**
   * The descriptive name of the web ACL. You cannot change the name of a web ACL after you create it.
   * @default None
   */
  readonly webAclName?: string;

  /**
   * Specifies whether this is for an Amazon CloudFront distribution or for a regional application.
   */
  readonly scope: Scope;

  /**
   * The action to perform if none of the Rules contained in the WebACL match.
   */
  readonly defaultAction: DefaultAction;

  /**
   * Defines and enables Amazon CloudWatch metrics and web request sample collection.
   * @default Set false to both Amazon CloudWatch metrics and web request sample collection
   */
  readonly visibilityConfig?: VisibilityConfig;
}

/**
 * Defines an AWS WAF web ACL in this stack.
 */
export class WebAcl extends Resource {
  /**
   * Name of this web ACL rule
   * @attribute
   */
  public readonly webAclName: string;

  /**
   * The Amazon Resource Name (ARN) of the web ACL.
   * @attribute
   */
  public readonly webAclArn: string;

  /**
   * The current web ACL capacity (WCU) usage by the web ACL.
   * @attribute
   */
  public readonly webAclCapacity: number;

  /**
   * The ID of the web ACL.
   * @attribute
   */
  public readonly webAclId: string;

  /**
   * The label namespace prefix for this web ACL. All labels added by rules in this web ACL have this prefix.
   * @attribute
   */
  public readonly webAclLabelNamespace: string;

  constructor(scope: Construct, id: string, props: WebAclProps) {
    super(scope, id, {
      physicalName: props.webAclName,
    });

    const visibilityConfig: VisibilityConfig = props.visibilityConfig ?? {
      cloudWatchMetricsEnabled: true,
      metricName: props.webAclName || Names.uniqueId(this),
      sampledRequestsEnabled: true,
    };

    const resource = new CfnWebACL(this, 'Resource', {
      name: this.physicalName,
      scope: props.scope,
      defaultAction: props.defaultAction.bind(this).configuration,
      visibilityConfig,
    });

    this.webAclName = this.getResourceNameAttribute(resource.ref);
    this.webAclArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'wafv2',
      resource: 'webacl',
      resourceName: this.physicalName,
    });
    this.webAclCapacity = resource.attrCapacity;
    this.webAclId = resource.attrId;
    this.webAclLabelNamespace = resource.attrLabelNamespace;
  }
}
