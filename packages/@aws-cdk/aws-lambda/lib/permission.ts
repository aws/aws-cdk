import { PolicyPrincipal } from '@aws-cdk/cdk';

/**
 * Represents a permission statement that can be added to a Lambda's resource policy
 * via the `addToResourcePolicy` method.
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
  action?: string;

  /**
   * A unique token that must be supplied by the principal invoking the
   * function.
   *
   * @default The caller would not need to present a token.
   */
  eventSourceToken?: string;

  /**
   * The entity for which you are granting permission to invoke the Lambda
   * function. This entity can be any valid AWS service principal, such as
   * s3.amazonaws.com or sns.amazonaws.com, or, if you are granting
   * cross-account permission, an AWS account ID. For example, you might want
   * to allow a custom application in another AWS account to push events to
   * Lambda by invoking your function.
   *
   * The principal can be either an AccountPrincipal or a ServicePrincipal.
   */
  principal: PolicyPrincipal;

  /**
   * The AWS account ID (without hyphens) of the source owner. For example, if
   * you specify an S3 bucket in the SourceArn property, this value is the
   * bucket owner's account ID. You can use this property to ensure that all
   * source principals are owned by a specific account.
   */
  sourceAccount?: string;

  /**
   * The ARN of a resource that is invoking your function. When granting
   * Amazon Simple Storage Service (Amazon S3) permission to invoke your
   * function, specify this property with the bucket ARN as its value. This
   * ensures that events generated only from the specified bucket, not just
   * any bucket from any AWS account that creates a mapping to your function,
   * can invoke the function.
   */
  sourceArn?: string;
}
