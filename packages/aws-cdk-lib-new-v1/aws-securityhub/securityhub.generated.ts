/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::SecurityHub::AutomationRule` resource specifies an automation rule based on input parameters.
 *
 * For more information, see [Automation rules](https://docs.aws.amazon.com/securityhub/latest/userguide/automation-rules.html) in the *AWS Security Hub User Guide* .
 *
 * @cloudformationResource AWS::SecurityHub::AutomationRule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-automationrule.html
 */
export class CfnAutomationRule extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SecurityHub::AutomationRule";

  /**
   * Build a CfnAutomationRule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAutomationRule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAutomationRulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAutomationRule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A timestamp that indicates when the rule was created.
   *
   * Uses the `date-time` format specified in [RFC 3339 section 5.6, Internet Date/Time Format](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc3339#section-5.6) . The value cannot contain spaces. For example, `2020-03-22T13:22:13.933Z` .
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The principal that created the rule. For example, `arn:aws:sts::123456789012:assumed-role/Developer-Role/JaneDoe` .
   *
   * @cloudformationAttribute CreatedBy
   */
  public readonly attrCreatedBy: string;

  /**
   * The Amazon Resource Name (ARN) of the automation rule that you create. For example, `arn:aws:securityhub:us-east-1:123456789012:automation-rule/a1b2c3d4-5678-90ab-cdef-EXAMPLE11111` .
   *
   * @cloudformationAttribute RuleArn
   */
  public readonly attrRuleArn: string;

  /**
   * A timestamp that indicates when the rule was most recently updated.
   *
   * Uses the `date-time` format specified in [RFC 3339 section 5.6, Internet Date/Time Format](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc3339#section-5.6) . The value cannot contain spaces. For example, `2020-03-22T13:22:13.933Z` .
   *
   * @cloudformationAttribute UpdatedAt
   */
  public readonly attrUpdatedAt: string;

  /**
   * One or more actions to update finding fields if a finding matches the conditions specified in `Criteria` .
   */
  public actions?: Array<CfnAutomationRule.AutomationRulesActionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A set of [AWS Security Finding Format (ASFF)](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-findings-format.html) finding field attributes and corresponding expected values that Security Hub uses to filter findings. If a rule is enabled and a finding matches the criteria specified in this parameter, Security Hub applies the rule action to the finding.
   */
  public criteria?: CfnAutomationRule.AutomationRulesFindingFiltersProperty | cdk.IResolvable;

  /**
   * A description of the rule.
   */
  public description?: string;

  /**
   * Specifies whether a rule is the last to be applied with respect to a finding that matches the rule criteria.
   */
  public isTerminal?: boolean | cdk.IResolvable;

  /**
   * The name of the rule.
   */
  public ruleName?: string;

  /**
   * An integer ranging from 1 to 1000 that represents the order in which the rule action is applied to findings.
   */
  public ruleOrder?: number;

  /**
   * Whether the rule is active after it is created.
   */
  public ruleStatus?: string;

  /**
   * User-defined tags associated with an automation rule.
   */
  public tags?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAutomationRuleProps = {}) {
    super(scope, id, {
      "type": CfnAutomationRule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedBy = cdk.Token.asString(this.getAtt("CreatedBy", cdk.ResolutionTypeHint.STRING));
    this.attrRuleArn = cdk.Token.asString(this.getAtt("RuleArn", cdk.ResolutionTypeHint.STRING));
    this.attrUpdatedAt = cdk.Token.asString(this.getAtt("UpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.actions = props.actions;
    this.criteria = props.criteria;
    this.description = props.description;
    this.isTerminal = props.isTerminal;
    this.ruleName = props.ruleName;
    this.ruleOrder = props.ruleOrder;
    this.ruleStatus = props.ruleStatus;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "actions": this.actions,
      "criteria": this.criteria,
      "description": this.description,
      "isTerminal": this.isTerminal,
      "ruleName": this.ruleName,
      "ruleOrder": this.ruleOrder,
      "ruleStatus": this.ruleStatus,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAutomationRule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAutomationRulePropsToCloudFormation(props);
  }
}

export namespace CfnAutomationRule {
  /**
   * One or more actions to update finding fields if a finding matches the defined criteria of the rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesaction.html
   */
  export interface AutomationRulesActionProperty {
    /**
     * Specifies that the automation rule action is an update to a finding field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesaction.html#cfn-securityhub-automationrule-automationrulesaction-findingfieldsupdate
     */
    readonly findingFieldsUpdate: CfnAutomationRule.AutomationRulesFindingFieldsUpdateProperty | cdk.IResolvable;

    /**
     * Specifies that the rule action should update the `Types` finding field.
     *
     * The `Types` finding field classifies findings in the format of namespace/category/classifier. For more information, see [Types taxonomy for ASFF](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-findings-format-type-taxonomy.html) in the *AWS Security Hub User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesaction.html#cfn-securityhub-automationrule-automationrulesaction-type
     */
    readonly type: string;
  }

  /**
   * Identifies the finding fields that the automation rule action updates when a finding matches the defined criteria.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfieldsupdate.html
   */
  export interface AutomationRulesFindingFieldsUpdateProperty {
    /**
     * The rule action updates the `Confidence` field of a finding.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfieldsupdate.html#cfn-securityhub-automationrule-automationrulesfindingfieldsupdate-confidence
     */
    readonly confidence?: number;

    /**
     * The rule action updates the `Criticality` field of a finding.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfieldsupdate.html#cfn-securityhub-automationrule-automationrulesfindingfieldsupdate-criticality
     */
    readonly criticality?: number;

    /**
     * The rule action will update the `Note` field of a finding.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfieldsupdate.html#cfn-securityhub-automationrule-automationrulesfindingfieldsupdate-note
     */
    readonly note?: cdk.IResolvable | CfnAutomationRule.NoteUpdateProperty;

    /**
     * The rule action will update the `RelatedFindings` field of a finding.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfieldsupdate.html#cfn-securityhub-automationrule-automationrulesfindingfieldsupdate-relatedfindings
     */
    readonly relatedFindings?: Array<cdk.IResolvable | CfnAutomationRule.RelatedFindingProperty> | cdk.IResolvable;

    /**
     * The rule action will update the `Severity` field of a finding.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfieldsupdate.html#cfn-securityhub-automationrule-automationrulesfindingfieldsupdate-severity
     */
    readonly severity?: cdk.IResolvable | CfnAutomationRule.SeverityUpdateProperty;

    /**
     * The rule action updates the `Types` field of a finding.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfieldsupdate.html#cfn-securityhub-automationrule-automationrulesfindingfieldsupdate-types
     */
    readonly types?: Array<string>;

    /**
     * The rule action updates the `UserDefinedFields` field of a finding.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfieldsupdate.html#cfn-securityhub-automationrule-automationrulesfindingfieldsupdate-userdefinedfields
     */
    readonly userDefinedFields?: cdk.IResolvable | Record<string, string>;

    /**
     * The rule action updates the `VerificationState` field of a finding.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfieldsupdate.html#cfn-securityhub-automationrule-automationrulesfindingfieldsupdate-verificationstate
     */
    readonly verificationState?: string;

    /**
     * The rule action will update the `Workflow` field of a finding.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfieldsupdate.html#cfn-securityhub-automationrule-automationrulesfindingfieldsupdate-workflow
     */
    readonly workflow?: cdk.IResolvable | CfnAutomationRule.WorkflowUpdateProperty;
  }

  /**
   * The updated note.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-noteupdate.html
   */
  export interface NoteUpdateProperty {
    /**
     * The updated note text.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-noteupdate.html#cfn-securityhub-automationrule-noteupdate-text
     */
    readonly text: string;

    /**
     * The principal that updated the note.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-noteupdate.html#cfn-securityhub-automationrule-noteupdate-updatedby
     */
    readonly updatedBy: any | cdk.IResolvable;
  }

  /**
   * Provides details about a list of findings that the current finding relates to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-relatedfinding.html
   */
  export interface RelatedFindingProperty {
    /**
     * The product-generated identifier for a related finding.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-relatedfinding.html#cfn-securityhub-automationrule-relatedfinding-id
     */
    readonly id: any | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) for the product that generated a related finding.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-relatedfinding.html#cfn-securityhub-automationrule-relatedfinding-productarn
     */
    readonly productArn: string;
  }

  /**
   * Used to update information about the investigation into the finding.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-workflowupdate.html
   */
  export interface WorkflowUpdateProperty {
    /**
     * The status of the investigation into the finding.
     *
     * The workflow status is specific to an individual finding. It does not affect the generation of new findings. For example, setting the workflow status to `SUPPRESSED` or `RESOLVED` does not prevent a new finding for the same issue.
     *
     * The allowed values are the following.
     *
     * - `NEW` - The initial state of a finding, before it is reviewed.
     *
     * Security Hub also resets `WorkFlowStatus` from `NOTIFIED` or `RESOLVED` to `NEW` in the following cases:
     *
     * - The record state changes from `ARCHIVED` to `ACTIVE` .
     * - The compliance status changes from `PASSED` to either `WARNING` , `FAILED` , or `NOT_AVAILABLE` .
     * - `NOTIFIED` - Indicates that you notified the resource owner about the security issue. Used when the initial reviewer is not the resource owner, and needs intervention from the resource owner.
     * - `RESOLVED` - The finding was reviewed and remediated and is now considered resolved.
     * - `SUPPRESSED` - Indicates that you reviewed the finding and do not believe that any action is needed. The finding is no longer updated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-workflowupdate.html#cfn-securityhub-automationrule-workflowupdate-status
     */
    readonly status: string;
  }

  /**
   * Updates to the severity information for a finding.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-severityupdate.html
   */
  export interface SeverityUpdateProperty {
    /**
     * The severity value of the finding. The allowed values are the following.
     *
     * - `INFORMATIONAL` - No issue was found.
     * - `LOW` - The issue does not require action on its own.
     * - `MEDIUM` - The issue must be addressed but not urgently.
     * - `HIGH` - The issue must be addressed as a priority.
     * - `CRITICAL` - The issue must be remediated immediately to avoid it escalating.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-severityupdate.html#cfn-securityhub-automationrule-severityupdate-label
     */
    readonly label?: string;

    /**
     * The normalized severity for the finding. This attribute is to be deprecated in favor of `Label` .
     *
     * If you provide `Normalized` and do not provide `Label` , `Label` is set automatically as follows.
     *
     * - 0 - `INFORMATIONAL`
     * - 1–39 - `LOW`
     * - 40–69 - `MEDIUM`
     * - 70–89 - `HIGH`
     * - 90–100 - `CRITICAL`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-severityupdate.html#cfn-securityhub-automationrule-severityupdate-normalized
     */
    readonly normalized?: number;

    /**
     * The native severity as defined by the AWS service or integrated partner product that generated the finding.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-severityupdate.html#cfn-securityhub-automationrule-severityupdate-product
     */
    readonly product?: number;
  }

  /**
   * The criteria that determine which findings a rule applies to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html
   */
  export interface AutomationRulesFindingFiltersProperty {
    /**
     * The AWS account ID in which a finding was generated.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 100 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-awsaccountid
     */
    readonly awsAccountId?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * The name of the company for the product that generated the finding.
     *
     * For control-based findings, the company is AWS .
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-companyname
     */
    readonly companyName?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * The unique identifier of a standard in which a control is enabled.
     *
     * This field consists of the resource portion of the Amazon Resource Name (ARN) returned for a standard in the [DescribeStandards](https://docs.aws.amazon.com/securityhub/1.0/APIReference/API_DescribeStandards.html) API response.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-complianceassociatedstandardsid
     */
    readonly complianceAssociatedStandardsId?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * The security control ID for which a finding was generated. Security control IDs are the same across standards.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-compliancesecuritycontrolid
     */
    readonly complianceSecurityControlId?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * The result of a security check. This field is only used for findings generated from controls.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-compliancestatus
     */
    readonly complianceStatus?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * The likelihood that a finding accurately identifies the behavior or issue that it was intended to identify.
     *
     * `Confidence` is scored on a 0–100 basis using a ratio scale. A value of `0` means 0 percent confidence, and a value of `100` means 100 percent confidence. For example, a data exfiltration detection based on a statistical deviation of network traffic has low confidence because an actual exfiltration hasn't been verified. For more information, see [Confidence](https://docs.aws.amazon.com/securityhub/latest/userguide/asff-top-level-attributes.html#asff-confidence) in the *AWS Security Hub User Guide* .
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-confidence
     */
    readonly confidence?: Array<cdk.IResolvable | CfnAutomationRule.NumberFilterProperty> | cdk.IResolvable;

    /**
     * A timestamp that indicates when this finding record was created.
     *
     * Uses the `date-time` format specified in [RFC 3339 section 5.6, Internet Date/Time Format](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc3339#section-5.6) . The value cannot contain spaces. For example, `2020-03-22T13:22:13.933Z` .
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-createdat
     */
    readonly createdAt?: Array<CfnAutomationRule.DateFilterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The level of importance that is assigned to the resources that are associated with a finding.
     *
     * `Criticality` is scored on a 0–100 basis, using a ratio scale that supports only full integers. A score of `0` means that the underlying resources have no criticality, and a score of `100` is reserved for the most critical resources. For more information, see [Criticality](https://docs.aws.amazon.com/securityhub/latest/userguide/asff-top-level-attributes.html#asff-criticality) in the *AWS Security Hub User Guide* .
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-criticality
     */
    readonly criticality?: Array<cdk.IResolvable | CfnAutomationRule.NumberFilterProperty> | cdk.IResolvable;

    /**
     * A finding's description.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-description
     */
    readonly description?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * A timestamp that indicates when the potential security issue captured by a finding was first observed by the security findings product.
     *
     * Uses the `date-time` format specified in [RFC 3339 section 5.6, Internet Date/Time Format](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc3339#section-5.6) . The value cannot contain spaces. For example, `2020-03-22T13:22:13.933Z` .
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-firstobservedat
     */
    readonly firstObservedAt?: Array<CfnAutomationRule.DateFilterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The identifier for the solution-specific component that generated a finding.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 100 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-generatorid
     */
    readonly generatorId?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * The product-specific identifier for a finding.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-id
     */
    readonly id?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * A timestamp that indicates when the potential security issue captured by a finding was most recently observed by the security findings product.
     *
     * Uses the `date-time` format specified in [RFC 3339 section 5.6, Internet Date/Time Format](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc3339#section-5.6) . The value cannot contain spaces. For example, `2020-03-22T13:22:13.933Z` .
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-lastobservedat
     */
    readonly lastObservedAt?: Array<CfnAutomationRule.DateFilterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The text of a user-defined note that's added to a finding.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-notetext
     */
    readonly noteText?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * The timestamp of when the note was updated.
     *
     * Uses the date-time format specified in [RFC 3339 section 5.6, Internet Date/Time Format](https://docs.aws.amazon.com/https://www.rfc-editor.org/rfc/rfc3339#section-5.6) . The value cannot contain spaces. For example, `2020-03-22T13:22:13.933Z` .
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-noteupdatedat
     */
    readonly noteUpdatedAt?: Array<CfnAutomationRule.DateFilterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The principal that created a note.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-noteupdatedby
     */
    readonly noteUpdatedBy?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) for a third-party product that generated a finding in Security Hub.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-productarn
     */
    readonly productArn?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * Provides the name of the product that generated the finding. For control-based findings, the product name is Security Hub.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-productname
     */
    readonly productName?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * Provides the current state of a finding.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-recordstate
     */
    readonly recordState?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * The product-generated identifier for a related finding.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-relatedfindingsid
     */
    readonly relatedFindingsId?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * The ARN for the product that generated a related finding.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-relatedfindingsproductarn
     */
    readonly relatedFindingsProductArn?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * Custom fields and values about the resource that a finding pertains to.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-resourcedetailsother
     */
    readonly resourceDetailsOther?: Array<cdk.IResolvable | CfnAutomationRule.MapFilterProperty> | cdk.IResolvable;

    /**
     * The identifier for the given resource type.
     *
     * For AWS resources that are identified by Amazon Resource Names (ARNs), this is the ARN. For AWS resources that lack ARNs, this is the identifier as defined by the AWS service that created the resource. For non- AWS resources, this is a unique identifier that is associated with the resource.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 100 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-resourceid
     */
    readonly resourceId?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * The partition in which the resource that the finding pertains to is located.
     *
     * A partition is a group of AWS Regions . Each AWS account is scoped to one partition.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-resourcepartition
     */
    readonly resourcePartition?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * The AWS Region where the resource that a finding pertains to is located.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-resourceregion
     */
    readonly resourceRegion?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * A list of AWS tags associated with a resource at the time the finding was processed.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-resourcetags
     */
    readonly resourceTags?: Array<cdk.IResolvable | CfnAutomationRule.MapFilterProperty> | cdk.IResolvable;

    /**
     * A finding's title.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 100 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-resourcetype
     */
    readonly resourceType?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * The severity value of the finding.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-severitylabel
     */
    readonly severityLabel?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * Provides a URL that links to a page about the current finding in the finding product.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-sourceurl
     */
    readonly sourceUrl?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * A finding's title.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 100 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-title
     */
    readonly title?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * One or more finding types in the format of namespace/category/classifier that classify a finding.
     *
     * For a list of namespaces, classifiers, and categories, see [Types taxonomy for ASFF](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-findings-format-type-taxonomy.html) in the *AWS Security Hub User Guide* .
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-type
     */
    readonly type?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * A timestamp that indicates when the finding record was most recently updated.
     *
     * Uses the `date-time` format specified in [RFC 3339 section 5.6, Internet Date/Time Format](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc3339#section-5.6) . The value cannot contain spaces. For example, `2020-03-22T13:22:13.933Z` .
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-updatedat
     */
    readonly updatedAt?: Array<CfnAutomationRule.DateFilterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of user-defined name and value string pairs added to a finding.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-userdefinedfields
     */
    readonly userDefinedFields?: Array<cdk.IResolvable | CfnAutomationRule.MapFilterProperty> | cdk.IResolvable;

    /**
     * Provides the veracity of a finding.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-verificationstate
     */
    readonly verificationState?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;

    /**
     * Provides information about the status of the investigation into a finding.
     *
     * Array Members: Minimum number of 1 item. Maximum number of 20 items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-automationrulesfindingfilters.html#cfn-securityhub-automationrule-automationrulesfindingfilters-workflowstatus
     */
    readonly workflowStatus?: Array<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> | cdk.IResolvable;
  }

  /**
   * A string filter for filtering AWS Security Hub findings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-stringfilter.html
   */
  export interface StringFilterProperty {
    /**
     * The condition to apply to a string value when filtering Security Hub findings.
     *
     * To search for values that have the filter value, use one of the following comparison operators:
     *
     * - To search for values that include the filter value, use `CONTAINS` . For example, the filter `Title CONTAINS CloudFront` matches findings that have a `Title` that includes the string CloudFront.
     * - To search for values that exactly match the filter value, use `EQUALS` . For example, the filter `AwsAccountId EQUALS 123456789012` only matches findings that have an account ID of `123456789012` .
     * - To search for values that start with the filter value, use `PREFIX` . For example, the filter `ResourceRegion PREFIX us` matches findings that have a `ResourceRegion` that starts with `us` . A `ResourceRegion` that starts with a different value, such as `af` , `ap` , or `ca` , doesn't match.
     *
     * `CONTAINS` , `EQUALS` , and `PREFIX` filters on the same field are joined by `OR` . A finding matches if it matches any one of those filters. For example, the filters `Title CONTAINS CloudFront OR Title CONTAINS CloudWatch` match a finding that includes either `CloudFront` , `CloudWatch` , or both strings in the title.
     *
     * To search for values that don’t have the filter value, use one of the following comparison operators:
     *
     * - To search for values that exclude the filter value, use `NOT_CONTAINS` . For example, the filter `Title NOT_CONTAINS CloudFront` matches findings that have a `Title` that excludes the string CloudFront.
     * - To search for values other than the filter value, use `NOT_EQUALS` . For example, the filter `AwsAccountId NOT_EQUALS 123456789012` only matches findings that have an account ID other than `123456789012` .
     * - To search for values that don't start with the filter value, use `PREFIX_NOT_EQUALS` . For example, the filter `ResourceRegion PREFIX_NOT_EQUALS us` matches findings with a `ResourceRegion` that starts with a value other than `us` .
     *
     * `NOT_CONTAINS` , `NOT_EQUALS` , and `PREFIX_NOT_EQUALS` filters on the same field are joined by `AND` . A finding matches only if it matches all of those filters. For example, the filters `Title NOT_CONTAINS CloudFront AND Title NOT_CONTAINS CloudWatch` match a finding that excludes both `CloudFront` and `CloudWatch` in the title.
     *
     * You can’t have both a `CONTAINS` filter and a `NOT_CONTAINS` filter on the same field. Similarly, you can't provide both an `EQUALS` filter and a `NOT_EQUALS` or `PREFIX_NOT_EQUALS` filter on the same field. Combining filters in this way returns an error. `CONTAINS` filters can only be used with other `CONTAINS` filters. `NOT_CONTAINS` filters can only be used with other `NOT_CONTAINS` filters.
     *
     * You can combine `PREFIX` filters with `NOT_EQUALS` or `PREFIX_NOT_EQUALS` filters for the same field. Security Hub first processes the `PREFIX` filters, and then the `NOT_EQUALS` or `PREFIX_NOT_EQUALS` filters.
     *
     * For example, for the following filters, Security Hub first identifies findings that have resource types that start with either `AwsIam` or `AwsEc2` . It then excludes findings that have a resource type of `AwsIamPolicy` and findings that have a resource type of `AwsEc2NetworkInterface` .
     *
     * - `ResourceType PREFIX AwsIam`
     * - `ResourceType PREFIX AwsEc2`
     * - `ResourceType NOT_EQUALS AwsIamPolicy`
     * - `ResourceType NOT_EQUALS AwsEc2NetworkInterface`
     *
     * `CONTAINS` and `NOT_CONTAINS` operators can be used only with automation rules. For more information, see [Automation rules](https://docs.aws.amazon.com/securityhub/latest/userguide/automation-rules.html) in the *AWS Security Hub User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-stringfilter.html#cfn-securityhub-automationrule-stringfilter-comparison
     */
    readonly comparison: string;

    /**
     * The string filter value.
     *
     * Filter values are case sensitive. For example, the product name for control-based findings is `Security Hub` . If you provide `security hub` as the filter value, there's no match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-stringfilter.html#cfn-securityhub-automationrule-stringfilter-value
     */
    readonly value: string;
  }

  /**
   * A map filter for filtering AWS Security Hub findings.
   *
   * Each map filter provides the field to check for, the value to check for, and the comparison operator.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-mapfilter.html
   */
  export interface MapFilterProperty {
    /**
     * The condition to apply to the key value when filtering Security Hub findings with a map filter.
     *
     * To search for values that have the filter value, use one of the following comparison operators:
     *
     * - To search for values that include the filter value, use `CONTAINS` . For example, for the `ResourceTags` field, the filter `Department CONTAINS Security` matches findings that include the value `Security` for the `Department` tag. In the same example, a finding with a value of `Security team` for the `Department` tag is a match.
     * - To search for values that exactly match the filter value, use `EQUALS` . For example, for the `ResourceTags` field, the filter `Department EQUALS Security` matches findings that have the value `Security` for the `Department` tag.
     *
     * `CONTAINS` and `EQUALS` filters on the same field are joined by `OR` . A finding matches if it matches any one of those filters. For example, the filters `Department CONTAINS Security OR Department CONTAINS Finance` match a finding that includes either `Security` , `Finance` , or both values.
     *
     * To search for values that don't have the filter value, use one of the following comparison operators:
     *
     * - To search for values that exclude the filter value, use `NOT_CONTAINS` . For example, for the `ResourceTags` field, the filter `Department NOT_CONTAINS Finance` matches findings that exclude the value `Finance` for the `Department` tag.
     * - To search for values other than the filter value, use `NOT_EQUALS` . For example, for the `ResourceTags` field, the filter `Department NOT_EQUALS Finance` matches findings that don’t have the value `Finance` for the `Department` tag.
     *
     * `NOT_CONTAINS` and `NOT_EQUALS` filters on the same field are joined by `AND` . A finding matches only if it matches all of those filters. For example, the filters `Department NOT_CONTAINS Security AND Department NOT_CONTAINS Finance` match a finding that excludes both the `Security` and `Finance` values.
     *
     * `CONTAINS` filters can only be used with other `CONTAINS` filters. `NOT_CONTAINS` filters can only be used with other `NOT_CONTAINS` filters.
     *
     * You can’t have both a `CONTAINS` filter and a `NOT_CONTAINS` filter on the same field. Similarly, you can’t have both an `EQUALS` filter and a `NOT_EQUALS` filter on the same field. Combining filters in this way returns an error.
     *
     * `CONTAINS` and `NOT_CONTAINS` operators can be used only with automation rules. For more information, see [Automation rules](https://docs.aws.amazon.com/securityhub/latest/userguide/automation-rules.html) in the *AWS Security Hub User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-mapfilter.html#cfn-securityhub-automationrule-mapfilter-comparison
     */
    readonly comparison: string;

    /**
     * The key of the map filter.
     *
     * For example, for `ResourceTags` , `Key` identifies the name of the tag. For `UserDefinedFields` , `Key` is the name of the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-mapfilter.html#cfn-securityhub-automationrule-mapfilter-key
     */
    readonly key: string;

    /**
     * The value for the key in the map filter.
     *
     * Filter values are case sensitive. For example, one of the values for a tag called `Department` might be `Security` . If you provide `security` as the filter value, then there's no match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-mapfilter.html#cfn-securityhub-automationrule-mapfilter-value
     */
    readonly value: string;
  }

  /**
   * A date filter for querying findings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-datefilter.html
   */
  export interface DateFilterProperty {
    /**
     * A date range for the date filter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-datefilter.html#cfn-securityhub-automationrule-datefilter-daterange
     */
    readonly dateRange?: CfnAutomationRule.DateRangeProperty | cdk.IResolvable;

    /**
     * A timestamp that provides the end date for the date filter.
     *
     * A correctly formatted example is `2020-05-21T20:16:34.724Z` . The value cannot contain spaces, and date and time should be separated by `T` . For more information, see [RFC 3339 section 5.6, Internet Date/Time Format](https://docs.aws.amazon.com/https://www.rfc-editor.org/rfc/rfc3339#section-5.6) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-datefilter.html#cfn-securityhub-automationrule-datefilter-end
     */
    readonly end?: string;

    /**
     * A timestamp that provides the start date for the date filter.
     *
     * A correctly formatted example is `2020-05-21T20:16:34.724Z` . The value cannot contain spaces, and date and time should be separated by `T` . For more information, see [RFC 3339 section 5.6, Internet Date/Time Format](https://docs.aws.amazon.com/https://www.rfc-editor.org/rfc/rfc3339#section-5.6) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-datefilter.html#cfn-securityhub-automationrule-datefilter-start
     */
    readonly start?: string;
  }

  /**
   * A date range for the date filter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-daterange.html
   */
  export interface DateRangeProperty {
    /**
     * A date range unit for the date filter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-daterange.html#cfn-securityhub-automationrule-daterange-unit
     */
    readonly unit: string;

    /**
     * A date range value for the date filter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-daterange.html#cfn-securityhub-automationrule-daterange-value
     */
    readonly value: number;
  }

  /**
   * A number filter for querying findings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-numberfilter.html
   */
  export interface NumberFilterProperty {
    /**
     * The equal-to condition to be applied to a single field when querying for findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-numberfilter.html#cfn-securityhub-automationrule-numberfilter-eq
     */
    readonly eq?: number;

    /**
     * The greater-than-equal condition to be applied to a single field when querying for findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-numberfilter.html#cfn-securityhub-automationrule-numberfilter-gte
     */
    readonly gte?: number;

    /**
     * The less-than-equal condition to be applied to a single field when querying for findings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-automationrule-numberfilter.html#cfn-securityhub-automationrule-numberfilter-lte
     */
    readonly lte?: number;
  }
}

/**
 * Properties for defining a `CfnAutomationRule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-automationrule.html
 */
