import s3_assets = require('@aws-cdk/aws-s3-assets');
import sns = require('@aws-cdk/aws-sns');
import { CfnOutput, CfnParameter, CfnReference, Construct, Duration, IConstruct, ISynthesisSession, Lazy, Stack, Token } from '@aws-cdk/core';
import fs = require('fs');
import path = require('path');
import { CfnStack } from './cloudformation.generated';

const NESTED_STACK_SYMBOL = Symbol.for('@aws-cdk/aws-cloudformation.NestedStack');

export interface NestedStackProps {

  /**
   * The set value pairs that represent the parameters passed to CloudFormation
   * when this nested stack is created. Each parameter has a name corresponding
   * to a parameter defined in the embedded template and a value representing
   * the value that you want to set for the parameter.
   */
  readonly parameters?: { [key: string]: string };

  /**
   * The length of time that CloudFormation waits for the nested stack to reach
   * the CREATE_COMPLETE state. The default is no timeout. When CloudFormation
   * detects that the nested stack has reached the CREATE_COMPLETE state, it
   * marks the nested stack resource as CREATE_COMPLETE in the parent stack and
   * resumes creating the parent stack. If the timeout period expires before the
   * nested stack reaches CREATE_COMPLETE, CloudFormation marks the nested stack
   * as failed and rolls back both the nested stack and parent stack.
   */
  readonly timeout?: Duration;

  /**
   * The Simple Notification Service (SNS) topics to publish stack related
   * events. You can find your SNS topic ARNs using the SNS console or your
   * Command Line Interface (CLI).
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
  public static isNestedStack(x: any): x is NestedStack {
    return x != null && typeof(x) === 'object' && NESTED_STACK_SYMBOL in x;
  }

  /**
   * The name of the synthesized JSON file as it will be emitted into the cloud assembly directory.
   */
  public readonly templateFile: string;

  /**
   * The stack this stack is nested in.
   */
  public readonly parentStack: Stack;

  private readonly parameters: { [name: string]: string } = { };
  private readonly resource: CfnStack;

  constructor(scope: Construct, id: string, props: NestedStackProps = { }) {
    super(scope, id);

    this.parentStack = findParentStack(scope);

    const parentScope = new Construct(scope, id + '.NestedStack');

    Object.defineProperty(this, NESTED_STACK_SYMBOL, { value: true });

    // this is the file name of the synthesized template file within the cloud assembly
    this.templateFile = `${this.node.uniqueId}.nested.template.json`;

    const asset = new s3_assets.SynthesizedAsset(parentScope, 'Asset', {
      packaging: s3_assets.AssetPackaging.FILE,
      assemblyPath: this.templateFile,
      sourceHash: this.node.uniqueId
    });

    this.resource = new CfnStack(parentScope, `${id}.NestedStackResource`, {
      templateUrl: asset.s3Url,
      parameters: Lazy.anyValue({ produce: () => Object.keys(this.parameters).length > 0 ? this.parameters : undefined }),
      notificationArns: props.notifications ? props.notifications.map(n => n.topicArn) : undefined,
      timeoutInMinutes: props.timeout ? props.timeout.toMinutes() : undefined,
    });
  }

  public addParameter(name: string, value: string) {
    this.parameters[name] = value;
  }

  protected onCrossReferenceProduced(_source: IConstruct, reference: CfnReference, consumingStack: Stack) {
    // only parent stack can consume a reference from this nested stack
    if (consumingStack !== this.parentStack) {
      throw new Error(`Resources in nested stack can only be referenced from the parent stack`);
    }

    // output the value from the nested stack
    const outputId = `reference-to-${reference.target.node.uniqueId}-${reference.displayName}`;
    let output = this.node.tryFindChild(outputId) as CfnOutput;
    if (!output) {
      output = new CfnOutput(this, outputId, { value: Token.asString(reference) });
    }

    // morph the reference to use "Fn::GetAtt" on the nested stack with the new output
    if (!reference.hasValueForStack(consumingStack)) {
      reference.assignValueForStack(consumingStack, this.resource.getAtt(output.logicalId));
    }
  }

  protected onCrossReferenceConsumed(_source: IConstruct, reference: CfnReference, producingStack: Stack) {
    // can only reference resources in my own parent stack.
    if (producingStack !== this.parentStack) {
      throw new Error(`Resources in nested stacks can only reference resources from the parent stack`);
    }

    // wire the reference through a parameter
    const paramId = `reference-to-${reference.target.node.uniqueId}.${reference.displayName}`;
    if (!this.node.tryFindChild(paramId)) {
      const param = new CfnParameter(this, paramId, { type: 'String' });
      if (!reference.hasValueForStack(this)) {
        reference.assignValueForStack(this, param.value);

        this.addParameter(param.logicalId, Token.asString(reference));
      }
    }
  }

  protected synthesize(session: ISynthesisSession) {
    const filePath = path.join(session.assembly.outdir, this.templateFile);
    fs.writeFileSync(filePath, JSON.stringify(this.toCloudFormation(), undefined, 2), 'utf-8');
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
  if (!parentStack || NestedStack.isNestedStack(parentStack)) {
    throw new Error(`Nested stacks must be defined within scope of another non-nested stack`);
  }

  return parentStack as Stack;
}