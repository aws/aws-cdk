import { Construct } from './construct-compat';
import { CustomResource } from './custom-resource';
import { CustomResourceProvider, CustomResourceProviderRuntime } from './custom-resource-provider';
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
  private readonly value: Reference;

  private readonly jsonString: string;

  constructor(scope: Construct, id: string, props: CfnJsonProps) {
    super(scope, id);

    this.creationStack = captureStackTrace();

    const resourceType = 'Custom::AWSCDKCfnJson';
    const stack = Stack.of(this);

    const provider = CustomResourceProvider.getOrCreate(this, resourceType, {
      runtime: CustomResourceProviderRuntime.NODEJS_12,
      codeDirectory: `${__dirname}/cfn-json-provider`,
    });

    this.jsonString = stack.toJsonString(props.value);

    const resource = new CustomResource(this, 'Resource', {
      serviceToken: provider,
      resourceType,
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
