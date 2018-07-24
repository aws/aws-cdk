using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>
    /// Represents a permission statement that can be added to a Lambda's resource policy
    /// via the `addToResourcePolicy` method.
    /// </summary>
    public class LambdaPermission : DeputyBase, ILambdaPermission
    {
        /// <summary>
        /// The Lambda actions that you want to allow in this statement. For example,
        /// you can specify lambda:CreateFunction to specify a certain action, or use
        /// a wildcard (``lambda:*``) to grant permission to all Lambda actions. For a
        /// list of actions, see Actions and Condition Context Keys for AWS Lambda in
        /// the IAM User Guide.
        /// </summary>
        /// <remarks>default: 'lambda:InvokeFunction'</remarks>
        [JsiiProperty("action", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Action
        {
            get;
            set;
        }

        /// <summary>
        /// A unique token that must be supplied by the principal invoking the
        /// function.
        /// </summary>
        /// <remarks>default: The caller would not need to present a token.</remarks>
        [JsiiProperty("eventSourceToken", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string EventSourceToken
        {
            get;
            set;
        }

        /// <summary>
        /// The entity for which you are granting permission to invoke the Lambda
        /// function. This entity can be any valid AWS service principal, such as
        /// s3.amazonaws.com or sns.amazonaws.com, or, if you are granting
        /// cross-account permission, an AWS account ID. For example, you might want
        /// to allow a custom application in another AWS account to push events to
        /// Lambda by invoking your function.
        /// 
        /// The principal can be either an AccountPrincipal or a ServicePrincipal.
        /// </summary>
        [JsiiProperty("principal", "{\"fqn\":\"@aws-cdk/cdk.PolicyPrincipal\"}", true)]
        public PolicyPrincipal Principal
        {
            get;
            set;
        }

        /// <summary>
        /// The AWS account ID (without hyphens) of the source owner. For example, if
        /// you specify an S3 bucket in the SourceArn property, this value is the
        /// bucket owner's account ID. You can use this property to ensure that all
        /// source principals are owned by a specific account.
        /// </summary>
        [JsiiProperty("sourceAccount", "{\"primitive\":\"any\",\"optional\":true}", true)]
        public object SourceAccount
        {
            get;
            set;
        }

        /// <summary>
        /// The ARN of a resource that is invoking your function. When granting
        /// Amazon Simple Storage Service (Amazon S3) permission to invoke your
        /// function, specify this property with the bucket ARN as its value. This
        /// ensures that events generated only from the specified bucket, not just
        /// any bucket from any AWS account that creates a mapping to your function,
        /// can invoke the function.
        /// </summary>
        [JsiiProperty("sourceArn", "{\"fqn\":\"@aws-cdk/cdk.Arn\",\"optional\":true}", true)]
        public Arn SourceArn
        {
            get;
            set;
        }
    }
}