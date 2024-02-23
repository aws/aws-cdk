/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates an empty dataset and adds it to the specified dataset group.
 *
 * Use [CreateDatasetImportJob](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateDatasetImportJob.html) to import your training data to a dataset.
 *
 * There are 5 types of datasets:
 *
 * - Item interactions
 * - Items
 * - Users
 * - Action interactions
 * - Actions
 *
 * Each dataset type has an associated schema with required field types. Only the `Item interactions` dataset is required in order to train a model (also referred to as creating a solution).
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html
 */
export class CfnDataset extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Personalize::Dataset";

  /**
   * Build a CfnDataset from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataset {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDatasetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDataset(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the dataset.
   *
   * @cloudformationAttribute DatasetArn
   */
  public readonly attrDatasetArn: string;

  /**
   * The Amazon Resource Name (ARN) of the dataset group.
   */
  public datasetGroupArn: string;

  /**
   * Describes a job that imports training data from a data source (Amazon S3 bucket) to an Amazon Personalize dataset.
   */
  public datasetImportJob?: CfnDataset.DatasetImportJobProperty | cdk.IResolvable;

  /**
   * One of the following values:.
   */
  public datasetType: string;

  /**
   * The name of the dataset.
   */
  public name: string;

  /**
   * The ARN of the associated schema.
   */
  public schemaArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDatasetProps) {
    super(scope, id, {
      "type": CfnDataset.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "datasetGroupArn", this);
    cdk.requireProperty(props, "datasetType", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "schemaArn", this);

    this.attrDatasetArn = cdk.Token.asString(this.getAtt("DatasetArn", cdk.ResolutionTypeHint.STRING));
    this.datasetGroupArn = props.datasetGroupArn;
    this.datasetImportJob = props.datasetImportJob;
    this.datasetType = props.datasetType;
    this.name = props.name;
    this.schemaArn = props.schemaArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "datasetGroupArn": this.datasetGroupArn,
      "datasetImportJob": this.datasetImportJob,
      "datasetType": this.datasetType,
      "name": this.name,
      "schemaArn": this.schemaArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataset.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDatasetPropsToCloudFormation(props);
  }
}

export namespace CfnDataset {
  /**
   * Describes a job that imports training data from a data source (Amazon S3 bucket) to an Amazon Personalize dataset.
   *
   * A dataset import job can be in one of the following states:
   *
   * - CREATE PENDING > CREATE IN_PROGRESS > ACTIVE -or- CREATE FAILED
   *
   * If you specify a dataset import job as part of a dataset, all dataset import job fields are required.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html
   */
  export interface DatasetImportJobProperty {
    /**
     * The Amazon Resource Name (ARN) of the dataset that receives the imported data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html#cfn-personalize-dataset-datasetimportjob-datasetarn
     */
    readonly datasetArn?: string;

    /**
     * The ARN of the dataset import job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html#cfn-personalize-dataset-datasetimportjob-datasetimportjobarn
     */
    readonly datasetImportJobArn?: string;

    /**
     * The Amazon S3 bucket that contains the training data to import.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html#cfn-personalize-dataset-datasetimportjob-datasource
     */
    readonly dataSource?: any | cdk.IResolvable;

    /**
     * The name of the import job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html#cfn-personalize-dataset-datasetimportjob-jobname
     */
    readonly jobName?: string;

    /**
     * The ARN of the IAM role that has permissions to read from the Amazon S3 data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html#cfn-personalize-dataset-datasetimportjob-rolearn
     */
    readonly roleArn?: string;
  }

  /**
   * Describes the data source that contains the data to upload to a dataset.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasource.html
   */
  export interface DataSourceProperty {
    /**
     * The path to the Amazon S3 bucket where the data that you want to upload to your dataset is stored.
     *
     * For example:
     *
     * `s3://bucket-name/folder-name/`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasource.html#cfn-personalize-dataset-datasource-datalocation
     */
    readonly dataLocation?: string;
  }
}

/**
 * Properties for defining a `CfnDataset`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html
 */
export interface CfnDatasetProps {
  /**
   * The Amazon Resource Name (ARN) of the dataset group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-datasetgrouparn
   */
  readonly datasetGroupArn: string;

  /**
   * Describes a job that imports training data from a data source (Amazon S3 bucket) to an Amazon Personalize dataset.
   *
   * If you specify a dataset import job as part of a dataset, all dataset import job fields are required.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-datasetimportjob
   */
  readonly datasetImportJob?: CfnDataset.DatasetImportJobProperty | cdk.IResolvable;

  /**
   * One of the following values:.
   *
   * - Interactions
   * - Items
   * - Users
   * - Actions
   * - Action_Interactions
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-datasettype
   */
  readonly datasetType: string;

  /**
   * The name of the dataset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-name
   */
  readonly name: string;

  /**
   * The ARN of the associated schema.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-schemaarn
   */
  readonly schemaArn: string;
}

