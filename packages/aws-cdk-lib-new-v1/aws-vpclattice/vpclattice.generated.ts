/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Enables access logs to be sent to Amazon CloudWatch, Amazon S3, and Amazon Kinesis Data Firehose.
 *
 * The service network owner can use the access logs to audit the services in the network. The service network owner can only see access logs from clients and services that are associated with their service network. Access log entries represent traffic originated from VPCs associated with that network. For more information, see [Access logs](https://docs.aws.amazon.com/vpc-lattice/latest/ug/monitoring-access-logs.html) in the *Amazon VPC Lattice User Guide* .
 *
 * @cloudformationResource AWS::VpcLattice::AccessLogSubscription
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-accesslogsubscription.html
 */
export class CfnAccessLogSubscription extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::VpcLattice::AccessLogSubscription";

  /**
   * Build a CfnAccessLogSubscription from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccessLogSubscription {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAccessLogSubscriptionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAccessLogSubscription(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the access log subscription.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the access log subscription.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The Amazon Resource Name (ARN) of the access log subscription.
   *
   * @cloudformationAttribute ResourceArn
   */
  public readonly attrResourceArn: string;

  /**
   * The ID of the service network or service.
   *
   * @cloudformationAttribute ResourceId
   */
  public readonly attrResourceId: string;

  /**
   * The Amazon Resource Name (ARN) of the destination.
   */
  public destinationArn: string;

  /**
   * The ID or Amazon Resource Name (ARN) of the service network or service.
   */
  public resourceIdentifier?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags for the access log subscription.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAccessLogSubscriptionProps) {
    super(scope, id, {
      "type": CfnAccessLogSubscription.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "destinationArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrResourceArn = cdk.Token.asString(this.getAtt("ResourceArn", cdk.ResolutionTypeHint.STRING));
    this.attrResourceId = cdk.Token.asString(this.getAtt("ResourceId", cdk.ResolutionTypeHint.STRING));
    this.destinationArn = props.destinationArn;
    this.resourceIdentifier = props.resourceIdentifier;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::VpcLattice::AccessLogSubscription", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "destinationArn": this.destinationArn,
      "resourceIdentifier": this.resourceIdentifier,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessLogSubscription.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAccessLogSubscriptionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAccessLogSubscription`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-accesslogsubscription.html
 */
export interface CfnAccessLogSubscriptionProps {
  /**
   * The Amazon Resource Name (ARN) of the destination.
   *
   * The supported destination types are CloudWatch Log groups, Kinesis Data Firehose delivery streams, and Amazon S3 buckets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-accesslogsubscription.html#cfn-vpclattice-accesslogsubscription-destinationarn
   */
  readonly destinationArn: string;

  /**
   * The ID or Amazon Resource Name (ARN) of the service network or service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-accesslogsubscription.html#cfn-vpclattice-accesslogsubscription-resourceidentifier
   */
  readonly resourceIdentifier?: string;

  /**
   * The tags for the access log subscription.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-accesslogsubscription.html#cfn-vpclattice-accesslogsubscription-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnAccessLogSubscriptionProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessLogSubscriptionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessLogSubscriptionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationArn", cdk.requiredValidator)(properties.destinationArn));
  errors.collect(cdk.propertyValidator("destinationArn", cdk.validateString)(properties.destinationArn));
  errors.collect(cdk.propertyValidator("resourceIdentifier", cdk.validateString)(properties.resourceIdentifier));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAccessLogSubscriptionProps\"");
}

// @ts-ignore TS6133
function convertCfnAccessLogSubscriptionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessLogSubscriptionPropsValidator(properties).assertSuccess();
  return {
    "DestinationArn": cdk.stringToCloudFormation(properties.destinationArn),
    "ResourceIdentifier": cdk.stringToCloudFormation(properties.resourceIdentifier),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAccessLogSubscriptionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessLogSubscriptionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessLogSubscriptionProps>();
  ret.addPropertyResult("destinationArn", "DestinationArn", (properties.DestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationArn) : undefined));
  ret.addPropertyResult("resourceIdentifier", "ResourceIdentifier", (properties.ResourceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceIdentifier) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates or updates the auth policy. The policy string in JSON must not contain newlines or blank lines.
 *
 * For more information, see [Auth policies](https://docs.aws.amazon.com/vpc-lattice/latest/ug/auth-policies.html) in the *Amazon VPC Lattice User Guide* .
 *
 * @cloudformationResource AWS::VpcLattice::AuthPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-authpolicy.html
 */
export class CfnAuthPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::VpcLattice::AuthPolicy";

  /**
   * Build a CfnAuthPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAuthPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAuthPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAuthPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The state of the auth policy. The auth policy is only active when the auth type is set to `AWS _IAM` . If you provide a policy, then authentication and authorization decisions are made based on this policy and the client's IAM policy. If the auth type is `NONE` , then any auth policy you provide will remain inactive.
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * The auth policy.
   */
  public policy: any | cdk.IResolvable;

  /**
   * The ID or Amazon Resource Name (ARN) of the service network or service for which the policy is created.
   */
  public resourceIdentifier: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAuthPolicyProps) {
    super(scope, id, {
      "type": CfnAuthPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policy", this);
    cdk.requireProperty(props, "resourceIdentifier", this);

    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.policy = props.policy;
    this.resourceIdentifier = props.resourceIdentifier;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "policy": this.policy,
      "resourceIdentifier": this.resourceIdentifier
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAuthPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAuthPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAuthPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-authpolicy.html
 */
export interface CfnAuthPolicyProps {
  /**
   * The auth policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-authpolicy.html#cfn-vpclattice-authpolicy-policy
   */
  readonly policy: any | cdk.IResolvable;

  /**
   * The ID or Amazon Resource Name (ARN) of the service network or service for which the policy is created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-authpolicy.html#cfn-vpclattice-authpolicy-resourceidentifier
   */
  readonly resourceIdentifier: string;
}

/**
 * Determine whether the given properties match those of a `CfnAuthPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnAuthPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAuthPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policy", cdk.requiredValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("policy", cdk.validateObject)(properties.policy));
  errors.collect(cdk.propertyValidator("resourceIdentifier", cdk.requiredValidator)(properties.resourceIdentifier));
  errors.collect(cdk.propertyValidator("resourceIdentifier", cdk.validateString)(properties.resourceIdentifier));
  return errors.wrap("supplied properties not correct for \"CfnAuthPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnAuthPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAuthPolicyPropsValidator(properties).assertSuccess();
  return {
    "Policy": cdk.objectToCloudFormation(properties.policy),
    "ResourceIdentifier": cdk.stringToCloudFormation(properties.resourceIdentifier)
  };
}

// @ts-ignore TS6133
function CfnAuthPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAuthPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAuthPolicyProps>();
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getAny(properties.Policy) : undefined));
  ret.addPropertyResult("resourceIdentifier", "ResourceIdentifier", (properties.ResourceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceIdentifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a listener for a service.
 *
 * Before you start using your Amazon VPC Lattice service, you must add one or more listeners. A listener is a process that checks for connection requests to your services. For more information, see [Listeners](https://docs.aws.amazon.com/vpc-lattice/latest/ug/listeners.html) in the *Amazon VPC Lattice User Guide* .
 *
 * @cloudformationResource AWS::VpcLattice::Listener
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-listener.html
 */
export class CfnListener extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::VpcLattice::Listener";

  /**
   * Build a CfnListener from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnListener {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnListenerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnListener(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the listener.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the listener.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The Amazon Resource Name (ARN) of the service.
   *
   * @cloudformationAttribute ServiceArn
   */
  public readonly attrServiceArn: string;

  /**
   * The ID of the service.
   *
   * @cloudformationAttribute ServiceId
   */
  public readonly attrServiceId: string;

  /**
   * The action for the default rule.
   */
  public defaultAction: CfnListener.DefaultActionProperty | cdk.IResolvable;

  /**
   * The name of the listener.
   */
  public name?: string;

  /**
   * The listener port.
   */
  public port?: number;

  /**
   * The listener protocol.
   */
  public protocol: string;

  /**
   * The ID or Amazon Resource Name (ARN) of the service.
   */
  public serviceIdentifier?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags for the listener.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnListenerProps) {
    super(scope, id, {
      "type": CfnListener.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "defaultAction", this);
    cdk.requireProperty(props, "protocol", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrServiceArn = cdk.Token.asString(this.getAtt("ServiceArn", cdk.ResolutionTypeHint.STRING));
    this.attrServiceId = cdk.Token.asString(this.getAtt("ServiceId", cdk.ResolutionTypeHint.STRING));
    this.defaultAction = props.defaultAction;
    this.name = props.name;
    this.port = props.port;
    this.protocol = props.protocol;
    this.serviceIdentifier = props.serviceIdentifier;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::VpcLattice::Listener", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "defaultAction": this.defaultAction,
      "name": this.name,
      "port": this.port,
      "protocol": this.protocol,
      "serviceIdentifier": this.serviceIdentifier,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnListener.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnListenerPropsToCloudFormation(props);
  }
}

export namespace CfnListener {
  /**
   * The action for the default rule.
   *
   * Each listener has a default rule. The default rule is used if no other rules match.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-listener-defaultaction.html
   */
  export interface DefaultActionProperty {
    /**
     * Describes an action that returns a custom HTTP response.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-listener-defaultaction.html#cfn-vpclattice-listener-defaultaction-fixedresponse
     */
    readonly fixedResponse?: CfnListener.FixedResponseProperty | cdk.IResolvable;

    /**
     * Describes a forward action.
     *
     * You can use forward actions to route requests to one or more target groups.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-listener-defaultaction.html#cfn-vpclattice-listener-defaultaction-forward
     */
    readonly forward?: CfnListener.ForwardProperty | cdk.IResolvable;
  }

  /**
   * The forward action.
   *
   * Traffic that matches the rule is forwarded to the specified target groups.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-listener-forward.html
   */
  export interface ForwardProperty {
    /**
     * The target groups.
     *
     * Traffic matching the rule is forwarded to the specified target groups. With forward actions, you can assign a weight that controls the prioritization and selection of each target group. This means that requests are distributed to individual target groups based on their weights. For example, if two target groups have the same weight, each target group receives half of the traffic.
     *
     * The default value is 1. This means that if only one target group is provided, there is no need to set the weight; 100% of the traffic goes to that target group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-listener-forward.html#cfn-vpclattice-listener-forward-targetgroups
     */
    readonly targetGroups: Array<cdk.IResolvable | CfnListener.WeightedTargetGroupProperty> | cdk.IResolvable;
  }

  /**
   * Describes the weight of a target group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-listener-weightedtargetgroup.html
   */
  export interface WeightedTargetGroupProperty {
    /**
     * The ID of the target group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-listener-weightedtargetgroup.html#cfn-vpclattice-listener-weightedtargetgroup-targetgroupidentifier
     */
    readonly targetGroupIdentifier: string;

    /**
     * Only required if you specify multiple target groups for a forward action.
     *
     * The weight determines how requests are distributed to the target group. For example, if you specify two target groups, each with a weight of 10, each target group receives half the requests. If you specify two target groups, one with a weight of 10 and the other with a weight of 20, the target group with a weight of 20 receives twice as many requests as the other target group. If there's only one target group specified, then the default value is 100.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-listener-weightedtargetgroup.html#cfn-vpclattice-listener-weightedtargetgroup-weight
     */
    readonly weight?: number;
  }

  /**
   * Describes an action that returns a custom HTTP response.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-listener-fixedresponse.html
   */
  export interface FixedResponseProperty {
    /**
     * The HTTP response code.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-listener-fixedresponse.html#cfn-vpclattice-listener-fixedresponse-statuscode
     */
    readonly statusCode: number;
  }
}

/**
 * Properties for defining a `CfnListener`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-listener.html
 */
export interface CfnListenerProps {
  /**
   * The action for the default rule.
   *
   * Each listener has a default rule. The default rule is used if no other rules match.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-listener.html#cfn-vpclattice-listener-defaultaction
   */
  readonly defaultAction: CfnListener.DefaultActionProperty | cdk.IResolvable;

  /**
   * The name of the listener.
   *
   * A listener name must be unique within a service. The valid characters are a-z, 0-9, and hyphens (-). You can't use a hyphen as the first or last character, or immediately after another hyphen.
   *
   * If you don't specify a name, CloudFormation generates one. However, if you specify a name, and later want to replace the resource, you must specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-listener.html#cfn-vpclattice-listener-name
   */
  readonly name?: string;

  /**
   * The listener port.
   *
   * You can specify a value from 1 to 65535. For HTTP, the default is 80. For HTTPS, the default is 443.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-listener.html#cfn-vpclattice-listener-port
   */
  readonly port?: number;

  /**
   * The listener protocol.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-listener.html#cfn-vpclattice-listener-protocol
   */
  readonly protocol: string;

  /**
   * The ID or Amazon Resource Name (ARN) of the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-listener.html#cfn-vpclattice-listener-serviceidentifier
   */
  readonly serviceIdentifier?: string;

  /**
   * The tags for the listener.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-listener.html#cfn-vpclattice-listener-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `WeightedTargetGroupProperty`
 *
 * @param properties - the TypeScript properties of a `WeightedTargetGroupProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerWeightedTargetGroupPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetGroupIdentifier", cdk.requiredValidator)(properties.targetGroupIdentifier));
  errors.collect(cdk.propertyValidator("targetGroupIdentifier", cdk.validateString)(properties.targetGroupIdentifier));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"WeightedTargetGroupProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerWeightedTargetGroupPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerWeightedTargetGroupPropertyValidator(properties).assertSuccess();
  return {
    "TargetGroupIdentifier": cdk.stringToCloudFormation(properties.targetGroupIdentifier),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnListenerWeightedTargetGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnListener.WeightedTargetGroupProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.WeightedTargetGroupProperty>();
  ret.addPropertyResult("targetGroupIdentifier", "TargetGroupIdentifier", (properties.TargetGroupIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.TargetGroupIdentifier) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ForwardProperty`
 *
 * @param properties - the TypeScript properties of a `ForwardProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerForwardPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetGroups", cdk.requiredValidator)(properties.targetGroups));
  errors.collect(cdk.propertyValidator("targetGroups", cdk.listValidator(CfnListenerWeightedTargetGroupPropertyValidator))(properties.targetGroups));
  return errors.wrap("supplied properties not correct for \"ForwardProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerForwardPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerForwardPropertyValidator(properties).assertSuccess();
  return {
    "TargetGroups": cdk.listMapper(convertCfnListenerWeightedTargetGroupPropertyToCloudFormation)(properties.targetGroups)
  };
}

// @ts-ignore TS6133
function CfnListenerForwardPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.ForwardProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.ForwardProperty>();
  ret.addPropertyResult("targetGroups", "TargetGroups", (properties.TargetGroups != null ? cfn_parse.FromCloudFormation.getArray(CfnListenerWeightedTargetGroupPropertyFromCloudFormation)(properties.TargetGroups) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FixedResponseProperty`
 *
 * @param properties - the TypeScript properties of a `FixedResponseProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerFixedResponsePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("statusCode", cdk.requiredValidator)(properties.statusCode));
  errors.collect(cdk.propertyValidator("statusCode", cdk.validateNumber)(properties.statusCode));
  return errors.wrap("supplied properties not correct for \"FixedResponseProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerFixedResponsePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerFixedResponsePropertyValidator(properties).assertSuccess();
  return {
    "StatusCode": cdk.numberToCloudFormation(properties.statusCode)
  };
}

// @ts-ignore TS6133
function CfnListenerFixedResponsePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.FixedResponseProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.FixedResponseProperty>();
  ret.addPropertyResult("statusCode", "StatusCode", (properties.StatusCode != null ? cfn_parse.FromCloudFormation.getNumber(properties.StatusCode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DefaultActionProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerDefaultActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fixedResponse", CfnListenerFixedResponsePropertyValidator)(properties.fixedResponse));
  errors.collect(cdk.propertyValidator("forward", CfnListenerForwardPropertyValidator)(properties.forward));
  return errors.wrap("supplied properties not correct for \"DefaultActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerDefaultActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerDefaultActionPropertyValidator(properties).assertSuccess();
  return {
    "FixedResponse": convertCfnListenerFixedResponsePropertyToCloudFormation(properties.fixedResponse),
    "Forward": convertCfnListenerForwardPropertyToCloudFormation(properties.forward)
  };
}

// @ts-ignore TS6133
function CfnListenerDefaultActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.DefaultActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.DefaultActionProperty>();
  ret.addPropertyResult("fixedResponse", "FixedResponse", (properties.FixedResponse != null ? CfnListenerFixedResponsePropertyFromCloudFormation(properties.FixedResponse) : undefined));
  ret.addPropertyResult("forward", "Forward", (properties.Forward != null ? CfnListenerForwardPropertyFromCloudFormation(properties.Forward) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnListenerProps`
 *
 * @param properties - the TypeScript properties of a `CfnListenerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultAction", cdk.requiredValidator)(properties.defaultAction));
  errors.collect(cdk.propertyValidator("defaultAction", CfnListenerDefaultActionPropertyValidator)(properties.defaultAction));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("serviceIdentifier", cdk.validateString)(properties.serviceIdentifier));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnListenerProps\"");
}

// @ts-ignore TS6133
function convertCfnListenerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerPropsValidator(properties).assertSuccess();
  return {
    "DefaultAction": convertCfnListenerDefaultActionPropertyToCloudFormation(properties.defaultAction),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Port": cdk.numberToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "ServiceIdentifier": cdk.stringToCloudFormation(properties.serviceIdentifier),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnListenerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerProps>();
  ret.addPropertyResult("defaultAction", "DefaultAction", (properties.DefaultAction != null ? CfnListenerDefaultActionPropertyFromCloudFormation(properties.DefaultAction) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("serviceIdentifier", "ServiceIdentifier", (properties.ServiceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceIdentifier) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Retrieves information about the resource policy.
 *
 * The resource policy is an IAM policy created on behalf of the resource owner when they share a resource.
 *
 * @cloudformationResource AWS::VpcLattice::ResourcePolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-resourcepolicy.html
 */
export class CfnResourcePolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::VpcLattice::ResourcePolicy";

  /**
   * Build a CfnResourcePolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourcePolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResourcePolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResourcePolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the service network or service.
   */
  public policy: any | cdk.IResolvable;

  /**
   * An IAM policy.
   */
  public resourceArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourcePolicyProps) {
    super(scope, id, {
      "type": CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policy", this);
    cdk.requireProperty(props, "resourceArn", this);

    this.policy = props.policy;
    this.resourceArn = props.resourceArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "policy": this.policy,
      "resourceArn": this.resourceArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourcePolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnResourcePolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-resourcepolicy.html
 */
export interface CfnResourcePolicyProps {
  /**
   * The Amazon Resource Name (ARN) of the service network or service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-resourcepolicy.html#cfn-vpclattice-resourcepolicy-policy
   */
  readonly policy: any | cdk.IResolvable;

  /**
   * An IAM policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-resourcepolicy.html#cfn-vpclattice-resourcepolicy-resourcearn
   */
  readonly resourceArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnResourcePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourcePolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourcePolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policy", cdk.requiredValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("policy", cdk.validateObject)(properties.policy));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  return errors.wrap("supplied properties not correct for \"CfnResourcePolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnResourcePolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourcePolicyPropsValidator(properties).assertSuccess();
  return {
    "Policy": cdk.objectToCloudFormation(properties.policy),
    "ResourceArn": cdk.stringToCloudFormation(properties.resourceArn)
  };
}

// @ts-ignore TS6133
function CfnResourcePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourcePolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourcePolicyProps>();
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getAny(properties.Policy) : undefined));
  ret.addPropertyResult("resourceArn", "ResourceArn", (properties.ResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a listener rule.
 *
 * Each listener has a default rule for checking connection requests, but you can define additional rules. Each rule consists of a priority, one or more actions, and one or more conditions. For more information, see [Listener rules](https://docs.aws.amazon.com/vpc-lattice/latest/ug/listeners.html#listener-rules) in the *Amazon VPC Lattice User Guide* .
 *
 * @cloudformationResource AWS::VpcLattice::Rule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-rule.html
 */
export class CfnRule extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::VpcLattice::Rule";

  /**
   * Build a CfnRule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the rule.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the listener.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Describes the action for a rule.
   */
  public action: CfnRule.ActionProperty | cdk.IResolvable;

  /**
   * The ID or Amazon Resource Name (ARN) of the listener.
   */
  public listenerIdentifier?: string;

  /**
   * The rule match.
   */
  public match: cdk.IResolvable | CfnRule.MatchProperty;

  /**
   * The name of the rule.
   */
  public name?: string;

  /**
   * The priority assigned to the rule.
   */
  public priority: number;

  /**
   * The ID or Amazon Resource Name (ARN) of the service.
   */
  public serviceIdentifier?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags for the rule.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRuleProps) {
    super(scope, id, {
      "type": CfnRule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "action", this);
    cdk.requireProperty(props, "match", this);
    cdk.requireProperty(props, "priority", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.action = props.action;
    this.listenerIdentifier = props.listenerIdentifier;
    this.match = props.match;
    this.name = props.name;
    this.priority = props.priority;
    this.serviceIdentifier = props.serviceIdentifier;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::VpcLattice::Rule", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "action": this.action,
      "listenerIdentifier": this.listenerIdentifier,
      "match": this.match,
      "name": this.name,
      "priority": this.priority,
      "serviceIdentifier": this.serviceIdentifier,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRulePropsToCloudFormation(props);
  }
}

export namespace CfnRule {
  /**
   * Describes the action for a rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-action.html
   */
  export interface ActionProperty {
    /**
     * The fixed response action.
     *
     * The rule returns a custom HTTP response.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-action.html#cfn-vpclattice-rule-action-fixedresponse
     */
    readonly fixedResponse?: CfnRule.FixedResponseProperty | cdk.IResolvable;

    /**
     * The forward action.
     *
     * Traffic that matches the rule is forwarded to the specified target groups.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-action.html#cfn-vpclattice-rule-action-forward
     */
    readonly forward?: CfnRule.ForwardProperty | cdk.IResolvable;
  }

  /**
   * The forward action.
   *
   * Traffic that matches the rule is forwarded to the specified target groups.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-forward.html
   */
  export interface ForwardProperty {
    /**
     * The target groups.
     *
     * Traffic matching the rule is forwarded to the specified target groups. With forward actions, you can assign a weight that controls the prioritization and selection of each target group. This means that requests are distributed to individual target groups based on their weights. For example, if two target groups have the same weight, each target group receives half of the traffic.
     *
     * The default value is 1. This means that if only one target group is provided, there is no need to set the weight; 100% of the traffic goes to that target group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-forward.html#cfn-vpclattice-rule-forward-targetgroups
     */
    readonly targetGroups: Array<cdk.IResolvable | CfnRule.WeightedTargetGroupProperty> | cdk.IResolvable;
  }

  /**
   * Describes the weight of a target group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-weightedtargetgroup.html
   */
  export interface WeightedTargetGroupProperty {
    /**
     * The ID of the target group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-weightedtargetgroup.html#cfn-vpclattice-rule-weightedtargetgroup-targetgroupidentifier
     */
    readonly targetGroupIdentifier: string;

    /**
     * Only required if you specify multiple target groups for a forward action.
     *
     * The weight determines how requests are distributed to the target group. For example, if you specify two target groups, each with a weight of 10, each target group receives half the requests. If you specify two target groups, one with a weight of 10 and the other with a weight of 20, the target group with a weight of 20 receives twice as many requests as the other target group. If there's only one target group specified, then the default value is 100.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-weightedtargetgroup.html#cfn-vpclattice-rule-weightedtargetgroup-weight
     */
    readonly weight?: number;
  }

  /**
   * Describes an action that returns a custom HTTP response.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-fixedresponse.html
   */
  export interface FixedResponseProperty {
    /**
     * The HTTP response code.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-fixedresponse.html#cfn-vpclattice-rule-fixedresponse-statuscode
     */
    readonly statusCode: number;
  }

  /**
   * Describes a rule match.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-match.html
   */
  export interface MatchProperty {
    /**
     * The HTTP criteria that a rule must match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-match.html#cfn-vpclattice-rule-match-httpmatch
     */
    readonly httpMatch: CfnRule.HttpMatchProperty | cdk.IResolvable;
  }

  /**
   * Describes criteria that can be applied to incoming requests.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-httpmatch.html
   */
  export interface HttpMatchProperty {
    /**
     * The header matches.
     *
     * Matches incoming requests with rule based on request header value before applying rule action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-httpmatch.html#cfn-vpclattice-rule-httpmatch-headermatches
     */
    readonly headerMatches?: Array<CfnRule.HeaderMatchProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The HTTP method type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-httpmatch.html#cfn-vpclattice-rule-httpmatch-method
     */
    readonly method?: string;

    /**
     * The path match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-httpmatch.html#cfn-vpclattice-rule-httpmatch-pathmatch
     */
    readonly pathMatch?: cdk.IResolvable | CfnRule.PathMatchProperty;
  }

  /**
   * Describes the constraints for a header match.
   *
   * Matches incoming requests with rule based on request header value before applying rule action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-headermatch.html
   */
  export interface HeaderMatchProperty {
    /**
     * Indicates whether the match is case sensitive.
     *
     * @default - false
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-headermatch.html#cfn-vpclattice-rule-headermatch-casesensitive
     */
    readonly caseSensitive?: boolean | cdk.IResolvable;

    /**
     * The header match type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-headermatch.html#cfn-vpclattice-rule-headermatch-match
     */
    readonly match: CfnRule.HeaderMatchTypeProperty | cdk.IResolvable;

    /**
     * The name of the header.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-headermatch.html#cfn-vpclattice-rule-headermatch-name
     */
    readonly name: string;
  }

  /**
   * Describes a header match type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-headermatchtype.html
   */
  export interface HeaderMatchTypeProperty {
    /**
     * A contains type match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-headermatchtype.html#cfn-vpclattice-rule-headermatchtype-contains
     */
    readonly contains?: string;

    /**
     * An exact type match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-headermatchtype.html#cfn-vpclattice-rule-headermatchtype-exact
     */
    readonly exact?: string;

    /**
     * A prefix type match.
     *
     * Matches the value with the prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-headermatchtype.html#cfn-vpclattice-rule-headermatchtype-prefix
     */
    readonly prefix?: string;
  }

  /**
   * Describes the conditions that can be applied when matching a path for incoming requests.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-pathmatch.html
   */
  export interface PathMatchProperty {
    /**
     * Indicates whether the match is case sensitive.
     *
     * @default - false
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-pathmatch.html#cfn-vpclattice-rule-pathmatch-casesensitive
     */
    readonly caseSensitive?: boolean | cdk.IResolvable;

    /**
     * The type of path match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-pathmatch.html#cfn-vpclattice-rule-pathmatch-match
     */
    readonly match: cdk.IResolvable | CfnRule.PathMatchTypeProperty;
  }

  /**
   * Describes a path match type.
   *
   * Each rule can include only one of the following types of paths.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-pathmatchtype.html
   */
  export interface PathMatchTypeProperty {
    /**
     * An exact match of the path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-pathmatchtype.html#cfn-vpclattice-rule-pathmatchtype-exact
     */
    readonly exact?: string;

    /**
     * A prefix match of the path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-rule-pathmatchtype.html#cfn-vpclattice-rule-pathmatchtype-prefix
     */
    readonly prefix?: string;
  }
}

/**
 * Properties for defining a `CfnRule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-rule.html
 */
export interface CfnRuleProps {
  /**
   * Describes the action for a rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-rule.html#cfn-vpclattice-rule-action
   */
  readonly action: CfnRule.ActionProperty | cdk.IResolvable;

  /**
   * The ID or Amazon Resource Name (ARN) of the listener.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-rule.html#cfn-vpclattice-rule-listeneridentifier
   */
  readonly listenerIdentifier?: string;

  /**
   * The rule match.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-rule.html#cfn-vpclattice-rule-match
   */
  readonly match: cdk.IResolvable | CfnRule.MatchProperty;

  /**
   * The name of the rule.
   *
   * The name must be unique within the listener. The valid characters are a-z, 0-9, and hyphens (-). You can't use a hyphen as the first or last character, or immediately after another hyphen.
   *
   * If you don't specify a name, CloudFormation generates one. However, if you specify a name, and later want to replace the resource, you must specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-rule.html#cfn-vpclattice-rule-name
   */
  readonly name?: string;

  /**
   * The priority assigned to the rule.
   *
   * Each rule for a specific listener must have a unique priority. The lower the priority number the higher the priority.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-rule.html#cfn-vpclattice-rule-priority
   */
  readonly priority: number;

  /**
   * The ID or Amazon Resource Name (ARN) of the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-rule.html#cfn-vpclattice-rule-serviceidentifier
   */
  readonly serviceIdentifier?: string;

  /**
   * The tags for the rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-rule.html#cfn-vpclattice-rule-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `WeightedTargetGroupProperty`
 *
 * @param properties - the TypeScript properties of a `WeightedTargetGroupProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleWeightedTargetGroupPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetGroupIdentifier", cdk.requiredValidator)(properties.targetGroupIdentifier));
  errors.collect(cdk.propertyValidator("targetGroupIdentifier", cdk.validateString)(properties.targetGroupIdentifier));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"WeightedTargetGroupProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleWeightedTargetGroupPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleWeightedTargetGroupPropertyValidator(properties).assertSuccess();
  return {
    "TargetGroupIdentifier": cdk.stringToCloudFormation(properties.targetGroupIdentifier),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnRuleWeightedTargetGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.WeightedTargetGroupProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.WeightedTargetGroupProperty>();
  ret.addPropertyResult("targetGroupIdentifier", "TargetGroupIdentifier", (properties.TargetGroupIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.TargetGroupIdentifier) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ForwardProperty`
 *
 * @param properties - the TypeScript properties of a `ForwardProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleForwardPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetGroups", cdk.requiredValidator)(properties.targetGroups));
  errors.collect(cdk.propertyValidator("targetGroups", cdk.listValidator(CfnRuleWeightedTargetGroupPropertyValidator))(properties.targetGroups));
  return errors.wrap("supplied properties not correct for \"ForwardProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleForwardPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleForwardPropertyValidator(properties).assertSuccess();
  return {
    "TargetGroups": cdk.listMapper(convertCfnRuleWeightedTargetGroupPropertyToCloudFormation)(properties.targetGroups)
  };
}

// @ts-ignore TS6133
function CfnRuleForwardPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.ForwardProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.ForwardProperty>();
  ret.addPropertyResult("targetGroups", "TargetGroups", (properties.TargetGroups != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleWeightedTargetGroupPropertyFromCloudFormation)(properties.TargetGroups) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FixedResponseProperty`
 *
 * @param properties - the TypeScript properties of a `FixedResponseProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleFixedResponsePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("statusCode", cdk.requiredValidator)(properties.statusCode));
  errors.collect(cdk.propertyValidator("statusCode", cdk.validateNumber)(properties.statusCode));
  return errors.wrap("supplied properties not correct for \"FixedResponseProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleFixedResponsePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleFixedResponsePropertyValidator(properties).assertSuccess();
  return {
    "StatusCode": cdk.numberToCloudFormation(properties.statusCode)
  };
}

// @ts-ignore TS6133
function CfnRuleFixedResponsePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.FixedResponseProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.FixedResponseProperty>();
  ret.addPropertyResult("statusCode", "StatusCode", (properties.StatusCode != null ? cfn_parse.FromCloudFormation.getNumber(properties.StatusCode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fixedResponse", CfnRuleFixedResponsePropertyValidator)(properties.fixedResponse));
  errors.collect(cdk.propertyValidator("forward", CfnRuleForwardPropertyValidator)(properties.forward));
  return errors.wrap("supplied properties not correct for \"ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleActionPropertyValidator(properties).assertSuccess();
  return {
    "FixedResponse": convertCfnRuleFixedResponsePropertyToCloudFormation(properties.fixedResponse),
    "Forward": convertCfnRuleForwardPropertyToCloudFormation(properties.forward)
  };
}

// @ts-ignore TS6133
function CfnRuleActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.ActionProperty>();
  ret.addPropertyResult("fixedResponse", "FixedResponse", (properties.FixedResponse != null ? CfnRuleFixedResponsePropertyFromCloudFormation(properties.FixedResponse) : undefined));
  ret.addPropertyResult("forward", "Forward", (properties.Forward != null ? CfnRuleForwardPropertyFromCloudFormation(properties.Forward) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HeaderMatchTypeProperty`
 *
 * @param properties - the TypeScript properties of a `HeaderMatchTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleHeaderMatchTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contains", cdk.validateString)(properties.contains));
  errors.collect(cdk.propertyValidator("exact", cdk.validateString)(properties.exact));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  return errors.wrap("supplied properties not correct for \"HeaderMatchTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleHeaderMatchTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleHeaderMatchTypePropertyValidator(properties).assertSuccess();
  return {
    "Contains": cdk.stringToCloudFormation(properties.contains),
    "Exact": cdk.stringToCloudFormation(properties.exact),
    "Prefix": cdk.stringToCloudFormation(properties.prefix)
  };
}

// @ts-ignore TS6133
function CfnRuleHeaderMatchTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.HeaderMatchTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.HeaderMatchTypeProperty>();
  ret.addPropertyResult("contains", "Contains", (properties.Contains != null ? cfn_parse.FromCloudFormation.getString(properties.Contains) : undefined));
  ret.addPropertyResult("exact", "Exact", (properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HeaderMatchProperty`
 *
 * @param properties - the TypeScript properties of a `HeaderMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleHeaderMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("caseSensitive", cdk.validateBoolean)(properties.caseSensitive));
  errors.collect(cdk.propertyValidator("match", cdk.requiredValidator)(properties.match));
  errors.collect(cdk.propertyValidator("match", CfnRuleHeaderMatchTypePropertyValidator)(properties.match));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"HeaderMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleHeaderMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleHeaderMatchPropertyValidator(properties).assertSuccess();
  return {
    "CaseSensitive": cdk.booleanToCloudFormation(properties.caseSensitive),
    "Match": convertCfnRuleHeaderMatchTypePropertyToCloudFormation(properties.match),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnRuleHeaderMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.HeaderMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.HeaderMatchProperty>();
  ret.addPropertyResult("caseSensitive", "CaseSensitive", (properties.CaseSensitive != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CaseSensitive) : undefined));
  ret.addPropertyResult("match", "Match", (properties.Match != null ? CfnRuleHeaderMatchTypePropertyFromCloudFormation(properties.Match) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PathMatchTypeProperty`
 *
 * @param properties - the TypeScript properties of a `PathMatchTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRulePathMatchTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exact", cdk.validateString)(properties.exact));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  return errors.wrap("supplied properties not correct for \"PathMatchTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnRulePathMatchTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRulePathMatchTypePropertyValidator(properties).assertSuccess();
  return {
    "Exact": cdk.stringToCloudFormation(properties.exact),
    "Prefix": cdk.stringToCloudFormation(properties.prefix)
  };
}

// @ts-ignore TS6133
function CfnRulePathMatchTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.PathMatchTypeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.PathMatchTypeProperty>();
  ret.addPropertyResult("exact", "Exact", (properties.Exact != null ? cfn_parse.FromCloudFormation.getString(properties.Exact) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PathMatchProperty`
 *
 * @param properties - the TypeScript properties of a `PathMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRulePathMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("caseSensitive", cdk.validateBoolean)(properties.caseSensitive));
  errors.collect(cdk.propertyValidator("match", cdk.requiredValidator)(properties.match));
  errors.collect(cdk.propertyValidator("match", CfnRulePathMatchTypePropertyValidator)(properties.match));
  return errors.wrap("supplied properties not correct for \"PathMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnRulePathMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRulePathMatchPropertyValidator(properties).assertSuccess();
  return {
    "CaseSensitive": cdk.booleanToCloudFormation(properties.caseSensitive),
    "Match": convertCfnRulePathMatchTypePropertyToCloudFormation(properties.match)
  };
}

// @ts-ignore TS6133
function CfnRulePathMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.PathMatchProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.PathMatchProperty>();
  ret.addPropertyResult("caseSensitive", "CaseSensitive", (properties.CaseSensitive != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CaseSensitive) : undefined));
  ret.addPropertyResult("match", "Match", (properties.Match != null ? CfnRulePathMatchTypePropertyFromCloudFormation(properties.Match) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpMatchProperty`
 *
 * @param properties - the TypeScript properties of a `HttpMatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleHttpMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("headerMatches", cdk.listValidator(CfnRuleHeaderMatchPropertyValidator))(properties.headerMatches));
  errors.collect(cdk.propertyValidator("method", cdk.validateString)(properties.method));
  errors.collect(cdk.propertyValidator("pathMatch", CfnRulePathMatchPropertyValidator)(properties.pathMatch));
  return errors.wrap("supplied properties not correct for \"HttpMatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleHttpMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleHttpMatchPropertyValidator(properties).assertSuccess();
  return {
    "HeaderMatches": cdk.listMapper(convertCfnRuleHeaderMatchPropertyToCloudFormation)(properties.headerMatches),
    "Method": cdk.stringToCloudFormation(properties.method),
    "PathMatch": convertCfnRulePathMatchPropertyToCloudFormation(properties.pathMatch)
  };
}

// @ts-ignore TS6133
function CfnRuleHttpMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.HttpMatchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.HttpMatchProperty>();
  ret.addPropertyResult("headerMatches", "HeaderMatches", (properties.HeaderMatches != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleHeaderMatchPropertyFromCloudFormation)(properties.HeaderMatches) : undefined));
  ret.addPropertyResult("method", "Method", (properties.Method != null ? cfn_parse.FromCloudFormation.getString(properties.Method) : undefined));
  ret.addPropertyResult("pathMatch", "PathMatch", (properties.PathMatch != null ? CfnRulePathMatchPropertyFromCloudFormation(properties.PathMatch) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MatchProperty`
 *
 * @param properties - the TypeScript properties of a `MatchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleMatchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("httpMatch", cdk.requiredValidator)(properties.httpMatch));
  errors.collect(cdk.propertyValidator("httpMatch", CfnRuleHttpMatchPropertyValidator)(properties.httpMatch));
  return errors.wrap("supplied properties not correct for \"MatchProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleMatchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleMatchPropertyValidator(properties).assertSuccess();
  return {
    "HttpMatch": convertCfnRuleHttpMatchPropertyToCloudFormation(properties.httpMatch)
  };
}

// @ts-ignore TS6133
function CfnRuleMatchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.MatchProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.MatchProperty>();
  ret.addPropertyResult("httpMatch", "HttpMatch", (properties.HttpMatch != null ? CfnRuleHttpMatchPropertyFromCloudFormation(properties.HttpMatch) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnRuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", CfnRuleActionPropertyValidator)(properties.action));
  errors.collect(cdk.propertyValidator("listenerIdentifier", cdk.validateString)(properties.listenerIdentifier));
  errors.collect(cdk.propertyValidator("match", cdk.requiredValidator)(properties.match));
  errors.collect(cdk.propertyValidator("match", CfnRuleMatchPropertyValidator)(properties.match));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("priority", cdk.requiredValidator)(properties.priority));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("serviceIdentifier", cdk.validateString)(properties.serviceIdentifier));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRuleProps\"");
}

// @ts-ignore TS6133
function convertCfnRulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRulePropsValidator(properties).assertSuccess();
  return {
    "Action": convertCfnRuleActionPropertyToCloudFormation(properties.action),
    "ListenerIdentifier": cdk.stringToCloudFormation(properties.listenerIdentifier),
    "Match": convertCfnRuleMatchPropertyToCloudFormation(properties.match),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "ServiceIdentifier": cdk.stringToCloudFormation(properties.serviceIdentifier),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleProps>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? CfnRuleActionPropertyFromCloudFormation(properties.Action) : undefined));
  ret.addPropertyResult("listenerIdentifier", "ListenerIdentifier", (properties.ListenerIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ListenerIdentifier) : undefined));
  ret.addPropertyResult("match", "Match", (properties.Match != null ? CfnRuleMatchPropertyFromCloudFormation(properties.Match) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("serviceIdentifier", "ServiceIdentifier", (properties.ServiceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceIdentifier) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a service.
 *
 * A service is any software application that can run on instances containers, or serverless functions within an account or virtual private cloud (VPC).
 *
 * For more information, see [Services](https://docs.aws.amazon.com/vpc-lattice/latest/ug/services.html) in the *Amazon VPC Lattice User Guide* .
 *
 * @cloudformationResource AWS::VpcLattice::Service
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-service.html
 */
export class CfnService extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::VpcLattice::Service";

  /**
   * Build a CfnService from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnService {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnServicePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnService(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the service.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The date and time that the service was created, specified in ISO-8601 format.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * @cloudformationAttribute DnsEntry.DomainName
   */
  public readonly attrDnsEntryDomainName: string;

  /**
   * @cloudformationAttribute DnsEntry.HostedZoneId
   */
  public readonly attrDnsEntryHostedZoneId: string;

  /**
   * The ID of the service.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The date and time that the service was last updated, specified in ISO-8601 format.
   *
   * @cloudformationAttribute LastUpdatedAt
   */
  public readonly attrLastUpdatedAt: string;

  /**
   * The status of the service.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The type of IAM policy.
   */
  public authType?: string;

  /**
   * The Amazon Resource Name (ARN) of the certificate.
   */
  public certificateArn?: string;

  /**
   * The custom domain name of the service.
   */
  public customDomainName?: string;

  /**
   * The DNS information of the service.
   */
  public dnsEntry?: CfnService.DnsEntryProperty | cdk.IResolvable;

  /**
   * The name of the service.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags for the service.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServiceProps = {}) {
    super(scope, id, {
      "type": CfnService.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrDnsEntryDomainName = cdk.Token.asString(this.getAtt("DnsEntry.DomainName", cdk.ResolutionTypeHint.STRING));
    this.attrDnsEntryHostedZoneId = cdk.Token.asString(this.getAtt("DnsEntry.HostedZoneId", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLastUpdatedAt = cdk.Token.asString(this.getAtt("LastUpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.authType = props.authType;
    this.certificateArn = props.certificateArn;
    this.customDomainName = props.customDomainName;
    this.dnsEntry = props.dnsEntry;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::VpcLattice::Service", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authType": this.authType,
      "certificateArn": this.certificateArn,
      "customDomainName": this.customDomainName,
      "dnsEntry": this.dnsEntry,
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnService.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnServicePropsToCloudFormation(props);
  }
}

export namespace CfnService {
  /**
   * Describes the DNS information of a service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-service-dnsentry.html
   */
  export interface DnsEntryProperty {
    /**
     * The domain name of the service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-service-dnsentry.html#cfn-vpclattice-service-dnsentry-domainname
     */
    readonly domainName?: string;

    /**
     * The ID of the hosted zone.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-service-dnsentry.html#cfn-vpclattice-service-dnsentry-hostedzoneid
     */
    readonly hostedZoneId?: string;
  }
}

/**
 * Properties for defining a `CfnService`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-service.html
 */
export interface CfnServiceProps {
  /**
   * The type of IAM policy.
   *
   * - `NONE` : The resource does not use an IAM policy. This is the default.
   * - `AWS_IAM` : The resource uses an IAM policy. When this type is used, auth is enabled and an auth policy is required.
   *
   * @default - "NONE"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-service.html#cfn-vpclattice-service-authtype
   */
  readonly authType?: string;

  /**
   * The Amazon Resource Name (ARN) of the certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-service.html#cfn-vpclattice-service-certificatearn
   */
  readonly certificateArn?: string;

  /**
   * The custom domain name of the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-service.html#cfn-vpclattice-service-customdomainname
   */
  readonly customDomainName?: string;

  /**
   * The DNS information of the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-service.html#cfn-vpclattice-service-dnsentry
   */
  readonly dnsEntry?: CfnService.DnsEntryProperty | cdk.IResolvable;

  /**
   * The name of the service.
   *
   * The name must be unique within the account. The valid characters are a-z, 0-9, and hyphens (-). You can't use a hyphen as the first or last character, or immediately after another hyphen.
   *
   * If you don't specify a name, CloudFormation generates one. However, if you specify a name, and later want to replace the resource, you must specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-service.html#cfn-vpclattice-service-name
   */
  readonly name?: string;

  /**
   * The tags for the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-service.html#cfn-vpclattice-service-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `DnsEntryProperty`
 *
 * @param properties - the TypeScript properties of a `DnsEntryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceDnsEntryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("hostedZoneId", cdk.validateString)(properties.hostedZoneId));
  return errors.wrap("supplied properties not correct for \"DnsEntryProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceDnsEntryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceDnsEntryPropertyValidator(properties).assertSuccess();
  return {
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "HostedZoneId": cdk.stringToCloudFormation(properties.hostedZoneId)
  };
}

// @ts-ignore TS6133
function CfnServiceDnsEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnService.DnsEntryProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.DnsEntryProperty>();
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("hostedZoneId", "HostedZoneId", (properties.HostedZoneId != null ? cfn_parse.FromCloudFormation.getString(properties.HostedZoneId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnServiceProps`
 *
 * @param properties - the TypeScript properties of a `CfnServiceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServicePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authType", cdk.validateString)(properties.authType));
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("customDomainName", cdk.validateString)(properties.customDomainName));
  errors.collect(cdk.propertyValidator("dnsEntry", CfnServiceDnsEntryPropertyValidator)(properties.dnsEntry));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnServiceProps\"");
}

// @ts-ignore TS6133
function convertCfnServicePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServicePropsValidator(properties).assertSuccess();
  return {
    "AuthType": cdk.stringToCloudFormation(properties.authType),
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn),
    "CustomDomainName": cdk.stringToCloudFormation(properties.customDomainName),
    "DnsEntry": convertCfnServiceDnsEntryPropertyToCloudFormation(properties.dnsEntry),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnServicePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceProps>();
  ret.addPropertyResult("authType", "AuthType", (properties.AuthType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthType) : undefined));
  ret.addPropertyResult("certificateArn", "CertificateArn", (properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined));
  ret.addPropertyResult("customDomainName", "CustomDomainName", (properties.CustomDomainName != null ? cfn_parse.FromCloudFormation.getString(properties.CustomDomainName) : undefined));
  ret.addPropertyResult("dnsEntry", "DnsEntry", (properties.DnsEntry != null ? CfnServiceDnsEntryPropertyFromCloudFormation(properties.DnsEntry) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a service network.
 *
 * A service network is a logical boundary for a collection of services. You can associate services and VPCs with a service network.
 *
 * For more information, see [Service networks](https://docs.aws.amazon.com/vpc-lattice/latest/ug/service-networks.html) in the *Amazon VPC Lattice User Guide* .
 *
 * @cloudformationResource AWS::VpcLattice::ServiceNetwork
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetwork.html
 */
export class CfnServiceNetwork extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::VpcLattice::ServiceNetwork";

  /**
   * Build a CfnServiceNetwork from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnServiceNetwork {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnServiceNetworkPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnServiceNetwork(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the service network.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The date and time that the service network was created, specified in ISO-8601 format.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The ID of the service network.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The date and time of the last update, specified in ISO-8601 format.
   *
   * @cloudformationAttribute LastUpdatedAt
   */
  public readonly attrLastUpdatedAt: string;

  /**
   * The type of IAM policy.
   */
  public authType?: string;

  /**
   * The name of the service network.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags for the service network.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServiceNetworkProps = {}) {
    super(scope, id, {
      "type": CfnServiceNetwork.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLastUpdatedAt = cdk.Token.asString(this.getAtt("LastUpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.authType = props.authType;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::VpcLattice::ServiceNetwork", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authType": this.authType,
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnServiceNetwork.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnServiceNetworkPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnServiceNetwork`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetwork.html
 */
export interface CfnServiceNetworkProps {
  /**
   * The type of IAM policy.
   *
   * - `NONE` : The resource does not use an IAM policy. This is the default.
   * - `AWS_IAM` : The resource uses an IAM policy. When this type is used, auth is enabled and an auth policy is required.
   *
   * @default - "NONE"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetwork.html#cfn-vpclattice-servicenetwork-authtype
   */
  readonly authType?: string;

  /**
   * The name of the service network.
   *
   * The name must be unique to the account. The valid characters are a-z, 0-9, and hyphens (-). You can't use a hyphen as the first or last character, or immediately after another hyphen.
   *
   * If you don't specify a name, CloudFormation generates one. However, if you specify a name, and later want to replace the resource, you must specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetwork.html#cfn-vpclattice-servicenetwork-name
   */
  readonly name?: string;

  /**
   * The tags for the service network.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetwork.html#cfn-vpclattice-servicenetwork-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnServiceNetworkProps`
 *
 * @param properties - the TypeScript properties of a `CfnServiceNetworkProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceNetworkPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authType", cdk.validateString)(properties.authType));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnServiceNetworkProps\"");
}

// @ts-ignore TS6133
function convertCfnServiceNetworkPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceNetworkPropsValidator(properties).assertSuccess();
  return {
    "AuthType": cdk.stringToCloudFormation(properties.authType),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnServiceNetworkPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceNetworkProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceNetworkProps>();
  ret.addPropertyResult("authType", "AuthType", (properties.AuthType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthType) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Associates a service with a service network.
 *
 * For more information, see [Manage service associations](https://docs.aws.amazon.com/vpc-lattice/latest/ug/service-network-associations.html#service-network-service-associations) in the *Amazon VPC Lattice User Guide* .
 *
 * You can't use this operation if the service and service network are already associated or if there is a disassociation or deletion in progress. If the association fails, you can retry the operation by deleting the association and recreating it.
 *
 * You cannot associate a service and service network that are shared with a caller. The caller must own either the service or the service network.
 *
 * As a result of this operation, the association is created in the service network account and the association owner account.
 *
 * @cloudformationResource AWS::VpcLattice::ServiceNetworkServiceAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetworkserviceassociation.html
 */
export class CfnServiceNetworkServiceAssociation extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::VpcLattice::ServiceNetworkServiceAssociation";

  /**
   * Build a CfnServiceNetworkServiceAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnServiceNetworkServiceAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnServiceNetworkServiceAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnServiceNetworkServiceAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the association between the service network and the service.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The date and time that the association was created, specified in ISO-8601 format.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * @cloudformationAttribute DnsEntry.DomainName
   */
  public readonly attrDnsEntryDomainName: string;

  /**
   * @cloudformationAttribute DnsEntry.HostedZoneId
   */
  public readonly attrDnsEntryHostedZoneId: string;

  /**
   * The ID of the of the association between the service network and the service.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The Amazon Resource Name (ARN) of the service.
   *
   * @cloudformationAttribute ServiceArn
   */
  public readonly attrServiceArn: string;

  /**
   * The ID of the service.
   *
   * @cloudformationAttribute ServiceId
   */
  public readonly attrServiceId: string;

  /**
   * The name of the service.
   *
   * @cloudformationAttribute ServiceName
   */
  public readonly attrServiceName: string;

  /**
   * The Amazon Resource Name (ARN) of the service network
   *
   * @cloudformationAttribute ServiceNetworkArn
   */
  public readonly attrServiceNetworkArn: string;

  /**
   * The ID of the service network.
   *
   * @cloudformationAttribute ServiceNetworkId
   */
  public readonly attrServiceNetworkId: string;

  /**
   * The name of the service network.
   *
   * @cloudformationAttribute ServiceNetworkName
   */
  public readonly attrServiceNetworkName: string;

  /**
   * The status of the association between the service network and the service.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The DNS information of the service.
   */
  public dnsEntry?: CfnServiceNetworkServiceAssociation.DnsEntryProperty | cdk.IResolvable;

  /**
   * The ID or Amazon Resource Name (ARN) of the service.
   */
  public serviceIdentifier?: string;

  /**
   * The ID or Amazon Resource Name (ARN) of the service network.
   */
  public serviceNetworkIdentifier?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags for the association.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServiceNetworkServiceAssociationProps = {}) {
    super(scope, id, {
      "type": CfnServiceNetworkServiceAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrDnsEntryDomainName = cdk.Token.asString(this.getAtt("DnsEntry.DomainName", cdk.ResolutionTypeHint.STRING));
    this.attrDnsEntryHostedZoneId = cdk.Token.asString(this.getAtt("DnsEntry.HostedZoneId", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrServiceArn = cdk.Token.asString(this.getAtt("ServiceArn", cdk.ResolutionTypeHint.STRING));
    this.attrServiceId = cdk.Token.asString(this.getAtt("ServiceId", cdk.ResolutionTypeHint.STRING));
    this.attrServiceName = cdk.Token.asString(this.getAtt("ServiceName", cdk.ResolutionTypeHint.STRING));
    this.attrServiceNetworkArn = cdk.Token.asString(this.getAtt("ServiceNetworkArn", cdk.ResolutionTypeHint.STRING));
    this.attrServiceNetworkId = cdk.Token.asString(this.getAtt("ServiceNetworkId", cdk.ResolutionTypeHint.STRING));
    this.attrServiceNetworkName = cdk.Token.asString(this.getAtt("ServiceNetworkName", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.dnsEntry = props.dnsEntry;
    this.serviceIdentifier = props.serviceIdentifier;
    this.serviceNetworkIdentifier = props.serviceNetworkIdentifier;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::VpcLattice::ServiceNetworkServiceAssociation", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dnsEntry": this.dnsEntry,
      "serviceIdentifier": this.serviceIdentifier,
      "serviceNetworkIdentifier": this.serviceNetworkIdentifier,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnServiceNetworkServiceAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnServiceNetworkServiceAssociationPropsToCloudFormation(props);
  }
}

export namespace CfnServiceNetworkServiceAssociation {
  /**
   * The DNS information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-servicenetworkserviceassociation-dnsentry.html
   */
  export interface DnsEntryProperty {
    /**
     * The domain name of the service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-servicenetworkserviceassociation-dnsentry.html#cfn-vpclattice-servicenetworkserviceassociation-dnsentry-domainname
     */
    readonly domainName?: string;

    /**
     * The ID of the hosted zone.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-servicenetworkserviceassociation-dnsentry.html#cfn-vpclattice-servicenetworkserviceassociation-dnsentry-hostedzoneid
     */
    readonly hostedZoneId?: string;
  }
}

/**
 * Properties for defining a `CfnServiceNetworkServiceAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetworkserviceassociation.html
 */
export interface CfnServiceNetworkServiceAssociationProps {
  /**
   * The DNS information of the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetworkserviceassociation.html#cfn-vpclattice-servicenetworkserviceassociation-dnsentry
   */
  readonly dnsEntry?: CfnServiceNetworkServiceAssociation.DnsEntryProperty | cdk.IResolvable;

  /**
   * The ID or Amazon Resource Name (ARN) of the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetworkserviceassociation.html#cfn-vpclattice-servicenetworkserviceassociation-serviceidentifier
   */
  readonly serviceIdentifier?: string;

  /**
   * The ID or Amazon Resource Name (ARN) of the service network.
   *
   * You must use the ARN if the resources specified in the operation are in different accounts.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetworkserviceassociation.html#cfn-vpclattice-servicenetworkserviceassociation-servicenetworkidentifier
   */
  readonly serviceNetworkIdentifier?: string;

  /**
   * The tags for the association.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetworkserviceassociation.html#cfn-vpclattice-servicenetworkserviceassociation-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `DnsEntryProperty`
 *
 * @param properties - the TypeScript properties of a `DnsEntryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceNetworkServiceAssociationDnsEntryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("hostedZoneId", cdk.validateString)(properties.hostedZoneId));
  return errors.wrap("supplied properties not correct for \"DnsEntryProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceNetworkServiceAssociationDnsEntryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceNetworkServiceAssociationDnsEntryPropertyValidator(properties).assertSuccess();
  return {
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "HostedZoneId": cdk.stringToCloudFormation(properties.hostedZoneId)
  };
}

// @ts-ignore TS6133
function CfnServiceNetworkServiceAssociationDnsEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceNetworkServiceAssociation.DnsEntryProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceNetworkServiceAssociation.DnsEntryProperty>();
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("hostedZoneId", "HostedZoneId", (properties.HostedZoneId != null ? cfn_parse.FromCloudFormation.getString(properties.HostedZoneId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnServiceNetworkServiceAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnServiceNetworkServiceAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceNetworkServiceAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dnsEntry", CfnServiceNetworkServiceAssociationDnsEntryPropertyValidator)(properties.dnsEntry));
  errors.collect(cdk.propertyValidator("serviceIdentifier", cdk.validateString)(properties.serviceIdentifier));
  errors.collect(cdk.propertyValidator("serviceNetworkIdentifier", cdk.validateString)(properties.serviceNetworkIdentifier));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnServiceNetworkServiceAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnServiceNetworkServiceAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceNetworkServiceAssociationPropsValidator(properties).assertSuccess();
  return {
    "DnsEntry": convertCfnServiceNetworkServiceAssociationDnsEntryPropertyToCloudFormation(properties.dnsEntry),
    "ServiceIdentifier": cdk.stringToCloudFormation(properties.serviceIdentifier),
    "ServiceNetworkIdentifier": cdk.stringToCloudFormation(properties.serviceNetworkIdentifier),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnServiceNetworkServiceAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceNetworkServiceAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceNetworkServiceAssociationProps>();
  ret.addPropertyResult("dnsEntry", "DnsEntry", (properties.DnsEntry != null ? CfnServiceNetworkServiceAssociationDnsEntryPropertyFromCloudFormation(properties.DnsEntry) : undefined));
  ret.addPropertyResult("serviceIdentifier", "ServiceIdentifier", (properties.ServiceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceIdentifier) : undefined));
  ret.addPropertyResult("serviceNetworkIdentifier", "ServiceNetworkIdentifier", (properties.ServiceNetworkIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceNetworkIdentifier) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Associates a VPC with a service network.
 *
 * When you associate a VPC with the service network, it enables all the resources within that VPC to be clients and communicate with other services in the service network. For more information, see [Manage VPC associations](https://docs.aws.amazon.com/vpc-lattice/latest/ug/service-network-associations.html#service-network-vpc-associations) in the *Amazon VPC Lattice User Guide* .
 *
 * You can't use this operation if there is a disassociation in progress. If the association fails, retry by deleting the association and recreating it.
 *
 * As a result of this operation, the association gets created in the service network account and the VPC owner account.
 *
 * If you add a security group to the service network and VPC association, the association must continue to always have at least one security group. You can add or edit security groups at any time. However, to remove all security groups, you must first delete the association and recreate it without security groups.
 *
 * @cloudformationResource AWS::VpcLattice::ServiceNetworkVpcAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetworkvpcassociation.html
 */
export class CfnServiceNetworkVpcAssociation extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::VpcLattice::ServiceNetworkVpcAssociation";

  /**
   * Build a CfnServiceNetworkVpcAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnServiceNetworkVpcAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnServiceNetworkVpcAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnServiceNetworkVpcAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the association between the service network and the VPC.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The date and time that the association was created, specified in ISO-8601 format.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The ID of the specified association between the service network and the VPC.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The Amazon Resource Name (ARN) of the service network.
   *
   * @cloudformationAttribute ServiceNetworkArn
   */
  public readonly attrServiceNetworkArn: string;

  /**
   * The ID of the service network.
   *
   * @cloudformationAttribute ServiceNetworkId
   */
  public readonly attrServiceNetworkId: string;

  /**
   * The name of the service network.
   *
   * @cloudformationAttribute ServiceNetworkName
   */
  public readonly attrServiceNetworkName: string;

  /**
   * The status of the association.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The ID of the VPC.
   *
   * @cloudformationAttribute VpcId
   */
  public readonly attrVpcId: string;

  /**
   * The IDs of the security groups.
   */
  public securityGroupIds?: Array<string>;

  /**
   * The ID or Amazon Resource Name (ARN) of the service network.
   */
  public serviceNetworkIdentifier?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags for the association.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The ID of the VPC.
   */
  public vpcIdentifier?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServiceNetworkVpcAssociationProps = {}) {
    super(scope, id, {
      "type": CfnServiceNetworkVpcAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrServiceNetworkArn = cdk.Token.asString(this.getAtt("ServiceNetworkArn", cdk.ResolutionTypeHint.STRING));
    this.attrServiceNetworkId = cdk.Token.asString(this.getAtt("ServiceNetworkId", cdk.ResolutionTypeHint.STRING));
    this.attrServiceNetworkName = cdk.Token.asString(this.getAtt("ServiceNetworkName", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.attrVpcId = cdk.Token.asString(this.getAtt("VpcId", cdk.ResolutionTypeHint.STRING));
    this.securityGroupIds = props.securityGroupIds;
    this.serviceNetworkIdentifier = props.serviceNetworkIdentifier;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::VpcLattice::ServiceNetworkVpcAssociation", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcIdentifier = props.vpcIdentifier;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "securityGroupIds": this.securityGroupIds,
      "serviceNetworkIdentifier": this.serviceNetworkIdentifier,
      "tags": this.tags.renderTags(),
      "vpcIdentifier": this.vpcIdentifier
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnServiceNetworkVpcAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnServiceNetworkVpcAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnServiceNetworkVpcAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetworkvpcassociation.html
 */
export interface CfnServiceNetworkVpcAssociationProps {
  /**
   * The IDs of the security groups.
   *
   * Security groups aren't added by default. You can add a security group to apply network level controls to control which resources in a VPC are allowed to access the service network and its services. For more information, see [Control traffic to resources using security groups](https://docs.aws.amazon.com//vpc/latest/userguide/VPC_SecurityGroups.html) in the *Amazon VPC User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetworkvpcassociation.html#cfn-vpclattice-servicenetworkvpcassociation-securitygroupids
   */
  readonly securityGroupIds?: Array<string>;

  /**
   * The ID or Amazon Resource Name (ARN) of the service network.
   *
   * You must use the ARN when the resources specified in the operation are in different accounts.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetworkvpcassociation.html#cfn-vpclattice-servicenetworkvpcassociation-servicenetworkidentifier
   */
  readonly serviceNetworkIdentifier?: string;

  /**
   * The tags for the association.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetworkvpcassociation.html#cfn-vpclattice-servicenetworkvpcassociation-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ID of the VPC.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-servicenetworkvpcassociation.html#cfn-vpclattice-servicenetworkvpcassociation-vpcidentifier
   */
  readonly vpcIdentifier?: string;
}

/**
 * Determine whether the given properties match those of a `CfnServiceNetworkVpcAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnServiceNetworkVpcAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceNetworkVpcAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("serviceNetworkIdentifier", cdk.validateString)(properties.serviceNetworkIdentifier));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcIdentifier", cdk.validateString)(properties.vpcIdentifier));
  return errors.wrap("supplied properties not correct for \"CfnServiceNetworkVpcAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnServiceNetworkVpcAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceNetworkVpcAssociationPropsValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "ServiceNetworkIdentifier": cdk.stringToCloudFormation(properties.serviceNetworkIdentifier),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpcIdentifier": cdk.stringToCloudFormation(properties.vpcIdentifier)
  };
}

// @ts-ignore TS6133
function CfnServiceNetworkVpcAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceNetworkVpcAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceNetworkVpcAssociationProps>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("serviceNetworkIdentifier", "ServiceNetworkIdentifier", (properties.ServiceNetworkIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceNetworkIdentifier) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcIdentifier", "VpcIdentifier", (properties.VpcIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.VpcIdentifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a target group.
 *
 * A target group is a collection of targets, or compute resources, that run your application or service. A target group can only be used by a single service.
 *
 * For more information, see [Target groups](https://docs.aws.amazon.com/vpc-lattice/latest/ug/target-groups.html) in the *Amazon VPC Lattice User Guide* .
 *
 * @cloudformationResource AWS::VpcLattice::TargetGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-targetgroup.html
 */
export class CfnTargetGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::VpcLattice::TargetGroup";

  /**
   * Build a CfnTargetGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTargetGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTargetGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTargetGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the target group.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The date and time that the target group was created, specified in ISO-8601 format.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The ID of the target group.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The date and time that the target group was last updated, specified in ISO-8601 format.
   *
   * @cloudformationAttribute LastUpdatedAt
   */
  public readonly attrLastUpdatedAt: string;

  /**
   * The operation's status. You can retry the operation if the status is `CREATE_FAILED` . However, if you retry it while the status is `CREATE_IN_PROGRESS` , there is no change in the status.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The target group configuration.
   */
  public config?: cdk.IResolvable | CfnTargetGroup.TargetGroupConfigProperty;

  /**
   * The name of the target group.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags for the target group.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Describes a target.
   */
  public targets?: Array<cdk.IResolvable | CfnTargetGroup.TargetProperty> | cdk.IResolvable;

  /**
   * The type of target group.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTargetGroupProps) {
    super(scope, id, {
      "type": CfnTargetGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "type", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLastUpdatedAt = cdk.Token.asString(this.getAtt("LastUpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.config = props.config;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::VpcLattice::TargetGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targets = props.targets;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "config": this.config,
      "name": this.name,
      "tags": this.tags.renderTags(),
      "targets": this.targets,
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTargetGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTargetGroupPropsToCloudFormation(props);
  }
}

export namespace CfnTargetGroup {
  /**
   * Describes the configuration of a target group.
   *
   * For more information, see [Target groups](https://docs.aws.amazon.com/vpc-lattice/latest/ug/target-groups.html) in the *Amazon VPC Lattice User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-targetgroupconfig.html
   */
  export interface TargetGroupConfigProperty {
    /**
     * The health check configuration.
     *
     * Not supported if the target group type is `LAMBDA` or `ALB` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-targetgroupconfig.html#cfn-vpclattice-targetgroup-targetgroupconfig-healthcheck
     */
    readonly healthCheck?: CfnTargetGroup.HealthCheckConfigProperty | cdk.IResolvable;

    /**
     * The type of IP address used for the target group.
     *
     * Supported only if the target group type is `IP` . The default is `IPV4` .
     *
     * @default - "IPV4"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-targetgroupconfig.html#cfn-vpclattice-targetgroup-targetgroupconfig-ipaddresstype
     */
    readonly ipAddressType?: string;

    /**
     * The version of the event structure that your Lambda function receives.
     *
     * Supported only if the target group type is `LAMBDA` . The default is `V1` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-targetgroupconfig.html#cfn-vpclattice-targetgroup-targetgroupconfig-lambdaeventstructureversion
     */
    readonly lambdaEventStructureVersion?: string;

    /**
     * The port on which the targets are listening.
     *
     * For HTTP, the default is 80. For HTTPS, the default is 443. Not supported if the target group type is `LAMBDA` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-targetgroupconfig.html#cfn-vpclattice-targetgroup-targetgroupconfig-port
     */
    readonly port?: number;

    /**
     * The protocol to use for routing traffic to the targets.
     *
     * The default is the protocol of the target group. Not supported if the target group type is `LAMBDA` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-targetgroupconfig.html#cfn-vpclattice-targetgroup-targetgroupconfig-protocol
     */
    readonly protocol?: string;

    /**
     * The protocol version.
     *
     * The default is `HTTP1` . Not supported if the target group type is `LAMBDA` .
     *
     * @default - "HTTP1"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-targetgroupconfig.html#cfn-vpclattice-targetgroup-targetgroupconfig-protocolversion
     */
    readonly protocolVersion?: string;

    /**
     * The ID of the VPC.
     *
     * Not supported if the target group type is `LAMBDA` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-targetgroupconfig.html#cfn-vpclattice-targetgroup-targetgroupconfig-vpcidentifier
     */
    readonly vpcIdentifier?: string;
  }

  /**
   * Describes the health check configuration of a target group.
   *
   * Health check configurations aren't used for target groups of type `LAMBDA` or `ALB` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-healthcheckconfig.html
   */
  export interface HealthCheckConfigProperty {
    /**
     * Indicates whether health checking is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-healthcheckconfig.html#cfn-vpclattice-targetgroup-healthcheckconfig-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The approximate amount of time, in seconds, between health checks of an individual target.
     *
     * The range is 5–300 seconds. The default is 30 seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-healthcheckconfig.html#cfn-vpclattice-targetgroup-healthcheckconfig-healthcheckintervalseconds
     */
    readonly healthCheckIntervalSeconds?: number;

    /**
     * The amount of time, in seconds, to wait before reporting a target as unhealthy.
     *
     * The range is 1–120 seconds. The default is 5 seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-healthcheckconfig.html#cfn-vpclattice-targetgroup-healthcheckconfig-healthchecktimeoutseconds
     */
    readonly healthCheckTimeoutSeconds?: number;

    /**
     * The number of consecutive successful health checks required before considering an unhealthy target healthy.
     *
     * The range is 2–10. The default is 5.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-healthcheckconfig.html#cfn-vpclattice-targetgroup-healthcheckconfig-healthythresholdcount
     */
    readonly healthyThresholdCount?: number;

    /**
     * The codes to use when checking for a successful response from a target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-healthcheckconfig.html#cfn-vpclattice-targetgroup-healthcheckconfig-matcher
     */
    readonly matcher?: cdk.IResolvable | CfnTargetGroup.MatcherProperty;

    /**
     * The destination for health checks on the targets.
     *
     * If the protocol version is `HTTP/1.1` or `HTTP/2` , specify a valid URI (for example, `/path?query` ). The default path is `/` . Health checks are not supported if the protocol version is `gRPC` , however, you can choose `HTTP/1.1` or `HTTP/2` and specify a valid URI.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-healthcheckconfig.html#cfn-vpclattice-targetgroup-healthcheckconfig-path
     */
    readonly path?: string;

    /**
     * The port used when performing health checks on targets.
     *
     * The default setting is the port that a target receives traffic on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-healthcheckconfig.html#cfn-vpclattice-targetgroup-healthcheckconfig-port
     */
    readonly port?: number;

    /**
     * The protocol used when performing health checks on targets.
     *
     * The possible protocols are `HTTP` and `HTTPS` . The default is `HTTP` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-healthcheckconfig.html#cfn-vpclattice-targetgroup-healthcheckconfig-protocol
     */
    readonly protocol?: string;

    /**
     * The protocol version used when performing health checks on targets.
     *
     * The possible protocol versions are `HTTP1` and `HTTP2` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-healthcheckconfig.html#cfn-vpclattice-targetgroup-healthcheckconfig-protocolversion
     */
    readonly protocolVersion?: string;

    /**
     * The number of consecutive failed health checks required before considering a target unhealthy.
     *
     * The range is 2–10. The default is 2.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-healthcheckconfig.html#cfn-vpclattice-targetgroup-healthcheckconfig-unhealthythresholdcount
     */
    readonly unhealthyThresholdCount?: number;
  }

  /**
   * Describes the codes to use when checking for a successful response from a target for health checks.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-matcher.html
   */
  export interface MatcherProperty {
    /**
     * The HTTP code to use when checking for a successful response from a target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-matcher.html#cfn-vpclattice-targetgroup-matcher-httpcode
     */
    readonly httpCode: string;
  }

  /**
   * Describes a target.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-target.html
   */
  export interface TargetProperty {
    /**
     * The ID of the target.
     *
     * If the target group type is `INSTANCE` , this is an instance ID. If the target group type is `IP` , this is an IP address. If the target group type is `LAMBDA` , this is the ARN of a Lambda function. If the target group type is `ALB` , this is the ARN of an Application Load Balancer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-target.html#cfn-vpclattice-targetgroup-target-id
     */
    readonly id: string;

    /**
     * The port on which the target is listening.
     *
     * For HTTP, the default is 80. For HTTPS, the default is 443.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-vpclattice-targetgroup-target.html#cfn-vpclattice-targetgroup-target-port
     */
    readonly port?: number;
  }
}

/**
 * Properties for defining a `CfnTargetGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-targetgroup.html
 */
export interface CfnTargetGroupProps {
  /**
   * The target group configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-targetgroup.html#cfn-vpclattice-targetgroup-config
   */
  readonly config?: cdk.IResolvable | CfnTargetGroup.TargetGroupConfigProperty;

  /**
   * The name of the target group.
   *
   * The name must be unique within the account. The valid characters are a-z, 0-9, and hyphens (-). You can't use a hyphen as the first or last character, or immediately after another hyphen.
   *
   * If you don't specify a name, CloudFormation generates one. However, if you specify a name, and later want to replace the resource, you must specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-targetgroup.html#cfn-vpclattice-targetgroup-name
   */
  readonly name?: string;

  /**
   * The tags for the target group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-targetgroup.html#cfn-vpclattice-targetgroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Describes a target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-targetgroup.html#cfn-vpclattice-targetgroup-targets
   */
  readonly targets?: Array<cdk.IResolvable | CfnTargetGroup.TargetProperty> | cdk.IResolvable;

  /**
   * The type of target group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-vpclattice-targetgroup.html#cfn-vpclattice-targetgroup-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `MatcherProperty`
 *
 * @param properties - the TypeScript properties of a `MatcherProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTargetGroupMatcherPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("httpCode", cdk.requiredValidator)(properties.httpCode));
  errors.collect(cdk.propertyValidator("httpCode", cdk.validateString)(properties.httpCode));
  return errors.wrap("supplied properties not correct for \"MatcherProperty\"");
}

// @ts-ignore TS6133
function convertCfnTargetGroupMatcherPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTargetGroupMatcherPropertyValidator(properties).assertSuccess();
  return {
    "HttpCode": cdk.stringToCloudFormation(properties.httpCode)
  };
}

// @ts-ignore TS6133
function CfnTargetGroupMatcherPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTargetGroup.MatcherProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTargetGroup.MatcherProperty>();
  ret.addPropertyResult("httpCode", "HttpCode", (properties.HttpCode != null ? cfn_parse.FromCloudFormation.getString(properties.HttpCode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HealthCheckConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HealthCheckConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTargetGroupHealthCheckConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("healthCheckIntervalSeconds", cdk.validateNumber)(properties.healthCheckIntervalSeconds));
  errors.collect(cdk.propertyValidator("healthCheckTimeoutSeconds", cdk.validateNumber)(properties.healthCheckTimeoutSeconds));
  errors.collect(cdk.propertyValidator("healthyThresholdCount", cdk.validateNumber)(properties.healthyThresholdCount));
  errors.collect(cdk.propertyValidator("matcher", CfnTargetGroupMatcherPropertyValidator)(properties.matcher));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocolVersion", cdk.validateString)(properties.protocolVersion));
  errors.collect(cdk.propertyValidator("unhealthyThresholdCount", cdk.validateNumber)(properties.unhealthyThresholdCount));
  return errors.wrap("supplied properties not correct for \"HealthCheckConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnTargetGroupHealthCheckConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTargetGroupHealthCheckConfigPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "HealthCheckIntervalSeconds": cdk.numberToCloudFormation(properties.healthCheckIntervalSeconds),
    "HealthCheckTimeoutSeconds": cdk.numberToCloudFormation(properties.healthCheckTimeoutSeconds),
    "HealthyThresholdCount": cdk.numberToCloudFormation(properties.healthyThresholdCount),
    "Matcher": convertCfnTargetGroupMatcherPropertyToCloudFormation(properties.matcher),
    "Path": cdk.stringToCloudFormation(properties.path),
    "Port": cdk.numberToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "ProtocolVersion": cdk.stringToCloudFormation(properties.protocolVersion),
    "UnhealthyThresholdCount": cdk.numberToCloudFormation(properties.unhealthyThresholdCount)
  };
}

// @ts-ignore TS6133
function CfnTargetGroupHealthCheckConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTargetGroup.HealthCheckConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTargetGroup.HealthCheckConfigProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("healthCheckIntervalSeconds", "HealthCheckIntervalSeconds", (properties.HealthCheckIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthCheckIntervalSeconds) : undefined));
  ret.addPropertyResult("healthCheckTimeoutSeconds", "HealthCheckTimeoutSeconds", (properties.HealthCheckTimeoutSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthCheckTimeoutSeconds) : undefined));
  ret.addPropertyResult("healthyThresholdCount", "HealthyThresholdCount", (properties.HealthyThresholdCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthyThresholdCount) : undefined));
  ret.addPropertyResult("matcher", "Matcher", (properties.Matcher != null ? CfnTargetGroupMatcherPropertyFromCloudFormation(properties.Matcher) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("protocolVersion", "ProtocolVersion", (properties.ProtocolVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ProtocolVersion) : undefined));
  ret.addPropertyResult("unhealthyThresholdCount", "UnhealthyThresholdCount", (properties.UnhealthyThresholdCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.UnhealthyThresholdCount) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetGroupConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TargetGroupConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTargetGroupTargetGroupConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("healthCheck", CfnTargetGroupHealthCheckConfigPropertyValidator)(properties.healthCheck));
  errors.collect(cdk.propertyValidator("ipAddressType", cdk.validateString)(properties.ipAddressType));
  errors.collect(cdk.propertyValidator("lambdaEventStructureVersion", cdk.validateString)(properties.lambdaEventStructureVersion));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocolVersion", cdk.validateString)(properties.protocolVersion));
  errors.collect(cdk.propertyValidator("vpcIdentifier", cdk.validateString)(properties.vpcIdentifier));
  return errors.wrap("supplied properties not correct for \"TargetGroupConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnTargetGroupTargetGroupConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTargetGroupTargetGroupConfigPropertyValidator(properties).assertSuccess();
  return {
    "HealthCheck": convertCfnTargetGroupHealthCheckConfigPropertyToCloudFormation(properties.healthCheck),
    "IpAddressType": cdk.stringToCloudFormation(properties.ipAddressType),
    "LambdaEventStructureVersion": cdk.stringToCloudFormation(properties.lambdaEventStructureVersion),
    "Port": cdk.numberToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "ProtocolVersion": cdk.stringToCloudFormation(properties.protocolVersion),
    "VpcIdentifier": cdk.stringToCloudFormation(properties.vpcIdentifier)
  };
}

// @ts-ignore TS6133
function CfnTargetGroupTargetGroupConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTargetGroup.TargetGroupConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTargetGroup.TargetGroupConfigProperty>();
  ret.addPropertyResult("healthCheck", "HealthCheck", (properties.HealthCheck != null ? CfnTargetGroupHealthCheckConfigPropertyFromCloudFormation(properties.HealthCheck) : undefined));
  ret.addPropertyResult("ipAddressType", "IpAddressType", (properties.IpAddressType != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddressType) : undefined));
  ret.addPropertyResult("lambdaEventStructureVersion", "LambdaEventStructureVersion", (properties.LambdaEventStructureVersion != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaEventStructureVersion) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("protocolVersion", "ProtocolVersion", (properties.ProtocolVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ProtocolVersion) : undefined));
  ret.addPropertyResult("vpcIdentifier", "VpcIdentifier", (properties.VpcIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.VpcIdentifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetProperty`
 *
 * @param properties - the TypeScript properties of a `TargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTargetGroupTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  return errors.wrap("supplied properties not correct for \"TargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnTargetGroupTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTargetGroupTargetPropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.stringToCloudFormation(properties.id),
    "Port": cdk.numberToCloudFormation(properties.port)
  };
}

// @ts-ignore TS6133
function CfnTargetGroupTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTargetGroup.TargetProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTargetGroup.TargetProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTargetGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnTargetGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTargetGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("config", CfnTargetGroupTargetGroupConfigPropertyValidator)(properties.config));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("targets", cdk.listValidator(CfnTargetGroupTargetPropertyValidator))(properties.targets));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnTargetGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnTargetGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTargetGroupPropsValidator(properties).assertSuccess();
  return {
    "Config": convertCfnTargetGroupTargetGroupConfigPropertyToCloudFormation(properties.config),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Targets": cdk.listMapper(convertCfnTargetGroupTargetPropertyToCloudFormation)(properties.targets),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnTargetGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTargetGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTargetGroupProps>();
  ret.addPropertyResult("config", "Config", (properties.Config != null ? CfnTargetGroupTargetGroupConfigPropertyFromCloudFormation(properties.Config) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("targets", "Targets", (properties.Targets != null ? cfn_parse.FromCloudFormation.getArray(CfnTargetGroupTargetPropertyFromCloudFormation)(properties.Targets) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}