export interface CfnAutomationRuleProps {
  /**
   * One or more actions to update finding fields if a finding matches the conditions specified in `Criteria` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-automationrule.html#cfn-securityhub-automationrule-actions
   */
  readonly actions?: Array<CfnAutomationRule.AutomationRulesActionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A set of [AWS Security Finding Format (ASFF)](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-findings-format.html) finding field attributes and corresponding expected values that Security Hub uses to filter findings. If a rule is enabled and a finding matches the criteria specified in this parameter, Security Hub applies the rule action to the finding.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-automationrule.html#cfn-securityhub-automationrule-criteria
   */
  readonly criteria?: CfnAutomationRule.AutomationRulesFindingFiltersProperty | cdk.IResolvable;

  /**
   * A description of the rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-automationrule.html#cfn-securityhub-automationrule-description
   */
  readonly description?: string;

  /**
   * Specifies whether a rule is the last to be applied with respect to a finding that matches the rule criteria.
   *
   * This is useful when a finding matches the criteria for multiple rules, and each rule has different actions. If a rule is terminal, Security Hub applies the rule action to a finding that matches the rule criteria and doesn't evaluate other rules for the finding. By default, a rule isn't terminal.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-automationrule.html#cfn-securityhub-automationrule-isterminal
   */
  readonly isTerminal?: boolean | cdk.IResolvable;

