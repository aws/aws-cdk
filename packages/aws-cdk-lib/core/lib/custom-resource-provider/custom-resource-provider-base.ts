import { Construct } from 'constructs';
import { CfnResource } from '../cfn-resource';
import { Duration } from '../duration';
import { PolicySynthesizer, getPrecreatedRoleConfig } from '../helpers-internal';
import { Lazy } from '../lazy';
import { Size } from '../size';
import { Stack } from '../stack';
import { Token } from '../token';

export interface CustomResourceProviderOptions {
  /**
   * Whether or not the cloudformation response wrapper (`nodejs-entrypoint.ts`) is used.
   * If set to `true`, `nodejs-entrypoint.js` is bundled in the same asset as the custom resource
   * and set as the entrypoint. If set to `false`, the custom resource provided is the
   * entrypoint.
   *
   * @default - `true` if `inlineCode: false` and `false` otherwise.
   */
  readonly useCfnResponseWrapper?: boolean;

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
   * The amount of memory that your function has access to. Increasing the
   * function's memory also increases its CPU allocation.
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

export abstract class CustomResourceProviderBase extends Construct {
  private policyStatements?: any[];
  protected _role?: CfnResource;

  /**
   * The ARN of the provider's AWS Lambda function which should be used as the `serviceToken` when defining a custom
   * resource.
   */
  public abstract readonly serviceToken: string;

  /**
   * The ARN of the provider's AWS Lambda function role.
   */
  public abstract readonly roleArn: string;

  /**
   * Add an IAM policy statement to the inline policy of the
   * provider's lambda function's role.
   *
   * **Please note**: this is a direct IAM JSON policy blob, *not* a `iam.PolicyStatement`
   * object like you will see in the rest of the CDK.
   *
   *
   * @example
   * declare const myProvider: CustomResourceProvider;
   *
   * myProvider.addToRolePolicy({
   *   Effect: 'Allow',
   *   Action: 's3:GetObject',
   *   Resource: '*',
   * });
   */
  public addToRolePolicy(statement: any): void {
    if (!this.policyStatements) {
      this.policyStatements = [];
    }
    this.policyStatements.push(statement);
  }

  private renderPolicies() {
    if (!this.policyStatements) {
      return undefined;
    }

    const policies = [{
      PolicyName: 'Inline',
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: this.policyStatements,
      },
    }];

    return policies;
  }

  protected renderEnvironmentVariables(env?: { [key: string]: string }) {
    if (!env || Object.keys(env).length === 0) {
      return undefined;
    }

    env = { ...env }; // Copy

    // Always use regional endpoints
    env.AWS_STS_REGIONAL_ENDPOINTS = 'regional';

    // Sort environment so the hash of the function used to create
    // `currentVersion` is not affected by key order (this is how lambda does
    // it)
    const variables: { [key: string]: string } = {};
    const keys = Object.keys(env).sort();

    for (const key of keys) {
      variables[key] = env[key];
    }

    return { Variables: variables };
  }

  protected renderRoleArn(id: string) {
    const config = getPrecreatedRoleConfig(this, `${this.node.path}/Role`);
    const assumeRolePolicyDoc = [{ Action: 'sts:AssumeRole', Effect: 'Allow', Principal: { Service: 'lambda.amazonaws.com' } }];
    const managedPolicyArn = 'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole';

    if (config.enabled) {
      // gives policyStatements a chance to resolve
      this.node.addValidation({
        validate: () => {
          PolicySynthesizer.getOrCreate(this).addRole(`${this.node.path}/Role`, {
            missing: !config.precreatedRoleName,
            roleName: config.precreatedRoleName ?? id+'Role',
            managedPolicies: [{ managedPolicyArn: managedPolicyArn }],
            policyStatements: this.policyStatements ?? [],
            assumeRolePolicy: assumeRolePolicyDoc as any,
          });
          return [];
        },
      });
      return Stack.of(this).formatArn({
        region: '',
        service: 'iam',
        resource: 'role',
        resourceName: config.precreatedRoleName,
      });
    }

    if (!config.preventSynthesis) {
      this._role = new CfnResource(this, 'Role', {
        type: 'AWS::IAM::Role',
        properties: {
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: assumeRolePolicyDoc,
          },
          ManagedPolicyArns: [
            { 'Fn::Sub': managedPolicyArn },
          ],
          Policies: Lazy.any({ produce: () => this.renderPolicies() }),
        },
      });
      return Token.asString(this._role.getAtt('Arn'));
    }

    // used to satisfy all code paths returning a value, but there should never be an instance
    // where config.enabled=true && config.preventSynthesis=true
    return '';
  }
}
