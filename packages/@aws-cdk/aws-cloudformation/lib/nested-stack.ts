import sns = require('@aws-cdk/aws-sns');
import { Aws, CfnOutput, CfnParameter, Construct, Duration, Fn, IResolvable, IResolveContext, Lazy, Reference, Stack, Token } from '@aws-cdk/core';
import crypto = require('crypto');
import { FileAssetLocation, FileAssetPackaging , FileAssetSource } from '../../core/lib/assets';
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
  private _templateUrl?: string;

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

    this.parameters = props.parameters || {};

    this.resource = new CfnStack(parentScope, `${id}.NestedStackResource`, {
      templateUrl: Lazy.stringValue({ produce: () => this._templateUrl }),
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
          // resource.ref returns the stack ARN, so we need to split by "/" and select the 2nd component, which is the stack name:
          // arn:aws:cloudformation:us-east-2:123456789012:stack/mystack-mynestedstack-sggfrhxhum7w/f449b250-b969-11e0-a185-5081d0136786
          return Fn.select(1, Fn.split('/', this.resource.ref));
        }
      }
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

  protected prepare() {
    const cfn = JSON.stringify((this as any)._toCloudFormation());

    const templateHash = crypto.createHash('sha256').update(cfn).digest('hex');
    const parent = this.parentStack!;

    const templateLocation = parent.addFileAsset({
      packaging: FileAssetPackaging.FILE,
      sourceHash: templateHash,
      sourcePath: this.templateFile
    });

    // if bucketName/objectKey are cfn parameters from a stack other than the parent stack, they will
    // be resolved as cross-stack references like any other (see "multi" tests).
    this._templateUrl = `https://s3.${parent.region}.${parent.urlSuffix}/${templateLocation.bucketName}/${templateLocation.objectKey}`;

    super.prepare();
  }

  protected createCrossReference(sourceStack: Stack, reference: Reference): IResolvable {
    const targetStack = Stack.of(reference.target);

    // the nested stack references a resource from the parent stack:
    // we pass it through a as a cloudformation parameter
    if (targetStack === sourceStack.parentStack) {
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
    if (targetStack === this && targetStack.parentStack === sourceStack) {
      return this.getCreateOutputForReference(reference);
    }

    // sibling nested stacks (same parent):
    // output from one and pass as parameter to the other
    if (targetStack.parentStack && targetStack.parentStack === sourceStack.parentStack) {
      const outputValue = this.getCreateOutputForReference(reference);
      return (sourceStack as any).createCrossReference(sourceStack, outputValue);
    }

    // nested stack references a value from some other non-nested stack:
    // normal export/import, with dependency between the parents
    if (sourceStack.parentStack && sourceStack.parentStack !== targetStack) {
      return super.createCrossReference(sourceStack, reference);
    }

    // some non-nested stack (that is not the parent) references a resource inside the nested stack:
    // we output the value and let our parent export it
    if (!sourceStack.parentStack && targetStack.parentStack && targetStack.parentStack !== sourceStack) {
      const outputValue = this.getCreateOutputForReference(reference);
      return (targetStack.parentStack as any).createCrossReference(sourceStack, outputValue);
    }

    throw new Error('unexpected nested stack cross reference');
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