  /**
   * The name of the rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-automationrule.html#cfn-securityhub-automationrule-rulename
   */
  readonly ruleName?: string;

  /**
   * An integer ranging from 1 to 1000 that represents the order in which the rule action is applied to findings.
   *
   * Security Hub applies rules with lower values for this parameter first.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-automationrule.html#cfn-securityhub-automationrule-ruleorder
   */
  readonly ruleOrder?: number;

  /**
   * Whether the rule is active after it is created.
   *
   * If this parameter is equal to `ENABLED` , Security Hub applies the rule to findings and finding updates after the rule is created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-automationrule.html#cfn-securityhub-automationrule-rulestatus
   */
  readonly ruleStatus?: string;

  /**
   * User-defined tags associated with an automation rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-automationrule.html#cfn-securityhub-automationrule-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `NoteUpdateProperty`
 *
 * @param properties - the TypeScript properties of a `NoteUpdateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutomationRuleNoteUpdatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("text", cdk.requiredValidator)(properties.text));
  errors.collect(cdk.propertyValidator("text", cdk.validateString)(properties.text));
  errors.collect(cdk.propertyValidator("updatedBy", cdk.requiredValidator)(properties.updatedBy));
  errors.collect(cdk.propertyValidator("updatedBy", cdk.validateObject)(properties.updatedBy));
  return errors.wrap("supplied properties not correct for \"NoteUpdateProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutomationRuleNoteUpdatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutomationRuleNoteUpdatePropertyValidator(properties).assertSuccess();
  return {
    "Text": cdk.stringToCloudFormation(properties.text),
    "UpdatedBy": cdk.objectToCloudFormation(properties.updatedBy)
  };
}

// @ts-ignore TS6133
function CfnAutomationRuleNoteUpdatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutomationRule.NoteUpdateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutomationRule.NoteUpdateProperty>();
  ret.addPropertyResult("text", "Text", (properties.Text != null ? cfn_parse.FromCloudFormation.getString(properties.Text) : undefined));
  ret.addPropertyResult("updatedBy", "UpdatedBy", (properties.UpdatedBy != null ? cfn_parse.FromCloudFormation.getAny(properties.UpdatedBy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RelatedFindingProperty`
 *
 * @param properties - the TypeScript properties of a `RelatedFindingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutomationRuleRelatedFindingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateObject)(properties.id));
  errors.collect(cdk.propertyValidator("productArn", cdk.requiredValidator)(properties.productArn));
  errors.collect(cdk.propertyValidator("productArn", cdk.validateString)(properties.productArn));
  return errors.wrap("supplied properties not correct for \"RelatedFindingProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutomationRuleRelatedFindingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutomationRuleRelatedFindingPropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.objectToCloudFormation(properties.id),
    "ProductArn": cdk.stringToCloudFormation(properties.productArn)
  };
}

// @ts-ignore TS6133
function CfnAutomationRuleRelatedFindingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutomationRule.RelatedFindingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutomationRule.RelatedFindingProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getAny(properties.Id) : undefined));
  ret.addPropertyResult("productArn", "ProductArn", (properties.ProductArn != null ? cfn_parse.FromCloudFormation.getString(properties.ProductArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkflowUpdateProperty`
 *
 * @param properties - the TypeScript properties of a `WorkflowUpdateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutomationRuleWorkflowUpdatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"WorkflowUpdateProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutomationRuleWorkflowUpdatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutomationRuleWorkflowUpdatePropertyValidator(properties).assertSuccess();
  return {
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnAutomationRuleWorkflowUpdatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutomationRule.WorkflowUpdateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutomationRule.WorkflowUpdateProperty>();
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SeverityUpdateProperty`
 *
 * @param properties - the TypeScript properties of a `SeverityUpdateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutomationRuleSeverityUpdatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("label", cdk.validateString)(properties.label));
  errors.collect(cdk.propertyValidator("normalized", cdk.validateNumber)(properties.normalized));
  errors.collect(cdk.propertyValidator("product", cdk.validateNumber)(properties.product));
  return errors.wrap("supplied properties not correct for \"SeverityUpdateProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutomationRuleSeverityUpdatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutomationRuleSeverityUpdatePropertyValidator(properties).assertSuccess();
  return {
    "Label": cdk.stringToCloudFormation(properties.label),
    "Normalized": cdk.numberToCloudFormation(properties.normalized),
    "Product": cdk.numberToCloudFormation(properties.product)
  };
}

// @ts-ignore TS6133
function CfnAutomationRuleSeverityUpdatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutomationRule.SeverityUpdateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutomationRule.SeverityUpdateProperty>();
  ret.addPropertyResult("label", "Label", (properties.Label != null ? cfn_parse.FromCloudFormation.getString(properties.Label) : undefined));
  ret.addPropertyResult("normalized", "Normalized", (properties.Normalized != null ? cfn_parse.FromCloudFormation.getNumber(properties.Normalized) : undefined));
  ret.addPropertyResult("product", "Product", (properties.Product != null ? cfn_parse.FromCloudFormation.getNumber(properties.Product) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutomationRulesFindingFieldsUpdateProperty`
 *
 * @param properties - the TypeScript properties of a `AutomationRulesFindingFieldsUpdateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutomationRuleAutomationRulesFindingFieldsUpdatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("confidence", cdk.validateNumber)(properties.confidence));
  errors.collect(cdk.propertyValidator("criticality", cdk.validateNumber)(properties.criticality));
  errors.collect(cdk.propertyValidator("note", CfnAutomationRuleNoteUpdatePropertyValidator)(properties.note));
  errors.collect(cdk.propertyValidator("relatedFindings", cdk.listValidator(CfnAutomationRuleRelatedFindingPropertyValidator))(properties.relatedFindings));
  errors.collect(cdk.propertyValidator("severity", CfnAutomationRuleSeverityUpdatePropertyValidator)(properties.severity));
  errors.collect(cdk.propertyValidator("types", cdk.listValidator(cdk.validateString))(properties.types));
  errors.collect(cdk.propertyValidator("userDefinedFields", cdk.hashValidator(cdk.validateString))(properties.userDefinedFields));
  errors.collect(cdk.propertyValidator("verificationState", cdk.validateString)(properties.verificationState));
  errors.collect(cdk.propertyValidator("workflow", CfnAutomationRuleWorkflowUpdatePropertyValidator)(properties.workflow));
  return errors.wrap("supplied properties not correct for \"AutomationRulesFindingFieldsUpdateProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutomationRuleAutomationRulesFindingFieldsUpdatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutomationRuleAutomationRulesFindingFieldsUpdatePropertyValidator(properties).assertSuccess();
  return {
    "Confidence": cdk.numberToCloudFormation(properties.confidence),
    "Criticality": cdk.numberToCloudFormation(properties.criticality),
    "Note": convertCfnAutomationRuleNoteUpdatePropertyToCloudFormation(properties.note),
    "RelatedFindings": cdk.listMapper(convertCfnAutomationRuleRelatedFindingPropertyToCloudFormation)(properties.relatedFindings),
    "Severity": convertCfnAutomationRuleSeverityUpdatePropertyToCloudFormation(properties.severity),
    "Types": cdk.listMapper(cdk.stringToCloudFormation)(properties.types),
    "UserDefinedFields": cdk.hashMapper(cdk.stringToCloudFormation)(properties.userDefinedFields),
    "VerificationState": cdk.stringToCloudFormation(properties.verificationState),
    "Workflow": convertCfnAutomationRuleWorkflowUpdatePropertyToCloudFormation(properties.workflow)
  };
}

// @ts-ignore TS6133
function CfnAutomationRuleAutomationRulesFindingFieldsUpdatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAutomationRule.AutomationRulesFindingFieldsUpdateProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutomationRule.AutomationRulesFindingFieldsUpdateProperty>();
  ret.addPropertyResult("confidence", "Confidence", (properties.Confidence != null ? cfn_parse.FromCloudFormation.getNumber(properties.Confidence) : undefined));
  ret.addPropertyResult("criticality", "Criticality", (properties.Criticality != null ? cfn_parse.FromCloudFormation.getNumber(properties.Criticality) : undefined));
  ret.addPropertyResult("note", "Note", (properties.Note != null ? CfnAutomationRuleNoteUpdatePropertyFromCloudFormation(properties.Note) : undefined));
  ret.addPropertyResult("relatedFindings", "RelatedFindings", (properties.RelatedFindings != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleRelatedFindingPropertyFromCloudFormation)(properties.RelatedFindings) : undefined));
  ret.addPropertyResult("severity", "Severity", (properties.Severity != null ? CfnAutomationRuleSeverityUpdatePropertyFromCloudFormation(properties.Severity) : undefined));
  ret.addPropertyResult("types", "Types", (properties.Types != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Types) : undefined));
  ret.addPropertyResult("userDefinedFields", "UserDefinedFields", (properties.UserDefinedFields != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.UserDefinedFields) : undefined));
  ret.addPropertyResult("verificationState", "VerificationState", (properties.VerificationState != null ? cfn_parse.FromCloudFormation.getString(properties.VerificationState) : undefined));
  ret.addPropertyResult("workflow", "Workflow", (properties.Workflow != null ? CfnAutomationRuleWorkflowUpdatePropertyFromCloudFormation(properties.Workflow) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutomationRulesActionProperty`
 *
 * @param properties - the TypeScript properties of a `AutomationRulesActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutomationRuleAutomationRulesActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("findingFieldsUpdate", cdk.requiredValidator)(properties.findingFieldsUpdate));
  errors.collect(cdk.propertyValidator("findingFieldsUpdate", CfnAutomationRuleAutomationRulesFindingFieldsUpdatePropertyValidator)(properties.findingFieldsUpdate));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"AutomationRulesActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutomationRuleAutomationRulesActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutomationRuleAutomationRulesActionPropertyValidator(properties).assertSuccess();
  return {
    "FindingFieldsUpdate": convertCfnAutomationRuleAutomationRulesFindingFieldsUpdatePropertyToCloudFormation(properties.findingFieldsUpdate),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnAutomationRuleAutomationRulesActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAutomationRule.AutomationRulesActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutomationRule.AutomationRulesActionProperty>();
  ret.addPropertyResult("findingFieldsUpdate", "FindingFieldsUpdate", (properties.FindingFieldsUpdate != null ? CfnAutomationRuleAutomationRulesFindingFieldsUpdatePropertyFromCloudFormation(properties.FindingFieldsUpdate) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
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
function CfnAutomationRuleStringFilterPropertyValidator(properties: any): cdk.ValidationResult {
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
function convertCfnAutomationRuleStringFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutomationRuleStringFilterPropertyValidator(properties).assertSuccess();
  return {
    "Comparison": cdk.stringToCloudFormation(properties.comparison),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnAutomationRuleStringFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutomationRule.StringFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutomationRule.StringFilterProperty>();
  ret.addPropertyResult("comparison", "Comparison", (properties.Comparison != null ? cfn_parse.FromCloudFormation.getString(properties.Comparison) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MapFilterProperty`
 *
 * @param properties - the TypeScript properties of a `MapFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutomationRuleMapFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comparison", cdk.requiredValidator)(properties.comparison));
  errors.collect(cdk.propertyValidator("comparison", cdk.validateString)(properties.comparison));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"MapFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutomationRuleMapFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutomationRuleMapFilterPropertyValidator(properties).assertSuccess();
  return {
    "Comparison": cdk.stringToCloudFormation(properties.comparison),
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnAutomationRuleMapFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutomationRule.MapFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutomationRule.MapFilterProperty>();
  ret.addPropertyResult("comparison", "Comparison", (properties.Comparison != null ? cfn_parse.FromCloudFormation.getString(properties.Comparison) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DateRangeProperty`
 *
 * @param properties - the TypeScript properties of a `DateRangeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutomationRuleDateRangePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("unit", cdk.requiredValidator)(properties.unit));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"DateRangeProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutomationRuleDateRangePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutomationRuleDateRangePropertyValidator(properties).assertSuccess();
  return {
    "Unit": cdk.stringToCloudFormation(properties.unit),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnAutomationRuleDateRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAutomationRule.DateRangeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutomationRule.DateRangeProperty>();
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
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
function CfnAutomationRuleDateFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dateRange", CfnAutomationRuleDateRangePropertyValidator)(properties.dateRange));
  errors.collect(cdk.propertyValidator("end", cdk.validateString)(properties.end));
  errors.collect(cdk.propertyValidator("start", cdk.validateString)(properties.start));
  return errors.wrap("supplied properties not correct for \"DateFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutomationRuleDateFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutomationRuleDateFilterPropertyValidator(properties).assertSuccess();
  return {
    "DateRange": convertCfnAutomationRuleDateRangePropertyToCloudFormation(properties.dateRange),
    "End": cdk.stringToCloudFormation(properties.end),
    "Start": cdk.stringToCloudFormation(properties.start)
  };
}

// @ts-ignore TS6133
function CfnAutomationRuleDateFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAutomationRule.DateFilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutomationRule.DateFilterProperty>();
  ret.addPropertyResult("dateRange", "DateRange", (properties.DateRange != null ? CfnAutomationRuleDateRangePropertyFromCloudFormation(properties.DateRange) : undefined));
  ret.addPropertyResult("end", "End", (properties.End != null ? cfn_parse.FromCloudFormation.getString(properties.End) : undefined));
  ret.addPropertyResult("start", "Start", (properties.Start != null ? cfn_parse.FromCloudFormation.getString(properties.Start) : undefined));
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
function CfnAutomationRuleNumberFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eq", cdk.validateNumber)(properties.eq));
  errors.collect(cdk.propertyValidator("gte", cdk.validateNumber)(properties.gte));
  errors.collect(cdk.propertyValidator("lte", cdk.validateNumber)(properties.lte));
  return errors.wrap("supplied properties not correct for \"NumberFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutomationRuleNumberFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutomationRuleNumberFilterPropertyValidator(properties).assertSuccess();
  return {
    "Eq": cdk.numberToCloudFormation(properties.eq),
    "Gte": cdk.numberToCloudFormation(properties.gte),
    "Lte": cdk.numberToCloudFormation(properties.lte)
  };
}

// @ts-ignore TS6133
function CfnAutomationRuleNumberFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAutomationRule.NumberFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutomationRule.NumberFilterProperty>();
  ret.addPropertyResult("eq", "Eq", (properties.Eq != null ? cfn_parse.FromCloudFormation.getNumber(properties.Eq) : undefined));
  ret.addPropertyResult("gte", "Gte", (properties.Gte != null ? cfn_parse.FromCloudFormation.getNumber(properties.Gte) : undefined));
  ret.addPropertyResult("lte", "Lte", (properties.Lte != null ? cfn_parse.FromCloudFormation.getNumber(properties.Lte) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutomationRulesFindingFiltersProperty`
 *
 * @param properties - the TypeScript properties of a `AutomationRulesFindingFiltersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutomationRuleAutomationRulesFindingFiltersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsAccountId", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.awsAccountId));
  errors.collect(cdk.propertyValidator("companyName", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.companyName));
  errors.collect(cdk.propertyValidator("complianceAssociatedStandardsId", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.complianceAssociatedStandardsId));
  errors.collect(cdk.propertyValidator("complianceSecurityControlId", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.complianceSecurityControlId));
  errors.collect(cdk.propertyValidator("complianceStatus", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.complianceStatus));
  errors.collect(cdk.propertyValidator("confidence", cdk.listValidator(CfnAutomationRuleNumberFilterPropertyValidator))(properties.confidence));
  errors.collect(cdk.propertyValidator("createdAt", cdk.listValidator(CfnAutomationRuleDateFilterPropertyValidator))(properties.createdAt));
  errors.collect(cdk.propertyValidator("criticality", cdk.listValidator(CfnAutomationRuleNumberFilterPropertyValidator))(properties.criticality));
  errors.collect(cdk.propertyValidator("description", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.description));
  errors.collect(cdk.propertyValidator("firstObservedAt", cdk.listValidator(CfnAutomationRuleDateFilterPropertyValidator))(properties.firstObservedAt));
  errors.collect(cdk.propertyValidator("generatorId", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.generatorId));
  errors.collect(cdk.propertyValidator("id", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.id));
  errors.collect(cdk.propertyValidator("lastObservedAt", cdk.listValidator(CfnAutomationRuleDateFilterPropertyValidator))(properties.lastObservedAt));
  errors.collect(cdk.propertyValidator("noteText", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.noteText));
  errors.collect(cdk.propertyValidator("noteUpdatedAt", cdk.listValidator(CfnAutomationRuleDateFilterPropertyValidator))(properties.noteUpdatedAt));
  errors.collect(cdk.propertyValidator("noteUpdatedBy", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.noteUpdatedBy));
  errors.collect(cdk.propertyValidator("productArn", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.productArn));
  errors.collect(cdk.propertyValidator("productName", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.productName));
  errors.collect(cdk.propertyValidator("recordState", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.recordState));
  errors.collect(cdk.propertyValidator("relatedFindingsId", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.relatedFindingsId));
  errors.collect(cdk.propertyValidator("relatedFindingsProductArn", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.relatedFindingsProductArn));
  errors.collect(cdk.propertyValidator("resourceDetailsOther", cdk.listValidator(CfnAutomationRuleMapFilterPropertyValidator))(properties.resourceDetailsOther));
  errors.collect(cdk.propertyValidator("resourceId", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.resourceId));
  errors.collect(cdk.propertyValidator("resourcePartition", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.resourcePartition));
  errors.collect(cdk.propertyValidator("resourceRegion", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.resourceRegion));
  errors.collect(cdk.propertyValidator("resourceTags", cdk.listValidator(CfnAutomationRuleMapFilterPropertyValidator))(properties.resourceTags));
  errors.collect(cdk.propertyValidator("resourceType", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.resourceType));
  errors.collect(cdk.propertyValidator("severityLabel", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.severityLabel));
  errors.collect(cdk.propertyValidator("sourceUrl", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.sourceUrl));
  errors.collect(cdk.propertyValidator("title", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.title));
  errors.collect(cdk.propertyValidator("type", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.type));
  errors.collect(cdk.propertyValidator("updatedAt", cdk.listValidator(CfnAutomationRuleDateFilterPropertyValidator))(properties.updatedAt));
  errors.collect(cdk.propertyValidator("userDefinedFields", cdk.listValidator(CfnAutomationRuleMapFilterPropertyValidator))(properties.userDefinedFields));
  errors.collect(cdk.propertyValidator("verificationState", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.verificationState));
  errors.collect(cdk.propertyValidator("workflowStatus", cdk.listValidator(CfnAutomationRuleStringFilterPropertyValidator))(properties.workflowStatus));
  return errors.wrap("supplied properties not correct for \"AutomationRulesFindingFiltersProperty\"");
}

// @ts-ignore TS6133
function convertCfnAutomationRuleAutomationRulesFindingFiltersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutomationRuleAutomationRulesFindingFiltersPropertyValidator(properties).assertSuccess();
  return {
    "AwsAccountId": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.awsAccountId),
    "CompanyName": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.companyName),
    "ComplianceAssociatedStandardsId": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.complianceAssociatedStandardsId),
    "ComplianceSecurityControlId": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.complianceSecurityControlId),
    "ComplianceStatus": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.complianceStatus),
    "Confidence": cdk.listMapper(convertCfnAutomationRuleNumberFilterPropertyToCloudFormation)(properties.confidence),
    "CreatedAt": cdk.listMapper(convertCfnAutomationRuleDateFilterPropertyToCloudFormation)(properties.createdAt),
    "Criticality": cdk.listMapper(convertCfnAutomationRuleNumberFilterPropertyToCloudFormation)(properties.criticality),
    "Description": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.description),
    "FirstObservedAt": cdk.listMapper(convertCfnAutomationRuleDateFilterPropertyToCloudFormation)(properties.firstObservedAt),
    "GeneratorId": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.generatorId),
    "Id": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.id),
    "LastObservedAt": cdk.listMapper(convertCfnAutomationRuleDateFilterPropertyToCloudFormation)(properties.lastObservedAt),
    "NoteText": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.noteText),
    "NoteUpdatedAt": cdk.listMapper(convertCfnAutomationRuleDateFilterPropertyToCloudFormation)(properties.noteUpdatedAt),
    "NoteUpdatedBy": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.noteUpdatedBy),
    "ProductArn": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.productArn),
    "ProductName": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.productName),
    "RecordState": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.recordState),
    "RelatedFindingsId": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.relatedFindingsId),
    "RelatedFindingsProductArn": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.relatedFindingsProductArn),
    "ResourceDetailsOther": cdk.listMapper(convertCfnAutomationRuleMapFilterPropertyToCloudFormation)(properties.resourceDetailsOther),
    "ResourceId": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.resourceId),
    "ResourcePartition": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.resourcePartition),
    "ResourceRegion": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.resourceRegion),
    "ResourceTags": cdk.listMapper(convertCfnAutomationRuleMapFilterPropertyToCloudFormation)(properties.resourceTags),
    "ResourceType": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.resourceType),
    "SeverityLabel": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.severityLabel),
    "SourceUrl": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.sourceUrl),
    "Title": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.title),
    "Type": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.type),
    "UpdatedAt": cdk.listMapper(convertCfnAutomationRuleDateFilterPropertyToCloudFormation)(properties.updatedAt),
    "UserDefinedFields": cdk.listMapper(convertCfnAutomationRuleMapFilterPropertyToCloudFormation)(properties.userDefinedFields),
    "VerificationState": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.verificationState),
    "WorkflowStatus": cdk.listMapper(convertCfnAutomationRuleStringFilterPropertyToCloudFormation)(properties.workflowStatus)
  };
}

// @ts-ignore TS6133
function CfnAutomationRuleAutomationRulesFindingFiltersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAutomationRule.AutomationRulesFindingFiltersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutomationRule.AutomationRulesFindingFiltersProperty>();
  ret.addPropertyResult("awsAccountId", "AwsAccountId", (properties.AwsAccountId != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.AwsAccountId) : undefined));
  ret.addPropertyResult("companyName", "CompanyName", (properties.CompanyName != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.CompanyName) : undefined));
  ret.addPropertyResult("complianceAssociatedStandardsId", "ComplianceAssociatedStandardsId", (properties.ComplianceAssociatedStandardsId != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.ComplianceAssociatedStandardsId) : undefined));
  ret.addPropertyResult("complianceSecurityControlId", "ComplianceSecurityControlId", (properties.ComplianceSecurityControlId != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.ComplianceSecurityControlId) : undefined));
  ret.addPropertyResult("complianceStatus", "ComplianceStatus", (properties.ComplianceStatus != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.ComplianceStatus) : undefined));
  ret.addPropertyResult("confidence", "Confidence", (properties.Confidence != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleNumberFilterPropertyFromCloudFormation)(properties.Confidence) : undefined));
  ret.addPropertyResult("createdAt", "CreatedAt", (properties.CreatedAt != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleDateFilterPropertyFromCloudFormation)(properties.CreatedAt) : undefined));
  ret.addPropertyResult("criticality", "Criticality", (properties.Criticality != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleNumberFilterPropertyFromCloudFormation)(properties.Criticality) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.Description) : undefined));
  ret.addPropertyResult("firstObservedAt", "FirstObservedAt", (properties.FirstObservedAt != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleDateFilterPropertyFromCloudFormation)(properties.FirstObservedAt) : undefined));
  ret.addPropertyResult("generatorId", "GeneratorId", (properties.GeneratorId != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.GeneratorId) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.Id) : undefined));
  ret.addPropertyResult("lastObservedAt", "LastObservedAt", (properties.LastObservedAt != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleDateFilterPropertyFromCloudFormation)(properties.LastObservedAt) : undefined));
  ret.addPropertyResult("noteText", "NoteText", (properties.NoteText != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.NoteText) : undefined));
  ret.addPropertyResult("noteUpdatedAt", "NoteUpdatedAt", (properties.NoteUpdatedAt != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleDateFilterPropertyFromCloudFormation)(properties.NoteUpdatedAt) : undefined));
  ret.addPropertyResult("noteUpdatedBy", "NoteUpdatedBy", (properties.NoteUpdatedBy != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.NoteUpdatedBy) : undefined));
  ret.addPropertyResult("productArn", "ProductArn", (properties.ProductArn != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.ProductArn) : undefined));
  ret.addPropertyResult("productName", "ProductName", (properties.ProductName != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.ProductName) : undefined));
  ret.addPropertyResult("recordState", "RecordState", (properties.RecordState != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.RecordState) : undefined));
  ret.addPropertyResult("relatedFindingsId", "RelatedFindingsId", (properties.RelatedFindingsId != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.RelatedFindingsId) : undefined));
  ret.addPropertyResult("relatedFindingsProductArn", "RelatedFindingsProductArn", (properties.RelatedFindingsProductArn != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.RelatedFindingsProductArn) : undefined));
  ret.addPropertyResult("resourceDetailsOther", "ResourceDetailsOther", (properties.ResourceDetailsOther != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleMapFilterPropertyFromCloudFormation)(properties.ResourceDetailsOther) : undefined));
  ret.addPropertyResult("resourceId", "ResourceId", (properties.ResourceId != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.ResourceId) : undefined));
  ret.addPropertyResult("resourcePartition", "ResourcePartition", (properties.ResourcePartition != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.ResourcePartition) : undefined));
  ret.addPropertyResult("resourceRegion", "ResourceRegion", (properties.ResourceRegion != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.ResourceRegion) : undefined));
  ret.addPropertyResult("resourceTags", "ResourceTags", (properties.ResourceTags != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleMapFilterPropertyFromCloudFormation)(properties.ResourceTags) : undefined));
  ret.addPropertyResult("resourceType", "ResourceType", (properties.ResourceType != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.ResourceType) : undefined));
  ret.addPropertyResult("severityLabel", "SeverityLabel", (properties.SeverityLabel != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.SeverityLabel) : undefined));
  ret.addPropertyResult("sourceUrl", "SourceUrl", (properties.SourceUrl != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.SourceUrl) : undefined));
  ret.addPropertyResult("title", "Title", (properties.Title != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.Title) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.Type) : undefined));
  ret.addPropertyResult("updatedAt", "UpdatedAt", (properties.UpdatedAt != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleDateFilterPropertyFromCloudFormation)(properties.UpdatedAt) : undefined));
  ret.addPropertyResult("userDefinedFields", "UserDefinedFields", (properties.UserDefinedFields != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleMapFilterPropertyFromCloudFormation)(properties.UserDefinedFields) : undefined));
  ret.addPropertyResult("verificationState", "VerificationState", (properties.VerificationState != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.VerificationState) : undefined));
  ret.addPropertyResult("workflowStatus", "WorkflowStatus", (properties.WorkflowStatus != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleStringFilterPropertyFromCloudFormation)(properties.WorkflowStatus) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAutomationRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnAutomationRuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAutomationRulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.listValidator(CfnAutomationRuleAutomationRulesActionPropertyValidator))(properties.actions));
  errors.collect(cdk.propertyValidator("criteria", CfnAutomationRuleAutomationRulesFindingFiltersPropertyValidator)(properties.criteria));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("isTerminal", cdk.validateBoolean)(properties.isTerminal));
  errors.collect(cdk.propertyValidator("ruleName", cdk.validateString)(properties.ruleName));
  errors.collect(cdk.propertyValidator("ruleOrder", cdk.validateNumber)(properties.ruleOrder));
  errors.collect(cdk.propertyValidator("ruleStatus", cdk.validateString)(properties.ruleStatus));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAutomationRuleProps\"");
}

// @ts-ignore TS6133
function convertCfnAutomationRulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAutomationRulePropsValidator(properties).assertSuccess();
  return {
    "Actions": cdk.listMapper(convertCfnAutomationRuleAutomationRulesActionPropertyToCloudFormation)(properties.actions),
    "Criteria": convertCfnAutomationRuleAutomationRulesFindingFiltersPropertyToCloudFormation(properties.criteria),
    "Description": cdk.stringToCloudFormation(properties.description),
    "IsTerminal": cdk.booleanToCloudFormation(properties.isTerminal),
    "RuleName": cdk.stringToCloudFormation(properties.ruleName),
    "RuleOrder": cdk.numberToCloudFormation(properties.ruleOrder),
    "RuleStatus": cdk.stringToCloudFormation(properties.ruleStatus),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAutomationRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAutomationRuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAutomationRuleProps>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? cfn_parse.FromCloudFormation.getArray(CfnAutomationRuleAutomationRulesActionPropertyFromCloudFormation)(properties.Actions) : undefined));
  ret.addPropertyResult("criteria", "Criteria", (properties.Criteria != null ? CfnAutomationRuleAutomationRulesFindingFiltersPropertyFromCloudFormation(properties.Criteria) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("isTerminal", "IsTerminal", (properties.IsTerminal != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsTerminal) : undefined));
  ret.addPropertyResult("ruleName", "RuleName", (properties.RuleName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleName) : undefined));
  ret.addPropertyResult("ruleOrder", "RuleOrder", (properties.RuleOrder != null ? cfn_parse.FromCloudFormation.getNumber(properties.RuleOrder) : undefined));
  ret.addPropertyResult("ruleStatus", "RuleStatus", (properties.RuleStatus != null ? cfn_parse.FromCloudFormation.getString(properties.RuleStatus) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SecurityHub::Hub` resource specifies the enablement of the AWS Security Hub service in your AWS account .
 *
 * The service is enabled in the current AWS Region or the specified Region. You create a separate `Hub` resource in each Region in which you want to enable Security Hub .
 *
 * When you use this resource to enable Security Hub , default security standards are enabled. To disable default standards, set the `EnableDefaultStandards` property to `false` . You can use the [`AWS::SecurityHub::Standard`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-standard.html) resource to enable additional standards.
 *
 * When you use this resource to enable Security Hub , new controls are automatically enabled for your enabled standards. To disable automatic enablement of new controls, set the `AutoEnableControls` property to `false` .
 *
 * You must create an `AWS::SecurityHub::Hub` resource for an account before you can create other types of Security Hub resources for the account through AWS CloudFormation . Use a [DependsOn attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) , such as `"DependsOn": "Hub"` , to ensure that you've created an `AWS::SecurityHub::Hub` resource before creating other Security Hub resources for an account.
 *
 * @cloudformationResource AWS::SecurityHub::Hub
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-hub.html
 */
export class CfnHub extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SecurityHub::Hub";

