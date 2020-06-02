import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as core from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import * as path from 'path';
import { CfncliLayer } from './cfncli-layer';

const CLOUDFORMATION_IAM_PATH = '/cloudformation/';
const BUCKET_RESOURCE_PROVIDER = 's3://awscdk-cloudformation-resource-provider';
const REGISTER_PROVIDER_RESOURCE_TYPE = 'Custom::AWSCDK-CloudFormation-ResourceTypeProvider';
const HANDLER_DIR = path.join(__dirname, 'resource-provider-handler');
const HANDLER_RUNTIME = lambda.Runtime.PYTHON_3_7;

/**
 * A IAM role used by CloudFormation when sending
 * resource provider's log and metrics to CloudWatch.
 *
 * @internal
 */
export class LogDeliveryRole extends iam.Role {

  constructor(scope: core.Construct, id: string, props?: iam.RoleProps) {
    super(scope, id, {
      description: 'Role used by CloudFormation when sending resource provider\'s log and metrics to CloudWatch.',
      maxSessionDuration: core.Duration.hours(12),
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('cloudformation.amazonaws.com'),
        new iam.ServicePrincipal('resources.cloudformation.amazonaws.com'),
      ),
      path: CLOUDFORMATION_IAM_PATH,
      ...props,
    });

    this.addManagedPolicy(new iam.ManagedPolicy(this, `${id}Policy`, {
      // managedPolicyName: 'LogDeliveryRolePolicy',
      path: CLOUDFORMATION_IAM_PATH,
      statements: [
        new iam.PolicyStatement({
          actions: [
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:DescribeLogGroups',
            'logs:DescribeLogStreams',
            'logs:PutLogEvents',
            'cloudwatch:ListMetrics',
            'cloudwatch:PutMetricData',
          ],
          resources: [ '*' ],
        }),
      ],
    }))
  }
}

/**
 * A custom resource that handles adding a resource type to the CloudFormation registry.
 *
 * @internal
 */
export class ResourceTypeProvider extends core.NestedStack {

  public static getOrCreate(scope: core.Construct) {
    const stack = core.Stack.of(scope);
    const uid = '@aws-cdk/aws-cloudformation.ResourceTypeProvider';
    return stack.node.tryFindChild(uid) as ResourceTypeProvider || new ResourceTypeProvider(stack, uid);
  }

  /**
   * The provider to use for custom resources.
   */
  public readonly provider: cr.Provider;

  /**
   * The IAM roles used by the provider's lambda handlers.
   */
  public readonly roles: iam.IRole[];

  /**
   * The IAM role used by the provider to send log entries to CloudWatch.
   * 
   * @see https://github.com/aws-cloudformation/cloudformation-cli/blob/master/src/rpdk/core/data/managed-upload-infrastructure.yaml
   */
  public readonly logRole: iam.IRole;

  private constructor(scope: core.Construct, id: string) {
    super(scope, id);

    const onEvent = new lambda.Function(this, 'OnEventHandler', {
      code: lambda.Code.fromAsset(HANDLER_DIR),
      description: 'onEvent handler for registering resource type',
      runtime: HANDLER_RUNTIME,
      handler: 'index.on_event',
      timeout: core.Duration.minutes(1),
      layers: [ CfncliLayer.getOrCreate(this, { version: '0.1.2' }) ],
    });
    onEvent.addToRolePolicy(new iam.PolicyStatement({
      actions: [ 'iam:PassRole' ],
      resources: [ `arn:aws:iam::${this.account}:role/cloudformation*/*` ],
    }));
    onEvent.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'cloudformation:DeregisterType',
        'cloudformation:DescribeType',
        'cloudformation:ListTypes',
        'cloudformation:ListTypeVersions',
        'cloudformation:RegisterType',
        'cloudformation:SetTypeDefaultVersion',
      ],
      resources: [ '*' ],
    }));

    const isComplete = new lambda.Function(this, 'IsCompleteHandler', {
      code: lambda.Code.fromAsset(HANDLER_DIR),
      description: 'isComplete handler for registering resource type',
      runtime: HANDLER_RUNTIME,
      handler: 'index.is_complete',
      timeout: core.Duration.minutes(1),
      layers: [ CfncliLayer.getOrCreate(this, { version: '0.1.2' }) ],
    });
    isComplete.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'cloudformation:DescribeType',
        'cloudformation:DescribeTypeRegistration',
        'cloudformation:SetTypeDefaultVersion',
      ],
      resources: [ '*' ],
    }));

    this.provider = new cr.Provider(this, 'Provider', {
      onEventHandler: onEvent,
      isCompleteHandler: isComplete,
      totalTimeout: core.Duration.hours(1),
      queryInterval: core.Duration.minutes(1),
    });

    this.roles = [ onEvent.role!, isComplete.role! ];

    this.logRole = new LogDeliveryRole(this, 'LogDeliveryRole');
  }

  /**
   * The custom resource service token for this provider.
   */
  public get serviceToken() { return this.provider.serviceToken; }
}

