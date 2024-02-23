/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Attaches a resource-based permission policy to a secret.
 *
 * A resource-based policy is optional. If a secret already has a resource policy attached, you must first remove it before attaching a new policy using this CloudFormation resource. You can remove the policy using the [console](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_resource-policies.html) , [CLI](https://docs.aws.amazon.com/cli/latest/reference/secretsmanager/delete-resource-policy.html) , or [API](https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_DeleteResourcePolicy.html) . For more information, see [Authentication and access control for Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access.html) .
 *
 * *Required permissions:* `secretsmanager:PutResourcePolicy` , `secretsmanager:GetResourcePolicy` . For more information, see [IAM policy actions for Secrets Manager](https://docs.aws.amazon.com/service-authorization/latest/reference/list_awssecretsmanager.html#awssecretsmanager-actions-as-permissions) and [Authentication and access control in Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access.html) .
 *
 * @cloudformationResource AWS::SecretsManager::ResourcePolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html
 */
export class CfnResourcePolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SecretsManager::ResourcePolicy";

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
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Specifies whether to block resource-based policies that allow broad access to the secret.
   */
  public blockPublicPolicy?: boolean | cdk.IResolvable;

  /**
   * A JSON-formatted string for an AWS resource-based policy.
   */
  public resourcePolicy: any | cdk.IResolvable;

  /**
   * The ARN or name of the secret to attach the resource-based policy.
   */
  public secretId: string;

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

    cdk.requireProperty(props, "resourcePolicy", this);
    cdk.requireProperty(props, "secretId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.blockPublicPolicy = props.blockPublicPolicy;
    this.resourcePolicy = props.resourcePolicy;
    this.secretId = props.secretId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "blockPublicPolicy": this.blockPublicPolicy,
      "resourcePolicy": this.resourcePolicy,
      "secretId": this.secretId
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html
 */
export interface CfnResourcePolicyProps {
  /**
   * Specifies whether to block resource-based policies that allow broad access to the secret.
   *
   * By default, Secrets Manager blocks policies that allow broad access, for example those that use a wildcard for the principal.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-blockpublicpolicy
   */
  readonly blockPublicPolicy?: boolean | cdk.IResolvable;

  /**
   * A JSON-formatted string for an AWS resource-based policy.
   *
   * For example policies, see [Permissions policy examples](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_examples.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-resourcepolicy
   */
  readonly resourcePolicy: any | cdk.IResolvable;

  /**
   * The ARN or name of the secret to attach the resource-based policy.
   *
   * For an ARN, we recommend that you specify a complete ARN rather than a partial ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-secretid
   */
  readonly secretId: string;
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
  errors.collect(cdk.propertyValidator("blockPublicPolicy", cdk.validateBoolean)(properties.blockPublicPolicy));
  errors.collect(cdk.propertyValidator("resourcePolicy", cdk.requiredValidator)(properties.resourcePolicy));
  errors.collect(cdk.propertyValidator("resourcePolicy", cdk.validateObject)(properties.resourcePolicy));
  errors.collect(cdk.propertyValidator("secretId", cdk.requiredValidator)(properties.secretId));
  errors.collect(cdk.propertyValidator("secretId", cdk.validateString)(properties.secretId));
  return errors.wrap("supplied properties not correct for \"CfnResourcePolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnResourcePolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourcePolicyPropsValidator(properties).assertSuccess();
  return {
    "BlockPublicPolicy": cdk.booleanToCloudFormation(properties.blockPublicPolicy),
    "ResourcePolicy": cdk.objectToCloudFormation(properties.resourcePolicy),
    "SecretId": cdk.stringToCloudFormation(properties.secretId)
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
  ret.addPropertyResult("blockPublicPolicy", "BlockPublicPolicy", (properties.BlockPublicPolicy != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BlockPublicPolicy) : undefined));
  ret.addPropertyResult("resourcePolicy", "ResourcePolicy", (properties.ResourcePolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.ResourcePolicy) : undefined));
  ret.addPropertyResult("secretId", "SecretId", (properties.SecretId != null ? cfn_parse.FromCloudFormation.getString(properties.SecretId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Sets the rotation schedule and Lambda rotation function for a secret. For more information, see [How rotation works](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_how.html) .
 *
 * For Amazon RDS master user credentials, see [AWS::RDS::DBCluster MasterUserSecret](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-masterusersecret.html) .
 *
 * For the rotation function, you have two options:
 *
 * - You can create a new rotation function based on one of the [Secrets Manager rotation function templates](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html) by using `HostedRotationLambda` .
 * - You can choose an existing rotation function by using `RotationLambdaARN` .
 *
 * For database secrets, if you define both the secret and the database or service in the AWS CloudFormation template, then you need to define the [AWS::SecretsManager::SecretTargetAttachment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html) resource to populate the secret with the connection details of the database or service before you attempt to configure rotation.
 *
 * @cloudformationResource AWS::SecretsManager::RotationSchedule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html
 */
export class CfnRotationSchedule extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SecretsManager::RotationSchedule";

  /**
   * Build a CfnRotationSchedule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRotationSchedule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRotationSchedulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRotationSchedule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Creates a new Lambda rotation function based on one of the [Secrets Manager rotation function templates](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html) . To use a rotation function that already exists, specify `RotationLambdaARN` instead.
   */
  public hostedRotationLambda?: CfnRotationSchedule.HostedRotationLambdaProperty | cdk.IResolvable;

  /**
   * Specifies whether to rotate the secret immediately or wait until the next scheduled rotation window.
   */
  public rotateImmediatelyOnUpdate?: boolean | cdk.IResolvable;

  /**
   * The ARN of an existing Lambda rotation function.
   */
  public rotationLambdaArn?: string;

  /**
   * A structure that defines the rotation configuration for this secret.
   */
  public rotationRules?: cdk.IResolvable | CfnRotationSchedule.RotationRulesProperty;

  /**
   * The ARN or name of the secret to rotate.
   */
  public secretId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRotationScheduleProps) {
    super(scope, id, {
      "type": CfnRotationSchedule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "secretId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.hostedRotationLambda = props.hostedRotationLambda;
    this.rotateImmediatelyOnUpdate = props.rotateImmediatelyOnUpdate;
    this.rotationLambdaArn = props.rotationLambdaArn;
    this.rotationRules = props.rotationRules;
    this.secretId = props.secretId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "hostedRotationLambda": this.hostedRotationLambda,
      "rotateImmediatelyOnUpdate": this.rotateImmediatelyOnUpdate,
      "rotationLambdaArn": this.rotationLambdaArn,
      "rotationRules": this.rotationRules,
      "secretId": this.secretId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRotationSchedule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRotationSchedulePropsToCloudFormation(props);
  }
}

export namespace CfnRotationSchedule {
  /**
   * Creates a new Lambda rotation function based on one of the [Secrets Manager rotation function templates](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html) .
   *
   * You must specify `Transform: AWS::SecretsManager-2020-07-23` at the beginning of the CloudFormation template.
   *
   * For Amazon RDS master user credentials, see [AWS::RDS::DBCluster MasterUserSecret](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-masterusersecret.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html
   */
  export interface HostedRotationLambdaProperty {
    /**
     * A string of the characters that you don't want in the password.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-excludecharacters
     */
    readonly excludeCharacters?: string;

    /**
     * The ARN of the KMS key that Secrets Manager uses to encrypt the secret.
     *
     * If you don't specify this value, then Secrets Manager uses the key `aws/secretsmanager` . If `aws/secretsmanager` doesn't yet exist, then Secrets Manager creates it for you automatically the first time it encrypts the secret value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-kmskeyarn
     */
    readonly kmsKeyArn?: string;

    /**
     * The ARN of the secret that contains superuser credentials, if you use the [Alternating users rotation strategy](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets_strategies.html#rotating-secrets-two-users) . CloudFormation grants the execution role for the Lambda rotation function `GetSecretValue` permission to the secret in this property. For more information, see [Lambda rotation function execution role permissions for Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets-required-permissions-function.html) .
     *
     * You must create the superuser secret before you can set this property.
     *
     * You must also include the superuser secret ARN as a key in the JSON of the rotating secret so that the Lambda rotation function can find it. CloudFormation does not hardcode secret ARNs in the Lambda rotation function, so you can use the function to rotate multiple secrets. For more information, see [JSON structure of Secrets Manager secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_secret_json_structure.html) .
     *
     * You can specify `MasterSecretArn` or `SuperuserSecretArn` but not both. They represent the same superuser secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-mastersecretarn
     */
    readonly masterSecretArn?: string;

    /**
     * The ARN of the KMS key that Secrets Manager used to encrypt the superuser secret, if you use the [alternating users strategy](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets_strategies.html#rotating-secrets-two-users) and the superuser secret is encrypted with a customer managed key. You don't need to specify this property if the superuser secret is encrypted using the key `aws/secretsmanager` . CloudFormation grants the execution role for the Lambda rotation function `Decrypt` , `DescribeKey` , and `GenerateDataKey` permission to the key in this property. For more information, see [Lambda rotation function execution role permissions for Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets-required-permissions-function.html) .
     *
     * You can specify `MasterSecretKmsKeyArn` or `SuperuserSecretKmsKeyArn` but not both. They represent the same superuser secret KMS key .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-mastersecretkmskeyarn
     */
    readonly masterSecretKmsKeyArn?: string;

    /**
     * The name of the Lambda rotation function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-rotationlambdaname
     */
    readonly rotationLambdaName?: string;

    /**
     * The rotation template to base the rotation function on, one of the following:.
     *
     * - `Db2SingleUser` to use the template [SecretsManagerRDSDb2RotationSingleUser](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html#sar-template-db2-singleuser) .
     * - `Db2MultiUser` to use the template [SecretsManagerRDSDb2RotationMultiUser](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html#sar-template-db2-multiuser) .
     * - `MySQLSingleUser` to use the template [SecretsManagerRDSMySQLRotationSingleUser](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html#sar-template-mysql-singleuser) .
     * - `MySQLMultiUser` to use the template [SecretsManagerRDSMySQLRotationMultiUser](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html#sar-template-mysql-multiuser) .
     * - `PostgreSQLSingleUser` to use the template [SecretsManagerRDSPostgreSQLRotationSingleUser](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html#sar-template-postgre-singleuser)
     * - `PostgreSQLMultiUser` to use the template [SecretsManagerRDSPostgreSQLRotationMultiUser](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html#sar-template-postgre-multiuser) .
     * - `OracleSingleUser` to use the template [SecretsManagerRDSOracleRotationSingleUser](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html#sar-template-oracle-singleuser) .
     * - `OracleMultiUser` to use the template [SecretsManagerRDSOracleRotationMultiUser](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html#sar-template-oracle-multiuser) .
     * - `MariaDBSingleUser` to use the template [SecretsManagerRDSMariaDBRotationSingleUser](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html#sar-template-mariadb-singleuser) .
     * - `MariaDBMultiUser` to use the template [SecretsManagerRDSMariaDBRotationMultiUser](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html#sar-template-mariadb-multiuser) .
     * - `SQLServerSingleUser` to use the template [SecretsManagerRDSSQLServerRotationSingleUser](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html#sar-template-sqlserver-singleuser) .
     * - `SQLServerMultiUser` to use the template [SecretsManagerRDSSQLServerRotationMultiUser](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html#sar-template-sqlserver-multiuser) .
     * - `RedshiftSingleUser` to use the template [SecretsManagerRedshiftRotationSingleUsr](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html#sar-template-redshift-singleuser) .
     * - `RedshiftMultiUser` to use the template [SecretsManagerRedshiftRotationMultiUser](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html#sar-template-redshift-multiuser) .
     * - `MongoDBSingleUser` to use the template [SecretsManagerMongoDBRotationSingleUser](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html#sar-template-mongodb-singleuser) .
     * - `MongoDBMultiUser` to use the template [SecretsManagerMongoDBRotationMultiUser](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html#sar-template-mongodb-multiuser) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-rotationtype
     */
    readonly rotationType: string;

    /**
     * By default, CloudFormation deploys Python 3.9 binaries for the rotation function. To use a different version of Python, you must do the following two steps:.
     *
     * - Deploy the matching version Python binaries with your rotation function.
     * - Set the version number in this field. For example, for Python 3.7, enter *python3.7*
     *
     * If you only do one of the steps, your rotation function will be incompatible with the binaries. For more information, see [Why did my Lambda rotation function fail with a "pg module not found" error](https://docs.aws.amazon.com/https://repost.aws/knowledge-center/secrets-manager-lambda-rotation) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-runtime
     */
    readonly runtime?: string;

    /**
     * The ARN of the secret that contains superuser credentials, if you use the [Alternating users rotation strategy](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets_strategies.html#rotating-secrets-two-users) . CloudFormation grants the execution role for the Lambda rotation function `GetSecretValue` permission to the secret in this property. For more information, see [Lambda rotation function execution role permissions for Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets-required-permissions-function.html) .
     *
     * You must create the superuser secret before you can set this property.
     *
     * You must also include the superuser secret ARN as a key in the JSON of the rotating secret so that the Lambda rotation function can find it. CloudFormation does not hardcode secret ARNs in the Lambda rotation function, so you can use the function to rotate multiple secrets. For more information, see [JSON structure of Secrets Manager secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_secret_json_structure.html) .
     *
     * You can specify `MasterSecretArn` or `SuperuserSecretArn` but not both. They represent the same superuser secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-superusersecretarn
     */
    readonly superuserSecretArn?: string;

    /**
     * The ARN of the KMS key that Secrets Manager used to encrypt the superuser secret, if you use the [alternating users strategy](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets_strategies.html#rotating-secrets-two-users) and the superuser secret is encrypted with a customer managed key. You don't need to specify this property if the superuser secret is encrypted using the key `aws/secretsmanager` . CloudFormation grants the execution role for the Lambda rotation function `Decrypt` , `DescribeKey` , and `GenerateDataKey` permission to the key in this property. For more information, see [Lambda rotation function execution role permissions for Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets-required-permissions-function.html) .
     *
     * You can specify `MasterSecretKmsKeyArn` or `SuperuserSecretKmsKeyArn` but not both. They represent the same superuser secret KMS key .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-superusersecretkmskeyarn
     */
    readonly superuserSecretKmsKeyArn?: string;

    /**
     * A comma-separated list of security group IDs applied to the target database.
     *
     * The template applies the same security groups as on the Lambda rotation function that is created as part of this stack.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-vpcsecuritygroupids
     */
    readonly vpcSecurityGroupIds?: string;

    /**
     * A comma separated list of VPC subnet IDs of the target database network.
     *
     * The Lambda rotation function is in the same subnet group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-vpcsubnetids
     */
    readonly vpcSubnetIds?: string;
  }

  /**
   * The rotation schedule and window.
   *
   * We recommend you use `ScheduleExpression` to set a cron or rate expression for the schedule and `Duration` to set the length of the rotation window.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-rotationrules.html
   */
  export interface RotationRulesProperty {
    /**
     * The number of days between automatic scheduled rotations of the secret.
     *
     * You can use this value to check that your secret meets your compliance guidelines for how often secrets must be rotated.
     *
     * In `DescribeSecret` and `ListSecrets` , this value is calculated from the rotation schedule after every successful rotation. In `RotateSecret` , you can set the rotation schedule in `RotationRules` with `AutomaticallyAfterDays` or `ScheduleExpression` , but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-rotationrules.html#cfn-secretsmanager-rotationschedule-rotationrules-automaticallyafterdays
     */
    readonly automaticallyAfterDays?: number;

    /**
     * The length of the rotation window in hours, for example `3h` for a three hour window.
     *
     * Secrets Manager rotates your secret at any time during this window. The window must not extend into the next rotation window or the next UTC day. The window starts according to the `ScheduleExpression` . If you don't specify a `Duration` , for a `ScheduleExpression` in hours, the window automatically closes after one hour. For a `ScheduleExpression` in days, the window automatically closes at the end of the UTC day. For more information, including examples, see [Schedule expressions in Secrets Manager rotation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_schedule.html) in the *Secrets Manager Users Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-rotationrules.html#cfn-secretsmanager-rotationschedule-rotationrules-duration
     */
    readonly duration?: string;

    /**
     * A `cron()` or `rate()` expression that defines the schedule for rotating your secret.
     *
     * Secrets Manager rotation schedules use UTC time zone. Secrets Manager rotates your secret any time during a rotation window.
     *
     * Secrets Manager `rate()` expressions represent the interval in hours or days that you want to rotate your secret, for example `rate(12 hours)` or `rate(10 days)` . You can rotate a secret as often as every four hours. If you use a `rate()` expression, the rotation window starts at midnight. For a rate in hours, the default rotation window closes after one hour. For a rate in days, the default rotation window closes at the end of the day. You can set the `Duration` to change the rotation window. The rotation window must not extend into the next UTC day or into the next rotation window.
     *
     * You can use a `cron()` expression to create a rotation schedule that is more detailed than a rotation interval. For more information, including examples, see [Schedule expressions in Secrets Manager rotation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_schedule.html) in the *Secrets Manager Users Guide* . For a cron expression that represents a schedule in hours, the default rotation window closes after one hour. For a cron expression that represents a schedule in days, the default rotation window closes at the end of the day. You can set the `Duration` to change the rotation window. The rotation window must not extend into the next UTC day or into the next rotation window.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-rotationrules.html#cfn-secretsmanager-rotationschedule-rotationrules-scheduleexpression
     */
    readonly scheduleExpression?: string;
  }
}

/**
 * Properties for defining a `CfnRotationSchedule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html
 */
export interface CfnRotationScheduleProps {
  /**
   * Creates a new Lambda rotation function based on one of the [Secrets Manager rotation function templates](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html) . To use a rotation function that already exists, specify `RotationLambdaARN` instead.
   *
   * For Amazon RDS master user credentials, see [AWS::RDS::DBCluster MasterUserSecret](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-masterusersecret.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda
   */
  readonly hostedRotationLambda?: CfnRotationSchedule.HostedRotationLambdaProperty | cdk.IResolvable;

  /**
   * Specifies whether to rotate the secret immediately or wait until the next scheduled rotation window.
   *
   * The rotation schedule is defined in `RotationRules` .
   *
   * If you don't immediately rotate the secret, Secrets Manager tests the rotation configuration by running the [`testSecret` step](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_how.html) of the Lambda rotation function. The test creates an `AWSPENDING` version of the secret and then removes it.
   *
   * If you don't specify this value, then by default, Secrets Manager rotates the secret immediately.
   *
   * Rotation is an asynchronous process. For more information, see [How rotation works](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_how.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotateimmediatelyonupdate
   */
  readonly rotateImmediatelyOnUpdate?: boolean | cdk.IResolvable;

  /**
   * The ARN of an existing Lambda rotation function.
   *
   * To specify a rotation function that is also defined in this template, use the [Ref](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref.html) function.
   *
   * For Amazon RDS master user credentials, see [AWS::RDS::DBCluster MasterUserSecret](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-masterusersecret.html) .
   *
   * To create a new rotation function based on one of the [Secrets Manager rotation function templates](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html) , specify `HostedRotationLambda` instead.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationlambdaarn
   */
  readonly rotationLambdaArn?: string;

  /**
   * A structure that defines the rotation configuration for this secret.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationrules
   */
  readonly rotationRules?: cdk.IResolvable | CfnRotationSchedule.RotationRulesProperty;

  /**
   * The ARN or name of the secret to rotate.
   *
   * To reference a secret also created in this template, use the [Ref](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref.html) function with the secret's logical ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-secretid
   */
  readonly secretId: string;
}

/**
 * Determine whether the given properties match those of a `HostedRotationLambdaProperty`
 *
 * @param properties - the TypeScript properties of a `HostedRotationLambdaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRotationScheduleHostedRotationLambdaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("excludeCharacters", cdk.validateString)(properties.excludeCharacters));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("masterSecretArn", cdk.validateString)(properties.masterSecretArn));
  errors.collect(cdk.propertyValidator("masterSecretKmsKeyArn", cdk.validateString)(properties.masterSecretKmsKeyArn));
  errors.collect(cdk.propertyValidator("rotationLambdaName", cdk.validateString)(properties.rotationLambdaName));
  errors.collect(cdk.propertyValidator("rotationType", cdk.requiredValidator)(properties.rotationType));
  errors.collect(cdk.propertyValidator("rotationType", cdk.validateString)(properties.rotationType));
  errors.collect(cdk.propertyValidator("runtime", cdk.validateString)(properties.runtime));
  errors.collect(cdk.propertyValidator("superuserSecretArn", cdk.validateString)(properties.superuserSecretArn));
  errors.collect(cdk.propertyValidator("superuserSecretKmsKeyArn", cdk.validateString)(properties.superuserSecretKmsKeyArn));
  errors.collect(cdk.propertyValidator("vpcSecurityGroupIds", cdk.validateString)(properties.vpcSecurityGroupIds));
  errors.collect(cdk.propertyValidator("vpcSubnetIds", cdk.validateString)(properties.vpcSubnetIds));
  return errors.wrap("supplied properties not correct for \"HostedRotationLambdaProperty\"");
}

// @ts-ignore TS6133
function convertCfnRotationScheduleHostedRotationLambdaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRotationScheduleHostedRotationLambdaPropertyValidator(properties).assertSuccess();
  return {
    "ExcludeCharacters": cdk.stringToCloudFormation(properties.excludeCharacters),
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "MasterSecretArn": cdk.stringToCloudFormation(properties.masterSecretArn),
    "MasterSecretKmsKeyArn": cdk.stringToCloudFormation(properties.masterSecretKmsKeyArn),
    "RotationLambdaName": cdk.stringToCloudFormation(properties.rotationLambdaName),
    "RotationType": cdk.stringToCloudFormation(properties.rotationType),
    "Runtime": cdk.stringToCloudFormation(properties.runtime),
    "SuperuserSecretArn": cdk.stringToCloudFormation(properties.superuserSecretArn),
    "SuperuserSecretKmsKeyArn": cdk.stringToCloudFormation(properties.superuserSecretKmsKeyArn),
    "VpcSecurityGroupIds": cdk.stringToCloudFormation(properties.vpcSecurityGroupIds),
    "VpcSubnetIds": cdk.stringToCloudFormation(properties.vpcSubnetIds)
  };
}

// @ts-ignore TS6133
function CfnRotationScheduleHostedRotationLambdaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRotationSchedule.HostedRotationLambdaProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRotationSchedule.HostedRotationLambdaProperty>();
  ret.addPropertyResult("excludeCharacters", "ExcludeCharacters", (properties.ExcludeCharacters != null ? cfn_parse.FromCloudFormation.getString(properties.ExcludeCharacters) : undefined));
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addPropertyResult("masterSecretArn", "MasterSecretArn", (properties.MasterSecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.MasterSecretArn) : undefined));
  ret.addPropertyResult("masterSecretKmsKeyArn", "MasterSecretKmsKeyArn", (properties.MasterSecretKmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.MasterSecretKmsKeyArn) : undefined));
  ret.addPropertyResult("rotationLambdaName", "RotationLambdaName", (properties.RotationLambdaName != null ? cfn_parse.FromCloudFormation.getString(properties.RotationLambdaName) : undefined));
  ret.addPropertyResult("rotationType", "RotationType", (properties.RotationType != null ? cfn_parse.FromCloudFormation.getString(properties.RotationType) : undefined));
  ret.addPropertyResult("runtime", "Runtime", (properties.Runtime != null ? cfn_parse.FromCloudFormation.getString(properties.Runtime) : undefined));
  ret.addPropertyResult("superuserSecretArn", "SuperuserSecretArn", (properties.SuperuserSecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SuperuserSecretArn) : undefined));
  ret.addPropertyResult("superuserSecretKmsKeyArn", "SuperuserSecretKmsKeyArn", (properties.SuperuserSecretKmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.SuperuserSecretKmsKeyArn) : undefined));
  ret.addPropertyResult("vpcSecurityGroupIds", "VpcSecurityGroupIds", (properties.VpcSecurityGroupIds != null ? cfn_parse.FromCloudFormation.getString(properties.VpcSecurityGroupIds) : undefined));
  ret.addPropertyResult("vpcSubnetIds", "VpcSubnetIds", (properties.VpcSubnetIds != null ? cfn_parse.FromCloudFormation.getString(properties.VpcSubnetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RotationRulesProperty`
 *
 * @param properties - the TypeScript properties of a `RotationRulesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRotationScheduleRotationRulesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("automaticallyAfterDays", cdk.validateNumber)(properties.automaticallyAfterDays));
  errors.collect(cdk.propertyValidator("duration", cdk.validateString)(properties.duration));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.validateString)(properties.scheduleExpression));
  return errors.wrap("supplied properties not correct for \"RotationRulesProperty\"");
}

// @ts-ignore TS6133
function convertCfnRotationScheduleRotationRulesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRotationScheduleRotationRulesPropertyValidator(properties).assertSuccess();
  return {
    "AutomaticallyAfterDays": cdk.numberToCloudFormation(properties.automaticallyAfterDays),
    "Duration": cdk.stringToCloudFormation(properties.duration),
    "ScheduleExpression": cdk.stringToCloudFormation(properties.scheduleExpression)
  };
}

// @ts-ignore TS6133
function CfnRotationScheduleRotationRulesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRotationSchedule.RotationRulesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRotationSchedule.RotationRulesProperty>();
  ret.addPropertyResult("automaticallyAfterDays", "AutomaticallyAfterDays", (properties.AutomaticallyAfterDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.AutomaticallyAfterDays) : undefined));
  ret.addPropertyResult("duration", "Duration", (properties.Duration != null ? cfn_parse.FromCloudFormation.getString(properties.Duration) : undefined));
  ret.addPropertyResult("scheduleExpression", "ScheduleExpression", (properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRotationScheduleProps`
 *
 * @param properties - the TypeScript properties of a `CfnRotationScheduleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRotationSchedulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hostedRotationLambda", CfnRotationScheduleHostedRotationLambdaPropertyValidator)(properties.hostedRotationLambda));
  errors.collect(cdk.propertyValidator("rotateImmediatelyOnUpdate", cdk.validateBoolean)(properties.rotateImmediatelyOnUpdate));
  errors.collect(cdk.propertyValidator("rotationLambdaArn", cdk.validateString)(properties.rotationLambdaArn));
  errors.collect(cdk.propertyValidator("rotationRules", CfnRotationScheduleRotationRulesPropertyValidator)(properties.rotationRules));
  errors.collect(cdk.propertyValidator("secretId", cdk.requiredValidator)(properties.secretId));
  errors.collect(cdk.propertyValidator("secretId", cdk.validateString)(properties.secretId));
  return errors.wrap("supplied properties not correct for \"CfnRotationScheduleProps\"");
}

// @ts-ignore TS6133
function convertCfnRotationSchedulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRotationSchedulePropsValidator(properties).assertSuccess();
  return {
    "HostedRotationLambda": convertCfnRotationScheduleHostedRotationLambdaPropertyToCloudFormation(properties.hostedRotationLambda),
    "RotateImmediatelyOnUpdate": cdk.booleanToCloudFormation(properties.rotateImmediatelyOnUpdate),
    "RotationLambdaARN": cdk.stringToCloudFormation(properties.rotationLambdaArn),
    "RotationRules": convertCfnRotationScheduleRotationRulesPropertyToCloudFormation(properties.rotationRules),
    "SecretId": cdk.stringToCloudFormation(properties.secretId)
  };
}

// @ts-ignore TS6133
function CfnRotationSchedulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRotationScheduleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRotationScheduleProps>();
  ret.addPropertyResult("hostedRotationLambda", "HostedRotationLambda", (properties.HostedRotationLambda != null ? CfnRotationScheduleHostedRotationLambdaPropertyFromCloudFormation(properties.HostedRotationLambda) : undefined));
  ret.addPropertyResult("rotateImmediatelyOnUpdate", "RotateImmediatelyOnUpdate", (properties.RotateImmediatelyOnUpdate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RotateImmediatelyOnUpdate) : undefined));
  ret.addPropertyResult("rotationLambdaArn", "RotationLambdaARN", (properties.RotationLambdaARN != null ? cfn_parse.FromCloudFormation.getString(properties.RotationLambdaARN) : undefined));
  ret.addPropertyResult("rotationRules", "RotationRules", (properties.RotationRules != null ? CfnRotationScheduleRotationRulesPropertyFromCloudFormation(properties.RotationRules) : undefined));
  ret.addPropertyResult("secretId", "SecretId", (properties.SecretId != null ? cfn_parse.FromCloudFormation.getString(properties.SecretId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new secret.
 *
 * A *secret* can be a password, a set of credentials such as a user name and password, an OAuth token, or other secret information that you store in an encrypted form in Secrets Manager.
 *
 * For Amazon RDS master user credentials, see [AWS::RDS::DBCluster MasterUserSecret](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-masterusersecret.html) .
 *
 * To retrieve a secret in a CloudFormation template, use a *dynamic reference* . For more information, see [Retrieve a secret in an AWS CloudFormation resource](https://docs.aws.amazon.com/secretsmanager/latest/userguide/cfn-example_reference-secret.html) .
 *
 * A common scenario is to first create a secret with `GenerateSecretString` , which generates a password, and then use a dynamic reference to retrieve the username and password from the secret to use as credentials for a new database. See the example *Creating a Redshift cluster and a secret for the admin credentials* .
 *
 * For information about creating a secret in the console, see [Create a secret](https://docs.aws.amazon.com/secretsmanager/latest/userguide/manage_create-basic-secret.html) . For information about creating a secret using the CLI or SDK, see [CreateSecret](https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_CreateSecret.html) .
 *
 * For information about retrieving a secret in code, see [Retrieve secrets from Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/retrieving-secrets.html) .
 *
 * @cloudformationResource AWS::SecretsManager::Secret
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html
 */
export class CfnSecret extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SecretsManager::Secret";

  /**
   * Build a CfnSecret from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSecret {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSecretPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSecret(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the secret.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The description of the secret.
   */
  public description?: string;

  /**
   * A structure that specifies how to generate a password to encrypt and store in the secret.
   */
  public generateSecretString?: CfnSecret.GenerateSecretStringProperty | cdk.IResolvable;

  /**
   * The ARN, key ID, or alias of the AWS KMS key that Secrets Manager uses to encrypt the secret value in the secret.
   */
  public kmsKeyId?: string;

  /**
   * The name of the new secret.
   */
  public name?: string;

  /**
   * A custom type that specifies a `Region` and the `KmsKeyId` for a replica secret.
   */
  public replicaRegions?: Array<cdk.IResolvable | CfnSecret.ReplicaRegionProperty> | cdk.IResolvable;

  /**
   * The text to encrypt and store in the secret.
   */
  public secretString?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tags to attach to the secret.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSecretProps = {}) {
    super(scope, id, {
      "type": CfnSecret.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.generateSecretString = props.generateSecretString;
    this.kmsKeyId = props.kmsKeyId;
    this.name = props.name;
    this.replicaRegions = props.replicaRegions;
    this.secretString = props.secretString;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SecretsManager::Secret", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::SecretsManager::Secret' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "generateSecretString": this.generateSecretString,
      "kmsKeyId": this.kmsKeyId,
      "name": this.name,
      "replicaRegions": this.replicaRegions,
      "secretString": this.secretString,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSecret.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSecretPropsToCloudFormation(props);
  }
}

export namespace CfnSecret {
  /**
   * Generates a random password.
   *
   * We recommend that you specify the maximum length and include every character type that the system you are generating a password for can support.
   *
   * *Required permissions:* `secretsmanager:GetRandomPassword` . For more information, see [IAM policy actions for Secrets Manager](https://docs.aws.amazon.com/service-authorization/latest/reference/list_awssecretsmanager.html#awssecretsmanager-actions-as-permissions) and [Authentication and access control in Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html
   */
  export interface GenerateSecretStringProperty {
    /**
     * A string of the characters that you don't want in the password.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludecharacters
     */
    readonly excludeCharacters?: string;

    /**
     * Specifies whether to exclude lowercase letters from the password.
     *
     * If you don't include this switch, the password can contain lowercase letters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludelowercase
     */
    readonly excludeLowercase?: boolean | cdk.IResolvable;

    /**
     * Specifies whether to exclude numbers from the password.
     *
     * If you don't include this switch, the password can contain numbers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludenumbers
     */
    readonly excludeNumbers?: boolean | cdk.IResolvable;

    /**
     * Specifies whether to exclude the following punctuation characters from the password: `!
     *
     * " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~` . If you don't include this switch, the password can contain punctuation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludepunctuation
     */
    readonly excludePunctuation?: boolean | cdk.IResolvable;

    /**
     * Specifies whether to exclude uppercase letters from the password.
     *
     * If you don't include this switch, the password can contain uppercase letters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludeuppercase
     */
    readonly excludeUppercase?: boolean | cdk.IResolvable;

    /**
     * The JSON key name for the key/value pair, where the value is the generated password.
     *
     * This pair is added to the JSON structure specified by the `SecretStringTemplate` parameter. If you specify this parameter, then you must also specify `SecretStringTemplate` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-generatestringkey
     */
    readonly generateStringKey?: string;

    /**
     * Specifies whether to include the space character.
     *
     * If you include this switch, the password can contain space characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-includespace
     */
    readonly includeSpace?: boolean | cdk.IResolvable;

    /**
     * The length of the password.
     *
     * If you don't include this parameter, the default length is 32 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-passwordlength
     */
    readonly passwordLength?: number;

    /**
     * Specifies whether to include at least one upper and lowercase letter, one number, and one punctuation.
     *
     * If you don't include this switch, the password contains at least one of every character type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-requireeachincludedtype
     */
    readonly requireEachIncludedType?: boolean | cdk.IResolvable;

    /**
     * A template that the generated string must match.
     *
     * When you make a change to this property, a new secret version is created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-secretstringtemplate
     */
    readonly secretStringTemplate?: string;
  }

  /**
   * Specifies a `Region` and the `KmsKeyId` for a replica secret.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html
   */
  export interface ReplicaRegionProperty {
    /**
     * The ARN, key ID, or alias of the KMS key to encrypt the secret.
     *
     * If you don't include this field, Secrets Manager uses `aws/secretsmanager` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html#cfn-secretsmanager-secret-replicaregion-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * A string that represents a `Region` , for example "us-east-1".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html#cfn-secretsmanager-secret-replicaregion-region
     */
    readonly region: string;
  }
}

/**
 * Properties for defining a `CfnSecret`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html
 */
export interface CfnSecretProps {
  /**
   * The description of the secret.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-description
   */
  readonly description?: string;

  /**
   * A structure that specifies how to generate a password to encrypt and store in the secret.
   *
   * To include a specific string in the secret, use `SecretString` instead. If you omit both `GenerateSecretString` and `SecretString` , you create an empty secret. When you make a change to this property, a new secret version is created.
   *
   * We recommend that you specify the maximum length and include every character type that the system you are generating a password for can support.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-generatesecretstring
   */
  readonly generateSecretString?: CfnSecret.GenerateSecretStringProperty | cdk.IResolvable;

  /**
   * The ARN, key ID, or alias of the AWS KMS key that Secrets Manager uses to encrypt the secret value in the secret.
   *
   * An alias is always prefixed by `alias/` , for example `alias/aws/secretsmanager` . For more information, see [About aliases](https://docs.aws.amazon.com/kms/latest/developerguide/alias-about.html) .
   *
   * To use a AWS KMS key in a different account, use the key ARN or the alias ARN.
   *
   * If you don't specify this value, then Secrets Manager uses the key `aws/secretsmanager` . If that key doesn't yet exist, then Secrets Manager creates it for you automatically the first time it encrypts the secret value.
   *
   * If the secret is in a different AWS account from the credentials calling the API, then you can't use `aws/secretsmanager` to encrypt the secret, and you must create and use a customer managed AWS KMS key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * The name of the new secret.
   *
   * The secret name can contain ASCII letters, numbers, and the following characters: /_+=.@-
   *
   * Do not end your secret name with a hyphen followed by six characters. If you do so, you risk confusion and unexpected results when searching for a secret by partial ARN. Secrets Manager automatically adds a hyphen and six random characters after the secret name at the end of the ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-name
   */
  readonly name?: string;

  /**
   * A custom type that specifies a `Region` and the `KmsKeyId` for a replica secret.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-replicaregions
   */
  readonly replicaRegions?: Array<cdk.IResolvable | CfnSecret.ReplicaRegionProperty> | cdk.IResolvable;

  /**
   * The text to encrypt and store in the secret.
   *
   * We recommend you use a JSON structure of key/value pairs for your secret value. To generate a random password, use `GenerateSecretString` instead. If you omit both `GenerateSecretString` and `SecretString` , you create an empty secret. When you make a change to this property, a new secret version is created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-secretstring
   */
  readonly secretString?: string;

  /**
   * A list of tags to attach to the secret.
   *
   * Each tag is a key and value pair of strings in a JSON text string, for example:
   *
   * `[{"Key":"CostCenter","Value":"12345"},{"Key":"environment","Value":"production"}]`
   *
   * Secrets Manager tag key names are case sensitive. A tag with the key "ABC" is a different tag from one with key "abc".
   *
   * Stack-level tags, tags you apply to the CloudFormation stack, are also attached to the secret.
   *
   * If you check tags in permissions policies as part of your security strategy, then adding or removing a tag can change permissions. If the completion of this operation would result in you losing your permissions for this secret, then Secrets Manager blocks the operation and returns an `Access Denied` error. For more information, see [Control access to secrets using tags](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_examples.html#tag-secrets-abac) and [Limit access to identities with tags that match secrets' tags](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_examples.html#auth-and-access_tags2) .
   *
   * For information about how to format a JSON parameter for the various command line tool environments, see [Using JSON for Parameters](https://docs.aws.amazon.com/cli/latest/userguide/cli-using-param.html#cli-using-param-json) . If your command-line tool or SDK requires quotation marks around the parameter, you should use single quotes to avoid confusion with the double quotes required in the JSON text.
   *
   * The following restrictions apply to tags:
   *
   * - Maximum number of tags per secret: 50
   * - Maximum key length: 127 Unicode characters in UTF-8
   * - Maximum value length: 255 Unicode characters in UTF-8
   * - Tag keys and values are case sensitive.
   * - Do not use the `aws:` prefix in your tag names or values because AWS reserves it for AWS use. You can't edit or delete tag names or values with this prefix. Tags with this prefix do not count against your tags per secret limit.
   * - If you use your tagging schema across multiple services and resources, other services might have restrictions on allowed characters. Generally allowed characters: letters, spaces, and numbers representable in UTF-8, plus the following special characters: + - = . _ : / @.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `GenerateSecretStringProperty`
 *
 * @param properties - the TypeScript properties of a `GenerateSecretStringProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecretGenerateSecretStringPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("excludeCharacters", cdk.validateString)(properties.excludeCharacters));
  errors.collect(cdk.propertyValidator("excludeLowercase", cdk.validateBoolean)(properties.excludeLowercase));
  errors.collect(cdk.propertyValidator("excludeNumbers", cdk.validateBoolean)(properties.excludeNumbers));
  errors.collect(cdk.propertyValidator("excludePunctuation", cdk.validateBoolean)(properties.excludePunctuation));
  errors.collect(cdk.propertyValidator("excludeUppercase", cdk.validateBoolean)(properties.excludeUppercase));
  errors.collect(cdk.propertyValidator("generateStringKey", cdk.validateString)(properties.generateStringKey));
  errors.collect(cdk.propertyValidator("includeSpace", cdk.validateBoolean)(properties.includeSpace));
  errors.collect(cdk.propertyValidator("passwordLength", cdk.validateNumber)(properties.passwordLength));
  errors.collect(cdk.propertyValidator("requireEachIncludedType", cdk.validateBoolean)(properties.requireEachIncludedType));
  errors.collect(cdk.propertyValidator("secretStringTemplate", cdk.validateString)(properties.secretStringTemplate));
  return errors.wrap("supplied properties not correct for \"GenerateSecretStringProperty\"");
}

// @ts-ignore TS6133
function convertCfnSecretGenerateSecretStringPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecretGenerateSecretStringPropertyValidator(properties).assertSuccess();
  return {
    "ExcludeCharacters": cdk.stringToCloudFormation(properties.excludeCharacters),
    "ExcludeLowercase": cdk.booleanToCloudFormation(properties.excludeLowercase),
    "ExcludeNumbers": cdk.booleanToCloudFormation(properties.excludeNumbers),
    "ExcludePunctuation": cdk.booleanToCloudFormation(properties.excludePunctuation),
    "ExcludeUppercase": cdk.booleanToCloudFormation(properties.excludeUppercase),
    "GenerateStringKey": cdk.stringToCloudFormation(properties.generateStringKey),
    "IncludeSpace": cdk.booleanToCloudFormation(properties.includeSpace),
    "PasswordLength": cdk.numberToCloudFormation(properties.passwordLength),
    "RequireEachIncludedType": cdk.booleanToCloudFormation(properties.requireEachIncludedType),
    "SecretStringTemplate": cdk.stringToCloudFormation(properties.secretStringTemplate)
  };
}

// @ts-ignore TS6133
function CfnSecretGenerateSecretStringPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecret.GenerateSecretStringProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecret.GenerateSecretStringProperty>();
  ret.addPropertyResult("excludeCharacters", "ExcludeCharacters", (properties.ExcludeCharacters != null ? cfn_parse.FromCloudFormation.getString(properties.ExcludeCharacters) : undefined));
  ret.addPropertyResult("excludeLowercase", "ExcludeLowercase", (properties.ExcludeLowercase != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExcludeLowercase) : undefined));
  ret.addPropertyResult("excludeNumbers", "ExcludeNumbers", (properties.ExcludeNumbers != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExcludeNumbers) : undefined));
  ret.addPropertyResult("excludePunctuation", "ExcludePunctuation", (properties.ExcludePunctuation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExcludePunctuation) : undefined));
  ret.addPropertyResult("excludeUppercase", "ExcludeUppercase", (properties.ExcludeUppercase != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExcludeUppercase) : undefined));
  ret.addPropertyResult("generateStringKey", "GenerateStringKey", (properties.GenerateStringKey != null ? cfn_parse.FromCloudFormation.getString(properties.GenerateStringKey) : undefined));
  ret.addPropertyResult("includeSpace", "IncludeSpace", (properties.IncludeSpace != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeSpace) : undefined));
  ret.addPropertyResult("passwordLength", "PasswordLength", (properties.PasswordLength != null ? cfn_parse.FromCloudFormation.getNumber(properties.PasswordLength) : undefined));
  ret.addPropertyResult("requireEachIncludedType", "RequireEachIncludedType", (properties.RequireEachIncludedType != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireEachIncludedType) : undefined));
  ret.addPropertyResult("secretStringTemplate", "SecretStringTemplate", (properties.SecretStringTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.SecretStringTemplate) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicaRegionProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicaRegionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecretReplicaRegionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("region", cdk.requiredValidator)(properties.region));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  return errors.wrap("supplied properties not correct for \"ReplicaRegionProperty\"");
}

// @ts-ignore TS6133
function convertCfnSecretReplicaRegionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecretReplicaRegionPropertyValidator(properties).assertSuccess();
  return {
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "Region": cdk.stringToCloudFormation(properties.region)
  };
}

// @ts-ignore TS6133
function CfnSecretReplicaRegionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSecret.ReplicaRegionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecret.ReplicaRegionProperty>();
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSecretProps`
 *
 * @param properties - the TypeScript properties of a `CfnSecretProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecretPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("generateSecretString", CfnSecretGenerateSecretStringPropertyValidator)(properties.generateSecretString));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("replicaRegions", cdk.listValidator(CfnSecretReplicaRegionPropertyValidator))(properties.replicaRegions));
  errors.collect(cdk.propertyValidator("secretString", cdk.validateString)(properties.secretString));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSecretProps\"");
}

// @ts-ignore TS6133
function convertCfnSecretPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecretPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "GenerateSecretString": convertCfnSecretGenerateSecretStringPropertyToCloudFormation(properties.generateSecretString),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ReplicaRegions": cdk.listMapper(convertCfnSecretReplicaRegionPropertyToCloudFormation)(properties.replicaRegions),
    "SecretString": cdk.stringToCloudFormation(properties.secretString),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSecretPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecretProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecretProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("generateSecretString", "GenerateSecretString", (properties.GenerateSecretString != null ? CfnSecretGenerateSecretStringPropertyFromCloudFormation(properties.GenerateSecretString) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("replicaRegions", "ReplicaRegions", (properties.ReplicaRegions != null ? cfn_parse.FromCloudFormation.getArray(CfnSecretReplicaRegionPropertyFromCloudFormation)(properties.ReplicaRegions) : undefined));
  ret.addPropertyResult("secretString", "SecretString", (properties.SecretString != null ? cfn_parse.FromCloudFormation.getString(properties.SecretString) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SecretsManager::SecretTargetAttachment` resource completes the final link between a Secrets Manager secret and the associated database by adding the database connection information to the secret JSON.
 *
 * If you want to turn on automatic rotation for a database credential secret, the secret must contain the database connection information. For more information, see [JSON structure of Secrets Manager database credential secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_secret_json_structure.html) .
 *
 * For Amazon RDS master user credentials, see [AWS::RDS::DBCluster MasterUserSecret](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-dbcluster-masterusersecret.html) .
 *
 * @cloudformationResource AWS::SecretsManager::SecretTargetAttachment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html
 */
export class CfnSecretTargetAttachment extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SecretsManager::SecretTargetAttachment";

  /**
   * Build a CfnSecretTargetAttachment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSecretTargetAttachment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSecretTargetAttachmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSecretTargetAttachment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ARN or name of the secret.
   */
  public secretId: string;

  /**
   * The ID of the database or cluster.
   */
  public targetId: string;

  /**
   * A string that defines the type of service or database associated with the secret.
   */
  public targetType: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSecretTargetAttachmentProps) {
    super(scope, id, {
      "type": CfnSecretTargetAttachment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "secretId", this);
    cdk.requireProperty(props, "targetId", this);
    cdk.requireProperty(props, "targetType", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.secretId = props.secretId;
    this.targetId = props.targetId;
    this.targetType = props.targetType;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "secretId": this.secretId,
      "targetId": this.targetId,
      "targetType": this.targetType
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSecretTargetAttachment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSecretTargetAttachmentPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSecretTargetAttachment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html
 */
export interface CfnSecretTargetAttachmentProps {
  /**
   * The ARN or name of the secret.
   *
   * To reference a secret also created in this template, use the see [Ref](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref.html) function with the secret's logical ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-secretid
   */
  readonly secretId: string;

  /**
   * The ID of the database or cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targetid
   */
  readonly targetId: string;

  /**
   * A string that defines the type of service or database associated with the secret.
   *
   * This value instructs Secrets Manager how to update the secret with the details of the service or database. This value must be one of the following:
   *
   * - AWS::RDS::DBInstance
   * - AWS::RDS::DBCluster
   * - AWS::Redshift::Cluster
   * - AWS::DocDB::DBInstance
   * - AWS::DocDB::DBCluster
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targettype
   */
  readonly targetType: string;
}

/**
 * Determine whether the given properties match those of a `CfnSecretTargetAttachmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnSecretTargetAttachmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecretTargetAttachmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("secretId", cdk.requiredValidator)(properties.secretId));
  errors.collect(cdk.propertyValidator("secretId", cdk.validateString)(properties.secretId));
  errors.collect(cdk.propertyValidator("targetId", cdk.requiredValidator)(properties.targetId));
  errors.collect(cdk.propertyValidator("targetId", cdk.validateString)(properties.targetId));
  errors.collect(cdk.propertyValidator("targetType", cdk.requiredValidator)(properties.targetType));
  errors.collect(cdk.propertyValidator("targetType", cdk.validateString)(properties.targetType));
  return errors.wrap("supplied properties not correct for \"CfnSecretTargetAttachmentProps\"");
}

// @ts-ignore TS6133
function convertCfnSecretTargetAttachmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecretTargetAttachmentPropsValidator(properties).assertSuccess();
  return {
    "SecretId": cdk.stringToCloudFormation(properties.secretId),
    "TargetId": cdk.stringToCloudFormation(properties.targetId),
    "TargetType": cdk.stringToCloudFormation(properties.targetType)
  };
}

// @ts-ignore TS6133
function CfnSecretTargetAttachmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecretTargetAttachmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecretTargetAttachmentProps>();
  ret.addPropertyResult("secretId", "SecretId", (properties.SecretId != null ? cfn_parse.FromCloudFormation.getString(properties.SecretId) : undefined));
  ret.addPropertyResult("targetId", "TargetId", (properties.TargetId != null ? cfn_parse.FromCloudFormation.getString(properties.TargetId) : undefined));
  ret.addPropertyResult("targetType", "TargetType", (properties.TargetType != null ? cfn_parse.FromCloudFormation.getString(properties.TargetType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}