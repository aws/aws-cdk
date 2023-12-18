import { Duration } from '../duration';
import { Size } from '../size';

export const INLINE_CUSTOM_RESOURCE_CONTEXT = '@aws-cdk/core:inlineCustomResourceIfPossible';

/**
 * Initialization options for custom resource providers
 */
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
