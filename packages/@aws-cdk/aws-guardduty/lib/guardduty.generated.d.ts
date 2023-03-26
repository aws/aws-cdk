import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnDetector`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html
 */
export interface CfnDetectorProps {
    /**
     * Specifies whether the detector is to be enabled on creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html#cfn-guardduty-detector-enable
     */
    readonly enable: boolean | cdk.IResolvable;
    /**
     * Describes which data sources will be enabled for the detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html#cfn-guardduty-detector-datasources
     */
    readonly dataSources?: CfnDetector.CFNDataSourceConfigurationsProperty | cdk.IResolvable;
    /**
     * Specifies how frequently updated findings are exported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html#cfn-guardduty-detector-findingpublishingfrequency
     */
    readonly findingPublishingFrequency?: string;
    /**
     * The tags to be added to a new detector resource. Each tag consists of a key and an optional value, both of which you define.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html#cfn-guardduty-detector-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::GuardDuty::Detector`
 *
 * The `AWS::GuardDuty::Detector` resource specifies a new  detector. A detector is an object that represents the  service. A detector is required for  to become operational.
 *
 * @cloudformationResource AWS::GuardDuty::Detector
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html
 */
export declare class CfnDetector extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GuardDuty::Detector";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDetector;
    /**
     * Specifies whether the detector is to be enabled on creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html#cfn-guardduty-detector-enable
     */
    enable: boolean | cdk.IResolvable;
    /**
     * Describes which data sources will be enabled for the detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html#cfn-guardduty-detector-datasources
     */
    dataSources: CfnDetector.CFNDataSourceConfigurationsProperty | cdk.IResolvable | undefined;
    /**
     * Specifies how frequently updated findings are exported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html#cfn-guardduty-detector-findingpublishingfrequency
     */
    findingPublishingFrequency: string | undefined;
    /**
     * The tags to be added to a new detector resource. Each tag consists of a key and an optional value, both of which you define.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html#cfn-guardduty-detector-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::GuardDuty::Detector`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDetectorProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnDetector {
    /**
     * Describes whether S3 data event logs, Kubernetes audit logs, or Malware Protection will be enabled as a data source when the detector is created.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfndatasourceconfigurations.html
     */
    interface CFNDataSourceConfigurationsProperty {
        /**
         * Describes which Kuberentes data sources are enabled for a detector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfndatasourceconfigurations.html#cfn-guardduty-detector-cfndatasourceconfigurations-kubernetes
         */
        readonly kubernetes?: CfnDetector.CFNKubernetesConfigurationProperty | cdk.IResolvable;
        /**
         * Describes whether Malware Protection will be enabled as a data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfndatasourceconfigurations.html#cfn-guardduty-detector-cfndatasourceconfigurations-malwareprotection
         */
        readonly malwareProtection?: CfnDetector.CFNMalwareProtectionConfigurationProperty | cdk.IResolvable;
        /**
         * Describes whether S3 data event logs are enabled as a data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfndatasourceconfigurations.html#cfn-guardduty-detector-cfndatasourceconfigurations-s3logs
         */
        readonly s3Logs?: CfnDetector.CFNS3LogsConfigurationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDetector {
    /**
     * Describes which optional data sources are enabled for a detector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnkubernetesauditlogsconfiguration.html
     */
    interface CFNKubernetesAuditLogsConfigurationProperty {
        /**
         * Describes whether Kubernetes audit logs are enabled as a data source for the detector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnkubernetesauditlogsconfiguration.html#cfn-guardduty-detector-cfnkubernetesauditlogsconfiguration-enable
         */
        readonly enable?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnDetector {
    /**
     * Describes which Kubernetes protection data sources are enabled for the detector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnkubernetesconfiguration.html
     */
    interface CFNKubernetesConfigurationProperty {
        /**
         * Describes whether Kubernetes audit logs are enabled as a data source for the detector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnkubernetesconfiguration.html#cfn-guardduty-detector-cfnkubernetesconfiguration-auditlogs
         */
        readonly auditLogs?: CfnDetector.CFNKubernetesAuditLogsConfigurationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDetector {
    /**
     * Describes whether Malware Protection will be enabled as a data source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnmalwareprotectionconfiguration.html
     */
    interface CFNMalwareProtectionConfigurationProperty {
        /**
         * Describes the configuration of Malware Protection for EC2 instances with findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnmalwareprotectionconfiguration.html#cfn-guardduty-detector-cfnmalwareprotectionconfiguration-scanec2instancewithfindings
         */
        readonly scanEc2InstanceWithFindings?: CfnDetector.CFNScanEc2InstanceWithFindingsConfigurationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDetector {
    /**
     * Describes whether S3 data event logs will be enabled as a data source when the detector is created.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfns3logsconfiguration.html
     */
    interface CFNS3LogsConfigurationProperty {
        /**
         * The status of S3 data event logs as a data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfns3logsconfiguration.html#cfn-guardduty-detector-cfns3logsconfiguration-enable
         */
        readonly enable?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnDetector {
    /**
     * Describes whether Malware Protection for EC2 instances with findings will be enabled as a data source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnscanec2instancewithfindingsconfiguration.html
     */
    interface CFNScanEc2InstanceWithFindingsConfigurationProperty {
        /**
         * Describes the configuration for scanning EBS volumes as data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-detector-cfnscanec2instancewithfindingsconfiguration.html#cfn-guardduty-detector-cfnscanec2instancewithfindingsconfiguration-ebsvolumes
         */
        readonly ebsVolumes?: boolean | cdk.IResolvable;
    }
}
/**
 * Properties for defining a `CfnFilter`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html
 */
export interface CfnFilterProps {
    /**
     * Specifies the action that is to be applied to the findings that match the filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-action
     */
    readonly action: string;
    /**
     * The description of the filter. Valid special characters include period (.), underscore (_), dash (-), and whitespace. The new line character is considered to be an invalid input for description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-description
     */
    readonly description: string;
    /**
     * The ID of the detector belonging to the GuardDuty account that you want to create a filter for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-detectorid
     */
    readonly detectorId: string;
    /**
     * Represents the criteria to be used in the filter for querying findings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-findingcriteria
     */
    readonly findingCriteria: CfnFilter.FindingCriteriaProperty | cdk.IResolvable;
    /**
     * The name of the filter. Valid characters include period (.), underscore (_), dash (-), and alphanumeric characters. A whitespace is considered to be an invalid character.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-name
     */
    readonly name: string;
    /**
     * Specifies the position of the filter in the list of current filters. Also specifies the order in which this filter is applied to the findings. The minimum value for this property is 1 and the maximum is 100.
     *
     * By default, filters may not be created in the same order as they are ranked. To ensure that the filters are created in the expected order, you can use an optional attribute, [DependsOn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) , with the following syntax: `"DependsOn":[ "ObjectName" ]` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-rank
     */
    readonly rank: number;
    /**
     * The tags to be added to a new filter resource. Each tag consists of a key and an optional value, both of which you define.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::GuardDuty::Filter`
 *
 * The `AWS::GuardDuty::Filter` resource specifies a new filter defined by the provided `findingCriteria` .
 *
 * @cloudformationResource AWS::GuardDuty::Filter
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html
 */
export declare class CfnFilter extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GuardDuty::Filter";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFilter;
    /**
     * Specifies the action that is to be applied to the findings that match the filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-action
     */
    action: string;
    /**
     * The description of the filter. Valid special characters include period (.), underscore (_), dash (-), and whitespace. The new line character is considered to be an invalid input for description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-description
     */
    description: string;
    /**
     * The ID of the detector belonging to the GuardDuty account that you want to create a filter for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-detectorid
     */
    detectorId: string;
    /**
     * Represents the criteria to be used in the filter for querying findings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-findingcriteria
     */
    findingCriteria: CfnFilter.FindingCriteriaProperty | cdk.IResolvable;
    /**
     * The name of the filter. Valid characters include period (.), underscore (_), dash (-), and alphanumeric characters. A whitespace is considered to be an invalid character.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-name
     */
    name: string;
    /**
     * Specifies the position of the filter in the list of current filters. Also specifies the order in which this filter is applied to the findings. The minimum value for this property is 1 and the maximum is 100.
     *
     * By default, filters may not be created in the same order as they are ranked. To ensure that the filters are created in the expected order, you can use an optional attribute, [DependsOn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) , with the following syntax: `"DependsOn":[ "ObjectName" ]` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-rank
     */
    rank: number;
    /**
     * The tags to be added to a new filter resource. Each tag consists of a key and an optional value, both of which you define.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::GuardDuty::Filter`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFilterProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnFilter {
    /**
     * Specifies the condition to apply to a single field when filtering through  findings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html
     */
    interface ConditionProperty {
        /**
         * Represents the equal condition to apply to a single field when querying for findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-eq
         */
        readonly eq?: string[];
        /**
         * Represents an *equal* ** condition to be applied to a single field when querying for findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-equals
         */
        readonly equalTo?: string[];
        /**
         * Represents a *greater than* condition to be applied to a single field when querying for findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-greaterthan
         */
        readonly greaterThan?: number;
        /**
         * Represents a *greater than or equal* condition to be applied to a single field when querying for findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-greaterthanorequal
         */
        readonly greaterThanOrEqual?: number;
        /**
         * Represents a *greater than* condition to be applied to a single field when querying for findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-gt
         */
        readonly gt?: number;
        /**
         * Represents the greater than or equal condition to apply to a single field when querying for findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-gte
         */
        readonly gte?: number;
        /**
         * Represents a *less than* condition to be applied to a single field when querying for findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-lessthan
         */
        readonly lessThan?: number;
        /**
         * Represents a *less than or equal* condition to be applied to a single field when querying for findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-lessthanorequal
         */
        readonly lessThanOrEqual?: number;
        /**
         * Represents the less than condition to apply to a single field when querying for findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-lt
         */
        readonly lt?: number;
        /**
         * Represents the less than or equal condition to apply to a single field when querying for findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-lte
         */
        readonly lte?: number;
        /**
         * Represents the not equal condition to apply to a single field when querying for findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-neq
         */
        readonly neq?: string[];
        /**
         * Represents a *not equal* ** condition to be applied to a single field when querying for findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-condition.html#cfn-guardduty-filter-condition-notequals
         */
        readonly notEquals?: string[];
    }
}
export declare namespace CfnFilter {
    /**
     * Represents a map of finding properties that match specified conditions and values when querying findings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-findingcriteria.html
     */
    interface FindingCriteriaProperty {
        /**
         * Represents a map of finding properties that match specified conditions and values when querying findings.
         *
         * For a mapping of JSON criterion to their console equivalent see [Finding criteria](https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_filter-findings.html#filter_criteria) . The following are the available criterion:
         *
         * - accountId
         * - region
         * - confidence
         * - id
         * - resource.accessKeyDetails.accessKeyId
         * - resource.accessKeyDetails.principalId
         * - resource.accessKeyDetails.userName
         * - resource.accessKeyDetails.userType
         * - resource.instanceDetails.iamInstanceProfile.id
         * - resource.instanceDetails.imageId
         * - resource.instanceDetails.instanceId
         * - resource.instanceDetails.outpostArn
         * - resource.instanceDetails.networkInterfaces.ipv6Addresses
         * - resource.instanceDetails.networkInterfaces.privateIpAddresses.privateIpAddress
         * - resource.instanceDetails.networkInterfaces.publicDnsName
         * - resource.instanceDetails.networkInterfaces.publicIp
         * - resource.instanceDetails.networkInterfaces.securityGroups.groupId
         * - resource.instanceDetails.networkInterfaces.securityGroups.groupName
         * - resource.instanceDetails.networkInterfaces.subnetId
         * - resource.instanceDetails.networkInterfaces.vpcId
         * - resource.instanceDetails.tags.key
         * - resource.instanceDetails.tags.value
         * - resource.resourceType
         * - service.action.actionType
         * - service.action.awsApiCallAction.api
         * - service.action.awsApiCallAction.callerType
         * - service.action.awsApiCallAction.errorCode
         * - service.action.awsApiCallAction.remoteIpDetails.city.cityName
         * - service.action.awsApiCallAction.remoteIpDetails.country.countryName
         * - service.action.awsApiCallAction.remoteIpDetails.ipAddressV4
         * - service.action.awsApiCallAction.remoteIpDetails.organization.asn
         * - service.action.awsApiCallAction.remoteIpDetails.organization.asnOrg
         * - service.action.awsApiCallAction.serviceName
         * - service.action.dnsRequestAction.domain
         * - service.action.networkConnectionAction.blocked
         * - service.action.networkConnectionAction.connectionDirection
         * - service.action.networkConnectionAction.localPortDetails.port
         * - service.action.networkConnectionAction.protocol
         * - service.action.networkConnectionAction.localIpDetails.ipAddressV4
         * - service.action.networkConnectionAction.remoteIpDetails.city.cityName
         * - service.action.networkConnectionAction.remoteIpDetails.country.countryName
         * - service.action.networkConnectionAction.remoteIpDetails.ipAddressV4
         * - service.action.networkConnectionAction.remoteIpDetails.organization.asn
         * - service.action.networkConnectionAction.remoteIpDetails.organization.asnOrg
         * - service.action.networkConnectionAction.remotePortDetails.port
         * - service.additionalInfo.threatListName
         * - service.archived
         *
         * When this attribute is set to TRUE, only archived findings are listed. When it's set to FALSE, only unarchived findings are listed. When this attribute is not set, all existing findings are listed.
         * - service.resourceRole
         * - severity
         * - type
         * - updatedAt
         *
         * Type: ISO 8601 string format: YYYY-MM-DDTHH:MM:SS.SSSZ or YYYY-MM-DDTHH:MM:SSZ depending on whether the value contains milliseconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-findingcriteria.html#cfn-guardduty-filter-findingcriteria-criterion
         */
        readonly criterion?: any | cdk.IResolvable;
        /**
         * Specifies the condition to be applied to a single field when filtering through findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-findingcriteria.html#cfn-guardduty-filter-findingcriteria-itemtype
         */
        readonly itemType?: CfnFilter.ConditionProperty | cdk.IResolvable;
    }
}
/**
 * Properties for defining a `CfnIPSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html
 */
export interface CfnIPSetProps {
    /**
     * Indicates whether or not  uses the `IPSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-activate
     */
    readonly activate: boolean | cdk.IResolvable;
    /**
     * The unique ID of the detector of the GuardDuty account that you want to create an IPSet for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-detectorid
     */
    readonly detectorId: string;
    /**
     * The format of the file that contains the IPSet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-format
     */
    readonly format: string;
    /**
     * The URI of the file that contains the IPSet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-location
     */
    readonly location: string;
    /**
     * The user-friendly name to identify the IPSet.
     *
     * Allowed characters are alphanumerics, spaces, hyphens (-), and underscores (_).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-name
     */
    readonly name?: string;
    /**
     * The tags to be added to a new IP set resource. Each tag consists of a key and an optional value, both of which you define.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::GuardDuty::IPSet`
 *
 * The `AWS::GuardDuty::IPSet` resource specifies a new `IPSet` . An `IPSet` is a list of trusted IP addresses from which secure communication is allowed with AWS infrastructure and applications.
 *
 * @cloudformationResource AWS::GuardDuty::IPSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html
 */
export declare class CfnIPSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GuardDuty::IPSet";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIPSet;
    /**
     * Indicates whether or not  uses the `IPSet` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-activate
     */
    activate: boolean | cdk.IResolvable;
    /**
     * The unique ID of the detector of the GuardDuty account that you want to create an IPSet for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-detectorid
     */
    detectorId: string;
    /**
     * The format of the file that contains the IPSet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-format
     */
    format: string;
    /**
     * The URI of the file that contains the IPSet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-location
     */
    location: string;
    /**
     * The user-friendly name to identify the IPSet.
     *
     * Allowed characters are alphanumerics, spaces, hyphens (-), and underscores (_).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-name
     */
    name: string | undefined;
    /**
     * The tags to be added to a new IP set resource. Each tag consists of a key and an optional value, both of which you define.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-ipset.html#cfn-guardduty-ipset-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::GuardDuty::IPSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnIPSetProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
/**
 * Properties for defining a `CfnMaster`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html
 */
export interface CfnMasterProps {
    /**
     * The unique ID of the detector of the GuardDuty member account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html#cfn-guardduty-master-detectorid
     */
    readonly detectorId: string;
    /**
     * The AWS account ID of the account designated as the  administrator account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html#cfn-guardduty-master-masterid
     */
    readonly masterId: string;
    /**
     * The ID of the invitation that is sent to the account designated as a member account. You can find the invitation ID by using the ListInvitation action of the  API.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html#cfn-guardduty-master-invitationid
     */
    readonly invitationId?: string;
}
/**
 * A CloudFormation `AWS::GuardDuty::Master`
 *
 * You can use the `AWS::GuardDuty::Master` resource in a  member account to accept an invitation from a  administrator account. The invitation to the member account must be sent prior to using the `AWS::GuardDuty::Master` resource to accept the administrator account's invitation. You can invite a member account by using the `InviteMembers` operation of the  API, or by creating an `AWS::GuardDuty::Member` resource.
 *
 * @cloudformationResource AWS::GuardDuty::Master
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html
 */
export declare class CfnMaster extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GuardDuty::Master";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMaster;
    /**
     * The unique ID of the detector of the GuardDuty member account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html#cfn-guardduty-master-detectorid
     */
    detectorId: string;
    /**
     * The AWS account ID of the account designated as the  administrator account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html#cfn-guardduty-master-masterid
     */
    masterId: string;
    /**
     * The ID of the invitation that is sent to the account designated as a member account. You can find the invitation ID by using the ListInvitation action of the  API.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html#cfn-guardduty-master-invitationid
     */
    invitationId: string | undefined;
    /**
     * Create a new `AWS::GuardDuty::Master`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMasterProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
/**
 * Properties for defining a `CfnMember`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html
 */
export interface CfnMemberProps {
    /**
     * The ID of the detector associated with the  service to add the member to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-detectorid
     */
    readonly detectorId: string;
    /**
     * The email address associated with the member account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-email
     */
    readonly email: string;
    /**
     * The AWS account ID of the account to designate as a member.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-memberid
     */
    readonly memberId: string;
    /**
     * Specifies whether or not to disable email notification for the member account that you invite.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-disableemailnotification
     */
    readonly disableEmailNotification?: boolean | cdk.IResolvable;
    /**
     * The invitation message that you want to send to the accounts that you're inviting to GuardDuty as members.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-message
     */
    readonly message?: string;
    /**
     * You can use the `Status` property to update the status of the relationship between the member account and its administrator account. Valid values are `Created` and `Invited` when using an `AWS::GuardDuty::Member` resource. If the value for this property is not provided or set to `Created` , a member account is created but not invited. If the value of this property is set to `Invited` , a member account is created and invited.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-status
     */
    readonly status?: string;
}
/**
 * A CloudFormation `AWS::GuardDuty::Member`
 *
 * You can use the `AWS::GuardDuty::Member` resource to add an AWS account as a  member account to the current  administrator account. If the value of the `Status` property is not provided or is set to `Created` , a member account is created but not invited. If the value of the `Status` property is set to `Invited` , a member account is created and invited. An `AWS::GuardDuty::Member` resource must be created with the `Status` property set to `Invited` before the `AWS::GuardDuty::Master` resource can be created in a  member account.
 *
 * @cloudformationResource AWS::GuardDuty::Member
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html
 */
export declare class CfnMember extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GuardDuty::Member";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMember;
    /**
     * The ID of the detector associated with the  service to add the member to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-detectorid
     */
    detectorId: string;
    /**
     * The email address associated with the member account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-email
     */
    email: string;
    /**
     * The AWS account ID of the account to designate as a member.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-memberid
     */
    memberId: string;
    /**
     * Specifies whether or not to disable email notification for the member account that you invite.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-disableemailnotification
     */
    disableEmailNotification: boolean | cdk.IResolvable | undefined;
    /**
     * The invitation message that you want to send to the accounts that you're inviting to GuardDuty as members.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-message
     */
    message: string | undefined;
    /**
     * You can use the `Status` property to update the status of the relationship between the member account and its administrator account. Valid values are `Created` and `Invited` when using an `AWS::GuardDuty::Member` resource. If the value for this property is not provided or set to `Created` , a member account is created but not invited. If the value of this property is set to `Invited` , a member account is created and invited.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-member.html#cfn-guardduty-member-status
     */
    status: string | undefined;
    /**
     * Create a new `AWS::GuardDuty::Member`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMemberProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
/**
 * Properties for defining a `CfnThreatIntelSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html
 */
export interface CfnThreatIntelSetProps {
    /**
     * A Boolean value that indicates whether GuardDuty is to start using the uploaded ThreatIntelSet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-activate
     */
    readonly activate: boolean | cdk.IResolvable;
    /**
     * The unique ID of the detector of the GuardDuty account that you want to create a threatIntelSet for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-detectorid
     */
    readonly detectorId: string;
    /**
     * The format of the file that contains the ThreatIntelSet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-format
     */
    readonly format: string;
    /**
     * The URI of the file that contains the ThreatIntelSet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-location
     */
    readonly location: string;
    /**
     * A user-friendly ThreatIntelSet name displayed in all findings that are generated by activity that involves IP addresses included in this ThreatIntelSet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-name
     */
    readonly name?: string;
    /**
     * The tags to be added to a new threat list resource. Each tag consists of a key and an optional value, both of which you define.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::GuardDuty::ThreatIntelSet`
 *
 * The `AWS::GuardDuty::ThreatIntelSet` resource specifies a new `ThreatIntelSet` . A `ThreatIntelSet` consists of known malicious IP addresses.  generates findings based on the `ThreatIntelSet` when it is activated.
 *
 * @cloudformationResource AWS::GuardDuty::ThreatIntelSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html
 */
export declare class CfnThreatIntelSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GuardDuty::ThreatIntelSet";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnThreatIntelSet;
    /**
     * A Boolean value that indicates whether GuardDuty is to start using the uploaded ThreatIntelSet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-activate
     */
    activate: boolean | cdk.IResolvable;
    /**
     * The unique ID of the detector of the GuardDuty account that you want to create a threatIntelSet for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-detectorid
     */
    detectorId: string;
    /**
     * The format of the file that contains the ThreatIntelSet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-format
     */
    format: string;
    /**
     * The URI of the file that contains the ThreatIntelSet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-location
     */
    location: string;
    /**
     * A user-friendly ThreatIntelSet name displayed in all findings that are generated by activity that involves IP addresses included in this ThreatIntelSet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-name
     */
    name: string | undefined;
    /**
     * The tags to be added to a new threat list resource. Each tag consists of a key and an optional value, both of which you define.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::GuardDuty::ThreatIntelSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnThreatIntelSetProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