  /**
   * Build a CfnHub from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHub {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnHubPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnHub(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the `Hub` resource that was retrieved.
   *
   * @cloudformationAttribute ARN
   */
  public readonly attrArn: string;

  /**
   * The date and time when Security Hub was enabled in your account.
   *
   * @cloudformationAttribute SubscribedAt
   */
  public readonly attrSubscribedAt: string;

  /**
   * Whether to automatically enable new controls when they are added to standards that are enabled.
   */
  public autoEnableControls?: boolean | cdk.IResolvable;

  /**
   * Specifies whether an account has consolidated control findings turned on or off.
   */
  public controlFindingGenerator?: string;

  /**
   * Whether to enable the security standards that Security Hub has designated as automatically enabled.
   */
  public enableDefaultStandards?: boolean | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: any;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnHubProps = {}) {
    super(scope, id, {
      "type": CfnHub.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("ARN", cdk.ResolutionTypeHint.STRING));
    this.attrSubscribedAt = cdk.Token.asString(this.getAtt("SubscribedAt", cdk.ResolutionTypeHint.STRING));
    this.autoEnableControls = props.autoEnableControls;
    this.controlFindingGenerator = props.controlFindingGenerator;
    this.enableDefaultStandards = props.enableDefaultStandards;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::SecurityHub::Hub", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoEnableControls": this.autoEnableControls,
      "controlFindingGenerator": this.controlFindingGenerator,
      "enableDefaultStandards": this.enableDefaultStandards,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnHub.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnHubPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnHub`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-hub.html
 */
export interface CfnHubProps {
  /**
   * Whether to automatically enable new controls when they are added to standards that are enabled.
   *
   * By default, this is set to `true` , and new controls are enabled automatically. To not automatically enable new controls, set this to `false` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-hub.html#cfn-securityhub-hub-autoenablecontrols
   */
  readonly autoEnableControls?: boolean | cdk.IResolvable;

  /**
   * Specifies whether an account has consolidated control findings turned on or off.
   *
   * If the value for this field is set to `SECURITY_CONTROL` , Security Hub generates a single finding for a control check even when the check applies to multiple enabled standards.
   *
   * If the value for this field is set to `STANDARD_CONTROL` , Security Hub generates separate findings for a control check when the check applies to multiple enabled standards.
   *
   * The value for this field in a member account matches the value in the administrator account. For accounts that aren't part of an organization, the default value of this field is `SECURITY_CONTROL` if you enabled Security Hub on or after February 23, 2023.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-hub.html#cfn-securityhub-hub-controlfindinggenerator
   */
  readonly controlFindingGenerator?: string;

  /**
   * Whether to enable the security standards that Security Hub has designated as automatically enabled.
   *
   * If you don't provide a value for `EnableDefaultStandards` , it is set to `true` , and the designated standards are automatically enabled in each AWS Region where you enable Security Hub . If you don't want to enable the designated standards, set `EnableDefaultStandards` to `false` .
   *
   * Currently, the automatically enabled standards are the Center for Internet Security (CIS) AWS Foundations Benchmark v1.2.0 and AWS Foundational Security Best Practices (FSBP).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-hub.html#cfn-securityhub-hub-enabledefaultstandards
   */
  readonly enableDefaultStandards?: boolean | cdk.IResolvable;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-hub.html#cfn-securityhub-hub-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `CfnHubProps`
 *
 * @param properties - the TypeScript properties of a `CfnHubProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHubPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoEnableControls", cdk.validateBoolean)(properties.autoEnableControls));
  errors.collect(cdk.propertyValidator("controlFindingGenerator", cdk.validateString)(properties.controlFindingGenerator));
  errors.collect(cdk.propertyValidator("enableDefaultStandards", cdk.validateBoolean)(properties.enableDefaultStandards));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnHubProps\"");
}

