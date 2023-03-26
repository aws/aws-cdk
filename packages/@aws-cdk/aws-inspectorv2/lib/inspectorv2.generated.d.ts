import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnFilter`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspectorv2-filter.html
 */
export interface CfnFilterProps {
    /**
     * The action that is to be applied to the findings that match the filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspectorv2-filter.html#cfn-inspectorv2-filter-filteraction
     */
    readonly filterAction: string;
    /**
     * Details on the filter criteria associated with this filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspectorv2-filter.html#cfn-inspectorv2-filter-filtercriteria
     */
    readonly filterCriteria: CfnFilter.FilterCriteriaProperty | cdk.IResolvable;
    /**
     * The name of the filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspectorv2-filter.html#cfn-inspectorv2-filter-name
     */
    readonly name: string;
    /**
     * A description of the filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspectorv2-filter.html#cfn-inspectorv2-filter-description
     */
    readonly description?: string;
}
/**
 * A CloudFormation `AWS::InspectorV2::Filter`
 *
 * Details about a filter.
 *
 * @cloudformationResource AWS::InspectorV2::Filter
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspectorv2-filter.html
 */
export declare class CfnFilter extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::InspectorV2::Filter";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFilter;
    /**
     * The Amazon Resource Number (ARN) associated with this filter.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The action that is to be applied to the findings that match the filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspectorv2-filter.html#cfn-inspectorv2-filter-filteraction
     */
    filterAction: string;
    /**
     * Details on the filter criteria associated with this filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspectorv2-filter.html#cfn-inspectorv2-filter-filtercriteria
     */
    filterCriteria: CfnFilter.FilterCriteriaProperty | cdk.IResolvable;
    /**
     * The name of the filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspectorv2-filter.html#cfn-inspectorv2-filter-name
     */
    name: string;
    /**
     * A description of the filter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspectorv2-filter.html#cfn-inspectorv2-filter-description
     */
    description: string | undefined;
    /**
     * Create a new `AWS::InspectorV2::Filter`.
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
     * Contains details on the time range used to filter findings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-datefilter.html
     */
    interface DateFilterProperty {
        /**
         * A timestamp representing the end of the time period filtered on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-datefilter.html#cfn-inspectorv2-filter-datefilter-endinclusive
         */
        readonly endInclusive?: number;
        /**
         * A timestamp representing the start of the time period filtered on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-datefilter.html#cfn-inspectorv2-filter-datefilter-startinclusive
         */
        readonly startInclusive?: number;
    }
}
export declare namespace CfnFilter {
    /**
     * Details on the criteria used to define the filter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html
     */
    interface FilterCriteriaProperty {
        /**
         * Details of the AWS account IDs used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-awsaccountid
         */
        readonly awsAccountId?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details of the component IDs used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-componentid
         */
        readonly componentId?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details of the component types used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-componenttype
         */
        readonly componentType?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details of the Amazon EC2 instance image IDs used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ec2instanceimageid
         */
        readonly ec2InstanceImageId?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details of the Amazon EC2 instance subnet IDs used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ec2instancesubnetid
         */
        readonly ec2InstanceSubnetId?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details of the Amazon EC2 instance VPC IDs used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ec2instancevpcid
         */
        readonly ec2InstanceVpcId?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details of the Amazon ECR image architecture types used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ecrimagearchitecture
         */
        readonly ecrImageArchitecture?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details of the Amazon ECR image hashes used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ecrimagehash
         */
        readonly ecrImageHash?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the Amazon ECR image push date and time used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ecrimagepushedat
         */
        readonly ecrImagePushedAt?: Array<CfnFilter.DateFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the Amazon ECR registry used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ecrimageregistry
         */
        readonly ecrImageRegistry?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the name of the Amazon ECR repository used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ecrimagerepositoryname
         */
        readonly ecrImageRepositoryName?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The tags attached to the Amazon ECR container image.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-ecrimagetags
         */
        readonly ecrImageTags?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the finding ARNs used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-findingarn
         */
        readonly findingArn?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the finding status types used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-findingstatus
         */
        readonly findingStatus?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the finding types used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-findingtype
         */
        readonly findingType?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the date and time a finding was first seen used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-firstobservedat
         */
        readonly firstObservedAt?: Array<CfnFilter.DateFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The Amazon Inspector score to filter on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-inspectorscore
         */
        readonly inspectorScore?: Array<CfnFilter.NumberFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the date and time a finding was last seen used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-lastobservedat
         */
        readonly lastObservedAt?: Array<CfnFilter.DateFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the ingress source addresses used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-networkprotocol
         */
        readonly networkProtocol?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the port ranges used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-portrange
         */
        readonly portRange?: Array<CfnFilter.PortRangeFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the related vulnerabilities used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-relatedvulnerabilities
         */
        readonly relatedVulnerabilities?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the resource IDs used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-resourceid
         */
        readonly resourceId?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the resource tags used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-resourcetags
         */
        readonly resourceTags?: Array<CfnFilter.MapFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the resource types used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-resourcetype
         */
        readonly resourceType?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the severity used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-severity
         */
        readonly severity?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the finding title used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-title
         */
        readonly title?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the date and time a finding was last updated at used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-updatedat
         */
        readonly updatedAt?: Array<CfnFilter.DateFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the vendor severity used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-vendorseverity
         */
        readonly vendorSeverity?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the vulnerability ID used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-vulnerabilityid
         */
        readonly vulnerabilityId?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the vulnerability score to filter findings by.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-vulnerabilitysource
         */
        readonly vulnerabilitySource?: Array<CfnFilter.StringFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Details on the vulnerable packages used to filter findings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-filtercriteria.html#cfn-inspectorv2-filter-filtercriteria-vulnerablepackages
         */
        readonly vulnerablePackages?: Array<CfnFilter.PackageFilterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnFilter {
    /**
     * An object that describes details of a map filter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-mapfilter.html
     */
    interface MapFilterProperty {
        /**
         * The operator to use when comparing values in the filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-mapfilter.html#cfn-inspectorv2-filter-mapfilter-comparison
         */
        readonly comparison: string;
        /**
         * The tag key used in the filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-mapfilter.html#cfn-inspectorv2-filter-mapfilter-key
         */
        readonly key?: string;
        /**
         * The tag value used in the filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-mapfilter.html#cfn-inspectorv2-filter-mapfilter-value
         */
        readonly value?: string;
    }
}
export declare namespace CfnFilter {
    /**
     * An object that describes the details of a number filter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-numberfilter.html
     */
    interface NumberFilterProperty {
        /**
         * The lowest number to be included in the filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-numberfilter.html#cfn-inspectorv2-filter-numberfilter-lowerinclusive
         */
        readonly lowerInclusive?: number;
        /**
         * The highest number to be included in the filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-numberfilter.html#cfn-inspectorv2-filter-numberfilter-upperinclusive
         */
        readonly upperInclusive?: number;
    }
}
export declare namespace CfnFilter {
    /**
     * Contains information on the details of a package filter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-packagefilter.html
     */
    interface PackageFilterProperty {
        /**
         * An object that contains details on the package architecture type to filter on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-packagefilter.html#cfn-inspectorv2-filter-packagefilter-architecture
         */
        readonly architecture?: CfnFilter.StringFilterProperty | cdk.IResolvable;
        /**
         * An object that contains details on the package epoch to filter on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-packagefilter.html#cfn-inspectorv2-filter-packagefilter-epoch
         */
        readonly epoch?: CfnFilter.NumberFilterProperty | cdk.IResolvable;
        /**
         * An object that contains details on the name of the package to filter on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-packagefilter.html#cfn-inspectorv2-filter-packagefilter-name
         */
        readonly name?: CfnFilter.StringFilterProperty | cdk.IResolvable;
        /**
         * An object that contains details on the package release to filter on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-packagefilter.html#cfn-inspectorv2-filter-packagefilter-release
         */
        readonly release?: CfnFilter.StringFilterProperty | cdk.IResolvable;
        /**
         * An object that contains details on the source layer hash to filter on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-packagefilter.html#cfn-inspectorv2-filter-packagefilter-sourcelayerhash
         */
        readonly sourceLayerHash?: CfnFilter.StringFilterProperty | cdk.IResolvable;
        /**
         * The package version to filter on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-packagefilter.html#cfn-inspectorv2-filter-packagefilter-version
         */
        readonly version?: CfnFilter.StringFilterProperty | cdk.IResolvable;
    }
}
export declare namespace CfnFilter {
    /**
     * An object that describes the details of a port range filter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-portrangefilter.html
     */
    interface PortRangeFilterProperty {
        /**
         * The port number the port range begins at.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-portrangefilter.html#cfn-inspectorv2-filter-portrangefilter-begininclusive
         */
        readonly beginInclusive?: number;
        /**
         * The port number the port range ends at.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-portrangefilter.html#cfn-inspectorv2-filter-portrangefilter-endinclusive
         */
        readonly endInclusive?: number;
    }
}
export declare namespace CfnFilter {
    /**
     * An object that describes the details of a string filter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-stringfilter.html
     */
    interface StringFilterProperty {
        /**
         * The operator to use when comparing values in the filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-stringfilter.html#cfn-inspectorv2-filter-stringfilter-comparison
         */
        readonly comparison: string;
        /**
         * The value to filter on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-inspectorv2-filter-stringfilter.html#cfn-inspectorv2-filter-stringfilter-value
         */
        readonly value: string;
    }
}
