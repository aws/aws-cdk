import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Function as LambdaFunction, FunctionProps } from './function';
import { FunctionBase, FunctionImportProps, IFunction } from './function-base';
import { Permission } from './permission';

/**
 * Properties for a newly created singleton Lambda
 */
export interface SingletonFunctionProps extends FunctionProps {
  /**
   * A unique identifier to identify this lambda
   *
   * The identifier should be unique across all custom resource providers.
   * We recommend generating a UUID per provider.
   */
  uuid: string;

  /**
   * A descriptive name for the purpose of this Lambda.
   *
   * If the Lambda does not have a physical name, this string will be
   * reflected its generated name. The combination of lambdaPurpose
   * and uuid must be unique.
   *
   * @default SingletonLambda
   */
  lambdaPurpose?: string;
}

/**
 * A Lambda that will only ever be added to a stack once.
 *
 * The lambda is identified using the value of 'uuid'. Run 'uuidgen'
 * for every SingletonLambda you create.
 */
export class SingletonFunction extends FunctionBase {
  public readonly functionName: string;
  public readonly functionArn: string;
  public readonly role?: iam.IRole | undefined;
  protected readonly canCreatePermissions: boolean;
  private lambdaFunction: IFunction;

  constructor(scope: cdk.Construct, id: string, props: SingletonFunctionProps) {
    super(scope, id);

    this.lambdaFunction = this.ensureLambda(props);

    this.functionArn = this.lambdaFunction.functionArn;
    this.functionName = this.lambdaFunction.functionName;
    this.role = this.lambdaFunction.role;

    this.canCreatePermissions = true; // Doesn't matter, addPermission is overriden anyway
  }

  public export(): FunctionImportProps {
    return this.lambdaFunction.export();
  }

  public addPermission(name: string, permission: Permission) {
    return this.lambdaFunction.addPermission(name, permission);
  }

  private ensureLambda(props: SingletonFunctionProps): IFunction {
    const constructName = (props.lambdaPurpose || 'SingletonLambda') + slugify(props.uuid);
    const stack = cdk.Stack.find(this);
    const existing = stack.node.tryFindChild(constructName);
    if (existing) {
      // Just assume this is true
      return existing as FunctionBase;
    }

    return new LambdaFunction(stack, constructName, props);
  }
}

function slugify(x: string): string {
  return x.replace(/[^a-zA-Z0-9]/g, '');
}
