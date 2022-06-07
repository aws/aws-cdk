import * as iam from '@aws-cdk/aws-iam';
import { FunctionUrlAuthType } from './function-url';

import { Construct } from 'constructs';

/**
 * Represents a permission statement that can be added to a Lambda function's
 * resource policy via the `addPermission()` method.
 */
export interface Permission {
  /**
   * The Lambda actions that you want to allow in this statement. For example,
   * you can specify lambda:CreateFunction to specify a certain action, or use
   * a wildcard (``lambda:*``) to grant permission to all Lambda actions. For a
   * list of actions, see Actions and Condition Context Keys for AWS Lambda in
   * the IAM User Guide.
   *
   * @default 'lambda:InvokeFunction'
   */
  readonly action?: string;

  /**
   * A unique token that must be supplied by the principal invoking the
   * function.
   *
   * @default - The caller would not need to present a token.
   */
  readonly eventSourceToken?: string;

  /**
   * The entity for which you are granting permission to invoke the Lambda
   * function. This entity can be any of the following:
   *
   * - a valid AWS service principal, such as `s3.amazonaws.com` or `sns.amazonaws.com`
   * - an AWS account ID for cross-account permissions. For example, you might want
   *   to allow a custom application in another AWS account to push events to
   *   Lambda by invoking your function.
   * - an AWS organization principal to grant permissions to an entire organization.
   *
   * The principal can be an AccountPrincipal, an ArnPrincipal, a ServicePrincipal,
   * or an OrganizationPrincipal.
   */
  readonly principal: iam.IPrincipal;

  /**
   * The scope to which the permission constructs be attached. The default is
   * the Lambda function construct itself, but this would need to be different
   * in cases such as cross-stack references where the Permissions would need
   * to sit closer to the consumer of this permission (i.e., the caller).
   *
   * @default - The instance of lambda.IFunction
   */
  readonly scope?: Construct;

  /**
   * The AWS account ID (without hyphens) of the source owner. For example, if
   * you specify an S3 bucket in the SourceArn property, this value is the
   * bucket owner's account ID. You can use this property to ensure that all
   * source principals are owned by a specific account.
   */
  readonly sourceAccount?: string;

  /**
   * The ARN of a resource that is invoking your function. When granting
   * Amazon Simple Storage Service (Amazon S3) permission to invoke your
   * function, specify this property with the bucket ARN as its value. This
   * ensures that events generated only from the specified bucket, not just
   * any bucket from any AWS account that creates a mapping to your function,
   * can invoke the function.
   */
  readonly sourceArn?: string;

  /**
   * The organization you want to grant permissions to. Use this ONLY if you
   * need to grant permissions to a subset of the organization. If you want to
   * grant permissions to the entire organization, sending the organization principal
   * through the `principal` property will suffice.
   *
   * You can use this property to ensure that all source principals are owned by
   * a specific organization.
   *
   * @default - No organizationId
   */
  readonly organizationId?: string;

  /**
   * The authType for the function URL that you are granting permissions for.
   *
   * @default - No functionUrlAuthType
   */
  readonly functionUrlAuthType?: FunctionUrlAuthType;
}
