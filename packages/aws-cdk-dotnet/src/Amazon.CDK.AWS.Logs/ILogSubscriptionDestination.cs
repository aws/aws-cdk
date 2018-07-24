using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Properties returned by a Subscription destination</summary>
    [JsiiInterface(typeof(ILogSubscriptionDestination), "@aws-cdk/aws-logs.LogSubscriptionDestination")]
    public interface ILogSubscriptionDestination
    {
        /// <summary>The ARN of the subscription's destination</summary>
        [JsiiProperty("arn", "{\"fqn\":\"@aws-cdk/cdk.Arn\"}")]
        Arn Arn
        {
            get;
        }

        /// <summary>The role to assume to write log events to the destination</summary>
        /// <remarks>default: No role assumed</remarks>
        [JsiiProperty("role", "{\"fqn\":\"@aws-cdk/aws-iam.Role\",\"optional\":true}")]
        Role Role
        {
            get;
        }
    }
}