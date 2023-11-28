import { Construct } from 'constructs';
import { CustomResourceProviderBase } from './custom-resource-provider-base';
import { CdkHandler } from '../../../handler-framework/lib/cdk-handler';
import { RuntimeDeterminer } from '../../../handler-framework/lib/utils/runtime-determiner';
import { CfnResource } from '../cfn-resource';
import { Duration } from '../duration';
import { Size } from '../size';
import { Stack } from '../stack';
import { Token } from '../token';

export interface CdkCustomResourceProviderProps {
  /**
   * The source code, compatible runtimes, and the method within your code that Lambda calls to execute your function.
   */
  readonly handler: CdkHandler;

  /**
   * A set of IAM policy statements to include in the inline policy of the
   * provider's lambda function.
   *
   * **Please note**: these are direct IAM JSON policy blobs, *not* `iam.PolicyStatement`
   * objects like you will see in the rest of the CDK.
   *
   * @default - no additional inline policy
   *
   * @example
   * const provider = CustomResourceProvider.getOrCreateProvider(this, 'Custom::MyCustomResourceType', {
   *   codeDirectory: `${__dirname}/my-handler`,
   *   runtime: CustomResourceProviderRuntime.NODEJS_18_X,
   *   policyStatements: [
   *     {
   *       Effect: 'Allow',
   *       Action: 's3:PutObject*',
   *       Resource: '*',
   *     }
   *   ],
   * });
   */
  readonly policyStatements?: any[];

  /**
   * AWS Lambda timeout for the provider.
   *
   * @default Duration.minutes(15)
   */
  readonly timeout?: Duration;

  /**
   * The amount of memory that your function has access to. Increasing the function's memory also increases its CPU
   * allocation.
   *
   * @default Size.mebibytes(128)
   */
  readonly memorySize?: Size;

  /**
   * Key-value pairs that are passed to Lambda as Environment
   *
   * @default - No environment variables.
   */
  readonly environment?: { [key: string]: string };

  /**
   * A description of the function.
   *
   * @default - No description.
   */
  readonly description?: string;
}

export class CdkCustomResourceProvider extends CustomResourceProviderBase {
  public static getOrCreate(scope: Construct, uniqueid: string, props: CdkCustomResourceProviderProps) {
    return this.getOrCreateProvider(scope, uniqueid, props).serviceToken;
  }

  public static getOrCreateProvider(scope: Construct, uniqueid: string, props: CdkCustomResourceProviderProps) {
    const id = `${uniqueid}CustomResourceProvider`;
    const stack = Stack.of(scope);
    const provider = stack.node.tryFindChild(id) as CdkCustomResourceProvider
      ?? new CdkCustomResourceProvider(stack, id, props);
    return provider;
  }

  public readonly serviceToken;
  public readonly roleArn;

  protected constructor(scope: Construct, id: string, props: CdkCustomResourceProviderProps) {
    super(scope, id);

    if (props.policyStatements) {
      for (const statement of props.policyStatements) {
        this.addToRolePolicy(statement);
      }
    }

    this.roleArn = this.renderRoleArn(id);

    const timeout = props.timeout ?? Duration.minutes(15);
    const memory = props.memorySize ?? Size.mebibytes(128);

    const handler = new CfnResource(this, 'Handler', {
      type: 'AWS::Lambda::Function',
      properties: {
        Code: props.handler.code.bind(Stack.of(this)),
        Timeout: timeout.toSeconds(),
        MemorySize: memory.toMebibytes(),
        Handler: props.handler.entrypoint,
        Role: this.roleArn,
        Runtime: RuntimeDeterminer.determineLatestRuntime(props.handler.compatibleRuntimes).name,
        Environment: this.renderEnvironmentVariables(props.environment),
        Description: props.description ?? undefined,
      },
    });

    props.handler.code.bindToResource(handler);

    if (this._role) {
      handler.addDependency(this._role);
    }

    this.serviceToken = Token.asString(handler.getAtt('Arn'));
  }
}