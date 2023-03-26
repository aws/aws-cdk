import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnAnalysis`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html
 */
export interface CfnAnalysisProps {
    /**
     * The ID for the analysis that you're creating. This ID displays in the URL of the analysis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-analysisid
     */
    readonly analysisId: string;
    /**
     * The ID of the AWS account where you are creating an analysis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-awsaccountid
     */
    readonly awsAccountId: string;
    /**
     * A source entity to use for the analysis that you're creating. This metadata structure contains details that describe a source template and one or more datasets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-sourceentity
     */
    readonly sourceEntity: CfnAnalysis.AnalysisSourceEntityProperty | cdk.IResolvable;
    /**
     * `AWS::QuickSight::Analysis.Errors`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-errors
     */
    readonly errors?: Array<CfnAnalysis.AnalysisErrorProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * A descriptive name for the analysis that you're creating. This name displays for the analysis in the Amazon QuickSight console.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-name
     */
    readonly name?: string;
    /**
     * The parameter names and override values that you want to use. An analysis can have any parameter type, and some parameters might accept multiple values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-parameters
     */
    readonly parameters?: CfnAnalysis.ParametersProperty | cdk.IResolvable;
    /**
     * A structure that describes the principals and the resource-level permissions on an analysis. You can use the `Permissions` structure to grant permissions by providing a list of AWS Identity and Access Management (IAM) action information for each principal listed by Amazon Resource Name (ARN).
     *
     * To specify no permissions, omit `Permissions` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-permissions
     */
    readonly permissions?: Array<CfnAnalysis.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the analysis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * The ARN for the theme to apply to the analysis that you're creating. To see the theme in the Amazon QuickSight console, make sure that you have access to it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-themearn
     */
    readonly themeArn?: string;
}
/**
 * A CloudFormation `AWS::QuickSight::Analysis`
 *
 * Creates an analysis in Amazon QuickSight.
 *
 * @cloudformationResource AWS::QuickSight::Analysis
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html
 */
export declare class CfnAnalysis extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::QuickSight::Analysis";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAnalysis;
    /**
     * The Amazon Resource Name (ARN) of the analysis.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     *
     * @cloudformationAttribute CreatedTime
     */
    readonly attrCreatedTime: string;
    /**
     * The ARNs of the datasets of the analysis.
     * @cloudformationAttribute DataSetArns
     */
    readonly attrDataSetArns: string[];
    /**
     * The time that the analysis was last updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    readonly attrLastUpdatedTime: string;
    /**
     *
     * @cloudformationAttribute Sheets
     */
    readonly attrSheets: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute Status
     */
    readonly attrStatus: string;
    /**
     * The ID for the analysis that you're creating. This ID displays in the URL of the analysis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-analysisid
     */
    analysisId: string;
    /**
     * The ID of the AWS account where you are creating an analysis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-awsaccountid
     */
    awsAccountId: string;
    /**
     * A source entity to use for the analysis that you're creating. This metadata structure contains details that describe a source template and one or more datasets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-sourceentity
     */
    sourceEntity: CfnAnalysis.AnalysisSourceEntityProperty | cdk.IResolvable;
    /**
     * `AWS::QuickSight::Analysis.Errors`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-errors
     */
    errors: Array<CfnAnalysis.AnalysisErrorProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * A descriptive name for the analysis that you're creating. This name displays for the analysis in the Amazon QuickSight console.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-name
     */
    name: string | undefined;
    /**
     * The parameter names and override values that you want to use. An analysis can have any parameter type, and some parameters might accept multiple values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-parameters
     */
    parameters: CfnAnalysis.ParametersProperty | cdk.IResolvable | undefined;
    /**
     * A structure that describes the principals and the resource-level permissions on an analysis. You can use the `Permissions` structure to grant permissions by providing a list of AWS Identity and Access Management (IAM) action information for each principal listed by Amazon Resource Name (ARN).
     *
     * To specify no permissions, omit `Permissions` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-permissions
     */
    permissions: Array<CfnAnalysis.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the analysis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The ARN for the theme to apply to the analysis that you're creating. To see the theme in the Amazon QuickSight console, make sure that you have access to it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-analysis.html#cfn-quicksight-analysis-themearn
     */
    themeArn: string | undefined;
    /**
     * Create a new `AWS::QuickSight::Analysis`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAnalysisProps);
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
export declare namespace CfnAnalysis {
    /**
     * Analysis error.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-analysiserror.html
     */
    interface AnalysisErrorProperty {
        /**
         * The message associated with the analysis error.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-analysiserror.html#cfn-quicksight-analysis-analysiserror-message
         */
        readonly message?: string;
        /**
         * The type of the analysis error.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-analysiserror.html#cfn-quicksight-analysis-analysiserror-type
         */
        readonly type?: string;
    }
}
export declare namespace CfnAnalysis {
    /**
     * The source entity of an analysis.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-analysissourceentity.html
     */
    interface AnalysisSourceEntityProperty {
        /**
         * The source template for the source entity of the analysis.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-analysissourceentity.html#cfn-quicksight-analysis-analysissourceentity-sourcetemplate
         */
        readonly sourceTemplate?: CfnAnalysis.AnalysisSourceTemplateProperty | cdk.IResolvable;
    }
}
export declare namespace CfnAnalysis {
    /**
     * The source template of an analysis.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-analysissourcetemplate.html
     */
    interface AnalysisSourceTemplateProperty {
        /**
         * The Amazon Resource Name (ARN) of the source template of an analysis.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-analysissourcetemplate.html#cfn-quicksight-analysis-analysissourcetemplate-arn
         */
        readonly arn: string;
        /**
         * The dataset references of the source template of an analysis.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-analysissourcetemplate.html#cfn-quicksight-analysis-analysissourcetemplate-datasetreferences
         */
        readonly dataSetReferences: Array<CfnAnalysis.DataSetReferenceProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnAnalysis {
    /**
     * Dataset reference.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-datasetreference.html
     */
    interface DataSetReferenceProperty {
        /**
         * Dataset Amazon Resource Name (ARN).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-datasetreference.html#cfn-quicksight-analysis-datasetreference-datasetarn
         */
        readonly dataSetArn: string;
        /**
         * Dataset placeholder.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-datasetreference.html#cfn-quicksight-analysis-datasetreference-datasetplaceholder
         */
        readonly dataSetPlaceholder: string;
    }
}
export declare namespace CfnAnalysis {
    /**
     * A date-time parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-datetimeparameter.html
     */
    interface DateTimeParameterProperty {
        /**
         * A display name for the date-time parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-datetimeparameter.html#cfn-quicksight-analysis-datetimeparameter-name
         */
        readonly name: string;
        /**
         * The values for the date-time parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-datetimeparameter.html#cfn-quicksight-analysis-datetimeparameter-values
         */
        readonly values: string[];
    }
}
export declare namespace CfnAnalysis {
    /**
     * A decimal parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-decimalparameter.html
     */
    interface DecimalParameterProperty {
        /**
         * A display name for the decimal parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-decimalparameter.html#cfn-quicksight-analysis-decimalparameter-name
         */
        readonly name: string;
        /**
         * The values for the decimal parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-decimalparameter.html#cfn-quicksight-analysis-decimalparameter-values
         */
        readonly values: number[] | cdk.IResolvable;
    }
}
export declare namespace CfnAnalysis {
    /**
     * An integer parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-integerparameter.html
     */
    interface IntegerParameterProperty {
        /**
         * The name of the integer parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-integerparameter.html#cfn-quicksight-analysis-integerparameter-name
         */
        readonly name: string;
        /**
         * The values for the integer parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-integerparameter.html#cfn-quicksight-analysis-integerparameter-values
         */
        readonly values: number[] | cdk.IResolvable;
    }
}
export declare namespace CfnAnalysis {
    /**
     * A list of Amazon QuickSight parameters and the list's override values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-parameters.html
     */
    interface ParametersProperty {
        /**
         * The parameters that have a data type of date-time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-parameters.html#cfn-quicksight-analysis-parameters-datetimeparameters
         */
        readonly dateTimeParameters?: Array<CfnAnalysis.DateTimeParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The parameters that have a data type of decimal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-parameters.html#cfn-quicksight-analysis-parameters-decimalparameters
         */
        readonly decimalParameters?: Array<CfnAnalysis.DecimalParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The parameters that have a data type of integer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-parameters.html#cfn-quicksight-analysis-parameters-integerparameters
         */
        readonly integerParameters?: Array<CfnAnalysis.IntegerParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The parameters that have a data type of string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-parameters.html#cfn-quicksight-analysis-parameters-stringparameters
         */
        readonly stringParameters?: Array<CfnAnalysis.StringParameterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnAnalysis {
    /**
     * Permission for the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-resourcepermission.html
     */
    interface ResourcePermissionProperty {
        /**
         * The IAM action to grant or revoke permissions on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-resourcepermission.html#cfn-quicksight-analysis-resourcepermission-actions
         */
        readonly actions: string[];
        /**
         * The Amazon Resource Name (ARN) of the principal. This can be one of the following:
         *
         * - The ARN of an Amazon QuickSight user or group associated with a data source or dataset. (This is common.)
         * - The ARN of an Amazon QuickSight user, group, or namespace associated with an analysis, dashboard, template, or theme. (This is common.)
         * - The ARN of an AWS account root: This is an IAM ARN rather than a Amazon QuickSight ARN. Use this option only to share resources (templates) across AWS accounts . (This is less common.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-resourcepermission.html#cfn-quicksight-analysis-resourcepermission-principal
         */
        readonly principal: string;
    }
}
export declare namespace CfnAnalysis {
    /**
     * A *sheet* , which is an object that contains a set of visuals that are viewed together on one page in Amazon QuickSight. Every analysis and dashboard contains at least one sheet. Each sheet contains at least one visualization widget, for example a chart, pivot table, or narrative insight. Sheets can be associated with other components, such as controls, filters, and so on.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-sheet.html
     */
    interface SheetProperty {
        /**
         * The name of a sheet. This name is displayed on the sheet's tab in the Amazon QuickSight console.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-sheet.html#cfn-quicksight-analysis-sheet-name
         */
        readonly name?: string;
        /**
         * The unique identifier associated with a sheet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-sheet.html#cfn-quicksight-analysis-sheet-sheetid
         */
        readonly sheetId?: string;
    }
}
export declare namespace CfnAnalysis {
    /**
     * A string parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-stringparameter.html
     */
    interface StringParameterProperty {
        /**
         * A display name for a string parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-stringparameter.html#cfn-quicksight-analysis-stringparameter-name
         */
        readonly name: string;
        /**
         * The values of a string parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-analysis-stringparameter.html#cfn-quicksight-analysis-stringparameter-values
         */
        readonly values: string[];
    }
}
/**
 * Properties for defining a `CfnDashboard`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html
 */
export interface CfnDashboardProps {
    /**
     * The ID of the AWS account where you want to create the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-awsaccountid
     */
    readonly awsAccountId: string;
    /**
     * The ID for the dashboard, also added to the IAM policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-dashboardid
     */
    readonly dashboardId: string;
    /**
     * The entity that you are using as a source when you create the dashboard. In `SourceEntity` , you specify the type of object that you want to use. You can only create a dashboard from a template, so you use a `SourceTemplate` entity. If you need to create a dashboard from an analysis, first convert the analysis to a template by using the `CreateTemplate` API operation. For `SourceTemplate` , specify the Amazon Resource Name (ARN) of the source template. The `SourceTemplate` ARN can contain any AWS account; and any QuickSight-supported AWS Region .
     *
     * Use the `DataSetReferences` entity within `SourceTemplate` to list the replacement datasets for the placeholders listed in the original. The schema in each dataset must match its placeholder.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-sourceentity
     */
    readonly sourceEntity: CfnDashboard.DashboardSourceEntityProperty | cdk.IResolvable;
    /**
     * Options for publishing the dashboard when you create it:
     *
     * - `AvailabilityStatus` for `AdHocFilteringOption` - This status can be either `ENABLED` or `DISABLED` . When this is set to `DISABLED` , Amazon QuickSight disables the left filter pane on the published dashboard, which can be used for ad hoc (one-time) filtering. This option is `ENABLED` by default.
     * - `AvailabilityStatus` for `ExportToCSVOption` - This status can be either `ENABLED` or `DISABLED` . The visual option to export data to .CSV format isn't enabled when this is set to `DISABLED` . This option is `ENABLED` by default.
     * - `VisibilityState` for `SheetControlsOption` - This visibility state can be either `COLLAPSED` or `EXPANDED` . This option is `COLLAPSED` by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-dashboardpublishoptions
     */
    readonly dashboardPublishOptions?: CfnDashboard.DashboardPublishOptionsProperty | cdk.IResolvable;
    /**
     * The display name of the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-name
     */
    readonly name?: string;
    /**
     * The parameters for the creation of the dashboard, which you want to use to override the default settings. A dashboard can have any type of parameters, and some parameters might accept multiple values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-parameters
     */
    readonly parameters?: CfnDashboard.ParametersProperty | cdk.IResolvable;
    /**
     * A structure that contains the permissions of the dashboard. You can use this structure for granting permissions by providing a list of IAM action information for each principal ARN.
     *
     * To specify no permissions, omit the permissions list.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-permissions
     */
    readonly permissions?: Array<CfnDashboard.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * The Amazon Resource Name (ARN) of the theme that is being used for this dashboard. If you add a value for this field, it overrides the value that is used in the source entity. The theme ARN must exist in the same AWS account where you create the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-themearn
     */
    readonly themeArn?: string;
    /**
     * A description for the first version of the dashboard being created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-versiondescription
     */
    readonly versionDescription?: string;
}
/**
 * A CloudFormation `AWS::QuickSight::Dashboard`
 *
 * Creates a dashboard from a template. To first create a template, see the `CreateTemplate` API operation.
 *
 * A dashboard is an entity in Amazon QuickSight that identifies Amazon QuickSight reports, created from analyses. You can share Amazon QuickSight dashboards. With the right permissions, you can create scheduled email reports from them. If you have the correct permissions, you can create a dashboard from a template that exists in a different AWS account .
 *
 * @cloudformationResource AWS::QuickSight::Dashboard
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html
 */
export declare class CfnDashboard extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::QuickSight::Dashboard";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDashboard;
    /**
     * The Amazon Resource Name (ARN) of the dashboard.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The time this dashboard version was created.
     * @cloudformationAttribute CreatedTime
     */
    readonly attrCreatedTime: string;
    /**
     * The time that the dashboard was last published.
     * @cloudformationAttribute LastPublishedTime
     */
    readonly attrLastPublishedTime: string;
    /**
     * The time that the dashboard was last updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    readonly attrLastUpdatedTime: string;
    /**
     *
     * @cloudformationAttribute Version.Arn
     */
    readonly attrVersionArn: string;
    /**
     *
     * @cloudformationAttribute Version.CreatedTime
     */
    readonly attrVersionCreatedTime: string;
    /**
     *
     * @cloudformationAttribute Version.DataSetArns
     */
    readonly attrVersionDataSetArns: string[];
    /**
     *
     * @cloudformationAttribute Version.Description
     */
    readonly attrVersionDescription: string;
    /**
     *
     * @cloudformationAttribute Version.Errors
     */
    readonly attrVersionErrors: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute Version.Sheets
     */
    readonly attrVersionSheets: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute Version.SourceEntityArn
     */
    readonly attrVersionSourceEntityArn: string;
    /**
     *
     * @cloudformationAttribute Version.Status
     */
    readonly attrVersionStatus: string;
    /**
     *
     * @cloudformationAttribute Version.ThemeArn
     */
    readonly attrVersionThemeArn: string;
    /**
     *
     * @cloudformationAttribute Version.VersionNumber
     */
    readonly attrVersionVersionNumber: cdk.IResolvable;
    /**
     * The ID of the AWS account where you want to create the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-awsaccountid
     */
    awsAccountId: string;
    /**
     * The ID for the dashboard, also added to the IAM policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-dashboardid
     */
    dashboardId: string;
    /**
     * The entity that you are using as a source when you create the dashboard. In `SourceEntity` , you specify the type of object that you want to use. You can only create a dashboard from a template, so you use a `SourceTemplate` entity. If you need to create a dashboard from an analysis, first convert the analysis to a template by using the `CreateTemplate` API operation. For `SourceTemplate` , specify the Amazon Resource Name (ARN) of the source template. The `SourceTemplate` ARN can contain any AWS account; and any QuickSight-supported AWS Region .
     *
     * Use the `DataSetReferences` entity within `SourceTemplate` to list the replacement datasets for the placeholders listed in the original. The schema in each dataset must match its placeholder.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-sourceentity
     */
    sourceEntity: CfnDashboard.DashboardSourceEntityProperty | cdk.IResolvable;
    /**
     * Options for publishing the dashboard when you create it:
     *
     * - `AvailabilityStatus` for `AdHocFilteringOption` - This status can be either `ENABLED` or `DISABLED` . When this is set to `DISABLED` , Amazon QuickSight disables the left filter pane on the published dashboard, which can be used for ad hoc (one-time) filtering. This option is `ENABLED` by default.
     * - `AvailabilityStatus` for `ExportToCSVOption` - This status can be either `ENABLED` or `DISABLED` . The visual option to export data to .CSV format isn't enabled when this is set to `DISABLED` . This option is `ENABLED` by default.
     * - `VisibilityState` for `SheetControlsOption` - This visibility state can be either `COLLAPSED` or `EXPANDED` . This option is `COLLAPSED` by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-dashboardpublishoptions
     */
    dashboardPublishOptions: CfnDashboard.DashboardPublishOptionsProperty | cdk.IResolvable | undefined;
    /**
     * The display name of the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-name
     */
    name: string | undefined;
    /**
     * The parameters for the creation of the dashboard, which you want to use to override the default settings. A dashboard can have any type of parameters, and some parameters might accept multiple values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-parameters
     */
    parameters: CfnDashboard.ParametersProperty | cdk.IResolvable | undefined;
    /**
     * A structure that contains the permissions of the dashboard. You can use this structure for granting permissions by providing a list of IAM action information for each principal ARN.
     *
     * To specify no permissions, omit the permissions list.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-permissions
     */
    permissions: Array<CfnDashboard.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The Amazon Resource Name (ARN) of the theme that is being used for this dashboard. If you add a value for this field, it overrides the value that is used in the source entity. The theme ARN must exist in the same AWS account where you create the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-themearn
     */
    themeArn: string | undefined;
    /**
     * A description for the first version of the dashboard being created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dashboard.html#cfn-quicksight-dashboard-versiondescription
     */
    versionDescription: string | undefined;
    /**
     * Create a new `AWS::QuickSight::Dashboard`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDashboardProps);
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
export declare namespace CfnDashboard {
    /**
     * An ad hoc (one-time) filtering option.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-adhocfilteringoption.html
     */
    interface AdHocFilteringOptionProperty {
        /**
         * Availability status.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-adhocfilteringoption.html#cfn-quicksight-dashboard-adhocfilteringoption-availabilitystatus
         */
        readonly availabilityStatus?: string;
    }
}
export declare namespace CfnDashboard {
    /**
     * Dashboard error.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboarderror.html
     */
    interface DashboardErrorProperty {
        /**
         * Message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboarderror.html#cfn-quicksight-dashboard-dashboarderror-message
         */
        readonly message?: string;
        /**
         * Type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboarderror.html#cfn-quicksight-dashboard-dashboarderror-type
         */
        readonly type?: string;
    }
}
export declare namespace CfnDashboard {
    /**
     * Dashboard publish options.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardpublishoptions.html
     */
    interface DashboardPublishOptionsProperty {
        /**
         * Ad hoc (one-time) filtering option.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardpublishoptions.html#cfn-quicksight-dashboard-dashboardpublishoptions-adhocfilteringoption
         */
        readonly adHocFilteringOption?: CfnDashboard.AdHocFilteringOptionProperty | cdk.IResolvable;
        /**
         * Export to .csv option.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardpublishoptions.html#cfn-quicksight-dashboard-dashboardpublishoptions-exporttocsvoption
         */
        readonly exportToCsvOption?: CfnDashboard.ExportToCSVOptionProperty | cdk.IResolvable;
        /**
         * Sheet controls option.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardpublishoptions.html#cfn-quicksight-dashboard-dashboardpublishoptions-sheetcontrolsoption
         */
        readonly sheetControlsOption?: CfnDashboard.SheetControlsOptionProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDashboard {
    /**
     * Dashboard source entity.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardsourceentity.html
     */
    interface DashboardSourceEntityProperty {
        /**
         * Source template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardsourceentity.html#cfn-quicksight-dashboard-dashboardsourceentity-sourcetemplate
         */
        readonly sourceTemplate?: CfnDashboard.DashboardSourceTemplateProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDashboard {
    /**
     * Dashboard source template.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardsourcetemplate.html
     */
    interface DashboardSourceTemplateProperty {
        /**
         * The Amazon Resource Name (ARN) of the resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardsourcetemplate.html#cfn-quicksight-dashboard-dashboardsourcetemplate-arn
         */
        readonly arn: string;
        /**
         * Dataset references.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardsourcetemplate.html#cfn-quicksight-dashboard-dashboardsourcetemplate-datasetreferences
         */
        readonly dataSetReferences: Array<CfnDashboard.DataSetReferenceProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnDashboard {
    /**
     * Dashboard version.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html
     */
    interface DashboardVersionProperty {
        /**
         * The Amazon Resource Name (ARN) of the resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-arn
         */
        readonly arn?: string;
        /**
         * The time that this dashboard version was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-createdtime
         */
        readonly createdTime?: string;
        /**
         * The Amazon Resource Numbers (ARNs) for the datasets that are associated with this version of the dashboard.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-datasetarns
         */
        readonly dataSetArns?: string[];
        /**
         * Description.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-description
         */
        readonly description?: string;
        /**
         * Errors associated with this dashboard version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-errors
         */
        readonly errors?: Array<CfnDashboard.DashboardErrorProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A list of the associated sheets with the unique identifier and name of each sheet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-sheets
         */
        readonly sheets?: Array<CfnDashboard.SheetProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Source entity ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-sourceentityarn
         */
        readonly sourceEntityArn?: string;
        /**
         * The HTTP status of the request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-status
         */
        readonly status?: string;
        /**
         * The ARN of the theme associated with a version of the dashboard.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-themearn
         */
        readonly themeArn?: string;
        /**
         * Version number for this version of the dashboard.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-dashboardversion.html#cfn-quicksight-dashboard-dashboardversion-versionnumber
         */
        readonly versionNumber?: number;
    }
}
export declare namespace CfnDashboard {
    /**
     * Dataset reference.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-datasetreference.html
     */
    interface DataSetReferenceProperty {
        /**
         * Dataset Amazon Resource Name (ARN).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-datasetreference.html#cfn-quicksight-dashboard-datasetreference-datasetarn
         */
        readonly dataSetArn: string;
        /**
         * Dataset placeholder.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-datasetreference.html#cfn-quicksight-dashboard-datasetreference-datasetplaceholder
         */
        readonly dataSetPlaceholder: string;
    }
}
export declare namespace CfnDashboard {
    /**
     * A date-time parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-datetimeparameter.html
     */
    interface DateTimeParameterProperty {
        /**
         * A display name for the date-time parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-datetimeparameter.html#cfn-quicksight-dashboard-datetimeparameter-name
         */
        readonly name: string;
        /**
         * The values for the date-time parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-datetimeparameter.html#cfn-quicksight-dashboard-datetimeparameter-values
         */
        readonly values: string[];
    }
}
export declare namespace CfnDashboard {
    /**
     * A decimal parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-decimalparameter.html
     */
    interface DecimalParameterProperty {
        /**
         * A display name for the decimal parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-decimalparameter.html#cfn-quicksight-dashboard-decimalparameter-name
         */
        readonly name: string;
        /**
         * The values for the decimal parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-decimalparameter.html#cfn-quicksight-dashboard-decimalparameter-values
         */
        readonly values: number[] | cdk.IResolvable;
    }
}
export declare namespace CfnDashboard {
    /**
     * Export to .csv option.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-exporttocsvoption.html
     */
    interface ExportToCSVOptionProperty {
        /**
         * Availability status.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-exporttocsvoption.html#cfn-quicksight-dashboard-exporttocsvoption-availabilitystatus
         */
        readonly availabilityStatus?: string;
    }
}
export declare namespace CfnDashboard {
    /**
     * An integer parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-integerparameter.html
     */
    interface IntegerParameterProperty {
        /**
         * The name of the integer parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-integerparameter.html#cfn-quicksight-dashboard-integerparameter-name
         */
        readonly name: string;
        /**
         * The values for the integer parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-integerparameter.html#cfn-quicksight-dashboard-integerparameter-values
         */
        readonly values: number[] | cdk.IResolvable;
    }
}
export declare namespace CfnDashboard {
    /**
     * A list of Amazon QuickSight parameters and the list's override values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-parameters.html
     */
    interface ParametersProperty {
        /**
         * The parameters that have a data type of date-time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-parameters.html#cfn-quicksight-dashboard-parameters-datetimeparameters
         */
        readonly dateTimeParameters?: Array<CfnDashboard.DateTimeParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The parameters that have a data type of decimal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-parameters.html#cfn-quicksight-dashboard-parameters-decimalparameters
         */
        readonly decimalParameters?: Array<CfnDashboard.DecimalParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The parameters that have a data type of integer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-parameters.html#cfn-quicksight-dashboard-parameters-integerparameters
         */
        readonly integerParameters?: Array<CfnDashboard.IntegerParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The parameters that have a data type of string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-parameters.html#cfn-quicksight-dashboard-parameters-stringparameters
         */
        readonly stringParameters?: Array<CfnDashboard.StringParameterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnDashboard {
    /**
     * Permission for the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-resourcepermission.html
     */
    interface ResourcePermissionProperty {
        /**
         * The IAM action to grant or revoke permissions on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-resourcepermission.html#cfn-quicksight-dashboard-resourcepermission-actions
         */
        readonly actions: string[];
        /**
         * The Amazon Resource Name (ARN) of the principal. This can be one of the following:
         *
         * - The ARN of an Amazon QuickSight user or group associated with a data source or dataset. (This is common.)
         * - The ARN of an Amazon QuickSight user, group, or namespace associated with an analysis, dashboard, template, or theme. (This is common.)
         * - The ARN of an AWS account root: This is an IAM ARN rather than a Amazon QuickSight ARN. Use this option only to share resources (templates) across AWS accounts . (This is less common.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-resourcepermission.html#cfn-quicksight-dashboard-resourcepermission-principal
         */
        readonly principal: string;
    }
}
export declare namespace CfnDashboard {
    /**
     * A *sheet* , which is an object that contains a set of visuals that are viewed together on one page in Amazon QuickSight. Every analysis and dashboard contains at least one sheet. Each sheet contains at least one visualization widget, for example a chart, pivot table, or narrative insight. Sheets can be associated with other components, such as controls, filters, and so on.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-sheet.html
     */
    interface SheetProperty {
        /**
         * The name of a sheet. This name is displayed on the sheet's tab in the Amazon QuickSight console.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-sheet.html#cfn-quicksight-dashboard-sheet-name
         */
        readonly name?: string;
        /**
         * The unique identifier associated with a sheet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-sheet.html#cfn-quicksight-dashboard-sheet-sheetid
         */
        readonly sheetId?: string;
    }
}
export declare namespace CfnDashboard {
    /**
     * Sheet controls option.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-sheetcontrolsoption.html
     */
    interface SheetControlsOptionProperty {
        /**
         * Visibility state.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-sheetcontrolsoption.html#cfn-quicksight-dashboard-sheetcontrolsoption-visibilitystate
         */
        readonly visibilityState?: string;
    }
}
export declare namespace CfnDashboard {
    /**
     * A string parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-stringparameter.html
     */
    interface StringParameterProperty {
        /**
         * A display name for a string parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-stringparameter.html#cfn-quicksight-dashboard-stringparameter-name
         */
        readonly name: string;
        /**
         * The values of a string parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dashboard-stringparameter.html#cfn-quicksight-dashboard-stringparameter-values
         */
        readonly values: string[];
    }
}
/**
 * Properties for defining a `CfnDataSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html
 */