// @ts-ignore TS6133
function convertCfnHubPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHubPropsValidator(properties).assertSuccess();
  return {
    "AutoEnableControls": cdk.booleanToCloudFormation(properties.autoEnableControls),
    "ControlFindingGenerator": cdk.stringToCloudFormation(properties.controlFindingGenerator),
    "EnableDefaultStandards": cdk.booleanToCloudFormation(properties.enableDefaultStandards),
    "Tags": cdk.objectToCloudFormation(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnHubPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHubProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHubProps>();
  ret.addPropertyResult("autoEnableControls", "AutoEnableControls", (properties.AutoEnableControls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoEnableControls) : undefined));
  ret.addPropertyResult("controlFindingGenerator", "ControlFindingGenerator", (properties.ControlFindingGenerator != null ? cfn_parse.FromCloudFormation.getString(properties.ControlFindingGenerator) : undefined));
  ret.addPropertyResult("enableDefaultStandards", "EnableDefaultStandards", (properties.EnableDefaultStandards != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableDefaultStandards) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SecurityHub::Standard` resource specifies the enablement of a security standard.
 *
 * The standard is identified by the `StandardsArn` property. To view a list of Security Hub standards and their Amazon Resource Names (ARNs), use the [`DescribeStandards`](https://docs.aws.amazon.com/securityhub/1.0/APIReference/API_DescribeStandards.html) API operation.
 *
 * You must create a separate `AWS::SecurityHub::Standard` resource for each standard that you want to enable.
 *
 * For more information about Security Hub standards, see [Security Hub standards reference](https://docs.aws.amazon.com/securityhub/latest/userguide/standards-reference.html) in the *AWS Security Hub User Guide* .
 *
 * @cloudformationResource AWS::SecurityHub::Standard
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-standard.html
 */
export class CfnStandard extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SecurityHub::Standard";

  /**
   * Build a CfnStandard from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStandard {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStandardPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStandard(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of a resource that represents your subscription to a supported standard.
   *
   * @cloudformationAttribute StandardsSubscriptionArn
   */
  public readonly attrStandardsSubscriptionArn: string;

  /**
   * Specifies which controls are to be disabled in a standard.
   */
  public disabledStandardsControls?: Array<cdk.IResolvable | CfnStandard.StandardsControlProperty> | cdk.IResolvable;

  /**
   * The ARN of the standard that you want to enable.
   */
  public standardsArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStandardProps) {
    super(scope, id, {
      "type": CfnStandard.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "standardsArn", this);

    this.attrStandardsSubscriptionArn = cdk.Token.asString(this.getAtt("StandardsSubscriptionArn", cdk.ResolutionTypeHint.STRING));
    this.disabledStandardsControls = props.disabledStandardsControls;
    this.standardsArn = props.standardsArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "disabledStandardsControls": this.disabledStandardsControls,
      "standardsArn": this.standardsArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStandard.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStandardPropsToCloudFormation(props);
  }
}

export namespace CfnStandard {
  /**
   * Provides details about an individual security control.
   *
   * For a list of Security Hub controls, see [Security Hub controls reference](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-controls-reference.html) in the *AWS Security Hub User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-standard-standardscontrol.html
   */
  export interface StandardsControlProperty {
    /**
     * A user-defined reason for changing a control's enablement status in a specified standard.
     *
     * If you are disabling a control, then this property is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-standard-standardscontrol.html#cfn-securityhub-standard-standardscontrol-reason
     */
    readonly reason?: string;

    /**
     * The Amazon Resource Name (ARN) of the control.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-securityhub-standard-standardscontrol.html#cfn-securityhub-standard-standardscontrol-standardscontrolarn
     */
    readonly standardsControlArn: string;
  }
}

/**
 * Properties for defining a `CfnStandard`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-standard.html
 */
export interface CfnStandardProps {
  /**
   * Specifies which controls are to be disabled in a standard.
   *
   * *Maximum* : `100`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-standard.html#cfn-securityhub-standard-disabledstandardscontrols
   */
  readonly disabledStandardsControls?: Array<cdk.IResolvable | CfnStandard.StandardsControlProperty> | cdk.IResolvable;

  /**
   * The ARN of the standard that you want to enable.
   *
   * To view a list of available Security Hub standards and their ARNs, use the [`DescribeStandards`](https://docs.aws.amazon.com/securityhub/1.0/APIReference/API_DescribeStandards.html) API operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-securityhub-standard.html#cfn-securityhub-standard-standardsarn
   */
  readonly standardsArn: string;
}

/**
 * Determine whether the given properties match those of a `StandardsControlProperty`
 *
 * @param properties - the TypeScript properties of a `StandardsControlProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStandardStandardsControlPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("reason", cdk.validateString)(properties.reason));
  errors.collect(cdk.propertyValidator("standardsControlArn", cdk.requiredValidator)(properties.standardsControlArn));
  errors.collect(cdk.propertyValidator("standardsControlArn", cdk.validateString)(properties.standardsControlArn));
  return errors.wrap("supplied properties not correct for \"StandardsControlProperty\"");
}

