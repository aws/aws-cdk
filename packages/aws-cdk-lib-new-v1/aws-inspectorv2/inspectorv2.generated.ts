/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Details about a filter.
 *
 * @cloudformationResource AWS::InspectorV2::Filter
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspectorv2-filter.html
 */
export class CfnFilter extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::InspectorV2::Filter";

  /**
   * Build a CfnFilter from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFilter {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFilterPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFilter(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Number (ARN) associated with this filter.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A description of the filter.
   */
  public description?: string;

  /**
   * The action that is to be applied to the findings that match the filter.
   */
  public filterAction: string;

  /**
   * Details on the filter criteria associated with this filter.
   */
  public filterCriteria: CfnFilter.FilterCriteriaProperty | cdk.IResolvable;

  /**
   * The name of the filter.
   */
  public name: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFilterProps) {
    super(scope, id, {
      "type": CfnFilter.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "filterAction", this);
    cdk.requireProperty(props, "filterCriteria", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.filterAction = props.filterAction;
    this.filterCriteria = props.filterCriteria;
    this.name = props.name;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "filterAction": this.filterAction,
      "filterCriteria": this.filterCriteria,
      "name": this.name
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFilter.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFilterPropsToCloudFormation(props);
  }
}

export namespace CfnFilter {
  /**
   * Details on the criteria used to define the filter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html
   */
  export interface FilterCriteriaProperty {
    /**
     * Details of the AWS account IDs used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-awsaccountid
     */
    readonly awsAccountId?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details of the component IDs used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-componentid
     */
    readonly componentId?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details of the component types used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-componenttype
     */
    readonly componentType?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details of the Amazon EC2 instance image IDs used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ec2instanceimageid
     */
    readonly ec2InstanceImageId?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details of the Amazon EC2 instance subnet IDs used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ec2instancesubnetid
     */
    readonly ec2InstanceSubnetId?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details of the Amazon EC2 instance VPC IDs used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ec2instancevpcid
     */
    readonly ec2InstanceVpcId?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details of the Amazon ECR image architecture types used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ecrimagearchitecture
     */
    readonly ecrImageArchitecture?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details of the Amazon ECR image hashes used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ecrimagehash
     */
    readonly ecrImageHash?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details on the Amazon ECR image push date and time used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ecrimagepushedat
     */
    readonly ecrImagePushedAt?: Array<CfnFilter.DateFilterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Details on the Amazon ECR registry used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ecrimageregistry
     */
    readonly ecrImageRegistry?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details on the name of the Amazon ECR repository used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ecrimagerepositoryname
     */
    readonly ecrImageRepositoryName?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * The tags attached to the Amazon ECR container image.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ecrimagetags
     */
    readonly ecrImageTags?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details on the finding ARNs used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-findingarn
     */
    readonly findingArn?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details on the finding status types used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-findingstatus
     */
    readonly findingStatus?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details on the finding types used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-findingtype
     */
    readonly findingType?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details on the date and time a finding was first seen used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-firstobservedat
     */
    readonly firstObservedAt?: Array<CfnFilter.DateFilterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Amazon Inspector score to filter on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-inspectorscore
     */
    readonly inspectorScore?: Array<cdk.IResolvable | CfnFilter.NumberFilterProperty> | cdk.IResolvable;

    /**
     * Details on the date and time a finding was last seen used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-lastobservedat
     */
    readonly lastObservedAt?: Array<CfnFilter.DateFilterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Details on network protocol used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-networkprotocol
     */
    readonly networkProtocol?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details on the port ranges used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-portrange
     */
    readonly portRange?: Array<cdk.IResolvable | CfnFilter.PortRangeFilterProperty> | cdk.IResolvable;

    /**
     * Details on the related vulnerabilities used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-relatedvulnerabilities
     */
    readonly relatedVulnerabilities?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details on the resource IDs used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-resourceid
     */
    readonly resourceId?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details on the resource tags used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-resourcetags
     */
    readonly resourceTags?: Array<cdk.IResolvable | CfnFilter.MapFilterProperty> | cdk.IResolvable;

    /**
     * Details on the resource types used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-resourcetype
     */
    readonly resourceType?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details on the severity used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-severity
     */
    readonly severity?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details on the finding title used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-title
     */
    readonly title?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details on the date and time a finding was last updated at used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-updatedat
     */
    readonly updatedAt?: Array<CfnFilter.DateFilterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Details on the vendor severity used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-vendorseverity
     */
    readonly vendorSeverity?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details on the vulnerability ID used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-vulnerabilityid
     */
    readonly vulnerabilityId?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details on the vulnerability score to filter findings by.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-vulnerabilitysource
     */
    readonly vulnerabilitySource?: Array<cdk.IResolvable | CfnFilter.StringFilterProperty> | cdk.IResolvable;

    /**
     * Details on the vulnerable packages used to filter findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-vulnerablepackages
     */
    readonly vulnerablePackages?: Array<cdk.IResolvable | CfnFilter.PackageFilterProperty> | cdk.IResolvable;
  }

  /**
   * An object that describes details of a map filter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-mapfilter.html
   */
  export interface MapFilterProperty {
    /**
     * The operator to use when comparing values in the filter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-mapfilter.html#cfn-inspectorv2-filter-mapfilter-comparison
     */
    readonly comparison: string;

    /**
     * The tag key used in the filter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-mapfilter.html#cfn-inspectorv2-filter-mapfilter-key
     */
    readonly key?: string;

    /**
     * The tag value used in the filter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-mapfilter.html#cfn-inspectorv2-filter-mapfilter-value
     */
    readonly value?: string;
  }

  /**
   * An object that describes the details of a string filter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-stringfilter.html
   */
  export interface StringFilterProperty {
    /**
     * The operator to use when comparing values in the filter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-stringfilter.html#cfn-inspectorv2-filter-stringfilter-comparison
     */
    readonly comparison: string;

    /**
     * The value to filter on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-stringfilter.html#cfn-inspectorv2-filter-stringfilter-value
     */
    readonly value: string;
  }

  /**
   * Contains details on the time range used to filter findings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-datefilter.html
   */
  export interface DateFilterProperty {
    /**
     * A timestamp representing the end of the time period filtered on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-datefilter.html#cfn-inspectorv2-filter-datefilter-endinclusive
     */
    readonly endInclusive?: number;

    /**
     * A timestamp representing the start of the time period filtered on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-datefilter.html#cfn-inspectorv2-filter-datefilter-startinclusive
     */
    readonly startInclusive?: number;
  }

  /**
   * An object that describes the details of a number filter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-numberfilter.html
   */
  export interface NumberFilterProperty {
    /**
     * The lowest number to be included in the filter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-numberfilter.html#cfn-inspectorv2-filter-numberfilter-lowerinclusive
     */
    readonly lowerInclusive?: number;

    /**
     * The highest number to be included in the filter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-numberfilter.html#cfn-inspectorv2-filter-numberfilter-upperinclusive
     */
    readonly upperInclusive?: number;
  }

  /**
   * An object that describes the details of a port range filter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-portrangefilter.html
   */
  export interface PortRangeFilterProperty {
    /**
     * The port number the port range begins at.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-portrangefilter.html#cfn-inspectorv2-filter-portrangefilter-begininclusive
     */
    readonly beginInclusive?: number;

    /**
     * The port number the port range ends at.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-portrangefilter.html#cfn-inspectorv2-filter-portrangefilter-endinclusive
     */
    readonly endInclusive?: number;
  }

  /**
   * Contains information on the details of a package filter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-packagefilter.html
   */
  export interface PackageFilterProperty {
    /**
     * An object that contains details on the package architecture type to filter on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-packagefilter.html#cfn-inspectorv2-filter-packagefilter-architecture
     */
    readonly architecture?: cdk.IResolvable | CfnFilter.StringFilterProperty;

    /**
     * An object that contains details on the package epoch to filter on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-packagefilter.html#cfn-inspectorv2-filter-packagefilter-epoch
     */
    readonly epoch?: cdk.IResolvable | CfnFilter.NumberFilterProperty;

    /**
     * An object that contains details on the name of the package to filter on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-packagefilter.html#cfn-inspectorv2-filter-packagefilter-name
     */
    readonly name?: cdk.IResolvable | CfnFilter.StringFilterProperty;

    /**
     * An object that contains details on the package release to filter on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-packagefilter.html#cfn-inspectorv2-filter-packagefilter-release
     */
    readonly release?: cdk.IResolvable | CfnFilter.StringFilterProperty;

    /**
     * An object that contains details on the source layer hash to filter on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-packagefilter.html#cfn-inspectorv2-filter-packagefilter-sourcelayerhash
     */
    readonly sourceLayerHash?: cdk.IResolvable | CfnFilter.StringFilterProperty;

    /**
     * The package version to filter on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-packagefilter.html#cfn-inspectorv2-filter-packagefilter-version
     */
    readonly version?: cdk.IResolvable | CfnFilter.StringFilterProperty;
  }
}

/**
 * Properties for defining a `CfnFilter`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspectorv2-filter.html
 */
export interface CfnFilterProps {
  /**
   * A description of the filter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspectorv2-filter.html#cfn-inspectorv2-filter-description
   */
  readonly description?: string;

  /**
   * The action that is to be applied to the findings that match the filter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspectorv2-filter.html#cfn-inspectorv2-filter-filteraction
   */
  readonly filterAction: string;

  /**
   * Details on the filter criteria associated with this filter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspectorv2-filter.html#cfn-inspectorv2-filter-filtercriteria
   */
  readonly filterCriteria: CfnFilter.FilterCriteriaProperty | cdk.IResolvable;

  /**
   * The name of the filter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspectorv2-filter.html#cfn-inspectorv2-filter-name
   */
  readonly name: string;
}

/**
 * Determine whether the given properties match those of a `MapFilterProperty`
 *
 * @param properties - the TypeScript properties of a `MapFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFilterMapFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comparison", cdk.requiredValidator)(properties.comparison));
  errors.collect(cdk.propertyValidator("comparison", cdk.validateString)(properties.comparison));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"MapFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnFilterMapFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFilterMapFilterPropertyValidator(properties).assertSuccess();
  return {
    "Comparison": cdk.stringToCloudFormation(properties.comparison),
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnFilterMapFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFilter.MapFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFilter.MapFilterProperty>();
  ret.addPropertyResult("comparison", "Comparison", (properties.Comparison != null ? cfn_parse.FromCloudFormation.getString(properties.Comparison) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StringFilterProperty`
 *
 * @param properties - the TypeScript properties of a `StringFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFilterStringFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comparison", cdk.requiredValidator)(properties.comparison));
  errors.collect(cdk.propertyValidator("comparison", cdk.validateString)(properties.comparison));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"StringFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnFilterStringFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFilterStringFilterPropertyValidator(properties).assertSuccess();
  return {
    "Comparison": cdk.stringToCloudFormation(properties.comparison),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnFilterStringFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFilter.StringFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFilter.StringFilterProperty>();
  ret.addPropertyResult("comparison", "Comparison", (properties.Comparison != null ? cfn_parse.FromCloudFormation.getString(properties.Comparison) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DateFilterProperty`
 *
 * @param properties - the TypeScript properties of a `DateFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFilterDateFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endInclusive", cdk.validateNumber)(properties.endInclusive));
  errors.collect(cdk.propertyValidator("startInclusive", cdk.validateNumber)(properties.startInclusive));
  return errors.wrap("supplied properties not correct for \"DateFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnFilterDateFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFilterDateFilterPropertyValidator(properties).assertSuccess();
  return {
    "EndInclusive": cdk.numberToCloudFormation(properties.endInclusive),
    "StartInclusive": cdk.numberToCloudFormation(properties.startInclusive)
  };
}

// @ts-ignore TS6133
function CfnFilterDateFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFilter.DateFilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFilter.DateFilterProperty>();
  ret.addPropertyResult("endInclusive", "EndInclusive", (properties.EndInclusive != null ? cfn_parse.FromCloudFormation.getNumber(properties.EndInclusive) : undefined));
  ret.addPropertyResult("startInclusive", "StartInclusive", (properties.StartInclusive != null ? cfn_parse.FromCloudFormation.getNumber(properties.StartInclusive) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NumberFilterProperty`
 *
 * @param properties - the TypeScript properties of a `NumberFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFilterNumberFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lowerInclusive", cdk.validateNumber)(properties.lowerInclusive));
  errors.collect(cdk.propertyValidator("upperInclusive", cdk.validateNumber)(properties.upperInclusive));
  return errors.wrap("supplied properties not correct for \"NumberFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnFilterNumberFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFilterNumberFilterPropertyValidator(properties).assertSuccess();
  return {
    "LowerInclusive": cdk.numberToCloudFormation(properties.lowerInclusive),
    "UpperInclusive": cdk.numberToCloudFormation(properties.upperInclusive)
  };
}

// @ts-ignore TS6133
function CfnFilterNumberFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFilter.NumberFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFilter.NumberFilterProperty>();
  ret.addPropertyResult("lowerInclusive", "LowerInclusive", (properties.LowerInclusive != null ? cfn_parse.FromCloudFormation.getNumber(properties.LowerInclusive) : undefined));
  ret.addPropertyResult("upperInclusive", "UpperInclusive", (properties.UpperInclusive != null ? cfn_parse.FromCloudFormation.getNumber(properties.UpperInclusive) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PortRangeFilterProperty`
 *
 * @param properties - the TypeScript properties of a `PortRangeFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFilterPortRangeFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("beginInclusive", cdk.validateNumber)(properties.beginInclusive));
  errors.collect(cdk.propertyValidator("endInclusive", cdk.validateNumber)(properties.endInclusive));
  return errors.wrap("supplied properties not correct for \"PortRangeFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnFilterPortRangeFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFilterPortRangeFilterPropertyValidator(properties).assertSuccess();
  return {
    "BeginInclusive": cdk.numberToCloudFormation(properties.beginInclusive),
    "EndInclusive": cdk.numberToCloudFormation(properties.endInclusive)
  };
}

// @ts-ignore TS6133
function CfnFilterPortRangeFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFilter.PortRangeFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFilter.PortRangeFilterProperty>();
  ret.addPropertyResult("beginInclusive", "BeginInclusive", (properties.BeginInclusive != null ? cfn_parse.FromCloudFormation.getNumber(properties.BeginInclusive) : undefined));
  ret.addPropertyResult("endInclusive", "EndInclusive", (properties.EndInclusive != null ? cfn_parse.FromCloudFormation.getNumber(properties.EndInclusive) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PackageFilterProperty`
 *
 * @param properties - the TypeScript properties of a `PackageFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFilterPackageFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("architecture", CfnFilterStringFilterPropertyValidator)(properties.architecture));
  errors.collect(cdk.propertyValidator("epoch", CfnFilterNumberFilterPropertyValidator)(properties.epoch));
  errors.collect(cdk.propertyValidator("name", CfnFilterStringFilterPropertyValidator)(properties.name));
  errors.collect(cdk.propertyValidator("release", CfnFilterStringFilterPropertyValidator)(properties.release));
  errors.collect(cdk.propertyValidator("sourceLayerHash", CfnFilterStringFilterPropertyValidator)(properties.sourceLayerHash));
  errors.collect(cdk.propertyValidator("version", CfnFilterStringFilterPropertyValidator)(properties.version));
  return errors.wrap("supplied properties not correct for \"PackageFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnFilterPackageFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFilterPackageFilterPropertyValidator(properties).assertSuccess();
  return {
    "Architecture": convertCfnFilterStringFilterPropertyToCloudFormation(properties.architecture),
    "Epoch": convertCfnFilterNumberFilterPropertyToCloudFormation(properties.epoch),
    "Name": convertCfnFilterStringFilterPropertyToCloudFormation(properties.name),
    "Release": convertCfnFilterStringFilterPropertyToCloudFormation(properties.release),
    "SourceLayerHash": convertCfnFilterStringFilterPropertyToCloudFormation(properties.sourceLayerHash),
    "Version": convertCfnFilterStringFilterPropertyToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnFilterPackageFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFilter.PackageFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFilter.PackageFilterProperty>();
  ret.addPropertyResult("architecture", "Architecture", (properties.Architecture != null ? CfnFilterStringFilterPropertyFromCloudFormation(properties.Architecture) : undefined));
  ret.addPropertyResult("epoch", "Epoch", (properties.Epoch != null ? CfnFilterNumberFilterPropertyFromCloudFormation(properties.Epoch) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? CfnFilterStringFilterPropertyFromCloudFormation(properties.Name) : undefined));
  ret.addPropertyResult("release", "Release", (properties.Release != null ? CfnFilterStringFilterPropertyFromCloudFormation(properties.Release) : undefined));
  ret.addPropertyResult("sourceLayerHash", "SourceLayerHash", (properties.SourceLayerHash != null ? CfnFilterStringFilterPropertyFromCloudFormation(properties.SourceLayerHash) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? CfnFilterStringFilterPropertyFromCloudFormation(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FilterCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `FilterCriteriaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFilterFilterCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsAccountId", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.awsAccountId));
  errors.collect(cdk.propertyValidator("componentId", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.componentId));
  errors.collect(cdk.propertyValidator("componentType", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.componentType));
  errors.collect(cdk.propertyValidator("ec2InstanceImageId", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.ec2InstanceImageId));
  errors.collect(cdk.propertyValidator("ec2InstanceSubnetId", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.ec2InstanceSubnetId));
  errors.collect(cdk.propertyValidator("ec2InstanceVpcId", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.ec2InstanceVpcId));
  errors.collect(cdk.propertyValidator("ecrImageArchitecture", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.ecrImageArchitecture));
  errors.collect(cdk.propertyValidator("ecrImageHash", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.ecrImageHash));
  errors.collect(cdk.propertyValidator("ecrImagePushedAt", cdk.listValidator(CfnFilterDateFilterPropertyValidator))(properties.ecrImagePushedAt));
  errors.collect(cdk.propertyValidator("ecrImageRegistry", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.ecrImageRegistry));
  errors.collect(cdk.propertyValidator("ecrImageRepositoryName", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.ecrImageRepositoryName));
  errors.collect(cdk.propertyValidator("ecrImageTags", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.ecrImageTags));
  errors.collect(cdk.propertyValidator("findingArn", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.findingArn));
  errors.collect(cdk.propertyValidator("findingStatus", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.findingStatus));
  errors.collect(cdk.propertyValidator("findingType", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.findingType));
  errors.collect(cdk.propertyValidator("firstObservedAt", cdk.listValidator(CfnFilterDateFilterPropertyValidator))(properties.firstObservedAt));
  errors.collect(cdk.propertyValidator("inspectorScore", cdk.listValidator(CfnFilterNumberFilterPropertyValidator))(properties.inspectorScore));
  errors.collect(cdk.propertyValidator("lastObservedAt", cdk.listValidator(CfnFilterDateFilterPropertyValidator))(properties.lastObservedAt));
  errors.collect(cdk.propertyValidator("networkProtocol", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.networkProtocol));
  errors.collect(cdk.propertyValidator("portRange", cdk.listValidator(CfnFilterPortRangeFilterPropertyValidator))(properties.portRange));
  errors.collect(cdk.propertyValidator("relatedVulnerabilities", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.relatedVulnerabilities));
  errors.collect(cdk.propertyValidator("resourceId", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.resourceId));
  errors.collect(cdk.propertyValidator("resourceTags", cdk.listValidator(CfnFilterMapFilterPropertyValidator))(properties.resourceTags));
  errors.collect(cdk.propertyValidator("resourceType", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.resourceType));
  errors.collect(cdk.propertyValidator("severity", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.severity));
  errors.collect(cdk.propertyValidator("title", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.title));
  errors.collect(cdk.propertyValidator("updatedAt", cdk.listValidator(CfnFilterDateFilterPropertyValidator))(properties.updatedAt));
  errors.collect(cdk.propertyValidator("vendorSeverity", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.vendorSeverity));
  errors.collect(cdk.propertyValidator("vulnerabilityId", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.vulnerabilityId));
  errors.collect(cdk.propertyValidator("vulnerabilitySource", cdk.listValidator(CfnFilterStringFilterPropertyValidator))(properties.vulnerabilitySource));
  errors.collect(cdk.propertyValidator("vulnerablePackages", cdk.listValidator(CfnFilterPackageFilterPropertyValidator))(properties.vulnerablePackages));
  return errors.wrap("supplied properties not correct for \"FilterCriteriaProperty\"");
}

// @ts-ignore TS6133
function convertCfnFilterFilterCriteriaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFilterFilterCriteriaPropertyValidator(properties).assertSuccess();
  return {
    "AwsAccountId": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.awsAccountId),
    "ComponentId": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.componentId),
    "ComponentType": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.componentType),
    "Ec2InstanceImageId": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.ec2InstanceImageId),
    "Ec2InstanceSubnetId": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.ec2InstanceSubnetId),
    "Ec2InstanceVpcId": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.ec2InstanceVpcId),
    "EcrImageArchitecture": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.ecrImageArchitecture),
    "EcrImageHash": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.ecrImageHash),
    "EcrImagePushedAt": cdk.listMapper(convertCfnFilterDateFilterPropertyToCloudFormation)(properties.ecrImagePushedAt),
    "EcrImageRegistry": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.ecrImageRegistry),
    "EcrImageRepositoryName": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.ecrImageRepositoryName),
    "EcrImageTags": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.ecrImageTags),
    "FindingArn": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.findingArn),
    "FindingStatus": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.findingStatus),
    "FindingType": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.findingType),
    "FirstObservedAt": cdk.listMapper(convertCfnFilterDateFilterPropertyToCloudFormation)(properties.firstObservedAt),
    "InspectorScore": cdk.listMapper(convertCfnFilterNumberFilterPropertyToCloudFormation)(properties.inspectorScore),
    "LastObservedAt": cdk.listMapper(convertCfnFilterDateFilterPropertyToCloudFormation)(properties.lastObservedAt),
    "NetworkProtocol": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.networkProtocol),
    "PortRange": cdk.listMapper(convertCfnFilterPortRangeFilterPropertyToCloudFormation)(properties.portRange),
    "RelatedVulnerabilities": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.relatedVulnerabilities),
    "ResourceId": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.resourceId),
    "ResourceTags": cdk.listMapper(convertCfnFilterMapFilterPropertyToCloudFormation)(properties.resourceTags),
    "ResourceType": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.resourceType),
    "Severity": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.severity),
    "Title": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.title),
    "UpdatedAt": cdk.listMapper(convertCfnFilterDateFilterPropertyToCloudFormation)(properties.updatedAt),
    "VendorSeverity": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.vendorSeverity),
    "VulnerabilityId": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.vulnerabilityId),
    "VulnerabilitySource": cdk.listMapper(convertCfnFilterStringFilterPropertyToCloudFormation)(properties.vulnerabilitySource),
    "VulnerablePackages": cdk.listMapper(convertCfnFilterPackageFilterPropertyToCloudFormation)(properties.vulnerablePackages)
  };
}

// @ts-ignore TS6133
function CfnFilterFilterCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFilter.FilterCriteriaProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFilter.FilterCriteriaProperty>();
  ret.addPropertyResult("awsAccountId", "AwsAccountId", (properties.AwsAccountId != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.AwsAccountId) : undefined));
  ret.addPropertyResult("componentId", "ComponentId", (properties.ComponentId != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.ComponentId) : undefined));
  ret.addPropertyResult("componentType", "ComponentType", (properties.ComponentType != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.ComponentType) : undefined));
  ret.addPropertyResult("ec2InstanceImageId", "Ec2InstanceImageId", (properties.Ec2InstanceImageId != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.Ec2InstanceImageId) : undefined));
  ret.addPropertyResult("ec2InstanceSubnetId", "Ec2InstanceSubnetId", (properties.Ec2InstanceSubnetId != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.Ec2InstanceSubnetId) : undefined));
  ret.addPropertyResult("ec2InstanceVpcId", "Ec2InstanceVpcId", (properties.Ec2InstanceVpcId != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.Ec2InstanceVpcId) : undefined));
  ret.addPropertyResult("ecrImageArchitecture", "EcrImageArchitecture", (properties.EcrImageArchitecture != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.EcrImageArchitecture) : undefined));
  ret.addPropertyResult("ecrImageHash", "EcrImageHash", (properties.EcrImageHash != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.EcrImageHash) : undefined));
  ret.addPropertyResult("ecrImagePushedAt", "EcrImagePushedAt", (properties.EcrImagePushedAt != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterDateFilterPropertyFromCloudFormation)(properties.EcrImagePushedAt) : undefined));
  ret.addPropertyResult("ecrImageRegistry", "EcrImageRegistry", (properties.EcrImageRegistry != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.EcrImageRegistry) : undefined));
  ret.addPropertyResult("ecrImageRepositoryName", "EcrImageRepositoryName", (properties.EcrImageRepositoryName != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.EcrImageRepositoryName) : undefined));
  ret.addPropertyResult("ecrImageTags", "EcrImageTags", (properties.EcrImageTags != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.EcrImageTags) : undefined));
  ret.addPropertyResult("findingArn", "FindingArn", (properties.FindingArn != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.FindingArn) : undefined));
  ret.addPropertyResult("findingStatus", "FindingStatus", (properties.FindingStatus != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.FindingStatus) : undefined));
  ret.addPropertyResult("findingType", "FindingType", (properties.FindingType != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.FindingType) : undefined));
  ret.addPropertyResult("firstObservedAt", "FirstObservedAt", (properties.FirstObservedAt != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterDateFilterPropertyFromCloudFormation)(properties.FirstObservedAt) : undefined));
  ret.addPropertyResult("inspectorScore", "InspectorScore", (properties.InspectorScore != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterNumberFilterPropertyFromCloudFormation)(properties.InspectorScore) : undefined));
  ret.addPropertyResult("lastObservedAt", "LastObservedAt", (properties.LastObservedAt != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterDateFilterPropertyFromCloudFormation)(properties.LastObservedAt) : undefined));
  ret.addPropertyResult("networkProtocol", "NetworkProtocol", (properties.NetworkProtocol != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.NetworkProtocol) : undefined));
  ret.addPropertyResult("portRange", "PortRange", (properties.PortRange != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterPortRangeFilterPropertyFromCloudFormation)(properties.PortRange) : undefined));
  ret.addPropertyResult("relatedVulnerabilities", "RelatedVulnerabilities", (properties.RelatedVulnerabilities != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.RelatedVulnerabilities) : undefined));
  ret.addPropertyResult("resourceId", "ResourceId", (properties.ResourceId != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.ResourceId) : undefined));
  ret.addPropertyResult("resourceTags", "ResourceTags", (properties.ResourceTags != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterMapFilterPropertyFromCloudFormation)(properties.ResourceTags) : undefined));
  ret.addPropertyResult("resourceType", "ResourceType", (properties.ResourceType != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.ResourceType) : undefined));
  ret.addPropertyResult("severity", "Severity", (properties.Severity != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.Severity) : undefined));
  ret.addPropertyResult("title", "Title", (properties.Title != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.Title) : undefined));
  ret.addPropertyResult("updatedAt", "UpdatedAt", (properties.UpdatedAt != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterDateFilterPropertyFromCloudFormation)(properties.UpdatedAt) : undefined));
  ret.addPropertyResult("vendorSeverity", "VendorSeverity", (properties.VendorSeverity != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.VendorSeverity) : undefined));
  ret.addPropertyResult("vulnerabilityId", "VulnerabilityId", (properties.VulnerabilityId != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.VulnerabilityId) : undefined));
  ret.addPropertyResult("vulnerabilitySource", "VulnerabilitySource", (properties.VulnerabilitySource != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterStringFilterPropertyFromCloudFormation)(properties.VulnerabilitySource) : undefined));
  ret.addPropertyResult("vulnerablePackages", "VulnerablePackages", (properties.VulnerablePackages != null ? cfn_parse.FromCloudFormation.getArray(CfnFilterPackageFilterPropertyFromCloudFormation)(properties.VulnerablePackages) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFilterProps`
 *
 * @param properties - the TypeScript properties of a `CfnFilterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFilterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("filterAction", cdk.requiredValidator)(properties.filterAction));
  errors.collect(cdk.propertyValidator("filterAction", cdk.validateString)(properties.filterAction));
  errors.collect(cdk.propertyValidator("filterCriteria", cdk.requiredValidator)(properties.filterCriteria));
  errors.collect(cdk.propertyValidator("filterCriteria", CfnFilterFilterCriteriaPropertyValidator)(properties.filterCriteria));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"CfnFilterProps\"");
}

// @ts-ignore TS6133
function convertCfnFilterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFilterPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "FilterAction": cdk.stringToCloudFormation(properties.filterAction),
    "FilterCriteria": convertCfnFilterFilterCriteriaPropertyToCloudFormation(properties.filterCriteria),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnFilterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFilterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFilterProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("filterAction", "FilterAction", (properties.FilterAction != null ? cfn_parse.FromCloudFormation.getString(properties.FilterAction) : undefined));
  ret.addPropertyResult("filterCriteria", "FilterCriteria", (properties.FilterCriteria != null ? CfnFilterFilterCriteriaPropertyFromCloudFormation(properties.FilterCriteria) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}