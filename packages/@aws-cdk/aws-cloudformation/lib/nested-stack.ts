import s3_assets = require('@aws-cdk/aws-s3-assets');
import sns = require('@aws-cdk/aws-sns');
import {
  Aws, CfnOutput, CfnParameter, Construct, Duration, Fn, IConstruct,
  IResolvable, IResolveContext, Lazy, Reference, Stack, Token } from '@aws-cdk/core';
import cxapi = require('@aws-cdk/cx-api');
import { CfnStack } from './cloudformation.generated';

const NESTED_STACK_SYMBOL = Symbol.for('@aws-cdk/aws-cloudformation.NestedStack');

export interface NestedStackProps {

  /**
   * The set value pairs that represent the parameters passed to CloudFormation
   * when this nested stack is created. Each parameter has a name corresponding
   * to a parameter defined in the embedded template and a value representing
   * the value that you want to set for the parameter.
   *
   * @default - no parameters are passed to the nested stack
   */
  readonly parameters?: { [key: string]: string };

  /**
   * The length of time that CloudFormation waits for the nested stack to reach
   * the CREATE_COMPLETE state.
   *
   * When CloudFormation detects that the nested stack has reached the
   * CREATE_COMPLETE state, it marks the nested stack resource as
   * CREATE_COMPLETE in the parent stack and resumes creating the parent stack.
   * If the timeout period expires before the nested stack reaches
   * CREATE_COMPLETE, CloudFormation marks the nested stack as failed and rolls
   * back both the nested stack and parent stack.
   *
   * @default - no timeout
   */
  readonly timeout?: Duration;

  /**
   * The Simple Notification Service (SNS) topics to publish stack related
   * events.
   *
   * @default - notifications are not sent for this stack.
   */
  readonly notifications?: sns.ITopic[];
}

/**
 * A nested CloudFormation stack.
 *
 * This means that it must have a non-nested Stack as an ancestor, into which an
 * `AWS::CloudFormation::Stack` resource will be synthesized into the parent
 * stack.
 *
 * Furthermore, this stack will not be treated as an independent deployment
 * artifact (won't be listed in "cdk list" or deployable through "cdk deploy"),
 * but rather only synthesized as a template and uploaded as an asset to S3.
 *
 * Cross references of resource attributes between the parent stack and the
 * nested stack will automatically be translated to stack parameters and
 * outputs.
 */
export class NestedStack extends Stack {

  /**
   * Checks if `x` is an object of type `NestedStack`.
   */
  public static isNestedStack(x: any): x is NestedStack {
    return x != null && typeof(x) === 'object' && NESTED_STACK_SYMBOL in x;
  }

  public readonly templateFile: string;

  /**
   * The stack this stack is nested in.
   */
  public readonly parentStack?: Stack;

  /**
   * An attribute that represents the name of the nested stack.
   *
   * If this is referenced from the parent stack, it will return a token that parses the name from the stack ID.
   * If this is referenced from the context of the nested stack, it will return `{ "Ref": "AWS::StackName" }`
   *
   * @example mystack-mynestedstack-sggfrhxhum7w
   * @attribute
   */
  public readonly stackName: string;

  private readonly parameters: { [name: string]: string };
  private readonly resource: CfnStack;

  constructor(scope: Construct, id: string, props: NestedStackProps = { }) {
    const parentStack = findParentStack(scope);

    super(scope, id, {
      env: {
        account: parentStack.account,
        region: parentStack.region
      },
    });

    this.parentStack = parentStack;

    const parentScope = new Construct(scope, id + '.NestedStack');

    Object.defineProperty(this, NESTED_STACK_SYMBOL, { value: true });

    // this is the file name of the synthesized template file within the cloud assembly
    this.templateFile = `${this.node.uniqueId}.nested.template.json`;

    const asset = new s3_assets.SynthesizedAsset(parentScope, 'Asset', {
      packaging: s3_assets.AssetPackaging.FILE,
      assemblyPath: this.templateFile,
      sourceHash: this.node.uniqueId
    });

    this.parameters = props.parameters || {};

    this.resource = new CfnStack(parentScope, `${id}.NestedStackResource`, {
      templateUrl: asset.s3Url,
      parameters: Lazy.anyValue({ produce: () => Object.keys(this.parameters).length > 0 ? this.parameters : undefined }),
      notificationArns: props.notifications ? props.notifications.map(n => n.topicArn) : undefined,
      timeoutInMinutes: props.timeout ? props.timeout.toMinutes() : undefined,
    });

    this.stackName = Token.asString({
      resolve: (context: IResolveContext) => {
        const stack = Stack.of(context.scope);
        if (stack === this) {
          return Aws.STACK_NAME;
        } else {
          // resource.ref returns the stack ID, so we need to split by "/" and select the 2nd component, which is the stack name:
          // arn:aws:cloudformation:us-east-2:123456789012:stack/mystack-mynestedstack-sggfrhxhum7w/f449b250-b969-11e0-a185-5081d0136786
          return Fn.select(1, Fn.split('/', this.resource.ref));
        }
      }
    });
  }

