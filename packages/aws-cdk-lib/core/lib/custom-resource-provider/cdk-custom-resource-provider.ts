import { Construct } from 'constructs';
import { CustomResourceProviderBase, CustomResourceProviderOptions } from './custom-resource-provider-base';
import { CdkHandler } from '../../../handler-framework/lib/cdk-handler';
import { RuntimeDeterminer } from '../../../handler-framework/lib/utils/runtime-determiner';
import { CfnResource } from '../cfn-resource';
import { Duration } from '../duration';
import { Size } from '../size';
import { Stack } from '../stack';
import { Token } from '../token';

export interface CdkCustomResourceProviderProps extends CustomResourceProviderOptions {
  /**
   * The source code, compatible runtimes, and the method within your code that Lambda calls to execute your function.
   */
  readonly handler: CdkHandler;
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

    const code = props.handler.code.bind(Stack.of(this));

    const timeout = props.timeout ?? Duration.minutes(15);
    const memory = props.memorySize ?? Size.mebibytes(128);

    const handler = new CfnResource(this, 'Handler', {
      type: 'AWS::Lambda::Function',
      properties: {
        Code: {
          code: {
            S3Bucket: code.s3Location?.bucketName,
            S3Key: code.s3Location?.objectKey,
          },
        },
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