/**
 * Determine whether the given properties match those of a `DatasetImportJobProperty`
 *
 * @param properties - the TypeScript properties of a `DatasetImportJobProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetDatasetImportJobPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataSource", cdk.validateObject)(properties.dataSource));
  errors.collect(cdk.propertyValidator("datasetArn", cdk.validateString)(properties.datasetArn));
  errors.collect(cdk.propertyValidator("datasetImportJobArn", cdk.validateString)(properties.datasetImportJobArn));
  errors.collect(cdk.propertyValidator("jobName", cdk.validateString)(properties.jobName));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"DatasetImportJobProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetDatasetImportJobPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetDatasetImportJobPropertyValidator(properties).assertSuccess();
  return {
    "DataSource": cdk.objectToCloudFormation(properties.dataSource),
    "DatasetArn": cdk.stringToCloudFormation(properties.datasetArn),
    "DatasetImportJobArn": cdk.stringToCloudFormation(properties.datasetImportJobArn),
    "JobName": cdk.stringToCloudFormation(properties.jobName),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnDatasetDatasetImportJobPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DatasetImportJobProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DatasetImportJobProperty>();
  ret.addPropertyResult("datasetArn", "DatasetArn", (properties.DatasetArn != null ? cfn_parse.FromCloudFormation.getString(properties.DatasetArn) : undefined));
  ret.addPropertyResult("datasetImportJobArn", "DatasetImportJobArn", (properties.DatasetImportJobArn != null ? cfn_parse.FromCloudFormation.getString(properties.DatasetImportJobArn) : undefined));
  ret.addPropertyResult("dataSource", "DataSource", (properties.DataSource != null ? cfn_parse.FromCloudFormation.getAny(properties.DataSource) : undefined));
  ret.addPropertyResult("jobName", "JobName", (properties.JobName != null ? cfn_parse.FromCloudFormation.getString(properties.JobName) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDatasetProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatasetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("datasetGroupArn", cdk.requiredValidator)(properties.datasetGroupArn));
  errors.collect(cdk.propertyValidator("datasetGroupArn", cdk.validateString)(properties.datasetGroupArn));
  errors.collect(cdk.propertyValidator("datasetImportJob", CfnDatasetDatasetImportJobPropertyValidator)(properties.datasetImportJob));
  errors.collect(cdk.propertyValidator("datasetType", cdk.requiredValidator)(properties.datasetType));
  errors.collect(cdk.propertyValidator("datasetType", cdk.validateString)(properties.datasetType));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("schemaArn", cdk.requiredValidator)(properties.schemaArn));
  errors.collect(cdk.propertyValidator("schemaArn", cdk.validateString)(properties.schemaArn));
  return errors.wrap("supplied properties not correct for \"CfnDatasetProps\"");
}

// @ts-ignore TS6133
function convertCfnDatasetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetPropsValidator(properties).assertSuccess();
  return {
    "DatasetGroupArn": cdk.stringToCloudFormation(properties.datasetGroupArn),
    "DatasetImportJob": convertCfnDatasetDatasetImportJobPropertyToCloudFormation(properties.datasetImportJob),
    "DatasetType": cdk.stringToCloudFormation(properties.datasetType),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SchemaArn": cdk.stringToCloudFormation(properties.schemaArn)
  };
}

// @ts-ignore TS6133
function CfnDatasetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatasetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatasetProps>();
  ret.addPropertyResult("datasetGroupArn", "DatasetGroupArn", (properties.DatasetGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.DatasetGroupArn) : undefined));
  ret.addPropertyResult("datasetImportJob", "DatasetImportJob", (properties.DatasetImportJob != null ? CfnDatasetDatasetImportJobPropertyFromCloudFormation(properties.DatasetImportJob) : undefined));
  ret.addPropertyResult("datasetType", "DatasetType", (properties.DatasetType != null ? cfn_parse.FromCloudFormation.getString(properties.DatasetType) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("schemaArn", "SchemaArn", (properties.SchemaArn != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataSourceProperty`
 *
 * @param properties - the TypeScript properties of a `DataSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetDataSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataLocation", cdk.validateString)(properties.dataLocation));
  return errors.wrap("supplied properties not correct for \"DataSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetDataSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetDataSourcePropertyValidator(properties).assertSuccess();
  return {
    "DataLocation": cdk.stringToCloudFormation(properties.dataLocation)
  };
}

// @ts-ignore TS6133
function CfnDatasetDataSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DataSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DataSourceProperty>();
  ret.addPropertyResult("dataLocation", "DataLocation", (properties.DataLocation != null ? cfn_parse.FromCloudFormation.getString(properties.DataLocation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A dataset group is a collection of related datasets (Item interactions, Users, Items, Actions, Action interactions).
 *
 * You create a dataset group by calling [CreateDatasetGroup](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateDatasetGroup.html) . You then create a dataset and add it to a dataset group by calling [CreateDataset](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateDataset.html) . The dataset group is used to create and train a solution by calling [CreateSolution](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateSolution.html) . A dataset group can contain only one of each type of dataset.
 *
 * You can specify an AWS Key Management Service (KMS) key to encrypt the datasets in the group.
 *
 * @cloudformationResource AWS::Personalize::DatasetGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html
 */
