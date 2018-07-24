using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>Represents a Lambda function defined outside of this stack.</summary>
    [JsiiInterface(typeof(ILambdaRefProps), "@aws-cdk/aws-lambda.LambdaRefProps")]
    public interface ILambdaRefProps
    {
        /// <summary>
        /// The ARN of the Lambda function.
        /// Format: arn:&lt;partition&gt;:lambda:&lt;region&gt;:&lt;account-id&gt;:function:&lt;function-name&gt;
        /// </summary>
        [JsiiProperty("functionArn", "{\"fqn\":\"@aws-cdk/aws-lambda.FunctionArn\"}")]
        FunctionArn FunctionArn
        {
            get;
            set;
        }

        /// <summary>
        /// The IAM execution role associated with this function.
        /// If the role is not specified, any role-related operations will no-op.
        /// </summary>
        [JsiiProperty("role", "{\"fqn\":\"@aws-cdk/aws-iam.Role\",\"optional\":true}")]
        Role Role
        {
            get;
            set;
        }
    }
}