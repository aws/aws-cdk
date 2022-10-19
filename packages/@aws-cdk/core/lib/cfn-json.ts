import { Construct } from 'constructs';
import { CustomResource } from './custom-resource';
import { CfnUtilsProvider } from './private/cfn-utils-provider';
import { CfnUtilsResourceType } from './private/cfn-utils-provider/consts';
import { Reference } from './reference';
import { IResolvable, IResolveContext } from './resolvable';
import { Stack } from './stack';
import { captureStackTrace } from './stack-trace';

export interface CfnJsonProps {
  /**
   * The value to resolve. Can be any JavaScript object, including tokens and
   * references in keys or values.
   */
  readonly value: any;
}

/**
 * Captures a synthesis-time JSON object a CloudFormation reference which
 * resolves during deployment to the resolved values of the JSON object.
 *
 * The main use case for this is to overcome a limitation in CloudFormation that
 * does not allow using intrinsic functions as dictionary keys (because
 * dictionary keys in JSON must be strings). Specifically this is common in IAM
 * conditions such as `StringEquals: { lhs: "rhs" }` where you want "lhs" to be
 * a reference.
 *
 * This object is resolvable, so it can be used as a value.
 *
 * This construct is backed by a custom resource.
 */
export class CfnJson extends Construct implements IResolvable {
  public readonly creationStack: string[] = [];

  /**
   * An Fn::GetAtt to the JSON object passed through `value` and resolved during
   * synthesis.
   *
   * Normally there is no need to use this property since `CfnJson` is an
   * IResolvable, so it can be simply used as a value.
   */
  public readonly value: Reference;

  private readonly jsonString: string;

  constructor(scope: Construct, id: string, props: CfnJsonProps) {
    super(scope, id);

    this.creationStack = captureStackTrace();

    // stringify the JSON object in a token-aware way.
    this.jsonString = Stack.of(this).toJsonString(props.value);

    const resource = new CustomResource(this, 'Resource', {
      serviceToken: CfnUtilsProvider.getOrCreate(this),
      resourceType: CfnUtilsResourceType.CFN_JSON,
      properties: {
        Value: this.jsonString,
      },
    });

    this.value = resource.getAtt('Value');
  }

  /**
   * This is required in case someone JSON.stringifys an object which refrences
   * this object. Otherwise, we'll get a cyclic JSON reference.
   */
  public toJSON() {
    return this.jsonString;
  }

  public resolve(_: IResolveContext): any {
    return this.value;
  }
}