export class CfnDatasetGroup extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Personalize::DatasetGroup";

  /**
   * Build a CfnDatasetGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDatasetGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDatasetGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDatasetGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the dataset group.
   *
   * @cloudformationAttribute DatasetGroupArn
   */
  public readonly attrDatasetGroupArn: string;

  /**
   * The domain of a Domain dataset group.
   */
  public domain?: string;

  /**
   * The Amazon Resource Name (ARN) of the AWS Key Management Service (KMS) key used to encrypt the datasets.
   */
  public kmsKeyArn?: string;

  /**
   * The name of the dataset group.
   */
  public name: string;

  /**
   * The ARN of the AWS Identity and Access Management (IAM) role that has permissions to access the AWS Key Management Service (KMS) key.
   */
  public roleArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDatasetGroupProps) {
    super(scope, id, {
      "type": CfnDatasetGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrDatasetGroupArn = cdk.Token.asString(this.getAtt("DatasetGroupArn", cdk.ResolutionTypeHint.STRING));
    this.domain = props.domain;
    this.kmsKeyArn = props.kmsKeyArn;
    this.name = props.name;
    this.roleArn = props.roleArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "domain": this.domain,
      "kmsKeyArn": this.kmsKeyArn,
      "name": this.name,
      "roleArn": this.roleArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDatasetGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDatasetGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDatasetGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html
 */
export interface CfnDatasetGroupProps {
  /**
   * The domain of a Domain dataset group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-domain
   */
  readonly domain?: string;

  /**
   * The Amazon Resource Name (ARN) of the AWS Key Management Service (KMS) key used to encrypt the datasets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-kmskeyarn
   */
  readonly kmsKeyArn?: string;

  /**
   * The name of the dataset group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-name
   */
  readonly name: string;

  /**
   * The ARN of the AWS Identity and Access Management (IAM) role that has permissions to access the AWS Key Management Service (KMS) key.
   *
   * Supplying an IAM role is only valid when also specifying a KMS key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-rolearn
   */
  readonly roleArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnDatasetGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatasetGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("domain", cdk.validateString)(properties.domain));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CfnDatasetGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnDatasetGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetGroupPropsValidator(properties).assertSuccess();
  return {
    "Domain": cdk.stringToCloudFormation(properties.domain),
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnDatasetGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatasetGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatasetGroupProps>();
  ret.addPropertyResult("domain", "Domain", (properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined));
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an Amazon Personalize schema from the specified schema string.
 *
 * The schema you create must be in Avro JSON format.
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html
 */
export class CfnSchema extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Personalize::Schema";

  /**
   * Build a CfnSchema from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSchema {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSchemaPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSchema(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the schema.
   *
   * @cloudformationAttribute SchemaArn
   */
  public readonly attrSchemaArn: string;

  /**
   * The domain of a schema that you created for a dataset in a Domain dataset group.
   */
  public domain?: string;

  /**
   * The name of the schema.
   */
  public name: string;

  /**
   * The schema.
   */
  public schema: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSchemaProps) {
    super(scope, id, {
      "type": CfnSchema.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "schema", this);

    this.attrSchemaArn = cdk.Token.asString(this.getAtt("SchemaArn", cdk.ResolutionTypeHint.STRING));
    this.domain = props.domain;
    this.name = props.name;
    this.schema = props.schema;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "domain": this.domain,
      "name": this.name,
      "schema": this.schema
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSchema.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSchemaPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSchema`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html
 */
export interface CfnSchemaProps {
  /**
   * The domain of a schema that you created for a dataset in a Domain dataset group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html#cfn-personalize-schema-domain
   */
  readonly domain?: string;

  /**
   * The name of the schema.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html#cfn-personalize-schema-name
   */
  readonly name: string;

  /**
   * The schema.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html#cfn-personalize-schema-schema
   */
  readonly schema: string;
}

/**
 * Determine whether the given properties match those of a `CfnSchemaProps`
 *
 * @param properties - the TypeScript properties of a `CfnSchemaProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchemaPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("domain", cdk.validateString)(properties.domain));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("schema", cdk.requiredValidator)(properties.schema));
  errors.collect(cdk.propertyValidator("schema", cdk.validateString)(properties.schema));
  return errors.wrap("supplied properties not correct for \"CfnSchemaProps\"");
}

// @ts-ignore TS6133
function convertCfnSchemaPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchemaPropsValidator(properties).assertSuccess();
  return {
    "Domain": cdk.stringToCloudFormation(properties.domain),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Schema": cdk.stringToCloudFormation(properties.schema)
  };
}

// @ts-ignore TS6133
function CfnSchemaPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchemaProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchemaProps>();
  ret.addPropertyResult("domain", "Domain", (properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("schema", "Schema", (properties.Schema != null ? cfn_parse.FromCloudFormation.getString(properties.Schema) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * An object that provides information about a solution.
 *
 * A solution is a trained model that can be deployed as a campaign.
 *
 * @cloudformationResource AWS::Personalize::Solution
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html
 */
export class CfnSolution extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Personalize::Solution";

  /**
   * Build a CfnSolution from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSolution {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSolutionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSolution(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the solution.
   *
   * @cloudformationAttribute SolutionArn
   */
  public readonly attrSolutionArn: string;

  /**
   * The Amazon Resource Name (ARN) of the dataset group that provides the training data.
   */
  public datasetGroupArn: string;

  /**
   * The event type (for example, 'click' or 'like') that is used for training the model.
   */
  public eventType?: string;

  /**
   * The name of the solution.
   */
  public name: string;

  /**
   * > We don't recommend enabling automated machine learning.
   */
  public performAutoMl?: boolean | cdk.IResolvable;

  /**
   * Whether to perform hyperparameter optimization (HPO) on the chosen recipe.
   */
  public performHpo?: boolean | cdk.IResolvable;

  /**
   * The ARN of the recipe used to create the solution.
   */
  public recipeArn?: string;

  /**
   * Describes the configuration properties for the solution.
   */
  public solutionConfig?: cdk.IResolvable | CfnSolution.SolutionConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSolutionProps) {
    super(scope, id, {
      "type": CfnSolution.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "datasetGroupArn", this);
    cdk.requireProperty(props, "name", this);

    this.attrSolutionArn = cdk.Token.asString(this.getAtt("SolutionArn", cdk.ResolutionTypeHint.STRING));
    this.datasetGroupArn = props.datasetGroupArn;
    this.eventType = props.eventType;
    this.name = props.name;
    this.performAutoMl = props.performAutoMl;
    this.performHpo = props.performHpo;
    this.recipeArn = props.recipeArn;
    this.solutionConfig = props.solutionConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "datasetGroupArn": this.datasetGroupArn,
      "eventType": this.eventType,
      "name": this.name,
      "performAutoMl": this.performAutoMl,
      "performHpo": this.performHpo,
      "recipeArn": this.recipeArn,
      "solutionConfig": this.solutionConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSolution.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSolutionPropsToCloudFormation(props);
  }
}

export namespace CfnSolution {
  /**
   * Describes the configuration properties for the solution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html
   */
  export interface SolutionConfigProperty {
    /**
     * Lists the algorithm hyperparameters and their values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html#cfn-personalize-solution-solutionconfig-algorithmhyperparameters
     */
    readonly algorithmHyperParameters?: cdk.IResolvable | Record<string, string>;

    /**
     * The [AutoMLConfig](https://docs.aws.amazon.com/personalize/latest/dg/API_AutoMLConfig.html) object containing a list of recipes to search when AutoML is performed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html#cfn-personalize-solution-solutionconfig-automlconfig
     */
    readonly autoMlConfig?: any | cdk.IResolvable;

    /**
     * Only events with a value greater than or equal to this threshold are used for training a model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html#cfn-personalize-solution-solutionconfig-eventvaluethreshold
     */
    readonly eventValueThreshold?: string;

    /**
     * Lists the feature transformation parameters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html#cfn-personalize-solution-solutionconfig-featuretransformationparameters
     */
    readonly featureTransformationParameters?: cdk.IResolvable | Record<string, string>;

    /**
     * Describes the properties for hyperparameter optimization (HPO).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html#cfn-personalize-solution-solutionconfig-hpoconfig
     */
    readonly hpoConfig?: any | cdk.IResolvable;
  }

  /**
   * Specifies the hyperparameters and their ranges.
   *
   * Hyperparameters can be categorical, continuous, or integer-valued.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-algorithmhyperparameterranges.html
   */
  export interface AlgorithmHyperParameterRangesProperty {
    /**
     * Provides the name and range of a categorical hyperparameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-algorithmhyperparameterranges.html#cfn-personalize-solution-algorithmhyperparameterranges-categoricalhyperparameterranges
     */
    readonly categoricalHyperParameterRanges?: Array<CfnSolution.CategoricalHyperParameterRangeProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Provides the name and range of a continuous hyperparameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-algorithmhyperparameterranges.html#cfn-personalize-solution-algorithmhyperparameterranges-continuoushyperparameterranges
     */
    readonly continuousHyperParameterRanges?: Array<CfnSolution.ContinuousHyperParameterRangeProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Provides the name and range of an integer-valued hyperparameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-algorithmhyperparameterranges.html#cfn-personalize-solution-algorithmhyperparameterranges-integerhyperparameterranges
     */
    readonly integerHyperParameterRanges?: Array<CfnSolution.IntegerHyperParameterRangeProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Provides the name and range of an integer-valued hyperparameter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-integerhyperparameterrange.html
   */
  export interface IntegerHyperParameterRangeProperty {
    /**
     * The maximum allowable value for the hyperparameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-integerhyperparameterrange.html#cfn-personalize-solution-integerhyperparameterrange-maxvalue
     */
    readonly maxValue?: number;

    /**
     * The minimum allowable value for the hyperparameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-integerhyperparameterrange.html#cfn-personalize-solution-integerhyperparameterrange-minvalue
     */
    readonly minValue?: number;

    /**
     * The name of the hyperparameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-integerhyperparameterrange.html#cfn-personalize-solution-integerhyperparameterrange-name
     */
    readonly name?: string;
  }

  /**
   * Provides the name and range of a categorical hyperparameter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-categoricalhyperparameterrange.html
   */
  export interface CategoricalHyperParameterRangeProperty {
    /**
     * The name of the hyperparameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-categoricalhyperparameterrange.html#cfn-personalize-solution-categoricalhyperparameterrange-name
     */
    readonly name?: string;

    /**
     * A list of the categories for the hyperparameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-categoricalhyperparameterrange.html#cfn-personalize-solution-categoricalhyperparameterrange-values
     */
    readonly values?: Array<string>;
  }

  /**
   * Provides the name and range of a continuous hyperparameter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-continuoushyperparameterrange.html
   */
  export interface ContinuousHyperParameterRangeProperty {
    /**
     * The maximum allowable value for the hyperparameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-continuoushyperparameterrange.html#cfn-personalize-solution-continuoushyperparameterrange-maxvalue
     */
    readonly maxValue?: number;

    /**
     * The minimum allowable value for the hyperparameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-continuoushyperparameterrange.html#cfn-personalize-solution-continuoushyperparameterrange-minvalue
     */
    readonly minValue?: number;

    /**
     * The name of the hyperparameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-continuoushyperparameterrange.html#cfn-personalize-solution-continuoushyperparameterrange-name
     */
    readonly name?: string;
  }

  /**
   * When the solution performs AutoML ( `performAutoML` is true in [CreateSolution](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateSolution.html) ), Amazon Personalize determines which recipe, from the specified list, optimizes the given metric. Amazon Personalize then uses that recipe for the solution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-automlconfig.html
   */
  export interface AutoMLConfigProperty {
    /**
     * The metric to optimize.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-automlconfig.html#cfn-personalize-solution-automlconfig-metricname
     */
    readonly metricName?: string;

    /**
     * The list of candidate recipes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-automlconfig.html#cfn-personalize-solution-automlconfig-recipelist
     */
    readonly recipeList?: Array<string>;
  }

  /**
   * Describes the properties for hyperparameter optimization (HPO).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoconfig.html
   */
  export interface HpoConfigProperty {
    /**
     * The hyperparameters and their allowable ranges.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoconfig.html#cfn-personalize-solution-hpoconfig-algorithmhyperparameterranges
     */
    readonly algorithmHyperParameterRanges?: CfnSolution.AlgorithmHyperParameterRangesProperty | cdk.IResolvable;

    /**
     * The metric to optimize during HPO.
     *
     * > Amazon Personalize doesn't support configuring the `hpoObjective` at this time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoconfig.html#cfn-personalize-solution-hpoconfig-hpoobjective
     */
    readonly hpoObjective?: CfnSolution.HpoObjectiveProperty | cdk.IResolvable;

    /**
     * Describes the resource configuration for HPO.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoconfig.html#cfn-personalize-solution-hpoconfig-hporesourceconfig
     */
    readonly hpoResourceConfig?: CfnSolution.HpoResourceConfigProperty | cdk.IResolvable;
  }

  /**
   * Describes the resource configuration for hyperparameter optimization (HPO).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hporesourceconfig.html
   */
  export interface HpoResourceConfigProperty {
    /**
     * The maximum number of training jobs when you create a solution version.
     *
     * The maximum value for `maxNumberOfTrainingJobs` is `40` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hporesourceconfig.html#cfn-personalize-solution-hporesourceconfig-maxnumberoftrainingjobs
     */
    readonly maxNumberOfTrainingJobs?: string;

    /**
     * The maximum number of parallel training jobs when you create a solution version.
     *
     * The maximum value for `maxParallelTrainingJobs` is `10` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hporesourceconfig.html#cfn-personalize-solution-hporesourceconfig-maxparalleltrainingjobs
     */
    readonly maxParallelTrainingJobs?: string;
  }

  /**
   * The metric to optimize during hyperparameter optimization (HPO).
   *
   * > Amazon Personalize doesn't support configuring the `hpoObjective` at this time.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoobjective.html
   */
  export interface HpoObjectiveProperty {
    /**
     * The name of the metric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoobjective.html#cfn-personalize-solution-hpoobjective-metricname
     */
    readonly metricName?: string;

    /**
     * A regular expression for finding the metric in the training job logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoobjective.html#cfn-personalize-solution-hpoobjective-metricregex
     */
    readonly metricRegex?: string;

    /**
     * The type of the metric.
     *
     * Valid values are `Maximize` and `Minimize` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoobjective.html#cfn-personalize-solution-hpoobjective-type
     */
    readonly type?: string;
  }
}

/**
 * Properties for defining a `CfnSolution`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html
 */
export interface CfnSolutionProps {
  /**
   * The Amazon Resource Name (ARN) of the dataset group that provides the training data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-datasetgrouparn
   */
  readonly datasetGroupArn: string;

  /**
   * The event type (for example, 'click' or 'like') that is used for training the model.
   *
   * If no `eventType` is provided, Amazon Personalize uses all interactions for training with equal weight regardless of type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-eventtype
   */
  readonly eventType?: string;

  /**
   * The name of the solution.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-name
   */
  readonly name: string;

  /**
   * > We don't recommend enabling automated machine learning.
   *
   * Instead, match your use case to the available Amazon Personalize recipes. For more information, see [Determining your use case.](https://docs.aws.amazon.com/personalize/latest/dg/determining-use-case.html)
   *
   * When true, Amazon Personalize performs a search for the best USER_PERSONALIZATION recipe from the list specified in the solution configuration ( `recipeArn` must not be specified). When false (the default), Amazon Personalize uses `recipeArn` for training.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-performautoml
   */
  readonly performAutoMl?: boolean | cdk.IResolvable;

  /**
   * Whether to perform hyperparameter optimization (HPO) on the chosen recipe.
   *
   * The default is `false` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-performhpo
   */
  readonly performHpo?: boolean | cdk.IResolvable;

  /**
   * The ARN of the recipe used to create the solution.
   *
   * This is required when `performAutoML` is false.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-recipearn
   */
  readonly recipeArn?: string;

  /**
   * Describes the configuration properties for the solution.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-solutionconfig
   */
  readonly solutionConfig?: cdk.IResolvable | CfnSolution.SolutionConfigProperty;
}

/**
 * Determine whether the given properties match those of a `SolutionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SolutionConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSolutionSolutionConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("algorithmHyperParameters", cdk.hashValidator(cdk.validateString))(properties.algorithmHyperParameters));
  errors.collect(cdk.propertyValidator("autoMlConfig", cdk.validateObject)(properties.autoMlConfig));
  errors.collect(cdk.propertyValidator("eventValueThreshold", cdk.validateString)(properties.eventValueThreshold));
  errors.collect(cdk.propertyValidator("featureTransformationParameters", cdk.hashValidator(cdk.validateString))(properties.featureTransformationParameters));
  errors.collect(cdk.propertyValidator("hpoConfig", cdk.validateObject)(properties.hpoConfig));
  return errors.wrap("supplied properties not correct for \"SolutionConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnSolutionSolutionConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSolutionSolutionConfigPropertyValidator(properties).assertSuccess();
  return {
    "AlgorithmHyperParameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.algorithmHyperParameters),
    "AutoMLConfig": cdk.objectToCloudFormation(properties.autoMlConfig),
    "EventValueThreshold": cdk.stringToCloudFormation(properties.eventValueThreshold),
    "FeatureTransformationParameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.featureTransformationParameters),
    "HpoConfig": cdk.objectToCloudFormation(properties.hpoConfig)
  };
}

// @ts-ignore TS6133
function CfnSolutionSolutionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSolution.SolutionConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.SolutionConfigProperty>();
  ret.addPropertyResult("algorithmHyperParameters", "AlgorithmHyperParameters", (properties.AlgorithmHyperParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AlgorithmHyperParameters) : undefined));
  ret.addPropertyResult("autoMlConfig", "AutoMLConfig", (properties.AutoMLConfig != null ? cfn_parse.FromCloudFormation.getAny(properties.AutoMLConfig) : undefined));
  ret.addPropertyResult("eventValueThreshold", "EventValueThreshold", (properties.EventValueThreshold != null ? cfn_parse.FromCloudFormation.getString(properties.EventValueThreshold) : undefined));
  ret.addPropertyResult("featureTransformationParameters", "FeatureTransformationParameters", (properties.FeatureTransformationParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.FeatureTransformationParameters) : undefined));
  ret.addPropertyResult("hpoConfig", "HpoConfig", (properties.HpoConfig != null ? cfn_parse.FromCloudFormation.getAny(properties.HpoConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSolutionProps`
 *
 * @param properties - the TypeScript properties of a `CfnSolutionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSolutionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("datasetGroupArn", cdk.requiredValidator)(properties.datasetGroupArn));
  errors.collect(cdk.propertyValidator("datasetGroupArn", cdk.validateString)(properties.datasetGroupArn));
  errors.collect(cdk.propertyValidator("eventType", cdk.validateString)(properties.eventType));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("performAutoMl", cdk.validateBoolean)(properties.performAutoMl));
  errors.collect(cdk.propertyValidator("performHpo", cdk.validateBoolean)(properties.performHpo));
  errors.collect(cdk.propertyValidator("recipeArn", cdk.validateString)(properties.recipeArn));
  errors.collect(cdk.propertyValidator("solutionConfig", CfnSolutionSolutionConfigPropertyValidator)(properties.solutionConfig));
  return errors.wrap("supplied properties not correct for \"CfnSolutionProps\"");
}

// @ts-ignore TS6133
function convertCfnSolutionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSolutionPropsValidator(properties).assertSuccess();
  return {
    "DatasetGroupArn": cdk.stringToCloudFormation(properties.datasetGroupArn),
    "EventType": cdk.stringToCloudFormation(properties.eventType),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PerformAutoML": cdk.booleanToCloudFormation(properties.performAutoMl),
    "PerformHPO": cdk.booleanToCloudFormation(properties.performHpo),
    "RecipeArn": cdk.stringToCloudFormation(properties.recipeArn),
    "SolutionConfig": convertCfnSolutionSolutionConfigPropertyToCloudFormation(properties.solutionConfig)
  };
}

// @ts-ignore TS6133
function CfnSolutionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolutionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolutionProps>();
  ret.addPropertyResult("datasetGroupArn", "DatasetGroupArn", (properties.DatasetGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.DatasetGroupArn) : undefined));
  ret.addPropertyResult("eventType", "EventType", (properties.EventType != null ? cfn_parse.FromCloudFormation.getString(properties.EventType) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("performAutoMl", "PerformAutoML", (properties.PerformAutoML != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PerformAutoML) : undefined));
  ret.addPropertyResult("performHpo", "PerformHPO", (properties.PerformHPO != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PerformHPO) : undefined));
  ret.addPropertyResult("recipeArn", "RecipeArn", (properties.RecipeArn != null ? cfn_parse.FromCloudFormation.getString(properties.RecipeArn) : undefined));
  ret.addPropertyResult("solutionConfig", "SolutionConfig", (properties.SolutionConfig != null ? CfnSolutionSolutionConfigPropertyFromCloudFormation(properties.SolutionConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IntegerHyperParameterRangeProperty`
 *
 * @param properties - the TypeScript properties of a `IntegerHyperParameterRangeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSolutionIntegerHyperParameterRangePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxValue", cdk.validateNumber)(properties.maxValue));
  errors.collect(cdk.propertyValidator("minValue", cdk.validateNumber)(properties.minValue));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"IntegerHyperParameterRangeProperty\"");
}

// @ts-ignore TS6133
function convertCfnSolutionIntegerHyperParameterRangePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSolutionIntegerHyperParameterRangePropertyValidator(properties).assertSuccess();
  return {
    "MaxValue": cdk.numberToCloudFormation(properties.maxValue),
    "MinValue": cdk.numberToCloudFormation(properties.minValue),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnSolutionIntegerHyperParameterRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.IntegerHyperParameterRangeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.IntegerHyperParameterRangeProperty>();
  ret.addPropertyResult("maxValue", "MaxValue", (properties.MaxValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxValue) : undefined));
  ret.addPropertyResult("minValue", "MinValue", (properties.MinValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinValue) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CategoricalHyperParameterRangeProperty`
 *
 * @param properties - the TypeScript properties of a `CategoricalHyperParameterRangeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSolutionCategoricalHyperParameterRangePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"CategoricalHyperParameterRangeProperty\"");
}

// @ts-ignore TS6133
function convertCfnSolutionCategoricalHyperParameterRangePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSolutionCategoricalHyperParameterRangePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnSolutionCategoricalHyperParameterRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.CategoricalHyperParameterRangeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.CategoricalHyperParameterRangeProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ContinuousHyperParameterRangeProperty`
 *
 * @param properties - the TypeScript properties of a `ContinuousHyperParameterRangeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSolutionContinuousHyperParameterRangePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxValue", cdk.validateNumber)(properties.maxValue));
  errors.collect(cdk.propertyValidator("minValue", cdk.validateNumber)(properties.minValue));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"ContinuousHyperParameterRangeProperty\"");
}

// @ts-ignore TS6133
function convertCfnSolutionContinuousHyperParameterRangePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSolutionContinuousHyperParameterRangePropertyValidator(properties).assertSuccess();
  return {
    "MaxValue": cdk.numberToCloudFormation(properties.maxValue),
    "MinValue": cdk.numberToCloudFormation(properties.minValue),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnSolutionContinuousHyperParameterRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.ContinuousHyperParameterRangeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.ContinuousHyperParameterRangeProperty>();
  ret.addPropertyResult("maxValue", "MaxValue", (properties.MaxValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxValue) : undefined));
  ret.addPropertyResult("minValue", "MinValue", (properties.MinValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinValue) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AlgorithmHyperParameterRangesProperty`
 *
 * @param properties - the TypeScript properties of a `AlgorithmHyperParameterRangesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSolutionAlgorithmHyperParameterRangesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("categoricalHyperParameterRanges", cdk.listValidator(CfnSolutionCategoricalHyperParameterRangePropertyValidator))(properties.categoricalHyperParameterRanges));
  errors.collect(cdk.propertyValidator("continuousHyperParameterRanges", cdk.listValidator(CfnSolutionContinuousHyperParameterRangePropertyValidator))(properties.continuousHyperParameterRanges));
  errors.collect(cdk.propertyValidator("integerHyperParameterRanges", cdk.listValidator(CfnSolutionIntegerHyperParameterRangePropertyValidator))(properties.integerHyperParameterRanges));
  return errors.wrap("supplied properties not correct for \"AlgorithmHyperParameterRangesProperty\"");
}

// @ts-ignore TS6133
function convertCfnSolutionAlgorithmHyperParameterRangesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSolutionAlgorithmHyperParameterRangesPropertyValidator(properties).assertSuccess();
  return {
    "CategoricalHyperParameterRanges": cdk.listMapper(convertCfnSolutionCategoricalHyperParameterRangePropertyToCloudFormation)(properties.categoricalHyperParameterRanges),
    "ContinuousHyperParameterRanges": cdk.listMapper(convertCfnSolutionContinuousHyperParameterRangePropertyToCloudFormation)(properties.continuousHyperParameterRanges),
    "IntegerHyperParameterRanges": cdk.listMapper(convertCfnSolutionIntegerHyperParameterRangePropertyToCloudFormation)(properties.integerHyperParameterRanges)
  };
}

// @ts-ignore TS6133
function CfnSolutionAlgorithmHyperParameterRangesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.AlgorithmHyperParameterRangesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.AlgorithmHyperParameterRangesProperty>();
  ret.addPropertyResult("categoricalHyperParameterRanges", "CategoricalHyperParameterRanges", (properties.CategoricalHyperParameterRanges != null ? cfn_parse.FromCloudFormation.getArray(CfnSolutionCategoricalHyperParameterRangePropertyFromCloudFormation)(properties.CategoricalHyperParameterRanges) : undefined));
  ret.addPropertyResult("continuousHyperParameterRanges", "ContinuousHyperParameterRanges", (properties.ContinuousHyperParameterRanges != null ? cfn_parse.FromCloudFormation.getArray(CfnSolutionContinuousHyperParameterRangePropertyFromCloudFormation)(properties.ContinuousHyperParameterRanges) : undefined));
  ret.addPropertyResult("integerHyperParameterRanges", "IntegerHyperParameterRanges", (properties.IntegerHyperParameterRanges != null ? cfn_parse.FromCloudFormation.getArray(CfnSolutionIntegerHyperParameterRangePropertyFromCloudFormation)(properties.IntegerHyperParameterRanges) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutoMLConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AutoMLConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSolutionAutoMLConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("recipeList", cdk.listValidator(cdk.validateString))(properties.recipeList));
  return errors.wrap("supplied properties not correct for \"AutoMLConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnSolutionAutoMLConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSolutionAutoMLConfigPropertyValidator(properties).assertSuccess();
  return {
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "RecipeList": cdk.listMapper(cdk.stringToCloudFormation)(properties.recipeList)
  };
}

// @ts-ignore TS6133
function CfnSolutionAutoMLConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.AutoMLConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.AutoMLConfigProperty>();
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("recipeList", "RecipeList", (properties.RecipeList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.RecipeList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HpoResourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HpoResourceConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSolutionHpoResourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxNumberOfTrainingJobs", cdk.validateString)(properties.maxNumberOfTrainingJobs));
  errors.collect(cdk.propertyValidator("maxParallelTrainingJobs", cdk.validateString)(properties.maxParallelTrainingJobs));
  return errors.wrap("supplied properties not correct for \"HpoResourceConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnSolutionHpoResourceConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSolutionHpoResourceConfigPropertyValidator(properties).assertSuccess();
  return {
    "MaxNumberOfTrainingJobs": cdk.stringToCloudFormation(properties.maxNumberOfTrainingJobs),
    "MaxParallelTrainingJobs": cdk.stringToCloudFormation(properties.maxParallelTrainingJobs)
  };
}

// @ts-ignore TS6133
function CfnSolutionHpoResourceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.HpoResourceConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.HpoResourceConfigProperty>();
  ret.addPropertyResult("maxNumberOfTrainingJobs", "MaxNumberOfTrainingJobs", (properties.MaxNumberOfTrainingJobs != null ? cfn_parse.FromCloudFormation.getString(properties.MaxNumberOfTrainingJobs) : undefined));
  ret.addPropertyResult("maxParallelTrainingJobs", "MaxParallelTrainingJobs", (properties.MaxParallelTrainingJobs != null ? cfn_parse.FromCloudFormation.getString(properties.MaxParallelTrainingJobs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HpoObjectiveProperty`
 *
 * @param properties - the TypeScript properties of a `HpoObjectiveProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSolutionHpoObjectivePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricRegex", cdk.validateString)(properties.metricRegex));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"HpoObjectiveProperty\"");
}

// @ts-ignore TS6133
function convertCfnSolutionHpoObjectivePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSolutionHpoObjectivePropertyValidator(properties).assertSuccess();
  return {
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "MetricRegex": cdk.stringToCloudFormation(properties.metricRegex),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnSolutionHpoObjectivePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.HpoObjectiveProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.HpoObjectiveProperty>();
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("metricRegex", "MetricRegex", (properties.MetricRegex != null ? cfn_parse.FromCloudFormation.getString(properties.MetricRegex) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HpoConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HpoConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSolutionHpoConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("algorithmHyperParameterRanges", CfnSolutionAlgorithmHyperParameterRangesPropertyValidator)(properties.algorithmHyperParameterRanges));
  errors.collect(cdk.propertyValidator("hpoObjective", CfnSolutionHpoObjectivePropertyValidator)(properties.hpoObjective));
  errors.collect(cdk.propertyValidator("hpoResourceConfig", CfnSolutionHpoResourceConfigPropertyValidator)(properties.hpoResourceConfig));
  return errors.wrap("supplied properties not correct for \"HpoConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnSolutionHpoConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSolutionHpoConfigPropertyValidator(properties).assertSuccess();
  return {
    "AlgorithmHyperParameterRanges": convertCfnSolutionAlgorithmHyperParameterRangesPropertyToCloudFormation(properties.algorithmHyperParameterRanges),
    "HpoObjective": convertCfnSolutionHpoObjectivePropertyToCloudFormation(properties.hpoObjective),
    "HpoResourceConfig": convertCfnSolutionHpoResourceConfigPropertyToCloudFormation(properties.hpoResourceConfig)
  };
}

// @ts-ignore TS6133
function CfnSolutionHpoConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.HpoConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.HpoConfigProperty>();
  ret.addPropertyResult("algorithmHyperParameterRanges", "AlgorithmHyperParameterRanges", (properties.AlgorithmHyperParameterRanges != null ? CfnSolutionAlgorithmHyperParameterRangesPropertyFromCloudFormation(properties.AlgorithmHyperParameterRanges) : undefined));
  ret.addPropertyResult("hpoObjective", "HpoObjective", (properties.HpoObjective != null ? CfnSolutionHpoObjectivePropertyFromCloudFormation(properties.HpoObjective) : undefined));
  ret.addPropertyResult("hpoResourceConfig", "HpoResourceConfig", (properties.HpoResourceConfig != null ? CfnSolutionHpoResourceConfigPropertyFromCloudFormation(properties.HpoResourceConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}