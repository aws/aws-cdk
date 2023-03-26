import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnDataset`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html
 */
export interface CfnDatasetProps {
    /**
     * The Amazon Resource Name (ARN) of the dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-datasetgrouparn
     */
    readonly datasetGroupArn: string;
    /**
     * One of the following values:
     *
     * - Interactions
     * - Items
     * - Users
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-datasettype
     */
    readonly datasetType: string;
    /**
     * The name of the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-name
     */
    readonly name: string;
    /**
     * The ARN of the associated schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-schemaarn
     */
    readonly schemaArn: string;
    /**
     * Describes a job that imports training data from a data source (Amazon S3 bucket) to an Amazon Personalize dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-datasetimportjob
     */
    readonly datasetImportJob?: CfnDataset.DatasetImportJobProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::Personalize::Dataset`
 *
 * Creates an empty dataset and adds it to the specified dataset group. Use [CreateDatasetImportJob](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateDatasetImportJob.html) to import your training data to a dataset.
 *
 * There are three types of datasets:
 *
 * - Interactions
 * - Items
 * - Users
 *
 * Each dataset type has an associated schema with required field types. Only the `Interactions` dataset is required in order to train a model (also referred to as creating a solution).
 *
 * A dataset can be in one of the following states:
 *
 * - CREATE PENDING > CREATE IN_PROGRESS > ACTIVE -or- CREATE FAILED
 * - DELETE PENDING > DELETE IN_PROGRESS
 *
 * To get the status of the dataset, call [DescribeDataset](https://docs.aws.amazon.com/personalize/latest/dg/API_DescribeDataset.html) .
 *
 * **Related APIs** - [CreateDatasetGroup](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateDatasetGroup.html)
 * - [ListDatasets](https://docs.aws.amazon.com/personalize/latest/dg/API_ListDatasets.html)
 * - [DescribeDataset](https://docs.aws.amazon.com/personalize/latest/dg/API_DescribeDataset.html)
 * - [DeleteDataset](https://docs.aws.amazon.com/personalize/latest/dg/API_DeleteDataset.html)
 *
 * @cloudformationResource AWS::Personalize::Dataset
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html
 */
export declare class CfnDataset extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Personalize::Dataset";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataset;
    /**
     * The Amazon Resource Name (ARN) of the dataset.
     * @cloudformationAttribute DatasetArn
     */
    readonly attrDatasetArn: string;
    /**
     * The Amazon Resource Name (ARN) of the dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-datasetgrouparn
     */
    datasetGroupArn: string;
    /**
     * One of the following values:
     *
     * - Interactions
     * - Items
     * - Users
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-datasettype
     */
    datasetType: string;
    /**
     * The name of the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-name
     */
    name: string;
    /**
     * The ARN of the associated schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-schemaarn
     */
    schemaArn: string;
    /**
     * Describes a job that imports training data from a data source (Amazon S3 bucket) to an Amazon Personalize dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-datasetimportjob
     */
    datasetImportJob: CfnDataset.DatasetImportJobProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Personalize::Dataset`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDatasetProps);
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
export declare namespace CfnDataset {
    /**
     * Describes the data source that contains the data to upload to a dataset.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasource.html
     */
    interface DataSourceProperty {
        /**
         * The path to the Amazon S3 bucket where the data that you want to upload to your dataset is stored. For example:
         *
         * `s3://bucket-name/folder-name/`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasource.html#cfn-personalize-dataset-datasource-datalocation
         */
        readonly dataLocation?: string;
    }
}
export declare namespace CfnDataset {
    /**
     * Describes a job that imports training data from a data source (Amazon S3 bucket) to an Amazon Personalize dataset. For more information, see [CreateDatasetImportJob](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateDatasetImportJob.html) .
     *
     * A dataset import job can be in one of the following states:
     *
     * - CREATE PENDING > CREATE IN_PROGRESS > ACTIVE -or- CREATE FAILED
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html
     */
    interface DatasetImportJobProperty {
        /**
         * The Amazon S3 bucket that contains the training data to import.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html#cfn-personalize-dataset-datasetimportjob-datasource
         */
        readonly dataSource?: any | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the dataset that receives the imported data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html#cfn-personalize-dataset-datasetimportjob-datasetarn
         */
        readonly datasetArn?: string;
        /**
         * The ARN of the dataset import job.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html#cfn-personalize-dataset-datasetimportjob-datasetimportjobarn
         */
        readonly datasetImportJobArn?: string;
        /**
         * The name of the import job.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html#cfn-personalize-dataset-datasetimportjob-jobname
         */
        readonly jobName?: string;
        /**
         * The ARN of the IAM role that has permissions to read from the Amazon S3 data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html#cfn-personalize-dataset-datasetimportjob-rolearn
         */
        readonly roleArn?: string;
    }
}
/**
 * Properties for defining a `CfnDatasetGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html
 */
export interface CfnDatasetGroupProps {
    /**
     * The name of the dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-name
     */
    readonly name: string;
    /**
     * The domain of a Domain dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-domain
     */
    readonly domain?: string;
    /**
     * The Amazon Resource Name (ARN) of the AWS Key Management Service (KMS) key used to encrypt the datasets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-kmskeyarn
     */
    readonly kmsKeyArn?: string;
    /**
     * The ARN of the IAM role that has permissions to create the dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-rolearn
     */
    readonly roleArn?: string;
}
/**
 * A CloudFormation `AWS::Personalize::DatasetGroup`
 *
 * A dataset group is a collection of related datasets (Interactions, User, and Item). You create a dataset group by calling [CreateDatasetGroup](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateDatasetGroup.html) . You then create a dataset and add it to a dataset group by calling [CreateDataset](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateDataset.html) . The dataset group is used to create and train a solution by calling [CreateSolution](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateSolution.html) . A dataset group can contain only one of each type of dataset.
 *
 * You can specify an AWS Key Management Service (KMS) key to encrypt the datasets in the group.
 *
 * @cloudformationResource AWS::Personalize::DatasetGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html
 */
export declare class CfnDatasetGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Personalize::DatasetGroup";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDatasetGroup;
    /**
     * The Amazon Resource Name (ARN) of the dataset group.
     * @cloudformationAttribute DatasetGroupArn
     */
    readonly attrDatasetGroupArn: string;
    /**
     * The name of the dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-name
     */
    name: string;
    /**
     * The domain of a Domain dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-domain
     */
    domain: string | undefined;
    /**
     * The Amazon Resource Name (ARN) of the AWS Key Management Service (KMS) key used to encrypt the datasets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-kmskeyarn
     */
    kmsKeyArn: string | undefined;
    /**
     * The ARN of the IAM role that has permissions to create the dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-rolearn
     */
    roleArn: string | undefined;
    /**
     * Create a new `AWS::Personalize::DatasetGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDatasetGroupProps);
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
 * Properties for defining a `CfnSchema`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html
 */
export interface CfnSchemaProps {
    /**
     * The name of the schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html#cfn-personalize-schema-name
     */
    readonly name: string;
    /**
     * The schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html#cfn-personalize-schema-schema
     */
    readonly schema: string;
    /**
     * The domain of a schema that you created for a dataset in a Domain dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html#cfn-personalize-schema-domain
     */
    readonly domain?: string;
}
/**
 * A CloudFormation `AWS::Personalize::Schema`
 *
 * Creates an Amazon Personalize schema from the specified schema string. The schema you create must be in Avro JSON format.
 *
 * Amazon Personalize recognizes three schema variants. Each schema is associated with a dataset type and has a set of required field and keywords. If you are creating a schema for a dataset in a Domain dataset group, you provide the domain of the Domain dataset group. You specify a schema when you call [CreateDataset](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateDataset.html) .
 *
 * For more information on schemas, see [Datasets and schemas](https://docs.aws.amazon.com/personalize/latest/dg/how-it-works-dataset-schema.html) .
 *
 * **Related APIs** - [ListSchemas](https://docs.aws.amazon.com/personalize/latest/dg/API_ListSchemas.html)
 * - [DescribeSchema](https://docs.aws.amazon.com/personalize/latest/dg/API_DescribeSchema.html)
 * - [DeleteSchema](https://docs.aws.amazon.com/personalize/latest/dg/API_DeleteSchema.html)
 *
 * @cloudformationResource AWS::Personalize::Schema
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html
 */
export declare class CfnSchema extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Personalize::Schema";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSchema;
    /**
     * The Amazon Resource Name (ARN) of the schema.
     * @cloudformationAttribute SchemaArn
     */
    readonly attrSchemaArn: string;
    /**
     * The name of the schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html#cfn-personalize-schema-name
     */
    name: string;
    /**
     * The schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html#cfn-personalize-schema-schema
     */
    schema: string;
    /**
     * The domain of a schema that you created for a dataset in a Domain dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html#cfn-personalize-schema-domain
     */
    domain: string | undefined;
    /**
     * Create a new `AWS::Personalize::Schema`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSchemaProps);
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
 * Properties for defining a `CfnSolution`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html
 */
export interface CfnSolutionProps {
    /**
     * The Amazon Resource Name (ARN) of the dataset group that provides the training data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-datasetgrouparn
     */
    readonly datasetGroupArn: string;
    /**
     * The name of the solution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-name
     */
    readonly name: string;
    /**
     * The event type (for example, 'click' or 'like') that is used for training the model. If no `eventType` is provided, Amazon Personalize uses all interactions for training with equal weight regardless of type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-eventtype
     */
    readonly eventType?: string;
    /**
     * > We don't recommend enabling automated machine learning. Instead, match your use case to the available Amazon Personalize recipes. For more information, see [Determining your use case.](https://docs.aws.amazon.com/personalize/latest/dg/determining-use-case.html)
     *
     * When true, Amazon Personalize performs a search for the best USER_PERSONALIZATION recipe from the list specified in the solution configuration ( `recipeArn` must not be specified). When false (the default), Amazon Personalize uses `recipeArn` for training.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-performautoml
     */
    readonly performAutoMl?: boolean | cdk.IResolvable;
    /**
     * Whether to perform hyperparameter optimization (HPO) on the chosen recipe. The default is `false` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-performhpo
     */
    readonly performHpo?: boolean | cdk.IResolvable;
    /**
     * The ARN of the recipe used to create the solution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-recipearn
     */
    readonly recipeArn?: string;
    /**
     * Describes the configuration properties for the solution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-solutionconfig
     */
    readonly solutionConfig?: CfnSolution.SolutionConfigProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::Personalize::Solution`
 *
 * An object that provides information about a solution. A solution is a trained model that can be deployed as a campaign.
 *
 * @cloudformationResource AWS::Personalize::Solution
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html
 */
export declare class CfnSolution extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Personalize::Solution";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSolution;
    /**
     * The Amazon Resource Name (ARN) of the solution.
     * @cloudformationAttribute SolutionArn
     */
    readonly attrSolutionArn: string;
    /**
     * The Amazon Resource Name (ARN) of the dataset group that provides the training data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-datasetgrouparn
     */
    datasetGroupArn: string;
    /**
     * The name of the solution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-name
     */
    name: string;
    /**
     * The event type (for example, 'click' or 'like') that is used for training the model. If no `eventType` is provided, Amazon Personalize uses all interactions for training with equal weight regardless of type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-eventtype
     */
    eventType: string | undefined;
    /**
     * > We don't recommend enabling automated machine learning. Instead, match your use case to the available Amazon Personalize recipes. For more information, see [Determining your use case.](https://docs.aws.amazon.com/personalize/latest/dg/determining-use-case.html)
     *
     * When true, Amazon Personalize performs a search for the best USER_PERSONALIZATION recipe from the list specified in the solution configuration ( `recipeArn` must not be specified). When false (the default), Amazon Personalize uses `recipeArn` for training.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-performautoml
     */
    performAutoMl: boolean | cdk.IResolvable | undefined;
    /**
     * Whether to perform hyperparameter optimization (HPO) on the chosen recipe. The default is `false` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-performhpo
     */
    performHpo: boolean | cdk.IResolvable | undefined;
    /**
     * The ARN of the recipe used to create the solution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-recipearn
     */
    recipeArn: string | undefined;
    /**
     * Describes the configuration properties for the solution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-solutionconfig
     */
    solutionConfig: CfnSolution.SolutionConfigProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Personalize::Solution`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSolutionProps);
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
export declare namespace CfnSolution {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-algorithmhyperparameterranges.html
     */
    interface AlgorithmHyperParameterRangesProperty {
        /**
         * `CfnSolution.AlgorithmHyperParameterRangesProperty.CategoricalHyperParameterRanges`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-algorithmhyperparameterranges.html#cfn-personalize-solution-algorithmhyperparameterranges-categoricalhyperparameterranges
         */
        readonly categoricalHyperParameterRanges?: Array<CfnSolution.CategoricalHyperParameterRangeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnSolution.AlgorithmHyperParameterRangesProperty.ContinuousHyperParameterRanges`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-algorithmhyperparameterranges.html#cfn-personalize-solution-algorithmhyperparameterranges-continuoushyperparameterranges
         */
        readonly continuousHyperParameterRanges?: Array<CfnSolution.ContinuousHyperParameterRangeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnSolution.AlgorithmHyperParameterRangesProperty.IntegerHyperParameterRanges`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-algorithmhyperparameterranges.html#cfn-personalize-solution-algorithmhyperparameterranges-integerhyperparameterranges
         */
        readonly integerHyperParameterRanges?: Array<CfnSolution.IntegerHyperParameterRangeProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnSolution {
    /**
     * When the solution performs AutoML ( `performAutoML` is true in [CreateSolution](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateSolution.html) ), Amazon Personalize determines which recipe, from the specified list, optimizes the given metric. Amazon Personalize then uses that recipe for the solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-automlconfig.html
     */
    interface AutoMLConfigProperty {
        /**
         * The metric to optimize.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-automlconfig.html#cfn-personalize-solution-automlconfig-metricname
         */
        readonly metricName?: string;
        /**
         * The list of candidate recipes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-automlconfig.html#cfn-personalize-solution-automlconfig-recipelist
         */
        readonly recipeList?: string[];
    }
}
export declare namespace CfnSolution {
    /**
     * Provides the name and range of a categorical hyperparameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-categoricalhyperparameterrange.html
     */
    interface CategoricalHyperParameterRangeProperty {
        /**
         * The name of the hyperparameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-categoricalhyperparameterrange.html#cfn-personalize-solution-categoricalhyperparameterrange-name
         */
        readonly name?: string;
        /**
         * A list of the categories for the hyperparameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-categoricalhyperparameterrange.html#cfn-personalize-solution-categoricalhyperparameterrange-values
         */
        readonly values?: string[];
    }
}
export declare namespace CfnSolution {
    /**
     * Provides the name and range of a continuous hyperparameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-continuoushyperparameterrange.html
     */
    interface ContinuousHyperParameterRangeProperty {
        /**
         * The maximum allowable value for the hyperparameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-continuoushyperparameterrange.html#cfn-personalize-solution-continuoushyperparameterrange-maxvalue
         */
        readonly maxValue?: number;
        /**
         * The minimum allowable value for the hyperparameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-continuoushyperparameterrange.html#cfn-personalize-solution-continuoushyperparameterrange-minvalue
         */
        readonly minValue?: number;
        /**
         * The name of the hyperparameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-continuoushyperparameterrange.html#cfn-personalize-solution-continuoushyperparameterrange-name
         */
        readonly name?: string;
    }
}
export declare namespace CfnSolution {
    /**
     * Describes the properties for hyperparameter optimization (HPO).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoconfig.html
     */
    interface HpoConfigProperty {
        /**
         * The hyperparameters and their allowable ranges.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoconfig.html#cfn-personalize-solution-hpoconfig-algorithmhyperparameterranges
         */
        readonly algorithmHyperParameterRanges?: CfnSolution.AlgorithmHyperParameterRangesProperty | cdk.IResolvable;
        /**
         * The metric to optimize during HPO.
         *
         * > Amazon Personalize doesn't support configuring the `hpoObjective` at this time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoconfig.html#cfn-personalize-solution-hpoconfig-hpoobjective
         */
        readonly hpoObjective?: CfnSolution.HpoObjectiveProperty | cdk.IResolvable;
        /**
         * Describes the resource configuration for HPO.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoconfig.html#cfn-personalize-solution-hpoconfig-hporesourceconfig
         */
        readonly hpoResourceConfig?: CfnSolution.HpoResourceConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnSolution {
    /**
     * The metric to optimize during hyperparameter optimization (HPO).
     *
     * > Amazon Personalize doesn't support configuring the `hpoObjective` at this time.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoobjective.html
     */
    interface HpoObjectiveProperty {
        /**
         * The name of the metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoobjective.html#cfn-personalize-solution-hpoobjective-metricname
         */
        readonly metricName?: string;
        /**
         * A regular expression for finding the metric in the training job logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoobjective.html#cfn-personalize-solution-hpoobjective-metricregex
         */
        readonly metricRegex?: string;
        /**
         * The type of the metric. Valid values are `Maximize` and `Minimize` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoobjective.html#cfn-personalize-solution-hpoobjective-type
         */
        readonly type?: string;
    }
}
export declare namespace CfnSolution {
    /**
     * Describes the resource configuration for hyperparameter optimization (HPO).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hporesourceconfig.html
     */
    interface HpoResourceConfigProperty {
        /**
         * The maximum number of training jobs when you create a solution version. The maximum value for `maxNumberOfTrainingJobs` is `40` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hporesourceconfig.html#cfn-personalize-solution-hporesourceconfig-maxnumberoftrainingjobs
         */
        readonly maxNumberOfTrainingJobs?: string;
        /**
         * The maximum number of parallel training jobs when you create a solution version. The maximum value for `maxParallelTrainingJobs` is `10` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hporesourceconfig.html#cfn-personalize-solution-hporesourceconfig-maxparalleltrainingjobs
         */
        readonly maxParallelTrainingJobs?: string;
    }
}
export declare namespace CfnSolution {
    /**
     * Provides the name and range of an integer-valued hyperparameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-integerhyperparameterrange.html
     */
    interface IntegerHyperParameterRangeProperty {
        /**
         * The maximum allowable value for the hyperparameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-integerhyperparameterrange.html#cfn-personalize-solution-integerhyperparameterrange-maxvalue
         */
        readonly maxValue?: number;
        /**
         * The minimum allowable value for the hyperparameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-integerhyperparameterrange.html#cfn-personalize-solution-integerhyperparameterrange-minvalue
         */
        readonly minValue?: number;
        /**
         * The name of the hyperparameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-integerhyperparameterrange.html#cfn-personalize-solution-integerhyperparameterrange-name
         */
        readonly name?: string;
    }
}
export declare namespace CfnSolution {
    /**
     * Describes the configuration properties for the solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html
     */
    interface SolutionConfigProperty {
        /**
         * Lists the hyperparameter names and ranges.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html#cfn-personalize-solution-solutionconfig-algorithmhyperparameters
         */
        readonly algorithmHyperParameters?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * The [AutoMLConfig](https://docs.aws.amazon.com/personalize/latest/dg/API_AutoMLConfig.html) object containing a list of recipes to search when AutoML is performed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html#cfn-personalize-solution-solutionconfig-automlconfig
         */
        readonly autoMlConfig?: any | cdk.IResolvable;
        /**
         * Only events with a value greater than or equal to this threshold are used for training a model.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html#cfn-personalize-solution-solutionconfig-eventvaluethreshold
         */
        readonly eventValueThreshold?: string;
        /**
         * Lists the feature transformation parameters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html#cfn-personalize-solution-solutionconfig-featuretransformationparameters
         */
        readonly featureTransformationParameters?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * Describes the properties for hyperparameter optimization (HPO).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html#cfn-personalize-solution-solutionconfig-hpoconfig
         */
        readonly hpoConfig?: any | cdk.IResolvable;
    }
}