export interface CfnDataSetProps {
    /**
     * The AWS account ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-awsaccountid
     */
    readonly awsAccountId?: string;
    /**
     * Groupings of columns that work together in certain Amazon QuickSight features. Currently, only geospatial hierarchy is supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-columngroups
     */
    readonly columnGroups?: Array<CfnDataSet.ColumnGroupProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * A set of one or more definitions of a `ColumnLevelPermissionRule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-columnlevelpermissionrules
     */
    readonly columnLevelPermissionRules?: Array<CfnDataSet.ColumnLevelPermissionRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * An ID for the dataset that you want to create. This ID is unique per AWS Region for each AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-datasetid
     */
    readonly dataSetId?: string;
    /**
     * The usage configuration to apply to child datasets that reference this dataset as a source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-datasetusageconfiguration
     */
    readonly dataSetUsageConfiguration?: CfnDataSet.DataSetUsageConfigurationProperty | cdk.IResolvable;
    /**
     * The folder that contains fields and nested subfolders for your dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-fieldfolders
     */
    readonly fieldFolders?: {
        [key: string]: (CfnDataSet.FieldFolderProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * Indicates whether you want to import the data into SPICE.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-importmode
     */
    readonly importMode?: string;
    /**
     * The wait policy to use when creating or updating a Dataset. The default is to wait for SPICE ingestion to finish with timeout of 36 hours.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-ingestionwaitpolicy
     */
    readonly ingestionWaitPolicy?: CfnDataSet.IngestionWaitPolicyProperty | cdk.IResolvable;
    /**
     * Configures the combination and transformation of the data from the physical tables.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-logicaltablemap
     */
    readonly logicalTableMap?: {
        [key: string]: (CfnDataSet.LogicalTableProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * The display name for the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-name
     */
    readonly name?: string;
    /**
     * A list of resource permissions on the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-permissions
     */
    readonly permissions?: Array<CfnDataSet.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Declares the physical tables that are available in the underlying data sources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-physicaltablemap
     */
    readonly physicalTableMap?: {
        [key: string]: (CfnDataSet.PhysicalTableProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * The row-level security configuration for the data that you want to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-rowlevelpermissiondataset
     */
    readonly rowLevelPermissionDataSet?: CfnDataSet.RowLevelPermissionDataSetProperty | cdk.IResolvable;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::QuickSight::DataSet`
 *
 * Creates a dataset. This operation doesn't support datasets that include uploaded files as a source.
 *
 * @cloudformationResource AWS::QuickSight::DataSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html
 */
export declare class CfnDataSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::QuickSight::DataSet";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataSet;
    /**
     * The Amazon Resource Name (ARN) of the dataset.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     *
     * @cloudformationAttribute ConsumedSpiceCapacityInBytes
     */
    readonly attrConsumedSpiceCapacityInBytes: cdk.IResolvable;
    /**
     * The time this dataset version was created.
     * @cloudformationAttribute CreatedTime
     */
    readonly attrCreatedTime: string;
    /**
     * The time this dataset version was last updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    readonly attrLastUpdatedTime: string;
    /**
     *
     * @cloudformationAttribute OutputColumns
     */
    readonly attrOutputColumns: cdk.IResolvable;
    /**
     * The AWS account ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-awsaccountid
     */
    awsAccountId: string | undefined;
    /**
     * Groupings of columns that work together in certain Amazon QuickSight features. Currently, only geospatial hierarchy is supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-columngroups
     */
    columnGroups: Array<CfnDataSet.ColumnGroupProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * A set of one or more definitions of a `ColumnLevelPermissionRule` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-columnlevelpermissionrules
     */
    columnLevelPermissionRules: Array<CfnDataSet.ColumnLevelPermissionRuleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * An ID for the dataset that you want to create. This ID is unique per AWS Region for each AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-datasetid
     */
    dataSetId: string | undefined;
    /**
     * The usage configuration to apply to child datasets that reference this dataset as a source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-datasetusageconfiguration
     */
    dataSetUsageConfiguration: CfnDataSet.DataSetUsageConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * The folder that contains fields and nested subfolders for your dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-fieldfolders
     */
    fieldFolders: {
        [key: string]: (CfnDataSet.FieldFolderProperty | cdk.IResolvable);
    } | cdk.IResolvable | undefined;
    /**
     * Indicates whether you want to import the data into SPICE.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-importmode
     */
    importMode: string | undefined;
    /**
     * The wait policy to use when creating or updating a Dataset. The default is to wait for SPICE ingestion to finish with timeout of 36 hours.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-ingestionwaitpolicy
     */
    ingestionWaitPolicy: CfnDataSet.IngestionWaitPolicyProperty | cdk.IResolvable | undefined;
    /**
     * Configures the combination and transformation of the data from the physical tables.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-logicaltablemap
     */
    logicalTableMap: {
        [key: string]: (CfnDataSet.LogicalTableProperty | cdk.IResolvable);
    } | cdk.IResolvable | undefined;
    /**
     * The display name for the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-name
     */
    name: string | undefined;
    /**
     * A list of resource permissions on the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-permissions
     */
    permissions: Array<CfnDataSet.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Declares the physical tables that are available in the underlying data sources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-physicaltablemap
     */
    physicalTableMap: {
        [key: string]: (CfnDataSet.PhysicalTableProperty | cdk.IResolvable);
    } | cdk.IResolvable | undefined;
    /**
     * The row-level security configuration for the data that you want to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-rowlevelpermissiondataset
     */
    rowLevelPermissionDataSet: CfnDataSet.RowLevelPermissionDataSetProperty | cdk.IResolvable | undefined;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-dataset.html#cfn-quicksight-dataset-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::QuickSight::DataSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnDataSetProps);
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
export declare namespace CfnDataSet {
    /**
     * A calculated column for a dataset.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-calculatedcolumn.html
     */
    interface CalculatedColumnProperty {
        /**
         * A unique ID to identify a calculated column. During a dataset update, if the column ID of a calculated column matches that of an existing calculated column, Amazon QuickSight preserves the existing calculated column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-calculatedcolumn.html#cfn-quicksight-dataset-calculatedcolumn-columnid
         */
        readonly columnId: string;
        /**
         * Column name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-calculatedcolumn.html#cfn-quicksight-dataset-calculatedcolumn-columnname
         */
        readonly columnName: string;
        /**
         * An expression that defines the calculated column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-calculatedcolumn.html#cfn-quicksight-dataset-calculatedcolumn-expression
         */
        readonly expression: string;
    }
}
export declare namespace CfnDataSet {
    /**
     * A transform operation that casts a column to a different type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-castcolumntypeoperation.html
     */
    interface CastColumnTypeOperationProperty {
        /**
         * Column name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-castcolumntypeoperation.html#cfn-quicksight-dataset-castcolumntypeoperation-columnname
         */
        readonly columnName: string;
        /**
         * When casting a column from string to datetime type, you can supply a string in a format supported by Amazon QuickSight to denote the source data format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-castcolumntypeoperation.html#cfn-quicksight-dataset-castcolumntypeoperation-format
         */
        readonly format?: string;
        /**
         * New column data type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-castcolumntypeoperation.html#cfn-quicksight-dataset-castcolumntypeoperation-newcolumntype
         */
        readonly newColumnType: string;
    }
}
export declare namespace CfnDataSet {
    /**
     * Metadata that contains a description for a column.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columndescription.html
     */
    interface ColumnDescriptionProperty {
        /**
         * The text of a description for a column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columndescription.html#cfn-quicksight-dataset-columndescription-text
         */
        readonly text?: string;
    }
}
export declare namespace CfnDataSet {
    /**
     * Groupings of columns that work together in certain Amazon QuickSight features. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columngroup.html
     */
    interface ColumnGroupProperty {
        /**
         * Geospatial column group that denotes a hierarchy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columngroup.html#cfn-quicksight-dataset-columngroup-geospatialcolumngroup
         */
        readonly geoSpatialColumnGroup?: CfnDataSet.GeoSpatialColumnGroupProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDataSet {
    /**
     * A rule defined to grant access on one or more restricted columns. Each dataset can have multiple rules. To create a restricted column, you add it to one or more rules. Each rule must contain at least one column and at least one user or group. To be able to see a restricted column, a user or group needs to be added to a rule for that column.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columnlevelpermissionrule.html
     */
    interface ColumnLevelPermissionRuleProperty {
        /**
         * An array of column names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columnlevelpermissionrule.html#cfn-quicksight-dataset-columnlevelpermissionrule-columnnames
         */
        readonly columnNames?: string[];
        /**
         * An array of Amazon Resource Names (ARNs) for Amazon QuickSight users or groups.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columnlevelpermissionrule.html#cfn-quicksight-dataset-columnlevelpermissionrule-principals
         */
        readonly principals?: string[];
    }
}
export declare namespace CfnDataSet {
    /**
     * A tag for a column in a `[TagColumnOperation](https://docs.aws.amazon.com/quicksight/latest/APIReference/API_TagColumnOperation.html)` structure. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columntag.html
     */
    interface ColumnTagProperty {
        /**
         * A description for a column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columntag.html#cfn-quicksight-dataset-columntag-columndescription
         */
        readonly columnDescription?: CfnDataSet.ColumnDescriptionProperty | cdk.IResolvable;
        /**
         * A geospatial role for a column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-columntag.html#cfn-quicksight-dataset-columntag-columngeographicrole
         */
        readonly columnGeographicRole?: string;
    }
}
export declare namespace CfnDataSet {
    /**
     * A transform operation that creates calculated columns. Columns created in one such operation form a lexical closure.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-createcolumnsoperation.html
     */
    interface CreateColumnsOperationProperty {
        /**
         * Calculated columns to create.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-createcolumnsoperation.html#cfn-quicksight-dataset-createcolumnsoperation-columns
         */
        readonly columns: Array<CfnDataSet.CalculatedColumnProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnDataSet {
    /**
     * A physical table type built from the results of the custom SQL query.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-customsql.html
     */
    interface CustomSqlProperty {
        /**
         * The column schema from the SQL query result set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-customsql.html#cfn-quicksight-dataset-customsql-columns
         */
        readonly columns: Array<CfnDataSet.InputColumnProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-customsql.html#cfn-quicksight-dataset-customsql-datasourcearn
         */
        readonly dataSourceArn: string;
        /**
         * A display name for the SQL query result.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-customsql.html#cfn-quicksight-dataset-customsql-name
         */
        readonly name: string;
        /**
         * The SQL query.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-customsql.html#cfn-quicksight-dataset-customsql-sqlquery
         */
        readonly sqlQuery: string;
    }
}
export declare namespace CfnDataSet {
    /**
     * The usage configuration to apply to child datasets that reference this dataset as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-datasetusageconfiguration.html
     */
    interface DataSetUsageConfigurationProperty {
        /**
         * An option that controls whether a child dataset of a direct query can use this dataset as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-datasetusageconfiguration.html#cfn-quicksight-dataset-datasetusageconfiguration-disableuseasdirectquerysource
         */
        readonly disableUseAsDirectQuerySource?: boolean | cdk.IResolvable;
        /**
         * An option that controls whether a child dataset that's stored in QuickSight can use this dataset as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-datasetusageconfiguration.html#cfn-quicksight-dataset-datasetusageconfiguration-disableuseasimportedsource
         */
        readonly disableUseAsImportedSource?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnDataSet {
    /**
     * A FieldFolder element is a folder that contains fields and nested subfolders.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-fieldfolder.html
     */
    interface FieldFolderProperty {
        /**
         * A folder has a list of columns. A column can only be in one folder.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-fieldfolder.html#cfn-quicksight-dataset-fieldfolder-columns
         */
        readonly columns?: string[];
        /**
         * The description for a field folder.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-fieldfolder.html#cfn-quicksight-dataset-fieldfolder-description
         */
        readonly description?: string;
    }
}
export declare namespace CfnDataSet {
    /**
     * A transform operation that filters rows based on a condition.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-filteroperation.html
     */
    interface FilterOperationProperty {
        /**
         * An expression that must evaluate to a Boolean value. Rows for which the expression evaluates to true are kept in the dataset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-filteroperation.html#cfn-quicksight-dataset-filteroperation-conditionexpression
         */
        readonly conditionExpression: string;
    }
}
export declare namespace CfnDataSet {
    /**
     * Geospatial column group that denotes a hierarchy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-geospatialcolumngroup.html
     */
    interface GeoSpatialColumnGroupProperty {
        /**
         * Columns in this hierarchy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-geospatialcolumngroup.html#cfn-quicksight-dataset-geospatialcolumngroup-columns
         */
        readonly columns: string[];
        /**
         * Country code.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-geospatialcolumngroup.html#cfn-quicksight-dataset-geospatialcolumngroup-countrycode
         */
        readonly countryCode?: string;
        /**
         * A display name for the hierarchy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-geospatialcolumngroup.html#cfn-quicksight-dataset-geospatialcolumngroup-name
         */
        readonly name: string;
    }
}
export declare namespace CfnDataSet {
    /**
     * The wait policy to use when creating or updating a Dataset. The default is to wait for SPICE ingestion to finish with timeout of 36 hours.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-ingestionwaitpolicy.html
     */
    interface IngestionWaitPolicyProperty {
        /**
         * The maximum time (in hours) to wait for Ingestion to complete. Default timeout is 36 hours. Applicable only when `DataSetImportMode` mode is set to SPICE and `WaitForSpiceIngestion` is set to true.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-ingestionwaitpolicy.html#cfn-quicksight-dataset-ingestionwaitpolicy-ingestionwaittimeinhours
         */
        readonly ingestionWaitTimeInHours?: number;
        /**
         * Wait for SPICE ingestion to finish to mark dataset creation or update as successful. Default (true). Applicable only when `DataSetImportMode` mode is set to SPICE.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-ingestionwaitpolicy.html#cfn-quicksight-dataset-ingestionwaitpolicy-waitforspiceingestion
         */
        readonly waitForSpiceIngestion?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnDataSet {
    /**
     * Metadata for a column that is used as the input of a transform operation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-inputcolumn.html
     */
    interface InputColumnProperty {
        /**
         * The name of this column in the underlying data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-inputcolumn.html#cfn-quicksight-dataset-inputcolumn-name
         */
        readonly name: string;
        /**
         * The data type of the column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-inputcolumn.html#cfn-quicksight-dataset-inputcolumn-type
         */
        readonly type: string;
    }
}
export declare namespace CfnDataSet {
    /**
     * The instructions associated with a join.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joininstruction.html
     */
    interface JoinInstructionProperty {
        /**
         * Join key properties of the left operand.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joininstruction.html#cfn-quicksight-dataset-joininstruction-leftjoinkeyproperties
         */
        readonly leftJoinKeyProperties?: CfnDataSet.JoinKeyPropertiesProperty | cdk.IResolvable;
        /**
         * The operand on the left side of a join.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joininstruction.html#cfn-quicksight-dataset-joininstruction-leftoperand
         */
        readonly leftOperand: string;
        /**
         * The join instructions provided in the `ON` clause of a join.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joininstruction.html#cfn-quicksight-dataset-joininstruction-onclause
         */
        readonly onClause: string;
        /**
         * Join key properties of the right operand.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joininstruction.html#cfn-quicksight-dataset-joininstruction-rightjoinkeyproperties
         */
        readonly rightJoinKeyProperties?: CfnDataSet.JoinKeyPropertiesProperty | cdk.IResolvable;
        /**
         * The operand on the right side of a join.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joininstruction.html#cfn-quicksight-dataset-joininstruction-rightoperand
         */
        readonly rightOperand: string;
        /**
         * The type of join that it is.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joininstruction.html#cfn-quicksight-dataset-joininstruction-type
         */
        readonly type: string;
    }
}
export declare namespace CfnDataSet {
    /**
     * Properties associated with the columns participating in a join.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joinkeyproperties.html
     */
    interface JoinKeyPropertiesProperty {
        /**
         * A value that indicates that a row in a table is uniquely identified by the columns in a join key. This is used by Amazon QuickSight to optimize query performance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-joinkeyproperties.html#cfn-quicksight-dataset-joinkeyproperties-uniquekey
         */
        readonly uniqueKey?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnDataSet {
    /**
     * A *logical table* is a unit that joins and that data transformations operate on. A logical table has a source, which can be either a physical table or result of a join. When a logical table points to a physical table, the logical table acts as a mutable copy of that physical table through transform operations.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-logicaltable.html
     */
    interface LogicalTableProperty {
        /**
         * A display name for the logical table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-logicaltable.html#cfn-quicksight-dataset-logicaltable-alias
         */
        readonly alias: string;
        /**
         * Transform operations that act on this logical table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-logicaltable.html#cfn-quicksight-dataset-logicaltable-datatransforms
         */
        readonly dataTransforms?: Array<CfnDataSet.TransformOperationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Source of this logical table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-logicaltable.html#cfn-quicksight-dataset-logicaltable-source
         */
        readonly source: CfnDataSet.LogicalTableSourceProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDataSet {
    /**
     * Information about the source of a logical table. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-logicaltablesource.html
     */
    interface LogicalTableSourceProperty {
        /**
         * The Amazon Resource Number (ARN) of the parent dataset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-logicaltablesource.html#cfn-quicksight-dataset-logicaltablesource-datasetarn
         */
        readonly dataSetArn?: string;
        /**
         * Specifies the result of a join of two logical tables.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-logicaltablesource.html#cfn-quicksight-dataset-logicaltablesource-joininstruction
         */
        readonly joinInstruction?: CfnDataSet.JoinInstructionProperty | cdk.IResolvable;
        /**
         * Physical table ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-logicaltablesource.html#cfn-quicksight-dataset-logicaltablesource-physicaltableid
         */
        readonly physicalTableId?: string;
    }
}
export declare namespace CfnDataSet {
    /**
     * Output column.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-outputcolumn.html
     */
    interface OutputColumnProperty {
        /**
         * A description for a column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-outputcolumn.html#cfn-quicksight-dataset-outputcolumn-description
         */
        readonly description?: string;
        /**
         * A display name for the dataset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-outputcolumn.html#cfn-quicksight-dataset-outputcolumn-name
         */
        readonly name?: string;
        /**
         * Type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-outputcolumn.html#cfn-quicksight-dataset-outputcolumn-type
         */
        readonly type?: string;
    }
}
export declare namespace CfnDataSet {
    /**
     * A view of a data source that contains information about the shape of the data in the underlying source. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-physicaltable.html
     */
    interface PhysicalTableProperty {
        /**
         * A physical table type built from the results of the custom SQL query.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-physicaltable.html#cfn-quicksight-dataset-physicaltable-customsql
         */
        readonly customSql?: CfnDataSet.CustomSqlProperty | cdk.IResolvable;
        /**
         * A physical table type for relational data sources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-physicaltable.html#cfn-quicksight-dataset-physicaltable-relationaltable
         */
        readonly relationalTable?: CfnDataSet.RelationalTableProperty | cdk.IResolvable;
        /**
         * A physical table type for as S3 data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-physicaltable.html#cfn-quicksight-dataset-physicaltable-s3source
         */
        readonly s3Source?: CfnDataSet.S3SourceProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDataSet {
    /**
     * A transform operation that projects columns. Operations that come after a projection can only refer to projected columns.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-projectoperation.html
     */
    interface ProjectOperationProperty {
        /**
         * Projected columns.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-projectoperation.html#cfn-quicksight-dataset-projectoperation-projectedcolumns
         */
        readonly projectedColumns: string[];
    }
}
export declare namespace CfnDataSet {
    /**
     * A physical table type for relational data sources.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-relationaltable.html
     */
    interface RelationalTableProperty {
        /**
         * `CfnDataSet.RelationalTableProperty.Catalog`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-relationaltable.html#cfn-quicksight-dataset-relationaltable-catalog
         */
        readonly catalog?: string;
        /**
         * The Amazon Resource Name (ARN) for the data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-relationaltable.html#cfn-quicksight-dataset-relationaltable-datasourcearn
         */
        readonly dataSourceArn: string;
        /**
         * The column schema of the table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-relationaltable.html#cfn-quicksight-dataset-relationaltable-inputcolumns
         */
        readonly inputColumns: Array<CfnDataSet.InputColumnProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the relational table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-relationaltable.html#cfn-quicksight-dataset-relationaltable-name
         */
        readonly name: string;
        /**
         * The schema name. This name applies to certain relational database engines.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-relationaltable.html#cfn-quicksight-dataset-relationaltable-schema
         */
        readonly schema?: string;
    }
}
export declare namespace CfnDataSet {
    /**
     * A transform operation that renames a column.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-renamecolumnoperation.html
     */
    interface RenameColumnOperationProperty {
        /**
         * The name of the column to be renamed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-renamecolumnoperation.html#cfn-quicksight-dataset-renamecolumnoperation-columnname
         */
        readonly columnName: string;
        /**
         * The new name for the column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-renamecolumnoperation.html#cfn-quicksight-dataset-renamecolumnoperation-newcolumnname
         */
        readonly newColumnName: string;
    }
}
export declare namespace CfnDataSet {
    /**
     * Permission for the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-resourcepermission.html
     */
    interface ResourcePermissionProperty {
        /**
         * The IAM action to grand or revoke permisions on
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-resourcepermission.html#cfn-quicksight-dataset-resourcepermission-actions
         */
        readonly actions: string[];
        /**
         * The Amazon Resource Name (ARN) of the principal. This can be one of the following:
         *
         * - The ARN of an Amazon QuickSight user or group associated with a data source or dataset. (This is common.)
         * - The ARN of an Amazon QuickSight user, group, or namespace associated with an analysis, dashboard, template, or theme. (This is common.)
         * - The ARN of an AWS account root: This is an IAM ARN rather than a Amazon QuickSight ARN. Use this option only to share resources (templates) across AWS accounts . (This is less common.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-resourcepermission.html#cfn-quicksight-dataset-resourcepermission-principal
         */
        readonly principal: string;
    }
}
export declare namespace CfnDataSet {
    /**
     * Information about a dataset that contains permissions for row-level security (RLS). The permissions dataset maps fields to users or groups. For more information, see [Using Row-Level Security (RLS) to Restrict Access to a Dataset](https://docs.aws.amazon.com/quicksight/latest/user/restrict-access-to-a-data-set-using-row-level-security.html) in the *Amazon QuickSight User Guide* .
     *
     * The option to deny permissions by setting `PermissionPolicy` to `DENY_ACCESS` is not supported for new RLS datasets.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-rowlevelpermissiondataset.html
     */
    interface RowLevelPermissionDataSetProperty {
        /**
         * The Amazon Resource Name (ARN) of the dataset that contains permissions for RLS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-rowlevelpermissiondataset.html#cfn-quicksight-dataset-rowlevelpermissiondataset-arn
         */
        readonly arn: string;
        /**
         * The user or group rules associated with the dataset that contains permissions for RLS.
         *
         * By default, `FormatVersion` is `VERSION_1` . When `FormatVersion` is `VERSION_1` , `UserName` and `GroupName` are required. When `FormatVersion` is `VERSION_2` , `UserARN` and `GroupARN` are required, and `Namespace` must not exist.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-rowlevelpermissiondataset.html#cfn-quicksight-dataset-rowlevelpermissiondataset-formatversion
         */
        readonly formatVersion?: string;
        /**
         * The namespace associated with the dataset that contains permissions for RLS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-rowlevelpermissiondataset.html#cfn-quicksight-dataset-rowlevelpermissiondataset-namespace
         */
        readonly namespace?: string;
        /**
         * The type of permissions to use when interpreting the permissions for RLS. `DENY_ACCESS` is included for backward compatibility only.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-rowlevelpermissiondataset.html#cfn-quicksight-dataset-rowlevelpermissiondataset-permissionpolicy
         */
        readonly permissionPolicy: string;
    }
}
export declare namespace CfnDataSet {
    /**
     * A physical table type for an S3 data source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-s3source.html
     */
    interface S3SourceProperty {
        /**
         * The Amazon Resource Name (ARN) for the data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-s3source.html#cfn-quicksight-dataset-s3source-datasourcearn
         */
        readonly dataSourceArn: string;
        /**
         * A physical table type for an S3 data source.
         *
         * > For files that aren't JSON, only `STRING` data types are supported in input columns.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-s3source.html#cfn-quicksight-dataset-s3source-inputcolumns
         */
        readonly inputColumns: Array<CfnDataSet.InputColumnProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Information about the format for the S3 source file or files.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-s3source.html#cfn-quicksight-dataset-s3source-uploadsettings
         */
        readonly uploadSettings?: CfnDataSet.UploadSettingsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDataSet {
    /**
     * A transform operation that tags a column with additional information.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-tagcolumnoperation.html
     */
    interface TagColumnOperationProperty {
        /**
         * The column that this operation acts on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-tagcolumnoperation.html#cfn-quicksight-dataset-tagcolumnoperation-columnname
         */
        readonly columnName: string;
        /**
         * The dataset column tag, currently only used for geospatial type tagging.
         *
         * > This is not tags for the AWS tagging feature.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-tagcolumnoperation.html#cfn-quicksight-dataset-tagcolumnoperation-tags
         */
        readonly tags: CfnDataSet.ColumnTagProperty[];
    }
}
export declare namespace CfnDataSet {
    /**
     * A data transformation on a logical table. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-transformoperation.html
     */
    interface TransformOperationProperty {
        /**
         * A transform operation that casts a column to a different type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-transformoperation.html#cfn-quicksight-dataset-transformoperation-castcolumntypeoperation
         */
        readonly castColumnTypeOperation?: CfnDataSet.CastColumnTypeOperationProperty | cdk.IResolvable;
        /**
         * An operation that creates calculated columns. Columns created in one such operation form a lexical closure.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-transformoperation.html#cfn-quicksight-dataset-transformoperation-createcolumnsoperation
         */
        readonly createColumnsOperation?: CfnDataSet.CreateColumnsOperationProperty | cdk.IResolvable;
        /**
         * An operation that filters rows based on some condition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-transformoperation.html#cfn-quicksight-dataset-transformoperation-filteroperation
         */
        readonly filterOperation?: CfnDataSet.FilterOperationProperty | cdk.IResolvable;
        /**
         * An operation that projects columns. Operations that come after a projection can only refer to projected columns.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-transformoperation.html#cfn-quicksight-dataset-transformoperation-projectoperation
         */
        readonly projectOperation?: CfnDataSet.ProjectOperationProperty | cdk.IResolvable;
        /**
         * An operation that renames a column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-transformoperation.html#cfn-quicksight-dataset-transformoperation-renamecolumnoperation
         */
        readonly renameColumnOperation?: CfnDataSet.RenameColumnOperationProperty | cdk.IResolvable;
        /**
         * An operation that tags a column with additional information.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-transformoperation.html#cfn-quicksight-dataset-transformoperation-tagcolumnoperation
         */
        readonly tagColumnOperation?: CfnDataSet.TagColumnOperationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDataSet {
    /**
     * Information about the format for a source file or files.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-uploadsettings.html
     */
    interface UploadSettingsProperty {
        /**
         * Whether the file has a header row, or the files each have a header row.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-uploadsettings.html#cfn-quicksight-dataset-uploadsettings-containsheader
         */
        readonly containsHeader?: boolean | cdk.IResolvable;
        /**
         * The delimiter between values in the file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-uploadsettings.html#cfn-quicksight-dataset-uploadsettings-delimiter
         */
        readonly delimiter?: string;
        /**
         * File format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-uploadsettings.html#cfn-quicksight-dataset-uploadsettings-format
         */
        readonly format?: string;
        /**
         * A row number to start reading data from.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-uploadsettings.html#cfn-quicksight-dataset-uploadsettings-startfromrow
         */
        readonly startFromRow?: number;
        /**
         * Text qualifier.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-dataset-uploadsettings.html#cfn-quicksight-dataset-uploadsettings-textqualifier
         */
        readonly textQualifier?: string;
    }
}
/**
 * Properties for defining a `CfnDataSource`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html
 */
export interface CfnDataSourceProps {
    /**
     * A set of alternate data source parameters that you want to share for the credentials stored with this data source. The credentials are applied in tandem with the data source parameters when you copy a data source by using a create or update request. The API operation compares the `DataSourceParameters` structure that's in the request with the structures in the `AlternateDataSourceParameters` allow list. If the structures are an exact match, the request is allowed to use the credentials from this existing data source. If the `AlternateDataSourceParameters` list is null, the `Credentials` originally used with this `DataSourceParameters` are automatically allowed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-alternatedatasourceparameters
     */
    readonly alternateDataSourceParameters?: Array<CfnDataSource.DataSourceParametersProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The AWS account ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-awsaccountid
     */
    readonly awsAccountId?: string;
    /**
     * The credentials Amazon QuickSight that uses to connect to your underlying source. Currently, only credentials based on user name and password are supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-credentials
     */
    readonly credentials?: CfnDataSource.DataSourceCredentialsProperty | cdk.IResolvable;
    /**
     * An ID for the data source. This ID is unique per AWS Region for each AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-datasourceid
     */
    readonly dataSourceId?: string;
    /**
     * The parameters that Amazon QuickSight uses to connect to your underlying source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-datasourceparameters
     */
    readonly dataSourceParameters?: CfnDataSource.DataSourceParametersProperty | cdk.IResolvable;
    /**
     * Error information from the last update or the creation of the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-errorinfo
     */
    readonly errorInfo?: CfnDataSource.DataSourceErrorInfoProperty | cdk.IResolvable;
    /**
     * A display name for the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-name
     */
    readonly name?: string;
    /**
     * A list of resource permissions on the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-permissions
     */
    readonly permissions?: Array<CfnDataSource.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Secure Socket Layer (SSL) properties that apply when Amazon QuickSight connects to your underlying source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-sslproperties
     */
    readonly sslProperties?: CfnDataSource.SslPropertiesProperty | cdk.IResolvable;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * The type of the data source. To return a list of all data sources, use `ListDataSources` .
     *
     * Use `AMAZON_ELASTICSEARCH` for Amazon OpenSearch Service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-type
     */
    readonly type?: string;
    /**
     * Use this parameter only when you want Amazon QuickSight to use a VPC connection when connecting to your underlying source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-vpcconnectionproperties
     */
    readonly vpcConnectionProperties?: CfnDataSource.VpcConnectionPropertiesProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::QuickSight::DataSource`
 *
 * Creates a data source.
 *
 * @cloudformationResource AWS::QuickSight::DataSource
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html
 */
export declare class CfnDataSource extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::QuickSight::DataSource";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataSource;
    /**
     * The Amazon Resource Name (ARN) of the dataset.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The time that this data source was created.
     * @cloudformationAttribute CreatedTime
     */
    readonly attrCreatedTime: string;
    /**
     * The last time that this data source was updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    readonly attrLastUpdatedTime: string;
    /**
     * The HTTP status of the request.
     * @cloudformationAttribute Status
     */
    readonly attrStatus: string;
    /**
     * A set of alternate data source parameters that you want to share for the credentials stored with this data source. The credentials are applied in tandem with the data source parameters when you copy a data source by using a create or update request. The API operation compares the `DataSourceParameters` structure that's in the request with the structures in the `AlternateDataSourceParameters` allow list. If the structures are an exact match, the request is allowed to use the credentials from this existing data source. If the `AlternateDataSourceParameters` list is null, the `Credentials` originally used with this `DataSourceParameters` are automatically allowed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-alternatedatasourceparameters
     */
    alternateDataSourceParameters: Array<CfnDataSource.DataSourceParametersProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The AWS account ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-awsaccountid
     */
    awsAccountId: string | undefined;
    /**
     * The credentials Amazon QuickSight that uses to connect to your underlying source. Currently, only credentials based on user name and password are supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-credentials
     */
    credentials: CfnDataSource.DataSourceCredentialsProperty | cdk.IResolvable | undefined;
    /**
     * An ID for the data source. This ID is unique per AWS Region for each AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-datasourceid
     */
    dataSourceId: string | undefined;
    /**
     * The parameters that Amazon QuickSight uses to connect to your underlying source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-datasourceparameters
     */
    dataSourceParameters: CfnDataSource.DataSourceParametersProperty | cdk.IResolvable | undefined;
    /**
     * Error information from the last update or the creation of the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-errorinfo
     */
    errorInfo: CfnDataSource.DataSourceErrorInfoProperty | cdk.IResolvable | undefined;
    /**
     * A display name for the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-name
     */
    name: string | undefined;
    /**
     * A list of resource permissions on the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-permissions
     */
    permissions: Array<CfnDataSource.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Secure Socket Layer (SSL) properties that apply when Amazon QuickSight connects to your underlying source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-sslproperties
     */
    sslProperties: CfnDataSource.SslPropertiesProperty | cdk.IResolvable | undefined;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The type of the data source. To return a list of all data sources, use `ListDataSources` .
     *
     * Use `AMAZON_ELASTICSEARCH` for Amazon OpenSearch Service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-type
     */
    type: string | undefined;
    /**
     * Use this parameter only when you want Amazon QuickSight to use a VPC connection when connecting to your underlying source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-datasource.html#cfn-quicksight-datasource-vpcconnectionproperties
     */
    vpcConnectionProperties: CfnDataSource.VpcConnectionPropertiesProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::QuickSight::DataSource`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnDataSourceProps);
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
export declare namespace CfnDataSource {
    /**
     * The parameters for OpenSearch.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-amazonelasticsearchparameters.html
     */
    interface AmazonElasticsearchParametersProperty {
        /**
         * The OpenSearch domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-amazonelasticsearchparameters.html#cfn-quicksight-datasource-amazonelasticsearchparameters-domain
         */
        readonly domain: string;
    }
}
export declare namespace CfnDataSource {
    /**
     * The parameters for OpenSearch.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-amazonopensearchparameters.html
     */
    interface AmazonOpenSearchParametersProperty {
        /**
         * The OpenSearch domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-amazonopensearchparameters.html#cfn-quicksight-datasource-amazonopensearchparameters-domain
         */
        readonly domain: string;
    }
}
export declare namespace CfnDataSource {
    /**
     * Parameters for Amazon Athena.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-athenaparameters.html
     */
    interface AthenaParametersProperty {
        /**
         * The workgroup that Amazon Athena uses.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-athenaparameters.html#cfn-quicksight-datasource-athenaparameters-workgroup
         */
        readonly workGroup?: string;
    }
}
export declare namespace CfnDataSource {
    /**
     * Parameters for Amazon Aurora.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-auroraparameters.html
     */
    interface AuroraParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-auroraparameters.html#cfn-quicksight-datasource-auroraparameters-database
         */
        readonly database: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-auroraparameters.html#cfn-quicksight-datasource-auroraparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-auroraparameters.html#cfn-quicksight-datasource-auroraparameters-port
         */
        readonly port: number;
    }
}
export declare namespace CfnDataSource {
    /**
     * Parameters for Amazon Aurora PostgreSQL-Compatible Edition.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-aurorapostgresqlparameters.html
     */
    interface AuroraPostgreSqlParametersProperty {
        /**
         * The Amazon Aurora PostgreSQL database to connect to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-aurorapostgresqlparameters.html#cfn-quicksight-datasource-aurorapostgresqlparameters-database
         */
        readonly database: string;
        /**
         * The Amazon Aurora PostgreSQL-Compatible host to connect to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-aurorapostgresqlparameters.html#cfn-quicksight-datasource-aurorapostgresqlparameters-host
         */
        readonly host: string;
        /**
         * The port that Amazon Aurora PostgreSQL is listening on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-aurorapostgresqlparameters.html#cfn-quicksight-datasource-aurorapostgresqlparameters-port
         */
        readonly port: number;
    }
}
export declare namespace CfnDataSource {
    /**
     * The combination of user name and password that are used as credentials.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-credentialpair.html
     */
    interface CredentialPairProperty {
        /**
         * A set of alternate data source parameters that you want to share for these credentials. The credentials are applied in tandem with the data source parameters when you copy a data source by using a create or update request. The API operation compares the `DataSourceParameters` structure that's in the request with the structures in the `AlternateDataSourceParameters` allow list. If the structures are an exact match, the request is allowed to use the new data source with the existing credentials. If the `AlternateDataSourceParameters` list is null, the `DataSourceParameters` originally used with these `Credentials` is automatically allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-credentialpair.html#cfn-quicksight-datasource-credentialpair-alternatedatasourceparameters
         */
        readonly alternateDataSourceParameters?: Array<CfnDataSource.DataSourceParametersProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Password.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-credentialpair.html#cfn-quicksight-datasource-credentialpair-password
         */
        readonly password: string;
        /**
         * User name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-credentialpair.html#cfn-quicksight-datasource-credentialpair-username
         */
        readonly username: string;
    }
}
export declare namespace CfnDataSource {
    /**
     * Data source credentials. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourcecredentials.html
     */
    interface DataSourceCredentialsProperty {
        /**
         * The Amazon Resource Name (ARN) of a data source that has the credential pair that you want to use. When `CopySourceArn` is not null, the credential pair from the data source in the ARN is used as the credentials for the `DataSourceCredentials` structure.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourcecredentials.html#cfn-quicksight-datasource-datasourcecredentials-copysourcearn
         */
        readonly copySourceArn?: string;
        /**
         * Credential pair. For more information, see `[CredentialPair](https://docs.aws.amazon.com/quicksight/latest/APIReference/API_CredentialPair.html)` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourcecredentials.html#cfn-quicksight-datasource-datasourcecredentials-credentialpair
         */
        readonly credentialPair?: CfnDataSource.CredentialPairProperty | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the secret associated with the data source in Amazon Secrets Manager.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourcecredentials.html#cfn-quicksight-datasource-datasourcecredentials-secretarn
         */
        readonly secretArn?: string;
    }
}
export declare namespace CfnDataSource {
    /**
     * Error information for the data source creation or update.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceerrorinfo.html
     */
    interface DataSourceErrorInfoProperty {
        /**
         * Error message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceerrorinfo.html#cfn-quicksight-datasource-datasourceerrorinfo-message
         */
        readonly message?: string;
        /**
         * Error type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceerrorinfo.html#cfn-quicksight-datasource-datasourceerrorinfo-type
         */
        readonly type?: string;
    }
}
export declare namespace CfnDataSource {
    /**
     * The parameters that Amazon QuickSight uses to connect to your underlying data source. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html
     */
    interface DataSourceParametersProperty {
        /**
         * The parameters for OpenSearch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-amazonelasticsearchparameters
         */
        readonly amazonElasticsearchParameters?: CfnDataSource.AmazonElasticsearchParametersProperty | cdk.IResolvable;
        /**
         * The parameters for OpenSearch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-amazonopensearchparameters
         */
        readonly amazonOpenSearchParameters?: CfnDataSource.AmazonOpenSearchParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Amazon Athena.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-athenaparameters
         */
        readonly athenaParameters?: CfnDataSource.AthenaParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Amazon Aurora MySQL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-auroraparameters
         */
        readonly auroraParameters?: CfnDataSource.AuroraParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Amazon Aurora.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-aurorapostgresqlparameters
         */
        readonly auroraPostgreSqlParameters?: CfnDataSource.AuroraPostgreSqlParametersProperty | cdk.IResolvable;
        /**
         * The required parameters that are needed to connect to a Databricks data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-databricksparameters
         */
        readonly databricksParameters?: CfnDataSource.DatabricksParametersProperty | cdk.IResolvable;
        /**
         * The parameters for MariaDB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-mariadbparameters
         */
        readonly mariaDbParameters?: CfnDataSource.MariaDbParametersProperty | cdk.IResolvable;
        /**
         * The parameters for MySQL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-mysqlparameters
         */
        readonly mySqlParameters?: CfnDataSource.MySqlParametersProperty | cdk.IResolvable;
        /**
         * Oracle parameters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-oracleparameters
         */
        readonly oracleParameters?: CfnDataSource.OracleParametersProperty | cdk.IResolvable;
        /**
         * The parameters for PostgreSQL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-postgresqlparameters
         */
        readonly postgreSqlParameters?: CfnDataSource.PostgreSqlParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Presto.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-prestoparameters
         */
        readonly prestoParameters?: CfnDataSource.PrestoParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Amazon RDS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-rdsparameters
         */
        readonly rdsParameters?: CfnDataSource.RdsParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Amazon Redshift.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-redshiftparameters
         */
        readonly redshiftParameters?: CfnDataSource.RedshiftParametersProperty | cdk.IResolvable;
        /**
         * The parameters for S3.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-s3parameters
         */
        readonly s3Parameters?: CfnDataSource.S3ParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Snowflake.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-snowflakeparameters
         */
        readonly snowflakeParameters?: CfnDataSource.SnowflakeParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Spark.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-sparkparameters
         */
        readonly sparkParameters?: CfnDataSource.SparkParametersProperty | cdk.IResolvable;
        /**
         * The parameters for SQL Server.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-sqlserverparameters
         */
        readonly sqlServerParameters?: CfnDataSource.SqlServerParametersProperty | cdk.IResolvable;
        /**
         * The parameters for Teradata.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-datasourceparameters.html#cfn-quicksight-datasource-datasourceparameters-teradataparameters
         */
        readonly teradataParameters?: CfnDataSource.TeradataParametersProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDataSource {
    /**
     * The required parameters that are needed to connect to a Databricks data source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-databricksparameters.html
     */
    interface DatabricksParametersProperty {
        /**
         * The host name of the Databricks data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-databricksparameters.html#cfn-quicksight-datasource-databricksparameters-host
         */
        readonly host: string;
        /**
         * The port for the Databricks data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-databricksparameters.html#cfn-quicksight-datasource-databricksparameters-port
         */
        readonly port: number;
        /**
         * The HTTP path of the Databricks data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-databricksparameters.html#cfn-quicksight-datasource-databricksparameters-sqlendpointpath
         */
        readonly sqlEndpointPath: string;
    }
}
export declare namespace CfnDataSource {
    /**
     * Amazon S3 manifest file location.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-manifestfilelocation.html
     */
    interface ManifestFileLocationProperty {
        /**
         * Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-manifestfilelocation.html#cfn-quicksight-datasource-manifestfilelocation-bucket
         */
        readonly bucket: string;
        /**
         * Amazon S3 key that identifies an object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-manifestfilelocation.html#cfn-quicksight-datasource-manifestfilelocation-key
         */
        readonly key: string;
    }
}
export declare namespace CfnDataSource {
    /**
     * The parameters for MariaDB.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-mariadbparameters.html
     */
    interface MariaDbParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-mariadbparameters.html#cfn-quicksight-datasource-mariadbparameters-database
         */
        readonly database: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-mariadbparameters.html#cfn-quicksight-datasource-mariadbparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-mariadbparameters.html#cfn-quicksight-datasource-mariadbparameters-port
         */
        readonly port: number;
    }
}
export declare namespace CfnDataSource {
    /**
     * The parameters for MySQL.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-mysqlparameters.html
     */
    interface MySqlParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-mysqlparameters.html#cfn-quicksight-datasource-mysqlparameters-database
         */
        readonly database: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-mysqlparameters.html#cfn-quicksight-datasource-mysqlparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-mysqlparameters.html#cfn-quicksight-datasource-mysqlparameters-port
         */
        readonly port: number;
    }
}
export declare namespace CfnDataSource {
    /**
     * Oracle parameters.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-oracleparameters.html
     */
    interface OracleParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-oracleparameters.html#cfn-quicksight-datasource-oracleparameters-database
         */
        readonly database: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-oracleparameters.html#cfn-quicksight-datasource-oracleparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-oracleparameters.html#cfn-quicksight-datasource-oracleparameters-port
         */
        readonly port: number;
    }
}
export declare namespace CfnDataSource {
    /**
     * The parameters for PostgreSQL.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-postgresqlparameters.html
     */
    interface PostgreSqlParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-postgresqlparameters.html#cfn-quicksight-datasource-postgresqlparameters-database
         */
        readonly database: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-postgresqlparameters.html#cfn-quicksight-datasource-postgresqlparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-postgresqlparameters.html#cfn-quicksight-datasource-postgresqlparameters-port
         */
        readonly port: number;
    }
}
export declare namespace CfnDataSource {
    /**
     * The parameters for Presto.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-prestoparameters.html
     */
    interface PrestoParametersProperty {
        /**
         * Catalog.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-prestoparameters.html#cfn-quicksight-datasource-prestoparameters-catalog
         */
        readonly catalog: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-prestoparameters.html#cfn-quicksight-datasource-prestoparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-prestoparameters.html#cfn-quicksight-datasource-prestoparameters-port
         */
        readonly port: number;
    }
}
export declare namespace CfnDataSource {
    /**
     * The parameters for Amazon RDS.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-rdsparameters.html
     */
    interface RdsParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-rdsparameters.html#cfn-quicksight-datasource-rdsparameters-database
         */
        readonly database: string;
        /**
         * Instance ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-rdsparameters.html#cfn-quicksight-datasource-rdsparameters-instanceid
         */
        readonly instanceId: string;
    }
}
export declare namespace CfnDataSource {
    /**
     * The parameters for Amazon Redshift. The `ClusterId` field can be blank if `Host` and `Port` are both set. The `Host` and `Port` fields can be blank if the `ClusterId` field is set.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-redshiftparameters.html
     */
    interface RedshiftParametersProperty {
        /**
         * Cluster ID. This field can be blank if the `Host` and `Port` are provided.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-redshiftparameters.html#cfn-quicksight-datasource-redshiftparameters-clusterid
         */
        readonly clusterId?: string;
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-redshiftparameters.html#cfn-quicksight-datasource-redshiftparameters-database
         */
        readonly database: string;
        /**
         * Host. This field can be blank if `ClusterId` is provided.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-redshiftparameters.html#cfn-quicksight-datasource-redshiftparameters-host
         */
        readonly host?: string;
        /**
         * Port. This field can be blank if the `ClusterId` is provided.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-redshiftparameters.html#cfn-quicksight-datasource-redshiftparameters-port
         */
        readonly port?: number;
    }
}
export declare namespace CfnDataSource {
    /**
     * Permission for the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-resourcepermission.html
     */
    interface ResourcePermissionProperty {
        /**
         * The IAM action to grant or revoke permissions on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-resourcepermission.html#cfn-quicksight-datasource-resourcepermission-actions
         */
        readonly actions: string[];
        /**
         * The Amazon Resource Name (ARN) of the principal. This can be one of the following:
         *
         * - The ARN of an Amazon QuickSight user or group associated with a data source or dataset. (This is common.)
         * - The ARN of an Amazon QuickSight user, group, or namespace associated with an analysis, dashboard, template, or theme. (This is common.)
         * - The ARN of an AWS account root: This is an IAM ARN rather than a Amazon QuickSight ARN. Use this option only to share resources (templates) across AWS accounts . (This is less common.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-resourcepermission.html#cfn-quicksight-datasource-resourcepermission-principal
         */
        readonly principal: string;
    }
}
export declare namespace CfnDataSource {
    /**
     * The parameters for S3.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-s3parameters.html
     */
    interface S3ParametersProperty {
        /**
         * Location of the Amazon S3 manifest file. This is NULL if the manifest file was uploaded into Amazon QuickSight.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-s3parameters.html#cfn-quicksight-datasource-s3parameters-manifestfilelocation
         */
        readonly manifestFileLocation: CfnDataSource.ManifestFileLocationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDataSource {
    /**
     * The parameters for Snowflake.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-snowflakeparameters.html
     */
    interface SnowflakeParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-snowflakeparameters.html#cfn-quicksight-datasource-snowflakeparameters-database
         */
        readonly database: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-snowflakeparameters.html#cfn-quicksight-datasource-snowflakeparameters-host
         */
        readonly host: string;
        /**
         * Warehouse.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-snowflakeparameters.html#cfn-quicksight-datasource-snowflakeparameters-warehouse
         */
        readonly warehouse: string;
    }
}
export declare namespace CfnDataSource {
    /**
     * The parameters for Spark.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sparkparameters.html
     */
    interface SparkParametersProperty {
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sparkparameters.html#cfn-quicksight-datasource-sparkparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sparkparameters.html#cfn-quicksight-datasource-sparkparameters-port
         */
        readonly port: number;
    }
}
export declare namespace CfnDataSource {
    /**
     * The parameters for SQL Server.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sqlserverparameters.html
     */
    interface SqlServerParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sqlserverparameters.html#cfn-quicksight-datasource-sqlserverparameters-database
         */
        readonly database: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sqlserverparameters.html#cfn-quicksight-datasource-sqlserverparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sqlserverparameters.html#cfn-quicksight-datasource-sqlserverparameters-port
         */
        readonly port: number;
    }
}
export declare namespace CfnDataSource {
    /**
     * Secure Socket Layer (SSL) properties that apply when Amazon QuickSight connects to your underlying data source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sslproperties.html
     */
    interface SslPropertiesProperty {
        /**
         * A Boolean option to control whether SSL should be disabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-sslproperties.html#cfn-quicksight-datasource-sslproperties-disablessl
         */
        readonly disableSsl?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnDataSource {
    /**
     * The parameters for Teradata.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-teradataparameters.html
     */
    interface TeradataParametersProperty {
        /**
         * Database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-teradataparameters.html#cfn-quicksight-datasource-teradataparameters-database
         */
        readonly database: string;
        /**
         * Host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-teradataparameters.html#cfn-quicksight-datasource-teradataparameters-host
         */
        readonly host: string;
        /**
         * Port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-teradataparameters.html#cfn-quicksight-datasource-teradataparameters-port
         */
        readonly port: number;
    }
}
export declare namespace CfnDataSource {
    /**
     * VPC connection properties.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-vpcconnectionproperties.html
     */
    interface VpcConnectionPropertiesProperty {
        /**
         * The Amazon Resource Name (ARN) for the VPC connection.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-datasource-vpcconnectionproperties.html#cfn-quicksight-datasource-vpcconnectionproperties-vpcconnectionarn
         */
        readonly vpcConnectionArn: string;
    }
}
/**
 * Properties for defining a `CfnTemplate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html
 */
export interface CfnTemplateProps {
    /**
     * The ID for the AWS account that the group is in. You use the ID for the AWS account that contains your Amazon QuickSight account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-awsaccountid
     */
    readonly awsAccountId: string;
    /**
     * The entity that you are using as a source when you create the template. In `SourceEntity` , you specify the type of object you're using as source: `SourceTemplate` for a template or `SourceAnalysis` for an analysis. Both of these require an Amazon Resource Name (ARN). For `SourceTemplate` , specify the ARN of the source template. For `SourceAnalysis` , specify the ARN of the source analysis. The `SourceTemplate` ARN can contain any AWS account and any Amazon QuickSight-supported AWS Region .
     *
     * Use the `DataSetReferences` entity within `SourceTemplate` or `SourceAnalysis` to list the replacement datasets for the placeholders listed in the original. The schema in each dataset must match its placeholder.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-sourceentity
     */
    readonly sourceEntity: CfnTemplate.TemplateSourceEntityProperty | cdk.IResolvable;
    /**
     * An ID for the template that you want to create. This template is unique per AWS Region ; in each AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-templateid
     */
    readonly templateId: string;
    /**
     * A display name for the template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-name
     */
    readonly name?: string;
    /**
     * A list of resource permissions to be set on the template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-permissions
     */
    readonly permissions?: Array<CfnTemplate.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * A description of the current template version being created. This API operation creates the first version of the template. Every time `UpdateTemplate` is called, a new version is created. Each version of the template maintains a description of the version in the `VersionDescription` field.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-versiondescription
     */
    readonly versionDescription?: string;
}
/**
 * A CloudFormation `AWS::QuickSight::Template`
 *
 * Creates a template from an existing Amazon QuickSight analysis or template. You can use the resulting template to create a dashboard.
 *
 * A *template* is an entity in Amazon QuickSight that encapsulates the metadata required to create an analysis and that you can use to create s dashboard. A template adds a layer of abstraction by using placeholders to replace the dataset associated with the analysis. You can use templates to create dashboards by replacing dataset placeholders with datasets that follow the same schema that was used to create the source analysis and template.
 *
 * @cloudformationResource AWS::QuickSight::Template
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html
 */
export declare class CfnTemplate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::QuickSight::Template";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTemplate;
    /**
     * The Amazon Resource Name (ARN) of the template.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The time this template was created.
     * @cloudformationAttribute CreatedTime
     */
    readonly attrCreatedTime: string;
    /**
     * The time this template was last updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    readonly attrLastUpdatedTime: string;
    /**
     *
     * @cloudformationAttribute Version.CreatedTime
     */
    readonly attrVersionCreatedTime: string;
    /**
     *
     * @cloudformationAttribute Version.DataSetConfigurations
     */
    readonly attrVersionDataSetConfigurations: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute Version.Description
     */
    readonly attrVersionDescription: string;
    /**
     *
     * @cloudformationAttribute Version.Errors
     */
    readonly attrVersionErrors: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute Version.Sheets
     */
    readonly attrVersionSheets: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute Version.SourceEntityArn
     */
    readonly attrVersionSourceEntityArn: string;
    /**
     *
     * @cloudformationAttribute Version.Status
     */
    readonly attrVersionStatus: string;
    /**
     *
     * @cloudformationAttribute Version.ThemeArn
     */
    readonly attrVersionThemeArn: string;
    /**
     *
     * @cloudformationAttribute Version.VersionNumber
     */
    readonly attrVersionVersionNumber: cdk.IResolvable;
    /**
     * The ID for the AWS account that the group is in. You use the ID for the AWS account that contains your Amazon QuickSight account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-awsaccountid
     */
    awsAccountId: string;
    /**
     * The entity that you are using as a source when you create the template. In `SourceEntity` , you specify the type of object you're using as source: `SourceTemplate` for a template or `SourceAnalysis` for an analysis. Both of these require an Amazon Resource Name (ARN). For `SourceTemplate` , specify the ARN of the source template. For `SourceAnalysis` , specify the ARN of the source analysis. The `SourceTemplate` ARN can contain any AWS account and any Amazon QuickSight-supported AWS Region .
     *
     * Use the `DataSetReferences` entity within `SourceTemplate` or `SourceAnalysis` to list the replacement datasets for the placeholders listed in the original. The schema in each dataset must match its placeholder.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-sourceentity
     */
    sourceEntity: CfnTemplate.TemplateSourceEntityProperty | cdk.IResolvable;
    /**
     * An ID for the template that you want to create. This template is unique per AWS Region ; in each AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-templateid
     */
    templateId: string;
    /**
     * A display name for the template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-name
     */
    name: string | undefined;
    /**
     * A list of resource permissions to be set on the template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-permissions
     */
    permissions: Array<CfnTemplate.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * A description of the current template version being created. This API operation creates the first version of the template. Every time `UpdateTemplate` is called, a new version is created. Each version of the template maintains a description of the version in the `VersionDescription` field.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-template.html#cfn-quicksight-template-versiondescription
     */
    versionDescription: string | undefined;
    /**
     * Create a new `AWS::QuickSight::Template`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTemplateProps);
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
export declare namespace CfnTemplate {
    /**
     * A structure describing the name, data type, and geographic role of the columns.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columngroupcolumnschema.html
     */
    interface ColumnGroupColumnSchemaProperty {
        /**
         * The name of the column group's column schema.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columngroupcolumnschema.html#cfn-quicksight-template-columngroupcolumnschema-name
         */
        readonly name?: string;
    }
}
export declare namespace CfnTemplate {
    /**
     * The column group schema.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columngroupschema.html
     */
    interface ColumnGroupSchemaProperty {
        /**
         * A structure containing the list of schemas for column group columns.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columngroupschema.html#cfn-quicksight-template-columngroupschema-columngroupcolumnschemalist
         */
        readonly columnGroupColumnSchemaList?: Array<CfnTemplate.ColumnGroupColumnSchemaProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the column group schema.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columngroupschema.html#cfn-quicksight-template-columngroupschema-name
         */
        readonly name?: string;
    }
}
export declare namespace CfnTemplate {
    /**
     * The column schema.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columnschema.html
     */
    interface ColumnSchemaProperty {
        /**
         * The data type of the column schema.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columnschema.html#cfn-quicksight-template-columnschema-datatype
         */
        readonly dataType?: string;
        /**
         * The geographic role of the column schema.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columnschema.html#cfn-quicksight-template-columnschema-geographicrole
         */
        readonly geographicRole?: string;
        /**
         * The name of the column schema.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-columnschema.html#cfn-quicksight-template-columnschema-name
         */
        readonly name?: string;
    }
}
export declare namespace CfnTemplate {
    /**
     * Dataset configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetconfiguration.html
     */
    interface DataSetConfigurationProperty {
        /**
         * A structure containing the list of column group schemas.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetconfiguration.html#cfn-quicksight-template-datasetconfiguration-columngroupschemalist
         */
        readonly columnGroupSchemaList?: Array<CfnTemplate.ColumnGroupSchemaProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Dataset schema.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetconfiguration.html#cfn-quicksight-template-datasetconfiguration-datasetschema
         */
        readonly dataSetSchema?: CfnTemplate.DataSetSchemaProperty | cdk.IResolvable;
        /**
         * Placeholder.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetconfiguration.html#cfn-quicksight-template-datasetconfiguration-placeholder
         */
        readonly placeholder?: string;
    }
}
export declare namespace CfnTemplate {
    /**
     * Dataset reference.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetreference.html
     */
    interface DataSetReferenceProperty {
        /**
         * Dataset Amazon Resource Name (ARN).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetreference.html#cfn-quicksight-template-datasetreference-datasetarn
         */
        readonly dataSetArn: string;
        /**
         * Dataset placeholder.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetreference.html#cfn-quicksight-template-datasetreference-datasetplaceholder
         */
        readonly dataSetPlaceholder: string;
    }
}
export declare namespace CfnTemplate {
    /**
     * Dataset schema.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetschema.html
     */
    interface DataSetSchemaProperty {
        /**
         * A structure containing the list of column schemas.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-datasetschema.html#cfn-quicksight-template-datasetschema-columnschemalist
         */
        readonly columnSchemaList?: Array<CfnTemplate.ColumnSchemaProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnTemplate {
    /**
     * Permission for the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-resourcepermission.html
     */
    interface ResourcePermissionProperty {
        /**
         * The IAM action to grant or revoke permissions on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-resourcepermission.html#cfn-quicksight-template-resourcepermission-actions
         */
        readonly actions: string[];
        /**
         * The Amazon Resource Name (ARN) of the principal. This can be one of the following:
         *
         * - The ARN of an Amazon QuickSight user or group associated with a data source or dataset. (This is common.)
         * - The ARN of an Amazon QuickSight user, group, or namespace associated with an analysis, dashboard, template, or theme. (This is common.)
         * - The ARN of an AWS account root: This is an IAM ARN rather than a Amazon QuickSight ARN. Use this option only to share resources (templates) across AWS accounts . (This is less common.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-resourcepermission.html#cfn-quicksight-template-resourcepermission-principal
         */
        readonly principal: string;
    }
}
export declare namespace CfnTemplate {
    /**
     * A *sheet* , which is an object that contains a set of visuals that are viewed together on one page in Amazon QuickSight. Every analysis and dashboard contains at least one sheet. Each sheet contains at least one visualization widget, for example a chart, pivot table, or narrative insight. Sheets can be associated with other components, such as controls, filters, and so on.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-sheet.html
     */
    interface SheetProperty {
        /**
         * The name of a sheet. This name is displayed on the sheet's tab in the Amazon QuickSight console.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-sheet.html#cfn-quicksight-template-sheet-name
         */
        readonly name?: string;
        /**
         * The unique identifier associated with a sheet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-sheet.html#cfn-quicksight-template-sheet-sheetid
         */
        readonly sheetId?: string;
    }
}
export declare namespace CfnTemplate {
    /**
     * List of errors that occurred when the template version creation failed.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateerror.html
     */
    interface TemplateErrorProperty {
        /**
         * Description of the error type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateerror.html#cfn-quicksight-template-templateerror-message
         */
        readonly message?: string;
        /**
         * Type of error.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateerror.html#cfn-quicksight-template-templateerror-type
         */
        readonly type?: string;
    }
}
export declare namespace CfnTemplate {
    /**
     * The source analysis of the template.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templatesourceanalysis.html
     */
    interface TemplateSourceAnalysisProperty {
        /**
         * The Amazon Resource Name (ARN) of the resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templatesourceanalysis.html#cfn-quicksight-template-templatesourceanalysis-arn
         */
        readonly arn: string;
        /**
         * A structure containing information about the dataset references used as placeholders in the template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templatesourceanalysis.html#cfn-quicksight-template-templatesourceanalysis-datasetreferences
         */
        readonly dataSetReferences: Array<CfnTemplate.DataSetReferenceProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnTemplate {
    /**
     * The source entity of the template.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templatesourceentity.html
     */
    interface TemplateSourceEntityProperty {
        /**
         * The source analysis, if it is based on an analysis.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templatesourceentity.html#cfn-quicksight-template-templatesourceentity-sourceanalysis
         */
        readonly sourceAnalysis?: CfnTemplate.TemplateSourceAnalysisProperty | cdk.IResolvable;
        /**
         * The source template, if it is based on an template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templatesourceentity.html#cfn-quicksight-template-templatesourceentity-sourcetemplate
         */
        readonly sourceTemplate?: CfnTemplate.TemplateSourceTemplateProperty | cdk.IResolvable;
    }
}
export declare namespace CfnTemplate {
    /**
     * The source template of the template.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templatesourcetemplate.html
     */
    interface TemplateSourceTemplateProperty {
        /**
         * The Amazon Resource Name (ARN) of the resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templatesourcetemplate.html#cfn-quicksight-template-templatesourcetemplate-arn
         */
        readonly arn: string;
    }
}
export declare namespace CfnTemplate {
    /**
     * A version of a template.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html
     */
    interface TemplateVersionProperty {
        /**
         * The time that this template version was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-createdtime
         */
        readonly createdTime?: string;
        /**
         * Schema of the dataset identified by the placeholder. Any dashboard created from this template should be bound to new datasets matching the same schema described through this API operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-datasetconfigurations
         */
        readonly dataSetConfigurations?: Array<CfnTemplate.DataSetConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The description of the template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-description
         */
        readonly description?: string;
        /**
         * Errors associated with this template version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-errors
         */
        readonly errors?: Array<CfnTemplate.TemplateErrorProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A list of the associated sheets with the unique identifier and name of each sheet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-sheets
         */
        readonly sheets?: Array<CfnTemplate.SheetProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of an analysis or template that was used to create this template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-sourceentityarn
         */
        readonly sourceEntityArn?: string;
        /**
         * The HTTP status of the request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-status
         */
        readonly status?: string;
        /**
         * The ARN of the theme associated with this version of the template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-themearn
         */
        readonly themeArn?: string;
        /**
         * The version number of the template version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-template-templateversion.html#cfn-quicksight-template-templateversion-versionnumber
         */
        readonly versionNumber?: number;
    }
}
/**
 * Properties for defining a `CfnTheme`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html
 */
export interface CfnThemeProps {
    /**
     * The ID of the AWS account where you want to store the new theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-awsaccountid
     */
    readonly awsAccountId: string;
    /**
     * An ID for the theme that you want to create. The theme ID is unique per AWS Region in each AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-themeid
     */
    readonly themeId: string;
    /**
     * The ID of the theme that a custom theme will inherit from. All themes inherit from one of the starting themes defined by Amazon QuickSight. For a list of the starting themes, use `ListThemes` or choose *Themes* from within an analysis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-basethemeid
     */
    readonly baseThemeId?: string;
    /**
     * The theme configuration, which contains the theme display properties.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-configuration
     */
    readonly configuration?: CfnTheme.ThemeConfigurationProperty | cdk.IResolvable;
    /**
     * A display name for the theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-name
     */
    readonly name?: string;
    /**
     * A valid grouping of resource permissions to apply to the new theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-permissions
     */
    readonly permissions?: Array<CfnTheme.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * A map of the key-value pairs for the resource tag or tags that you want to add to the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * A description of the first version of the theme that you're creating. Every time `UpdateTheme` is called, a new version is created. Each version of the theme has a description of the version in the `VersionDescription` field.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-versiondescription
     */
    readonly versionDescription?: string;
}
/**
 * A CloudFormation `AWS::QuickSight::Theme`
 *
 * Creates a theme.
 *
 * A *theme* is set of configuration options for color and layout. Themes apply to analyses and dashboards. For more information, see [Using Themes in Amazon QuickSight](https://docs.aws.amazon.com/quicksight/latest/user/themes-in-quicksight.html) in the *Amazon QuickSight User Guide* .
 *
 * @cloudformationResource AWS::QuickSight::Theme
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html
 */
export declare class CfnTheme extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::QuickSight::Theme";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTheme;
    /**
     * The Amazon Resource Name (ARN) of the theme.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The time the theme was created.
     * @cloudformationAttribute CreatedTime
     */
    readonly attrCreatedTime: string;
    /**
     * The time the theme was last updated.
     * @cloudformationAttribute LastUpdatedTime
     */
    readonly attrLastUpdatedTime: string;
    /**
     * Theme type.
     * @cloudformationAttribute Type
     */
    readonly attrType: string;
    /**
     *
     * @cloudformationAttribute Version.Arn
     */
    readonly attrVersionArn: string;
    /**
     *
     * @cloudformationAttribute Version.BaseThemeId
     */
    readonly attrVersionBaseThemeId: string;
    /**
     *
     * @cloudformationAttribute Version.CreatedTime
     */
    readonly attrVersionCreatedTime: string;
    /**
     *
     * @cloudformationAttribute Version.Description
     */
    readonly attrVersionDescription: string;
    /**
     *
     * @cloudformationAttribute Version.Errors
     */
    readonly attrVersionErrors: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute Version.Status
     */
    readonly attrVersionStatus: string;
    /**
     *
     * @cloudformationAttribute Version.VersionNumber
     */
    readonly attrVersionVersionNumber: cdk.IResolvable;
    /**
     * The ID of the AWS account where you want to store the new theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-awsaccountid
     */
    awsAccountId: string;
    /**
     * An ID for the theme that you want to create. The theme ID is unique per AWS Region in each AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-themeid
     */
    themeId: string;
    /**
     * The ID of the theme that a custom theme will inherit from. All themes inherit from one of the starting themes defined by Amazon QuickSight. For a list of the starting themes, use `ListThemes` or choose *Themes* from within an analysis.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-basethemeid
     */
    baseThemeId: string | undefined;
    /**
     * The theme configuration, which contains the theme display properties.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-configuration
     */
    configuration: CfnTheme.ThemeConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * A display name for the theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-name
     */
    name: string | undefined;
    /**
     * A valid grouping of resource permissions to apply to the new theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-permissions
     */
    permissions: Array<CfnTheme.ResourcePermissionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * A map of the key-value pairs for the resource tag or tags that you want to add to the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * A description of the first version of the theme that you're creating. Every time `UpdateTheme` is called, a new version is created. Each version of the theme has a description of the version in the `VersionDescription` field.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-quicksight-theme.html#cfn-quicksight-theme-versiondescription
     */
    versionDescription: string | undefined;
    /**
     * Create a new `AWS::QuickSight::Theme`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnThemeProps);
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
export declare namespace CfnTheme {
    /**
     * The display options for tile borders for visuals.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-borderstyle.html
     */
    interface BorderStyleProperty {
        /**
         * The option to enable display of borders for visuals.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-borderstyle.html#cfn-quicksight-theme-borderstyle-show
         */
        readonly show?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnTheme {
    /**
     * The theme colors that are used for data colors in charts. The colors description is a hexadecimal color code that consists of six alphanumerical characters, prefixed with `#` , for example #37BFF5.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-datacolorpalette.html
     */
    interface DataColorPaletteProperty {
        /**
         * The hexadecimal codes for the colors.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-datacolorpalette.html#cfn-quicksight-theme-datacolorpalette-colors
         */
        readonly colors?: string[];
        /**
         * The hexadecimal code of a color that applies to charts where a lack of data is highlighted.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-datacolorpalette.html#cfn-quicksight-theme-datacolorpalette-emptyfillcolor
         */
        readonly emptyFillColor?: string;
        /**
         * The minimum and maximum hexadecimal codes that describe a color gradient.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-datacolorpalette.html#cfn-quicksight-theme-datacolorpalette-minmaxgradient
         */
        readonly minMaxGradient?: string[];
    }
}
export declare namespace CfnTheme {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-font.html
     */
    interface FontProperty {
        /**
         * `CfnTheme.FontProperty.FontFamily`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-font.html#cfn-quicksight-theme-font-fontfamily
         */
        readonly fontFamily?: string;
    }
}
export declare namespace CfnTheme {
    /**
     * The display options for gutter spacing between tiles on a sheet.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-gutterstyle.html
     */
    interface GutterStyleProperty {
        /**
         * This Boolean value controls whether to display a gutter space between sheet tiles.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-gutterstyle.html#cfn-quicksight-theme-gutterstyle-show
         */
        readonly show?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnTheme {
    /**
     * The display options for margins around the outside edge of sheets.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-marginstyle.html
     */
    interface MarginStyleProperty {
        /**
         * This Boolean value controls whether to display sheet margins.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-marginstyle.html#cfn-quicksight-theme-marginstyle-show
         */
        readonly show?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnTheme {
    /**
     * Permission for the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-resourcepermission.html
     */
    interface ResourcePermissionProperty {
        /**
         * The IAM action to grant or revoke permissions on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-resourcepermission.html#cfn-quicksight-theme-resourcepermission-actions
         */
        readonly actions: string[];
        /**
         * The Amazon Resource Name (ARN) of the principal. This can be one of the following:
         *
         * - The ARN of an Amazon QuickSight user or group associated with a data source or dataset. (This is common.)
         * - The ARN of an Amazon QuickSight user, group, or namespace associated with an analysis, dashboard, template, or theme. (This is common.)
         * - The ARN of an AWS account root: This is an IAM ARN rather than a Amazon QuickSight ARN. Use this option only to share resources (templates) across AWS accounts . (This is less common.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-resourcepermission.html#cfn-quicksight-theme-resourcepermission-principal
         */
        readonly principal: string;
    }
}
export declare namespace CfnTheme {
    /**
     * The theme display options for sheets.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-sheetstyle.html
     */
    interface SheetStyleProperty {
        /**
         * The display options for tiles.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-sheetstyle.html#cfn-quicksight-theme-sheetstyle-tile
         */
        readonly tile?: CfnTheme.TileStyleProperty | cdk.IResolvable;
        /**
         * The layout options for tiles.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-sheetstyle.html#cfn-quicksight-theme-sheetstyle-tilelayout
         */
        readonly tileLayout?: CfnTheme.TileLayoutStyleProperty | cdk.IResolvable;
    }
}
export declare namespace CfnTheme {
    /**
     * The theme configuration. This configuration contains all of the display properties for a theme.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeconfiguration.html
     */
    interface ThemeConfigurationProperty {
        /**
         * Color properties that apply to chart data colors.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeconfiguration.html#cfn-quicksight-theme-themeconfiguration-datacolorpalette
         */
        readonly dataColorPalette?: CfnTheme.DataColorPaletteProperty | cdk.IResolvable;
        /**
         * Display options related to sheets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeconfiguration.html#cfn-quicksight-theme-themeconfiguration-sheet
         */
        readonly sheet?: CfnTheme.SheetStyleProperty | cdk.IResolvable;
        /**
         * `CfnTheme.ThemeConfigurationProperty.Typography`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeconfiguration.html#cfn-quicksight-theme-themeconfiguration-typography
         */
        readonly typography?: CfnTheme.TypographyProperty | cdk.IResolvable;
        /**
         * Color properties that apply to the UI and to charts, excluding the colors that apply to data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeconfiguration.html#cfn-quicksight-theme-themeconfiguration-uicolorpalette
         */
        readonly uiColorPalette?: CfnTheme.UIColorPaletteProperty | cdk.IResolvable;
    }
}
export declare namespace CfnTheme {
    /**
     * Theme error.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeerror.html
     */
    interface ThemeErrorProperty {
        /**
         * The error message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeerror.html#cfn-quicksight-theme-themeerror-message
         */
        readonly message?: string;
        /**
         * The type of error.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeerror.html#cfn-quicksight-theme-themeerror-type
         */
        readonly type?: string;
    }
}
export declare namespace CfnTheme {
    /**
     * A version of a theme.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html
     */
    interface ThemeVersionProperty {
        /**
         * The Amazon Resource Name (ARN) of the resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html#cfn-quicksight-theme-themeversion-arn
         */
        readonly arn?: string;
        /**
         * The Amazon QuickSight-defined ID of the theme that a custom theme inherits from. All themes initially inherit from a default Amazon QuickSight theme.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html#cfn-quicksight-theme-themeversion-basethemeid
         */
        readonly baseThemeId?: string;
        /**
         * The theme configuration, which contains all the theme display properties.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html#cfn-quicksight-theme-themeversion-configuration
         */
        readonly configuration?: CfnTheme.ThemeConfigurationProperty | cdk.IResolvable;
        /**
         * The date and time that this theme version was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html#cfn-quicksight-theme-themeversion-createdtime
         */
        readonly createdTime?: string;
        /**
         * The description of the theme.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html#cfn-quicksight-theme-themeversion-description
         */
        readonly description?: string;
        /**
         * Errors associated with the theme.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html#cfn-quicksight-theme-themeversion-errors
         */
        readonly errors?: Array<CfnTheme.ThemeErrorProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The status of the theme version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html#cfn-quicksight-theme-themeversion-status
         */
        readonly status?: string;
        /**
         * The version number of the theme.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-themeversion.html#cfn-quicksight-theme-themeversion-versionnumber
         */
        readonly versionNumber?: number;
    }
}
export declare namespace CfnTheme {
    /**
     * The display options for the layout of tiles on a sheet.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-tilelayoutstyle.html
     */
    interface TileLayoutStyleProperty {
        /**
         * The gutter settings that apply between tiles.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-tilelayoutstyle.html#cfn-quicksight-theme-tilelayoutstyle-gutter
         */
        readonly gutter?: CfnTheme.GutterStyleProperty | cdk.IResolvable;
        /**
         * The margin settings that apply around the outside edge of sheets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-tilelayoutstyle.html#cfn-quicksight-theme-tilelayoutstyle-margin
         */
        readonly margin?: CfnTheme.MarginStyleProperty | cdk.IResolvable;
    }
}
export declare namespace CfnTheme {
    /**
     * Display options related to tiles on a sheet.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-tilestyle.html
     */
    interface TileStyleProperty {
        /**
         * The border around a tile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-tilestyle.html#cfn-quicksight-theme-tilestyle-border
         */
        readonly border?: CfnTheme.BorderStyleProperty | cdk.IResolvable;
    }
}
export declare namespace CfnTheme {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-typography.html
     */
    interface TypographyProperty {
        /**
         * `CfnTheme.TypographyProperty.FontFamilies`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-typography.html#cfn-quicksight-theme-typography-fontfamilies
         */
        readonly fontFamilies?: Array<CfnTheme.FontProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnTheme {
    /**
     * The theme colors that apply to UI and to charts, excluding data colors. The colors description is a hexadecimal color code that consists of six alphanumerical characters, prefixed with `#` , for example #37BFF5. For more information, see [Using Themes in Amazon QuickSight](https://docs.aws.amazon.com/quicksight/latest/user/themes-in-quicksight.html) in the *Amazon QuickSight User Guide.*
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html
     */
    interface UIColorPaletteProperty {
        /**
         * This color is that applies to selected states and buttons.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-accent
         */
        readonly accent?: string;
        /**
         * The foreground color that applies to any text or other elements that appear over the accent color.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-accentforeground
         */
        readonly accentForeground?: string;
        /**
         * The color that applies to error messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-danger
         */
        readonly danger?: string;
        /**
         * The foreground color that applies to any text or other elements that appear over the error color.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-dangerforeground
         */
        readonly dangerForeground?: string;
        /**
         * The color that applies to the names of fields that are identified as dimensions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-dimension
         */
        readonly dimension?: string;
        /**
         * The foreground color that applies to any text or other elements that appear over the dimension color.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-dimensionforeground
         */
        readonly dimensionForeground?: string;
        /**
         * The color that applies to the names of fields that are identified as measures.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-measure
         */
        readonly measure?: string;
        /**
         * The foreground color that applies to any text or other elements that appear over the measure color.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-measureforeground
         */
        readonly measureForeground?: string;
        /**
         * The background color that applies to visuals and other high emphasis UI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-primarybackground
         */
        readonly primaryBackground?: string;
        /**
         * The color of text and other foreground elements that appear over the primary background regions, such as grid lines, borders, table banding, icons, and so on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-primaryforeground
         */
        readonly primaryForeground?: string;
        /**
         * The background color that applies to the sheet background and sheet controls.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-secondarybackground
         */
        readonly secondaryBackground?: string;
        /**
         * The foreground color that applies to any sheet title, sheet control text, or UI that appears over the secondary background.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-secondaryforeground
         */
        readonly secondaryForeground?: string;
        /**
         * The color that applies to success messages, for example the check mark for a successful download.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-success
         */
        readonly success?: string;
        /**
         * The foreground color that applies to any text or other elements that appear over the success color.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-successforeground
         */
        readonly successForeground?: string;
        /**
         * This color that applies to warning and informational messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-warning
         */
        readonly warning?: string;
        /**
         * The foreground color that applies to any text or other elements that appear over the warning color.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-quicksight-theme-uicolorpalette.html#cfn-quicksight-theme-uicolorpalette-warningforeground
         */
        readonly warningForeground?: string;
    }
}