  /**
   * If a file asset is added to the nested stack, we also need to add it to the
   * parent and wire the parameters.
   *
   * @param asset
   */
  public addFileAsset(asset: cxapi.FileAssetMetadataEntry) {
    const parent = this.parentStack!;

    const proxyParameter = (type: string, logicalId: string) => {
      const p = new CfnParameter(parent, `${this.node.uniqueId}.${asset.id}.${type}`, {
        type: 'String',
        description: `Proxy for asset parameter "${asset.id}.${type}" within the nested stack "${this.node.path}"`
      });

      this.parameters[logicalId] = p.valueAsString;
      return p.logicalId;
    };

    parent.addFileAsset({
      ...asset,
      s3BucketParameter: proxyParameter('bucket', asset.s3BucketParameter),
      s3KeyParameter: proxyParameter('key', asset.s3KeyParameter),
      artifactHashParameter: proxyParameter('hash', asset.artifactHashParameter)
    });
  }

  /**
   * An attribute that represents the ID of the stack.
   *
   * If this is referenced from the parent stack, it will return `{ "Ref": "LogicalIdOfNestedStackResource" }`.
   *
   * If this is referenced from the context of the nested stack, it will return `{ "Ref": "AWS::StackId" }`
   *
   * @example arn:aws:cloudformation:us-east-2:123456789012:stack/mystack-mynestedstack-sggfrhxhum7w/f449b250-b969-11e0-a185-5081d0136786
   * @attribute
   */
  public get stackId(): string {
    return Token.asString({
      resolve: (context: IResolveContext) => {
        const stack = Stack.of(context.scope);
        if (stack === this) {
          return Aws.STACK_ID;
        } else {
          return this.resource.ref;
        }
      }
    });
  }

  protected createCrossReference(source: IConstruct, reference: Reference): IResolvable {
    const consumingStack = Stack.of(source);
    const producingStack = Stack.of(reference.target);

    // the nested stack references a resource from the parent stack:
    // we pass it through a as a cloudformation parameter
    if (producingStack === consumingStack.parentStack) {
      const paramId = `reference-to-${reference.target.node.uniqueId}.${reference.displayName}`;
      let param = this.node.tryFindChild(paramId) as CfnParameter;
      if (!param) {
        param = new CfnParameter(this, paramId, { type: 'String' });
        this.parameters[param.logicalId] = Token.asString(reference);
      }

      return param.value;
    }

    // parent stack references a resource from the nested stack:
    // we output it from the nested stack and use "Fn::GetAtt" as the reference value
    if (producingStack === this && producingStack.parentStack === consumingStack) {
      return this.getCreateOutputForReference(reference);
    }

    // sibling nested stacks (same parent):
    // output from one and pass as parameter to the other
    if (producingStack.parentStack && producingStack.parentStack === consumingStack.parentStack) {
      const outputValue = this.getCreateOutputForReference(reference);
      return (consumingStack as any).createCrossReference(source, outputValue);
    }

    // nested stack references a value from some other non-nested stack:
    // normal export/import, with dependency between the parents
    if (consumingStack.parentStack && consumingStack.parentStack !== producingStack) {
      return super.createCrossReference(source, reference);
    }

    // some non-nested stack (that is not the parent) references a resource inside the nested stack:
    // we output the value and let our parent export it
    if (!consumingStack.parentStack && producingStack.parentStack && producingStack.parentStack !== consumingStack) {
      const outputValue = this.getCreateOutputForReference(reference);
      return (producingStack.parentStack as any).createCrossReference(source, outputValue);
    }

    throw new Error('unexpected');

    return super.createCrossReference(source, reference);
  }

  private getCreateOutputForReference(reference: Reference) {
    const outputId = `${reference.target.node.uniqueId}${reference.displayName}`;
    let output = this.node.tryFindChild(outputId) as CfnOutput;
    if (!output) {
      output = new CfnOutput(this, outputId, { value: Token.asString(reference) });
    }

    return this.resource.getAtt(`Outputs.${outputId}`);
  }
}

/**
 * Validates the scope for a nested stack. Nested stacks must be defined within the scope of another `Stack`.
 */
function findParentStack(scope: Construct): Stack {
  if (!scope) {
    throw new Error(`Nested stacks cannot be defined as a root construct`);
  }

  const parentStack = scope.node.scopes.reverse().find(p => Stack.isStack(p));
  if (!parentStack) {
    throw new Error(`Nested stacks must be defined within scope of another non-nested stack`);
  }

  return parentStack as Stack;
}