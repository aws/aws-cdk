import * as crypto from 'crypto';
import * as path from 'path';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ssm from '@aws-cdk/aws-ssm';
import {
  BootstraplessSynthesizer, CfnResource, Construct as CoreConstruct, ConstructNode,
  CustomResource, CustomResourceProvider, CustomResourceProviderRuntime,
  DefaultStackSynthesizer, IStackSynthesizer, Resource, Stack, StackProps, Stage, Token,
} from '@aws-cdk/core';
import { Construct } from 'constructs';


/**
 * Properties for creating a Lambda@Edge function
 * @experimental
 */
export interface EdgeFunctionExperimentalProps extends lambda.FunctionProps { }

/**
 * A Lambda@Edge function.
 *
 * Convenience resource for requesting a Lambda function in the 'us-east-1' region for use with Lambda@Edge.
 * Implements several restrictions enforced by Lambda@Edge.
 *
 * @resource AWS::Lambda::Function
 * @experimental
 */
export class EdgeFunctionExperimental extends Resource implements lambda.IVersion {

  private static readonly EDGE_REGION: string = 'us-east-1';

  public readonly edgeArn: string;
  public readonly functionName: string;
  public readonly functionArn: string;
  public readonly grantPrincipal: iam.IPrincipal;
  public readonly isBoundToVpc = false;
  public readonly lambda: lambda.IFunction;
  public readonly permissionsNode: ConstructNode;
  public readonly role?: iam.IRole;
  public readonly version: string;

  // functionStack needed for `addAlias`.
  private readonly functionStack: Stack;
  private readonly edgeFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: EdgeFunctionExperimentalProps) {
    super(scope, id);

    // Create a simple Function if we're already in us-east-1; otherwise create a cross-region stack.
    const regionIsUsEast1 = !Token.isUnresolved(this.stack.region) && this.stack.region === 'us-east-1';
    const { functionStack, edgeFunction, edgeArn } = regionIsUsEast1
      ? this.createInRegionFunction(id, props)
      : this.createCrossRegionFunction(id, props);

    this.functionStack = functionStack;
    this.edgeFunction = edgeFunction;
    this.edgeArn = edgeArn;

    this.functionArn = edgeArn;
    this.lambda = edgeFunction;
    this.functionName = this.lambda.functionName;
    this.grantPrincipal = this.lambda.role!;
    this.permissionsNode = this.lambda.permissionsNode;
    this.version = lambda.extractQualifierFromArn(this.functionArn);
  }

  /**
   * Returns 'this'. Convenience method to make `EdgeFunction` conform to the same interface as `Function`.
   */
  public get currentVersion(): lambda.IVersion {
    return this;
  }

  public addAlias(aliasName: string, options: lambda.AliasOptions = {}): lambda.Alias {
    return new lambda.Alias(this.functionStack, `Alias${aliasName}`, {
      aliasName,
      version: this.edgeFunction.currentVersion,
      ...options,
    });
  }

  /**
   * Not supported. Connections are only applicable to VPC-enabled functions.
   */
  public get connections(): ec2.Connections {
    throw new Error('Lambda@Edge does not support connections');
  }
  public get latestVersion(): lambda.IVersion {
    throw new Error('$LATEST function version cannot be used for Lambda@Edge');
  }

  public addEventSourceMapping(id: string, options: lambda.EventSourceMappingOptions): lambda.EventSourceMapping {
    return this.lambda.addEventSourceMapping(id, options);
  }
  public addPermission(id: string, permission: lambda.Permission): void {
    return this.lambda.addPermission(id, permission);
  }
  public addToRolePolicy(statement: iam.PolicyStatement): void {
    return this.lambda.addToRolePolicy(statement);
  }
  public grantInvoke(identity: iam.IGrantable): iam.Grant {
    return this.lambda.grantInvoke(identity);
  }
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.lambda.metric(metricName, { ...props, region: EdgeFunctionExperimental.EDGE_REGION });
  }
  public metricDuration(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.lambda.metricDuration({ ...props, region: EdgeFunctionExperimental.EDGE_REGION });
  }
  public metricErrors(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.lambda.metricErrors({ ...props, region: EdgeFunctionExperimental.EDGE_REGION });
  }
  public metricInvocations(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.lambda.metricInvocations({ ...props, region: EdgeFunctionExperimental.EDGE_REGION });
  }
  public metricThrottles(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.lambda.metricThrottles({ ...props, region: EdgeFunctionExperimental.EDGE_REGION });
  }
  public addEventSource(source: lambda.IEventSource): void {
    return this.lambda.addEventSource(source);
  }
  public configureAsyncInvoke(options: lambda.EventInvokeConfigOptions): void {
    return this.lambda.configureAsyncInvoke(options);
  }

  /** Create a function in-region */
  private createInRegionFunction(id: string, props: lambda.FunctionProps): FunctionConfig {
    const role = props.role ?? defaultLambdaRole(this, id);
    const edgeFunction = new lambda.Function(this, 'Fn', {
      ...props,
      role,
    });

    return { edgeFunction, edgeArn: edgeFunction.currentVersion.edgeArn, functionStack: this.stack };
  }

  /** Create a support stack and function in us-east-1, and a SSM reader in-region */
  private createCrossRegionFunction(id: string, props: lambda.FunctionProps): FunctionConfig {
    const parameterNamePrefix = 'EdgeFunctionArn';
    const parameterName = `${parameterNamePrefix}${id}`;
    const functionStack = this.edgeStack();
    this.stack.addDependency(functionStack);

    const edgeFunction = functionStack.addEdgeFunction(id, parameterName, props);
    // This is used to determine when the function has changed, to refresh the ARN from the custom resource.
    const edgeFunctionHash = calculateFunctionHash(edgeFunction);

    // Prefix of the parameter ARN that applies to all EdgeFunctions.
    // This is necessary because the `CustomResourceProvider` is a singleton, and the `policyStatement`
    // must work for multiple EdgeFunctions.
    const parameterArnPrefix = this.stack.formatArn({
      service: 'ssm',
      region: EdgeFunctionExperimental.EDGE_REGION,
      resource: 'parameter',
      resourceName: parameterNamePrefix + '*',
    });

    const resourceType = 'Custom::CrossRegionStringParameterReader';
    const serviceToken = CustomResourceProvider.getOrCreate(this, resourceType, {
      codeDirectory: path.join(__dirname, 'edge-function'),
      runtime: CustomResourceProviderRuntime.NODEJS_12,
      policyStatements: [{
        Effect: 'Allow',
        Resource: parameterArnPrefix,
        Action: ['ssm:GetParameter'],
      }],
    });
    const resource = new CustomResource(this, 'ArnReader', {
      resourceType: resourceType,
      serviceToken,
      properties: {
        Region: EdgeFunctionExperimental.EDGE_REGION,
        ParameterName: parameterName,
        RefreshToken: edgeFunctionHash,
      },
    });
    const edgeArn = resource.getAttString('FunctionArn');

    return { edgeFunction, edgeArn, functionStack };
  }

  private edgeStack(): CrossRegionLambdaStack {
    const stage = this.node.root;
    if (!stage || !Stage.isStage(stage)) {
      throw new Error('stacks which use EdgeFunctions must be part of a CDK app or stage');
    }
    const region = this.env.region;
    if (Token.isUnresolved(region)) {
      throw new Error('stacks which use EdgeFunctions must have an explicitly set region');
    }

    const edgeStackId = `edge-lambda-stack-${region}`;
    let edgeStack = stage.node.tryFindChild(edgeStackId) as CrossRegionLambdaStack;
    if (!edgeStack) {
      edgeStack = new CrossRegionLambdaStack(stage, edgeStackId, {
        synthesizer: this.crossRegionSupportSynthesizer(),
        env: { region: EdgeFunctionExperimental.EDGE_REGION },
      });
    }
    return edgeStack;
  }

  // Stolen from `@aws-cdk/aws-codepipeline`'s `Pipeline`.
  private crossRegionSupportSynthesizer(): IStackSynthesizer | undefined {
    // If we have the new synthesizer we need a bootstrapless copy of it,
    // because we don't want to require bootstrapping the environment
    // of the account in this replication region.
    // Otherwise, return undefined to use the default.
    return (this.stack.synthesizer instanceof DefaultStackSynthesizer)
      ? new BootstraplessSynthesizer({
        deployRoleArn: this.stack.synthesizer.deployRoleArn,
        cloudFormationExecutionRoleArn: this.stack.synthesizer.cloudFormationExecutionRoleArn,
      })
      : undefined;
  }
}

