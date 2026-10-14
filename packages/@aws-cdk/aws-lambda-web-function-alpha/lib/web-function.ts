import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import type * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { CfnWebFunction, CfnWebFunctionRevision } from 'aws-cdk-lib/aws-lambda';
import type { IWebFunctionRef, WebFunctionReference } from 'aws-cdk-lib/aws-lambda';
import type * as logs from 'aws-cdk-lib/aws-logs';
import type { Construct } from 'constructs';
import type { WebFunctionCode } from './code';
import { WebFunctionValidationError } from './private/errors';

/**
 * The application log level of a web function
 */
export enum WebFunctionApplicationLogLevel {
  /** Most verbose application logs */
  TRACE = 'TRACE',
  /** Debugging information */
  DEBUG = 'DEBUG',
  /** Informational messages */
  INFO = 'INFO',
  /** Warnings */
  WARN = 'WARN',
  /** Errors */
  ERROR = 'ERROR',
  /** Only fatal errors */
  FATAL = 'FATAL',
}

/**
 * The system log level of a web function
 */
export enum WebFunctionSystemLogLevel {
  /** Debugging information from the Lambda system */
  DEBUG = 'DEBUG',
  /** Informational messages from the Lambda system */
  INFO = 'INFO',
  /** Warnings from the Lambda system */
  WARN = 'WARN',
}

/**
 * A Lambda Web Function
 */
export interface IWebFunction extends cdk.IResource, IWebFunctionRef {
  /**
   * The ARN of the web function
   *
   * @attribute
   */
  readonly functionArn: string;

  /**
   * The name of the web function
   *
   * @attribute
   */
  readonly functionName: string;

  /**
   * The ID of a revision of the web function. Endpoints route to this revision by default.
   *
   * @attribute
   */
  readonly revisionId: string;
}

/**
 * Attributes of an existing Web Function
 */
export interface WebFunctionAttributes {
  /**
   * The ARN of the web function
   */
  readonly functionArn: string;

  /**
   * The name of the web function
   */
  readonly functionName: string;

  /**
   * The ID of a revision of the web function. Endpoints route to this revision by default.
   */
  readonly revisionId: string;
}

/**
 * Properties for a Web Function
 */
export interface WebFunctionProps {
  /**
   * The source code of the web function.
   *
   * The application must listen on the host and port given by the `AWS_LAMBDA_HTTP_ENDPOINT`
   * environment variable.
   */
  readonly code: WebFunctionCode;

  /**
   * The name of the web function. It can contain letters, numbers, hyphens (-) and underscores (_),
   * and cannot begin or end with a hyphen or an underscore. Names are limited to 64 characters.
   *
   * @default - a name is generated
   */
  readonly webFunctionName?: string;

  /**
   * A description of the revision that is deployed.
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * The runtime of the web function.
   *
   * @default lambda.Runtime.NODEJS_24_X
   */
  readonly runtime?: lambda.Runtime;

  /**
   * The execution role of the web function.
   *
   * @default - a new role that can write to CloudWatch Logs
   */
  readonly role?: iam.IRole;

  /**
   * The timeout of the web function. Must be a whole number of seconds.
   *
   * @default - the service default
   */
  readonly timeout?: cdk.Duration;

  /**
   * The maximum number of concurrent requests that a single execution environment handles.
   *
   * @default - the service default
   */
  readonly maxConcurrencyPerEnvironment?: number;

  /**
   * Environment variables for the web function.
   *
   * @default - no environment variables
   */
  readonly environment?: { [key: string]: string };

  /**
   * The KMS key used to encrypt the revision.
   *
   * @default - the service default encryption
   */
  readonly kmsKey?: kms.IKey;

  /**
   * The CloudWatch Logs log group the web function writes to.
   *
   * @default - the service default log group
   */
  readonly logGroup?: logs.ILogGroupRef;

  /**
   * The application log level.
   *
   * @default - the service default
   */
  readonly applicationLogLevel?: WebFunctionApplicationLogLevel;

  /**
   * The system log level.
   *
   * @default - the service default
   */
  readonly systemLogLevel?: WebFunctionSystemLogLevel;

  /**
   * Tags applied to the web function and its taggable children.
   *
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * A Lambda Web Function: an HTTP server that runs on Lambda and is exposed through a
 * `WebFunctionEndpoint`.
 *
 * @resource AWS::Lambda::WebFunction
 *
 * @example
 * import * as path from 'path';
 * import { Duration } from 'aws-cdk-lib';
 * import { WebFunction, WebFunctionAuthType, WebFunctionCode, WebFunctionEndpoint } from '@aws-cdk/aws-lambda-web-function-alpha';
 *
 * const fn = new WebFunction(this, 'WebFunction', {
 *   code: WebFunctionCode.fromAsset(path.join(__dirname, 'app')),
 *   timeout: Duration.seconds(30),
 *   environment: { NODE_ENV: 'production' },
 * });
 *
 * new WebFunctionEndpoint(this, 'Endpoint', { webFunction: fn, authType: WebFunctionAuthType.IAM_AUTH });
 */
export class WebFunction extends cdk.Resource implements IWebFunction {
  /**
   * Imports an existing web function from its attributes
   *
   * @param scope the construct scope
   * @param id the construct ID
   * @param attrs the attributes of the existing web function
   */
  public static fromWebFunctionAttributes(scope: Construct, id: string, attrs: WebFunctionAttributes): IWebFunction {
    return new ImportedWebFunction(scope, id, attrs);
  }

  /**
   * The ARN of the web function
   */
  public readonly functionArn: string;