/**
 * Properties for defining CloudFormation Resource Provider.
 */
export interface ResourceProviderProps {
  /**
   * The name of the type being registered.
   */
  readonly typeName: string;

  /**
   * The IAM role for CloudFormation to assume when invoking the resource type.
   *
   * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html
   * @default - a role will be automatically created
   */
  readonly executionRole?: iam.IRole;

  /**
   * A url to the S3 bucket containing the schema handler package that contains
   * the schema, event handlers, and associated files for the type you want to
   * register.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/registry.html#registry-register-permissions
   * @default - default S3 bucket url 
   */
  readonly schemaHandlerPackage?: string;

  /**
   * The Amazon CloudWatch log group to which CloudFormation sends error logging
   * information when invoking the type's handlers.
   *
   * @default - from typeName field
   */
  readonly logGroupName?: string;

  /**
   * The role that CloudFormation should assume when sending log entries to CloudWatch logs.
   *
   * @default - a role will be automatically created
   */
  readonly logRole?: iam.IRole | string;

  /**
   * The semantic version of the registered type.
   *
   * @default - 0.1.0
   */
  readonly semanticVersion?: string;

  /**
   * The provider service token.
   *
   * @default - a service token will be automatically created
   */
  readonly serviceToken?: string;
}

/**
 * Construct for defining CloudFormation Resource Provider.
 * 
 * @internal
 */
export class ResourceProvider extends core.Construct {
  /**
   * The name of the registered type.
   *
   * @attribute
   */
  public readonly name: string;

  /**
   * The Amazon Resource Name (ARN) of the type.
   *
   * @attribute
   */
  public readonly arn: string;

  /**
   * The description of the registered type.
   *
   * @attribute
   */
  public readonly description: string;

  /**
   * The Amazon Resource Name (ARN) of this specific version of the type being registered.
   *
   * @attribute
   */
  public readonly versionArn: string;

  /**
   * The ID of the default version of the type.
   *
   * @attribute
   */
  public readonly defaultVersionId: string;

  /**
   * The semantic version of the registered type.
   *
   * @attribute
   */
  public readonly semanticVersion: string;

  constructor(scope: core.Construct, id: string, props: ResourceProviderProps) {
    super(scope, id);

    let serviceToken = props.serviceToken;
    let logRole = props.logRole;

    if (typeof logRole === 'string') {
      logRole = iam.Role.fromRoleArn(this, 'LogDeliveryRole', logRole);
    }

    if (!serviceToken) {
      const provider = ResourceTypeProvider.getOrCreate(this);
      serviceToken = provider.serviceToken;
      logRole = provider.logRole;
    }
    if (!logRole) {
      logRole = new LogDeliveryRole(this, 'LogDeliveryRole');
    }

    const semanticVersion = props.semanticVersion || '0.1.0';
    const hypenatedName = props.typeName.replace(/::/g, '-').toLowerCase();
    const schemaHandlerPackage = props.schemaHandlerPackage
      || `${BUCKET_RESOURCE_PROVIDER}/${hypenatedName}-${semanticVersion}.zip`;

    const resource = new core.CustomResource(this, 'ResourceProvider', {
      serviceToken: serviceToken,
      resourceType: REGISTER_PROVIDER_RESOURCE_TYPE,
      properties: {
        Type: 'RESOURCE',
        TypeName: props.typeName,
        SemanticVersion: semanticVersion,
        Region: core.Stack.of(this).region,
        SchemaHandlerPackage: schemaHandlerPackage,
        ExecutionRoleArn: props.executionRole?.roleArn,
        LoggingConfig: {
          LogRoleArn: logRole.roleArn,
          LogGroupName: props.logGroupName || `${hypenatedName}-logs`,
        },
      },
    });

    this.name = resource.ref;
    this.arn = resource.getAttString('TypeArn');
    this.description = resource.getAttString('Description');
    this.versionArn = resource.getAttString('TypeVersionArn');
    this.defaultVersionId = resource.getAttString('DefaultVersionId');
    this.semanticVersion = resource.getAttString('SemanticVersion');

    // TODO: expose rest of attributes
    // this.schema = resource.getAttString('Schema');
    // this.deprecatedStatus = resource.getAttString('DeprecatedStatus');
    // this.provisioningType = resource.getAttString('ProvisioningType');
    // this.visibility = resource.getAttString('Visibility');
    // this.sourceUrl = resource.getAttString('SourceUrl');
    // this.documentationUrl = resource.getAttString('DocumentationUrl');
    // this.lastUpdated = resource.getAttString('LastUpdated');
    // this.timeCreated = resource.getAttString('TimeCreated');
  }
}