/** Result of creating an in-region or cross-region function */
interface FunctionConfig {
  readonly edgeFunction: lambda.Function;
  readonly edgeArn: string;
  readonly functionStack: Stack;
}

class CrossRegionLambdaStack extends Stack {

  constructor(scope: CoreConstruct, id: string, props: StackProps) {
    super(scope, id, props);
  }

  public addEdgeFunction(id: string, parameterName: string, props: lambda.FunctionProps) {
    const role = props.role ?? defaultLambdaRole(this, id);

    const edgeFunction = new lambda.Function(this, id, {
      ...props,
      role,
    });

    new ssm.StringParameter(edgeFunction, 'Parameter', {
      parameterName,
      stringValue: edgeFunction.currentVersion.edgeArn,
    });

    return edgeFunction;
  }
}

function defaultLambdaRole(scope: Construct, id: string): iam.IRole {
  return new iam.Role(scope, `${id}ServiceRole`, {
    assumedBy: new iam.CompositePrincipal(
      new iam.ServicePrincipal('lambda.amazonaws.com'),
      new iam.ServicePrincipal('edgelambda.amazonaws.com'),
    ),
    managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
  });
}

// Stolen from @aws-lambda/lib/function-hash.ts, which isn't currently exported.
function calculateFunctionHash(fn: lambda.Function) {
  const stack = Stack.of(fn);
  const functionResource = fn.node.defaultChild as CfnResource;
  // render the cloudformation resource from this function
  const config = stack.resolve((functionResource as any)._toCloudFormation());

  const hash = crypto.createHash('md5');
  hash.update(JSON.stringify(config));
  return hash.digest('hex');
}