// @ts-ignore TS6133
function convertCfnStandardStandardsControlPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStandardStandardsControlPropertyValidator(properties).assertSuccess();
  return {
    "Reason": cdk.stringToCloudFormation(properties.reason),
    "StandardsControlArn": cdk.stringToCloudFormation(properties.standardsControlArn)
  };
}

// @ts-ignore TS6133
function CfnStandardStandardsControlPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStandard.StandardsControlProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStandard.StandardsControlProperty>();
  ret.addPropertyResult("reason", "Reason", (properties.Reason != null ? cfn_parse.FromCloudFormation.getString(properties.Reason) : undefined));
  ret.addPropertyResult("standardsControlArn", "StandardsControlArn", (properties.StandardsControlArn != null ? cfn_parse.FromCloudFormation.getString(properties.StandardsControlArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStandardProps`
 *
 * @param properties - the TypeScript properties of a `CfnStandardProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStandardPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("disabledStandardsControls", cdk.listValidator(CfnStandardStandardsControlPropertyValidator))(properties.disabledStandardsControls));
  errors.collect(cdk.propertyValidator("standardsArn", cdk.requiredValidator)(properties.standardsArn));
  errors.collect(cdk.propertyValidator("standardsArn", cdk.validateString)(properties.standardsArn));
  return errors.wrap("supplied properties not correct for \"CfnStandardProps\"");
}

// @ts-ignore TS6133
function convertCfnStandardPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStandardPropsValidator(properties).assertSuccess();
  return {
    "DisabledStandardsControls": cdk.listMapper(convertCfnStandardStandardsControlPropertyToCloudFormation)(properties.disabledStandardsControls),
    "StandardsArn": cdk.stringToCloudFormation(properties.standardsArn)
  };
}

// @ts-ignore TS6133
function CfnStandardPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStandardProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStandardProps>();
  ret.addPropertyResult("disabledStandardsControls", "DisabledStandardsControls", (properties.DisabledStandardsControls != null ? cfn_parse.FromCloudFormation.getArray(CfnStandardStandardsControlPropertyFromCloudFormation)(properties.DisabledStandardsControls) : undefined));
  ret.addPropertyResult("standardsArn", "StandardsArn", (properties.StandardsArn != null ? cfn_parse.FromCloudFormation.getString(properties.StandardsArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}