  /**
   * The name of the web function
   */
  public readonly functionName: string;

  /**
   * The ID of the revision that holds the deployed code and configuration
   */
  public readonly revisionId: string;

  /**
   * The ARN of the revision that holds the deployed code and configuration
   */
  public readonly revisionArn: string;

  /**
   * The execution role of the web function
   */
  public readonly role: iam.IRole;

  /**
   * A reference to this web function, for use in other constructs
   */
  public get webFunctionRef(): WebFunctionReference {
    return { functionArn: this.functionArn };
  }

  /**
   * The underlying `AWS::Lambda::WebFunction` resource
   */
  public readonly cfnWebFunction: CfnWebFunction;

  /**
   * The underlying `AWS::Lambda::WebFunctionRevision` resource
   */
  public readonly cfnRevision: CfnWebFunctionRevision;

  constructor(scope: Construct, id: string, props: WebFunctionProps) {
    super(scope, id, { physicalName: props.webFunctionName });

    if (props.webFunctionName !== undefined) {
      validateFunctionName(props.webFunctionName);
    }

    this.role = props.role ?? new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    // The name is required by CloudFormation. Names.uniqueResourceName does not need a Region,
    // so the name can be generated in environment-agnostic stacks as well
    this.functionName = props.webFunctionName ?? cdk.Names.uniqueResourceName(this, { maxLength: 64, separator: '-' });

    this.cfnWebFunction = new CfnWebFunction(this, 'Resource', {
      functionName: this.functionName,
    });
    this.functionArn = this.cfnWebFunction.attrFunctionArn;

    const code = props.code.bind(this, this.functionArn);
    const loggingConfig = (props.logGroup || props.applicationLogLevel || props.systemLogLevel)
      ? {
        logGroup: props.logGroup?.logGroupRef.logGroupName,
        applicationLogLevel: props.applicationLogLevel,
        systemLogLevel: props.systemLogLevel,
      }
      : undefined;

    this.cfnRevision = new CfnWebFunctionRevision(this, 'Revision', {
      functionName: this.functionName,
      description: props.description,
      kmsKeyArn: props.kmsKey?.keyArn,
      buildConfig: {
        codeConfig: {
          s3Object: {
            bucket: code.bucket,
            key: code.key,
            versionId: code.versionId,
          },
        },
        runtimeConfig: {
          runtime: (props.runtime ?? lambda.Runtime.NODEJS_24_X).name,
        },
      },
      serviceConfig: {
        executionRoleArn: this.role.roleArn,
        timeoutSeconds: props.timeout?.toSeconds({ integral: true }),
        maxConcurrencyPerEnvironment: props.maxConcurrencyPerEnvironment,
        environmentVariables: props.environment,
        telemetryConfig: loggingConfig ? { loggingConfig } : undefined,
      },
    });
    // The revision references the function by name, which does not create a dependency
    this.cfnRevision.addDependency(this.cfnWebFunction);

    if (props.kmsKey) {
      grantServiceDecrypt(this, props.kmsKey, this.functionArn);
    }

    this.revisionId = this.cfnRevision.attrRevisionId;
    this.revisionArn = this.cfnRevision.attrRevisionArn;

    for (const [key, value] of Object.entries(props.tags ?? {})) {
      cdk.Tags.of(this).add(key, value);
    }
  }
}

/**
 * Validates a web function name against the constraints of `AWS::Lambda::WebFunction`
 */
function validateFunctionName(name: string) {
  if (cdk.Token.isUnresolved(name)) {
    return;
  }
  const errors: string[] = [];
  if (name.length > 64) {
    errors.push(`Web function name must be at most 64 characters, got ${name.length}`);
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    errors.push(`Web function name '${name}' can only contain letters, numbers, hyphens (-) and underscores (_)`);
  }
  if (/^[-_]|[-_]$/.test(name)) {
    errors.push(`Web function name '${name}' cannot begin or end with a hyphen or an underscore`);
  }
  if (errors.length > 0) {
    throw new WebFunctionValidationError(errors.join('\n'));
  }
}

/**
 * A web function that exists outside this stack
 */
class ImportedWebFunction extends cdk.Resource implements IWebFunction {
  public readonly functionArn: string;
  public readonly functionName: string;
  public readonly revisionId: string;

  constructor(scope: Construct, id: string, attrs: WebFunctionAttributes) {
    super(scope, id, { environmentFromArn: attrs.functionArn });
    this.functionArn = attrs.functionArn;
    this.functionName = attrs.functionName;
    this.revisionId = attrs.revisionId;
  }

  public get webFunctionRef(): WebFunctionReference {
    return { functionArn: this.functionArn };
  }
}

/**
 * Lets the Web Functions service decrypt the revision's code and environment with a customer managed key
 */
function grantServiceDecrypt(scope: Construct, key: kms.IKey, webFunctionArn: string) {
  if (!cdk.Resource.isOwnedResource(key)) {
    cdk.Annotations.of(scope).addWarningV2(
      '@aws-cdk/aws-lambda-web-function-alpha:importedKmsKey',
      'The KMS key is imported, so kms:Decrypt cannot be granted to lambda.amazonaws.com on it. Grant it in the key policy.',
    );
    return;
  }

  key.grantDecrypt(new iam.ServicePrincipal('lambda.amazonaws.com', {
    conditions: {
      StringEquals: { 'aws:SourceAccount': cdk.Stack.of(scope).account },
      ArnLike: { 'aws:SourceArn': `${webFunctionArn}/revision/*` },
    },
  }));
}
